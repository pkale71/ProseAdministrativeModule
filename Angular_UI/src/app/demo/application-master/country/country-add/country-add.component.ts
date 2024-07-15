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
  selector: 'app-country-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './country-add.component.html',
  styleUrls: ['./country-add.component.scss']
})
export class CountryAddComponent 
{
  @Input() public modalParams;
  addCountryForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  isChecked : boolean;
  isCompulsories : any[];

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

    this.addCountryForm = this.formbuilder.group({
      id:[''],
      name: ['',[Validators.required]],
      uploadFile: ['',Validators.required]
    });  
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
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

  async saveCountry()
  {
    if(!this.saveClicked)
    {
      if(this.isChecked)
      { 
        if(this.addCountryForm.valid)
        { 
          alert(this.addCountryForm.valid)
          this.isValidForm = true;
          this.saveClicked = true;
          try
          {
            if(this.addCountryForm.get('uploadFile')?.value != '')
            {
              console.log(this.addCountryForm.get('uploadFile')?.value != '')
              let formData = new FormData();
              formData.append('uploadFile',this.addCountryForm.get('uploadFile').value);
              let response = await this.businessService.uploadCountries(formData).toPromise();
              if (response.status_code == 200 && response.message == 'success') 
              {
                this.showNotification("success", "Country Saved");
                this.commonSharedService.countryListObject.next({result : "success"});
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
      }
      else   //(this.addCountryForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.businessService.saveCountry(this.addCountryForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Country Saved");
              this.commonSharedService.countryListObject.next({result : "success"});
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
    }  
    else
    {
      this.isValidForm = false;
      this.saveClicked = false;
    }
  }
  
  closeModal()
  {
    this.activeModal.close(); 
  }
}
