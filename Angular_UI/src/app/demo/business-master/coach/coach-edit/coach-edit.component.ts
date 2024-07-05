import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { TagInputModule } from 'ngx-chips';

@Component({
  selector: 'app-coach-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, TagInputModule],
  templateUrl: './coach-edit.component.html',
  styleUrls: ['./coach-edit.component.scss']
})
export class CoachEditComponent 
{
  @Input() public modalParams;
  editCoachForm : FormGroup;
  businessVerticalTypeForm : FormGroup;
  businessVerticalTypes : any[];
  masterBusinessVerticalTypes : any[];
  isValidForm : boolean;
  saveClicked : boolean;
  coach : any;
  
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
    this.coach = this.modalParams;
    this.isValidForm = true;
    this.saveClicked = false;
    this.businessVerticalTypes = [];

    this.editCoachForm = this.formbuilder.group({
      uuid: this.coach.uuid,
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      businessVerticalType: this.formbuilder.group({ id : ['']}),
    });  

    this.businessVerticalTypeForm = this.formbuilder.group({
      'businessVerticalType' : ['', Validators.required]
    })
   
    this.getBusinessVerticalTypes(0,0,'All');
    this.editCoachForm.patchValue(this.coach);
    this.businessVerticalTypeForm.get("businessVerticalType").setValue(this.coach.businessVerticalType.id);
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
      let response = await this.businessService.getBusinessVerticalTypes(businessVerticalId, businessVerticalGroupId, 'All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.masterBusinessVerticalTypes = response.businessVerticalTypes;
        this.businessVerticalTypes = this.masterBusinessVerticalTypes;
        this.businessVerticalTypes.unshift({ id : '', name : "Select Business Vertical Type"});
      }
      else
      {
        this.businessVerticalTypes = [];
        this.businessVerticalTypes.unshift({ id : '', name : "Select Business Vertical Type"});
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  async saveCoach()
  {
    if(!this.saveClicked)
    {
      if(this.editCoachForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.editCoachForm.controls["businessVerticalType"].get("id").setValue(this.businessVerticalTypeForm.get("businessVerticalType").value);
        try
        {
          let response = await this.businessService.updateCoach(this.editCoachForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Coach Updated");
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
