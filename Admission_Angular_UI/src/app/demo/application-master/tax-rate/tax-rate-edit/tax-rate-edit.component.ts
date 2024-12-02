import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-tax-rate-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './tax-rate-edit.component.html',
  styleUrls: ['./tax-rate-edit.component.scss']
})
export class TaxRateEditComponent 
{
  @Input() public modalParams;
  editTaxRateForm: FormGroup;
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

    this.editTaxRateForm = this.formbuilder.group({
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

    this.patchFormValue(this.modalParams.taxRate);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  patchFormValue(taxRate : any)
  {
    this.editTaxRateForm.patchValue(taxRate);
    this.getAcademicSessions(taxRate?.academicSession);
    this.academicSessionForm.get("academicSession").setValue(taxRate?.academicSession?.id);
    this.getTaxTypes("Active",taxRate?.taxType);
    this.taxTypeForm.get("taxType").setValue(taxRate?.taxType?.id);
  }

  async getAcademicSessions(selAcademicSession : any) 
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
        if(selAcademicSession)
        {
          let tempAcademicSession = this.academicSessions.filter(academicSession => academicSession.id == selAcademicSession.id);
          if(tempAcademicSession.length == 0)
          {
            this.academicSessions.push(selAcademicSession);
          }
        }
      }
      else
      {
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        if(selAcademicSession)
        {
          let tempAcademicSession = this.academicSessions.filter(academicSession => academicSession.id == selAcademicSession.id);
          if(tempAcademicSession.length == 0)
          {
            this.academicSessions.push(selAcademicSession);
          }
        }
        this.searchClickedAcademicSession = false;
      }
    }
    catch(e)
    {
      this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
      if(selAcademicSession)
      {
        let tempAcademicSession = this.academicSessions.filter(academicSession => academicSession.id == selAcademicSession.id);
        if(tempAcademicSession.length == 0)
        {
          this.academicSessions.push(selAcademicSession);
        }
      }
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
    }
  }

  async getTaxTypes(action : string, selTaxType : any) 
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
        if(selTaxType)
        {
          let tempTaxType = this.taxTypes.filter(taxType => taxType.id == selTaxType.id);
          if(tempTaxType.length == 0)
          {
            this.taxTypes.push(selTaxType);
          }
        }
      }
      else
      {
        this.taxTypes.unshift({"id" : "", "name" : "Select Tax Type"});
        if(selTaxType)
        {
          let tempTaxType = this.taxTypes.filter(taxType => taxType.id == selTaxType.id);
          if(tempTaxType.length == 0)
          {
            this.taxTypes.push(selTaxType);
          }
        }
        this.searchClickedTaxType = false;
      }
    }
    catch(e)
    {
      this.taxTypes.unshift({"id" : "", "name" : "Select Tax Type"});
      if(selTaxType)
      {
        let tempTaxType = this.taxTypes.filter(taxType => taxType.id == selTaxType.id);
        if(tempTaxType.length == 0)
        {
          this.taxTypes.push(selTaxType);
        }
      }
      this.showNotification("error", e);
      this.searchClickedTaxType = false;
    }
  }

  async saveTaxRate()
  {
    if(!this.saveClicked)
    {
      if(this.editTaxRateForm.valid && this.academicSessionForm.valid && this.taxTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.editTaxRateForm.controls['academicSession'].get("id").setValue(this.academicSessionForm.get("academicSession").value);
        this.editTaxRateForm.controls['taxType'].get("id").setValue(this.taxTypeForm.get("taxType").value);
        try
        {
          let response = await this.commonService.updateTaxRate(this.editTaxRateForm.value).toPromise();
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
