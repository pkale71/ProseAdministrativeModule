import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserTypeAddComponent } from '../user-type-add/user-type-add.component';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './user-type-list.component.html',
  styleUrls: ['./user-type-list.component.scss']
})
export class UserTypeListComponent 
{
  masterUserTypes : any[];
  userTypes : any[];
  searchClicked : boolean;
  userRoles : any[];
  masterUserRoles : any[];
  modules : any[];
  moduleForm : FormGroup;
  userRoleForm : FormGroup;
  
  constructor(private router : Router,
    private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private commonService : CommonService,
    public commonSharedService : CommonSharedService)
  {
    // this.loginUser = this.commonSharedService.loginUser;
    // this.userRole = this.loginUser.type;
    this.modules = [];
    this.userRoles = [];
  }
  
  ngOnInit() 
  {
    this.searchClicked = false;
    this.userTypes = [];

    this.moduleForm = this.formBuilder.group({
      'module' : ['0']
    })
    this.userRoleForm = this.formBuilder.group({
      'userRole' : ['0']
    })
    this.getModules();
    this.getUserTypes(0,0);
  }

  public userRoleAddResult:any = this.commonSharedService.userTypeListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getUserTypes(0,0);
    }
  })

  //get module
  async getModules() 
  {
    try 
    {
      let response = await this.commonService.getModules().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.modules = response.modules;
        this.modules.unshift({id : "0", name : "All"});
        this.userRoles.unshift({id : "0", name : "All"})
      }
      else
      {
        this.modules = [];
      }
    }
    catch(e)  
    {
      this.showNotification("error", e);
    }
  }

  //get user Role
  async getUserRoles() 
  {
    try
    {
      let moduleId = this.moduleForm.get("module").value;
      if(moduleId != null && moduleId != undefined)
      {
        let response = await this.commonService.getUserRoles(moduleId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterUserRoles = response.userRoles;
          this.userRoles = this.masterUserRoles
          this.userRoles.unshift({id : "", name : "All"});
        }
        else
        {
          this.userRoles = [];
        }
      }
    }  
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  filterData()
  {
    let moduleId : number = this.moduleForm.get("module").value;
    let userRoleId : number = this.userRoleForm.get("userRole").value;
    this.getUserTypes(moduleId, userRoleId);
  }

  async getUserTypes(moduleId : number, userRoleId : number) 
  {  
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getUserTypes(moduleId, userRoleId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblUserType').DataTable().destroy();
        this.masterUserTypes = response.userTypes;
        this.userTypes = this.masterUserTypes;
        setTimeout(function(){
          $('#tblUserType').DataTable();
        },800);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.userTypes = [];
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
    }
    catch(e)
    {
      this.showNotification("error",e);
    }
  }

  showNotification(type: string, message: string): void 
  {
    this.notifier.notify(type, message);
  }

  addUserType()
  {
    const dialogRef = this.modalService.open(UserTypeAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  updateStatus(userType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (userType.isActive == 1 ? 'de-active' : 'active') + ' the user type?',
      icon: 'warning',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          let tempJson = {
            id : userType.id,
            tableName : userType.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "UserRole Updated");
              this.commonSharedService.userTypeListObject.next({
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

  deleteUserType(userType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete user type?',
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
        let tempJSON = { "id" : userType.id };
        try
        {
          let response = await this.commonService.deleteUserType(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "UserType Deleted.");
            this.commonSharedService.userTypeListObject.next({result : "success"});
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
