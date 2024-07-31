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
    businessVerticalForm : FormGroup;
    businessVerticalTypeForm : FormGroup;
    businessVerticals : any[];
    businessVerticalTypes : any[];
    isValidForm : boolean;
    saveClicked : boolean;
    searchClicked : boolean;
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
        this.searchClicked = false;
        this.businessVerticals = [];
        this.businessVerticalTypes = [];

        this.editCoachForm = this.formbuilder.group({
            uuid: this.coach.uuid,
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            mobile : ['', [Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
            businessVertical: this.formbuilder.group({ "id" : [''] }),
            businessVerticalType: this.formbuilder.group({ "id" : [''] }),
        });  

        this.businessVerticalForm = this.formbuilder.group({
            'businessVertical' : ['', Validators.required]
        });
        this.businessVerticalTypeForm = this.formbuilder.group({
            'businessVerticalType' : ['', Validators.required]
        });
    
        this.editCoachForm.patchValue(this.coach);
        this.businessVerticalForm.get('businessVertical').setValue(this.coach.businessVertical.id);
        this.getBusinessVerticals(this.coach.businessVertical);
        this.businessVerticalTypeForm.get("businessVerticalType").setValue(this.coach.businessVerticalType.id);
        this.getBusinessVerticalTypes(this.coach.businessVerticalType);
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

   // get business vertical
   async getBusinessVerticals(action : string) 
   {  
       try
       {
           let response = await this.businessService.getBusinessVerticals('Active').toPromise();
           if (response.status_code == 200 && response.message == 'success') 
           {
               this.businessVerticals = response.businessVerticals;
               this.businessVerticals.unshift({ id : '', name : "Select Business Vertical" });
           }
           else
           {
               this.businessVerticals = [];
           }
       }
       catch(e)
       {
           this.showNotification("error", e);
       }
   }

   // get business type
   async getBusinessVerticalTypes(businessVerticalType : any) 
   {  
       try
       {
           let businessVerticalId = this.businessVerticalForm.get('businessVertical').value;
           if(businessVerticalId != undefined && businessVerticalId != '')
           {
               this.searchClicked = true;  
               let response = await this.businessService.getBusinessVerticalTypes(businessVerticalId, 0, 'Active').toPromise();
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
           else
           {
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
