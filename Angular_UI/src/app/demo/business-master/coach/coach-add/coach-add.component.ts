import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { TagInputModule } from 'ngx-chips';

@Component({
  selector: 'app-coach-add',
  standalone: true,
  imports: [CommonModule, SharedModule, TagInputModule, FormsModule],
  templateUrl: './coach-add.component.html',
  styleUrls: ['./coach-add.component.scss']
})
export class CoachAddComponent 
{
  @Input() public modalParams;
  coachForm : FormGroup;
  businessVerticalTypeForm : FormGroup;
  isValidForm : boolean;
  saveClicked : boolean;
  searchClicked : boolean;
  businessVerticalTypes : any[];

  constructor(private businessService: BusinessService, 
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
    this.searchClicked = false;
    this.businessVerticalTypes = [];

    this.coachForm = this.formbuilder.group({
      id: [''],
      uuid: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      businessVerticalType: this.formbuilder.group({ "id" : [''] }),
    });  

    this.businessVerticalTypeForm = this.formbuilder.group({
      'businessVerticalType' : ['', Validators.required]
    })

    this.getBusinessVerticalTypes(0,0,'All');
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  // get business type
  async getBusinessVerticalTypes(businessVerticalId : number, businessVerticalGroupId : number, action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.businessService.getBusinessVerticalTypes(businessVerticalId, businessVerticalGroupId, 'All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.businessVerticalTypes = response.businessVerticalTypes;
        this.businessVerticalTypes.unshift({ id : '', name : "Select Business Vertical Type"});
        this.searchClicked = false;
      }
      else
      {
        this.businessVerticalTypes = [];
        this.businessVerticalTypes.unshift({ id : '', name : "Select Business Vertical Type"});
        this.searchClicked = false; 
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  async saveCoach()
  {
    if(!this.saveClicked)
    {
      if(this.coachForm.valid && this.businessVerticalTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.coachForm.controls["businessVerticalType"].get("id").setValue(this.businessVerticalTypeForm.get("businessVerticalType").value);
        try
        {
          let response = await this.businessService.saveCoach(this.coachForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Coach Saved");
            this.commonSharedService.coachListObject.next({result : "success"});
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
