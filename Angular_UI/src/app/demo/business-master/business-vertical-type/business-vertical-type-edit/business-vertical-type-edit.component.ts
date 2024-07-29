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
  selector: 'app-business-vertical-type-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, TagInputModule],
  templateUrl: './business-vertical-type-edit.component.html',
  styleUrls: ['./business-vertical-type-edit.component.scss']
})
export class BusinessVerticalTypeEditComponent 
{
  @Input() public modalParams;
  editBusinessVerticalTypeForm : FormGroup;
  businessVerticalForm : FormGroup;
  businessVerticalGroupForm : FormGroup;
  businessVerticalGroups : any[];
  businessVerticals : any[];
  isValidForm : boolean;
  saveClicked : boolean;
  searchClicked : boolean;
  searchClickedBusinessVerticalGroup : boolean;
  businessVerticalType : any;
  
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
    this.businessVerticalType = this.modalParams;
    this.isValidForm = true;
    this.saveClicked = false;
    this.searchClicked = false;
    this.searchClickedBusinessVerticalGroup = false;
    this.businessVerticals = [];
    this.businessVerticalGroups = [];

    this.editBusinessVerticalTypeForm = this.formbuilder.group({
      id: [''],
      name: [this.businessVerticalType.name, [Validators.required]],
      businessVertical: this.formbuilder.group({ id : ['']}),
      businessVerticalGroup: this.formbuilder.group({ id : [''] })
    });  

    this.businessVerticalForm = this.formbuilder.group({
      'businessVertical' : ['', Validators.required]
    })

    this.businessVerticalGroupForm = this.formbuilder.group({
      "businessVerticalGroup" : ['', Validators.required]
    })
   
    this.editBusinessVerticalTypeForm.patchValue(this.businessVerticalType);
    this.businessVerticalForm.get("businessVertical").setValue(this.businessVerticalType.businessVertical.id);
    this.getBusinessVerticals(this.businessVerticalType.businessVertical);
    this.businessVerticalGroupForm.get("businessVerticalGroup").setValue(this.businessVerticalType.businessVerticalGroup.id);
    this.getBusinessVerticalGroups(this.businessVerticalType.businessVerticalGroup);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

    // get business vertical
    async getBusinessVerticals(businessVertical : any) 
    {  
        try
        {
            let response = await this.businessService.getBusinessVerticals('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.businessVerticals = response.businessVerticals;
                this.businessVerticals.unshift({ id : '', name : "Select Business Vertical"});
                if(businessVertical != '')
                {
                    let filterBusinessVertical = this.businessVerticals.filter(tempBusinessVertical => parseInt(tempBusinessVertical.id) == parseInt(businessVertical.id));
                    if(filterBusinessVertical.length == 0)
                    {
                        this.businessVerticals.push({ id : businessVertical.id, name : businessVertical.name });
                    }
                }
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

    //get business vertical group
    async getBusinessVerticalGroups(businessVerticalGroup : any) 
    {  
        try
        {
            let businessVerticalId = this.businessVerticalForm.get("businessVertical").value;
            if(businessVerticalId != undefined && businessVerticalId != "")
            {
                this.searchClickedBusinessVerticalGroup = true;  
                let response = await this.businessService.getBusinessVerticalGroups(businessVerticalId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.businessVerticalGroups = response.businessVerticalGroups;
                    console.log(this.businessVerticalGroups)
                    this.businessVerticalGroups.unshift({ id : '', name : "Select Business Vertical Group"});
                    this.searchClickedBusinessVerticalGroup = false;
                    if(businessVerticalGroup != '')
                    {
                        let filterBusinessVerticalGroup = this.businessVerticalGroups.filter(tempBusinessVerticalGroup => parseInt(tempBusinessVerticalGroup.id) == parseInt(businessVerticalGroup.id));
                        console.log(filterBusinessVerticalGroup)
                        if(filterBusinessVerticalGroup.length == 0)
                        {
                            this.businessVerticalGroups.push({ id : businessVerticalGroup.id, name : businessVerticalGroup.name });
                        }
                    }
                }
                else
                {
                    this.businessVerticalGroups = [];
                    this.businessVerticalGroups.unshift({ id : '', name : "Select Business Vertical Group"});
                    this.searchClickedBusinessVerticalGroup = false;
                }
            }
            else
            {
                this.businessVerticalGroups = [];
                this.businessVerticalGroups.unshift({ id : '', name : "Select Business Vertical Group"});
                this.searchClickedBusinessVerticalGroup = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClickedBusinessVerticalGroup = false;
        }
    }

    async saveBusinessVertical()
    {
        if(!this.saveClicked)
        {
            if(this.editBusinessVerticalTypeForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.editBusinessVerticalTypeForm.controls['businessVertical'].get("id").setValue(this.businessVerticalForm.get('businessVertical').value);
                this.editBusinessVerticalTypeForm.controls['businessVerticalGroup'].get('id').setValue(this.businessVerticalGroupForm.get('businessVerticalGroup').value);
                try
                {
                    let response = await this.businessService.updateBusinessVerticalType(this.editBusinessVerticalTypeForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Business Vertical Type Updated");
                        this.commonSharedService.businessVerticalTypeListObject.next({result : "success"});
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
