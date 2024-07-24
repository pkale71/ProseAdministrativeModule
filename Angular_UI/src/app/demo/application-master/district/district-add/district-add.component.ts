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
  selector: 'app-district-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './district-add.component.html',
  styleUrls: ['./district-add.component.scss']
})
export class DistrictAddComponent 
{
  @Input() public modalParams;
  addDistrictForm: FormGroup;
  countryForm: FormGroup;
  stateRegionForm: FormGroup;
  isValidForm: boolean;
  saveClicked: boolean;
  searchClicked: boolean;
  countries: any[];
  stateRegions: any[];
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
    this.searchClicked = false;
    this.countries = [];
    this.stateRegions = [];

    this.addDistrictForm = this.formbuilder.group({
      id:[''],
      name: ['',[Validators.required]],
      country: this.formbuilder.group({ 'id' : ['']}),
      stateRegion: this.formbuilder.group({ 'id' : ['']})
      // file: ['']
    });  

    this.countryForm = this.formbuilder.group({
      'country' : ['', Validators.required]
    })

    this.stateRegionForm = this.formbuilder.group({
      'stateRegion' : ['', Validators.required]
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
          this.countries = response.countries;
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

  //get state/region
  async getStateRegions(action : string) 
  {  
    try
    { 
      let countryId = this.countryForm.get('country').value;
      if(countryId != undefined && countryId != "")
      {
        this.searchClicked = true; 
        let response = await this.businessService.getStateRegions(countryId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.stateRegions = response.stateRegions;
          this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
          this.searchClicked = false;
        }
        else
        {
          this.stateRegions = [];
          this.stateRegions.unshift({ id : '', name : 'Select State/Region'});
          this.searchClicked = false;
        }
      }
      else
      {
        this.stateRegions = [];
        this.stateRegions.unshift({ id : '', name : 'Select State/Region'});          
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
      // this.searchClicked = false;
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

  async saveDistrict()
  {
    if(!this.saveClicked)
    {
      if(this.addDistrictForm.valid && this.countryForm.valid && this.stateRegionForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.addDistrictForm.controls["country"].get('id').setValue(this.countryForm.get('country').value);
        this.addDistrictForm.controls['stateRegion'].get('id').setValue(this.stateRegionForm.get('stateRegion').value);

        try
        {
            let response = await this.businessService.saveDistrict(this.addDistrictForm.value).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "State Region Saved");
              this.commonSharedService.districtListObject.next({
                result : "success",
                countryId : this.countryForm.get('country').value,
                stateRegionId : this.stateRegionForm.get('stateRegion').value
              });
              this.closeModal();
            }
          // }  
          else
          {
            let response = await this.businessService.saveDistrict(this.addDistrictForm.value).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "State Region Saved");
              this.commonSharedService.districtListObject.next({
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
