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
  masterBusinessVerticals : any[];
  masterBusinessVerticalGroups : any[];
  isValidForm : boolean;
  saveClicked : boolean;
  searchClicked : boolean;
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
   
    this.getBusinessVerticals();
    this.editBusinessVerticalTypeForm.patchValue(this.businessVerticalType);
    this.businessVerticalForm.get("businessVertical").setValue(this.businessVerticalType.businessVertical.id);
    this.businessVerticalGroupForm.get("businessVerticalGroup").setValue(this.businessVerticalType.businessVerticalGroup.id);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

   // get business vertical
   async getBusinessVerticals() 
   {  
     try
     {
       let response = await this.businessService.getBusinessVerticals('All').toPromise();
       if (response.status_code == 200 && response.message == 'success') 
       {
         this.masterBusinessVerticals = response.businessVerticals;
         this.businessVerticals = this.masterBusinessVerticals;
         this.businessVerticals.unshift({ id : '', name : "Select Business Vertical"});
         this.getBusinessVerticalGroups();
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
  async getBusinessVerticalGroups() 
  {  
    try
    {
      let businessVerticalId = this.businessVerticalForm.get("businessVertical").value;
      if(businessVerticalId != undefined && businessVerticalId != "")
      {
        this.searchClicked = true;  
        let response = await this.businessService.getBusinessVerticalGroups(businessVerticalId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterBusinessVerticalGroups = response.businessVerticalGroups;
          this.businessVerticalGroups = this.masterBusinessVerticalGroups;
          this.businessVerticalGroups.unshift({ id : '', name : "Select Business Vertical Group"});
          this.searchClicked = false;
        }
        else
        {
          this.businessVerticalGroups = [];
          this.searchClicked = false;
        }
      }
      else
      {
        this.businessVerticalGroups = [];
        this.searchClicked = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
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
