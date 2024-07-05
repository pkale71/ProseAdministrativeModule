import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/theme/shared/service/user.service';
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
  masterBusinessPartners : any[];
  businessPartnerTypes : any[];
  masterBusinessPartnerTypes : any[];
  businessPartnerTypeForm : FormGroup;
  searchClicked : boolean;
  businessPartnerType : any;
  masterBusinessPartnerType : any[];
  id : number;
    
  constructor(private router : Router,
    private formbuilder : FormBuilder,
    private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private userService: UserService, 
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
    this.masterBusinessPartners = [];
    
    this.businessPartnerTypeForm = this.formbuilder.group({
      'businessPartnerType': ['0']
    });

    this.getBusinessPartnerTypes();
    this.getBusinessPartners();
  }

  public businessPartnerAddResult:any = this.commonSharedService.businessPartnerListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getBusinessPartners();
    }
  }) 

  //get business partner type
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
      }
    } 
    catch (error) 
    {
      this.showNotification("error", error);
    }
  }

  async getBusinessPartners() 
  {
    try
    {
      let businessPartnerTypeId = this.businessPartnerTypeForm.get("businessPartnerType").value;
      if(businessPartnerTypeId != undefined && businessPartnerTypeId != '')
      {
        this.searchClicked = true;
        let response = await this.businessService.getBusinessPartners(businessPartnerTypeId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblBusinessPartner').DataTable().destroy();
          this.masterBusinessPartners = response.businessPartners;
          this.businessPartners = this.masterBusinessPartners;
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
      else
      {
        this.businessPartners = [];
        this.searchClicked = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  updateStatus(user : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (user.isActive == 1 ? 'de-active' : 'active') + ' the user?',
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
            uuid : user.uuid,
            userModuleId : "",
            action : "User"
          }
          this.showNotification("info", "Please wait...");
          let response = await this.userService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "User Status Updated");
              this.commonSharedService.userListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }

  // addBusinessPartner()
  // {
  //   const dialogRef = this.modalService.open(BusinessPartnerAddComponent, 
  //   { 
  //     size: 'xl', backdrop: 'static' 
  //   });
  //   dialogRef.componentInstance.modalParams = {};
  // }

  addBusinessPartnerType(id : string)
  {
    this.router.navigateByUrl("/business/businessPartner/add/" + id);
  }

  editUser(uuid : string)
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

  detailUser(uuid : string)
  {
    this.router.navigateByUrl("/user/detail/" + uuid);
  }

  deleteUser(uuid : string)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete user?',
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
        let tempJSON = { 
          "uuid" : uuid
        };
        try
        {
          let response = await this.userService.deleteUser(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Deleted.");
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
