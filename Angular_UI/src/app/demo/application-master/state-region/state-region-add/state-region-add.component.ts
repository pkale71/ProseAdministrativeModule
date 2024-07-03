import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/theme/shared/service/business.service';



@Component({
  selector: 'app-state-region-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './state-region-add.component.html',
  styleUrls: ['./state-region-add.component.scss']
})
export class StateRegionAddComponent 
{
  @Input() public modalParams;
  addStateRegionForm: FormGroup;
  countryForm: FormGroup;
  isValidForm: boolean;
  saveClicked: boolean;
  masterCountries: any[];
  countries: any[];
  isChecked: boolean;

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
    this.isChecked = false;
    this.countries = [];
    this.masterCountries = [];

    this.addStateRegionForm = this.formbuilder.group({
      id:[''],
      name: ['',[Validators.required]],
      country: this.formbuilder.group({ 'id' : ['']}),
      // file: ['']
    });  

    this.countryForm = this.formbuilder.group({
      'country' : ['', Validators.required]
    })

    this.getCountries('All');
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  //get country
  async getCountries(action : string) 
  {  
    try
    {
      let response = await this.businessService.getCountries('All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterCountries = response.countries;
          this.countries = this.masterCountries;
          this.countries.unshift({ id : '', name : 'Select Country'});
        }
        else
        { 
          this.countries = [];
          this.countries.unshift({ id : '', name : 'Select Country'});
        }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  async getDocuments(formatFor : string) 
  {  
    try
    {
      this.commonSharedService.ExcelFormatDownload(formatFor);      
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  getChange(event : any)
  {
    this.isChecked = event.target.checked;
  }

  async saveStateRegion()
  {
    if(!this.saveClicked)
    {
      // this.addStateRegionForm.get("name").disable();
      // console.log(this.addStateRegionForm.valid)
      // console.log(this.countryForm.valid)
      if(this.addStateRegionForm.valid && this.countryForm.valid)
      {
        // console.log(this.addStateRegionForm.valid && this.countryForm.valid)
        this.isValidForm = true;
        this.saveClicked = true;
        this.addStateRegionForm.controls["country"].get('id').setValue(this.countryForm.get('country').value);
        // console.log(this.addStateRegionForm.valid && this.countryForm.valid)
        try
        {
          // if(this.isChecked = true)
          // {
          //   console.log(this.isChecked)
            // const formData = new FormData();
            // formData.append('country', this.countryForm.get('country').value); 
            // formData.append('file', this.addStateRegionForm.get('fileInputField').value); 
            // console.log(formData)
            let response = await this.businessService.saveStateRegion(this.addStateRegionForm.value).toPromise();
            console.log(response)
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "State Region Saved");
              this.commonSharedService.stateRegionListObject.next({
                countryId : this.countryForm.get('country').value,
                result : "success"});
              this.closeModal();
            }
          // }  
          else
          {
            let response = await this.businessService.saveStateRegion(this.addStateRegionForm.value).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "State/Region Saved");
              this.commonSharedService.stateRegionListObject.next({
                countryId : this.countryForm.get('country').value,
                result : "success"});
              this.closeModal();
            }
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
