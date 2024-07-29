import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { BusinessPartnerEditComponent } from '../business-partner-edit/business-partner-edit.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { BusinessPartnerDetailComponent } from '../business-partner-detail/business-partner-detail.component';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { BusinessPartnerAddComponent } from '../business-partner-add/business-partner-add.component';

@Component({
  selector: 'app-business-partner-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './business-partner-list.component.html',
  styleUrls: ['./business-partner-list.component.scss']
})
export class BusinessPartnerListComponent 
{
  businessPartners : any[];
  businessPartnerTypes : any[];
  businessPartnerTypeForm : FormGroup;
  searchClicked : boolean;
  businessPartnerType : any;
  id : number;
  businessPartner : any;
  uuid : string;
    
  constructor(private router : Router,
    private formbuilder : FormBuilder,
    private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal, 
    private commonService : CommonService,
    private businessService : BusinessService,
    private route: ActivatedRoute,
    public commonSharedService : CommonSharedService)
  {
  }
  
  ngOnInit() 
  {
    this.searchClicked = false;
    this.businessPartnerTypes = [];
    this.businessPartners = [];
    
    this.businessPartnerTypeForm = this.formbuilder.group({
      'businessPartnerType': ['0']
    });

    this.getBusinessPartnerTypes();
    this.getBusinessPartners('', 'Active');
  }

  public businessPartnerAddResult:any = this.commonSharedService.businessPartnerListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getBusinessPartners('', 'Active');
    }
  }) 

  //get business partner types 
  async getBusinessPartnerTypes()
  {
    try 
    {
      let response = await this.businessService.getBusinessPartnerTypes().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.businessPartnerTypes = response.businessPartnerTypes;
        this.businessPartnerTypes.unshift({ id : "0", name : "All"});
      }
      else
      {
        this.businessPartnerTypes = [];
        this.businessPartnerTypes.unshift({ id : "0", name : "All"});
      }
    } 
    catch (error) 
    {
      this.showNotification("error", error);
    }
  }

  // get business partner with business partner type id
  async getBusinessPartners(businessPartnerTypeId : any, action : string) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.businessService.getBusinessPartners(businessPartnerTypeId, 'Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblBusinessPartner').DataTable().destroy();
        this.businessPartners = response.businessPartners;
        setTimeout(function(){
          $('#tblBusinessPartner').DataTable();
        },800);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.businessPartners = [];
        this.searchClicked = false;
      } 
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  // get business partner with uuid
  async getBusinessPartner(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getBusinessPartner(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.businessPartner = response.businessPartner;
      this.searchClicked = false;
    }
    else
    {
      this.businessPartner = [];
      this.searchClicked = false;
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  updateStatus(businessPartner : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (businessPartner.isActive == 1 ? 'de-active' : 'active') + ' the business partner?',
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
            id : businessPartner.uuid,
            tableName : businessPartner.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            let businessPartnerType = businessPartner?.businessPartnerType?.name;
            this.showNotification("success", businessPartnerType  + " " +  (businessPartner.isActive == 1 ? 'De-activated' : 'Activated'));
            this.commonSharedService.businessPartnerListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }

  addBusinessPartnerType(id : number)
  {
    this.router.navigateByUrl("/business/businessPartner/add/" + id);
  }

  editBusinessPartner(uuid : string)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(BusinessPartnerEditComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  detailBusinessPartner(uuid : string)
  {
    this.router.navigateByUrl("/business/businessPartner/detail/" + uuid);
  }

  deleteBusinessPartner(businessPartner : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete business partner?',
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
        let tempJson = {
          uuid : businessPartner.uuid,
        }
        try
        {
          let response = await this.businessService.deleteBusinessPartner(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            let businessPartnerType = businessPartner?.businessPartnerType?.name;
            this.showNotification("success", businessPartnerType + " " + "Deleted.");
            this.commonSharedService.businessPartnerListObject.next({result : "success"});
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
