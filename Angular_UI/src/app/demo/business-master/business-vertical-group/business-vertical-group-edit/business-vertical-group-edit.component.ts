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
  selector: 'app-business-vertical-group-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, TagInputModule],
  templateUrl: './business-vertical-group-edit.component.html',
  styleUrls: ['./business-vertical-group-edit.component.scss']
})
export class BusinessVerticalGroupEditComponent 
{
  @Input() public modalParams;
  editBusinessVerticalGroupForm: FormGroup;
  businessVerticalForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  isCompulsories : any[];
  businessVerticals : any[];
  masterBusinessVerticals : any[];
  name : string[];
  businessVerticalGroup : any;

  constructor(private businessService: BusinessService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
    this.businessVerticals = [];
    this.masterBusinessVerticals = [];
  }

  ngOnInit() 
  {
    this.businessVerticalGroup = this.modalParams;
    this.isValidForm = true;
    this.saveClicked = false;

    this.editBusinessVerticalGroupForm = this.formbuilder.group({
      id: [''],
      name: [this.businessVerticalGroup?.name, [Validators.required]],
      businessVertical: this.formbuilder.group({ id : ['']})
    });  
    this.businessVerticalForm = this.formbuilder.group({
      'businessVertical' : ['', Validators.required]
    })

    this.getBusinessVerticals('All');
    this.editBusinessVerticalGroupForm.patchValue(this.businessVerticalGroup);
    this.businessVerticalForm.get("businessVertical").setValue(this.businessVerticalGroup.businessVertical.id);
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
      let response = await this.businessService.getBusinessVerticals('All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.masterBusinessVerticals = response.businessVerticals;
        this.businessVerticals = this.masterBusinessVerticals;
        this.businessVerticals.unshift({ id : '', name : "Select Business Vertical" })
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

  async saveBusinessVertical()
  {
    if(!this.saveClicked)
    {
      if(this.editBusinessVerticalGroupForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.businessService.updateBusinessVerticalGroup(this.editBusinessVerticalGroupForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Business Vertical Group Updated");
            this.commonSharedService.businessVerticalGroupListObject.next({result : "success"});
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
