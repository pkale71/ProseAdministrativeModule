import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { id } from 'date-fns/locale';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CountryEditComponent } from '../country-edit/country-edit.component';
import { CountryAddComponent } from '../country-add/country-add.component';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent {
  searchClicked : boolean;
  countries : any[];
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private businessService: BusinessService, 
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
      this.countries = [];
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getCountries('All');
  }

  public academyEnclosureDocumentAddResult:any = this.commonSharedService.countryListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getCountries('All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getCountries(action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.businessService.getCountries('All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblCountry').DataTable().destroy();
          this.countries = response.countries;
          setTimeout(function(){
            $('#tblCountry').DataTable();
          },1000);
          this.searchClicked = false;
          this.modalService.dismissAll();
        }
        else
        {
        this.searchClicked = false;
        this.modalService.dismissAll(); 
        }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  addCountry()
  {
    const dialogRef = this.modalService.open(CountryAddComponent, 
    { 
      size: 'sm', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editCountry(country : any)
  {
    const dialogRef = this.modalService.open(CountryEditComponent, 
    { 
      size: 'sm', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = country;
  }

  updateStatus(country : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (country.isActive == 1 ? 'de-active' : 'active') + ' the country?',
      icon: 'warning',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willUpdate) => {
      if (willUpdate.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          let tempJson = {
            id : country.id,
            tableName : country.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Country Status Updated");
              this.commonSharedService.countryListObject.next({
                result : "success"
              });
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }

  deleteCountry(country : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete country?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
        
      } 
      else 
      {
        this.showNotification("info", "Please wait...");
        let tempJSON = { "id" : country.id };
        try
        {
          let response = await this.businessService.deleteCountry(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Country Deleted.");
            this.commonSharedService.countryListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });
  }
  
}
