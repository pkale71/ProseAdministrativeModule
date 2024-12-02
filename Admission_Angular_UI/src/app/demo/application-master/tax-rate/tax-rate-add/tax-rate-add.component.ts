import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-tax-rate-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './tax-rate-add.component.html',
  styleUrls: ['./tax-rate-add.component.scss']
})
export class TaxRateAddComponent 
{
  addTaxRateForm: FormGroup;
  taxTypeForm: FormGroup;
  academicSessionForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedTaxType : boolean;
  taxTypes : any[];
  academicSessions : any[];

  constructor(
    private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.addTaxRateForm = this.formbuilder.group({
      id:[''],
      academicSession: this.formbuilder.group({ 'id': [''] }),
      taxType: this.formbuilder.group({ 'id': [''] }),
      rate: ['',[Validators.required, Validators.pattern('^[0-9.]{1,5}$')]],
      applicableFrom : ['', Validators.required],
      applicableTo : ['', Validators.required]
    });  

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['', Validators.required]
    });

    this.taxTypeForm = this.formbuilder.group({
      taxType:['', Validators.required]
    });

    this.getAcademicSessions();
    this.getTaxTypes('Active');
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicSessions() 
  {  
    try
    {
      this.searchClickedAcademicSession = true;  
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = (response.academicSessions).filter(academicSession => academicSession.isCurrentSession == 1);
        this.searchClickedAcademicSession = false;
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
      }
      else
      {
        this.academicSessions = [];
        this.searchClickedAcademicSession = false;
      }
    }
    catch(e)
    {
      this.academicSessions = [];
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
    }
  }

  async getTaxTypes(action : string) 
  {  
    try
    {
      this.searchClickedTaxType = true;  
      let response = await this.commonService.getTaxTypes(action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.taxTypes = response.taxTypes;
        this.searchClickedTaxType = false;
        this.taxTypes.unshift({"id" : "", "name" : "Select Tax Type"});
      }
      else
      {
        this.taxTypes = [];
        this.searchClickedTaxType = false;
      }
    }
    catch(e)
    {
      this.taxTypes = [];
      this.showNotification("error", e);
      this.searchClickedTaxType = false;
    }
  }

  async saveTaxRate()
  {
    if(!this.saveClicked)
    {
      if(this.addTaxRateForm.valid && this.academicSessionForm.valid && this.taxTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.addTaxRateForm.controls['academicSession'].get("id").setValue(this.academicSessionForm.get("academicSession").value);
        this.addTaxRateForm.controls['taxType'].get("id").setValue(this.taxTypeForm.get("taxType").value);
        try
        {
          let response = await this.commonService.saveTaxRate(this.addTaxRateForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Tax Rate Saved");
              this.commonSharedService.taxRateListObject.next({result : "success"});
              this.closeModal();
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.isValidForm = false;
          this.saveClicked = false;
        }
      }
      else
      {
        this.isValidForm = false;
        this.saveClicked = false;
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
