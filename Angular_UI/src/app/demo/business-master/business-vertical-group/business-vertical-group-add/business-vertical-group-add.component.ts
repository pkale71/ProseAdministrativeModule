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
  selector: 'app-business-vertical-group-add',
  standalone: true,
  imports: [CommonModule, SharedModule, TagInputModule,],
  templateUrl: './business-vertical-group-add.component.html',
  styleUrls: ['./business-vertical-group-add.component.scss']
})
export class BusinessVerticalGroupAddComponent 
{
  @Input() public modalParams;
  addBusinessVerticalGroupForm: FormGroup;
  businessVerticalForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  businessVerticals : any[];
  names : string[] = [];

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
    this.businessVerticals = [];

    this.addBusinessVerticalGroupForm = this.formbuilder.group({
      id: [''],
      name: [[this.names], [Validators.required]],
      businessVertical: this.formbuilder.group({ "id" : [''] })
    });  

    this.businessVerticalForm = this.formbuilder.group({
      'businessVertical' : ['', Validators.required]
    })

    this.getBusinessVerticals('All');
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  onEnterKey(event: any) 
  {
    if (event.key === 'Enter') 
    {
      if (this.names.length >= 11) 
      {
        this.names.splice(-1, 1); 
        this.showNotification("warning","Select Only 10 Names");
        this.addBusinessVerticalGroupForm.setValue(this.names);
      }
    }
  }    

  // get business vertical
  async getBusinessVerticals(action : string) 
  {  
    try
    {
      let response = await this.businessService.getBusinessVerticals('All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.businessVerticals = response.businessVerticals;
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
      if(this.addBusinessVerticalGroupForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let allNames = [];
          for(let i = 0; i < this.names.length; i++)
          {
            allNames.push({"name" : this.names[i] });
          }
          let tempJson = {
            "businessVertical" : {"id" : this.businessVerticalForm.get("businessVertical").value},
            "names" : allNames
          }
          let response = await this.businessService.saveBusinessVerticalGroup(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Business Vertical Group Saved");
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
