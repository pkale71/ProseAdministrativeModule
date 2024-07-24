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
  selector: 'app-state-region-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './state-region-edit.component.html',
  styleUrls: ['./state-region-edit.component.scss']
})
export class StateRegionEditComponent 
{
  @Input() public modalParams;
  editStateRegionForm: FormGroup;
  countryForm: FormGroup;
  isValidForm: boolean;
  saveClicked: boolean;
  stateRegions: any;
  countries: any[];

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
    this.stateRegions = this.modalParams;
    this.isValidForm = true;
    this.saveClicked = false;
    this.countries = [];

    this.editStateRegionForm = this.formbuilder.group({
      id: [''],
      name: ['',[Validators.required]],
      country: this.formbuilder.group({ 'id' : ['']})
    });  

    this.countryForm = this.formbuilder.group({
      'country' : ['', Validators.required]
    })
    
    this.getCountries('All');
    this.editStateRegionForm.patchValue(this.stateRegions);
    this.countryForm.get('country').setValue(this.stateRegions.country.id);
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

  async saveStateRegion()
  {
    if(!this.saveClicked)
    {
      if(this.editStateRegionForm.valid && this.countryForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.editStateRegionForm.controls['country'].get('id').setValue(this.countryForm.get('country').value);
        try
        {
          let response = await this.businessService.updateStateRegion(this.editStateRegionForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "State/Region Updated");
            this.commonSharedService.stateRegionListObject.next({
              countryId : this.countryForm.get('country').value,
              result : "success"
            });
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
