import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// third party
import Swal from 'sweetalert2';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserModuleComponent } from '../user-module-add/user-module.component';
import { DataTablesModule } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserApprovedComponent } from '../user-approved/user-approved.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  user : any;
  searchClicked : boolean;
  uuid : string;
  userUUID : any; 
  userModules : any[];

  constructor(private notifier: NotifierService, 
    private commonService : CommonService,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService, 
    private modalService: NgbModal,
    public commonSharedService : CommonSharedService,
    private location : Location, 
    private route: ActivatedRoute
       )
    {
      this.uuid = this.route.params['value'].userUUID;
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.userModules = [];
    this.getUser(this.uuid);
    this.getUserModules(this.uuid, 'All');
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }
   

  public userModuleListResult:any = this.commonSharedService.userModulesListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getUserModules(this.uuid, 'All');
      // let userUUID = res.userUUID;
    }
  })

  addUserModule()
  {
    let params = {
      "userUUID" : this.uuid
    }
    const dialogRef = this.modalService.open(UserModuleComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  async getUser(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.userService.getUser(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblUser').DataTable().destroy();
      this.user = response.user;
      setTimeout(function(){
        $('#tblUser').DataTable();
      },800);
      this.searchClicked = false;
      this.modalService.dismissAll();
    }
    else
    {
      this.user = [];
      this.searchClicked = false;
      this.modalService.dismissAll();
    }
  }

  async getUserModules(userUUID : string, action : string) 
  {
    let response = await this.userService.getUserModule(userUUID, 'All').toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblUserModule').DataTable().destroy();
      this.userModules = response.userModules;
      setTimeout(function(){
        $('#tblUserModule').DataTable();
      },800);
      this.modalService.dismissAll();
    }
    else
    {
      this.userModules = [];
      this.modalService.dismissAll();
    }
  }

  back()
  {
    this.location.back();
  }

  updateStatus(userModule : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (userModule.isActive == 1 ? 'de-active' : 'active') + ' the user module?',
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
            uuid : this.user.uuid,
            userModuleId : userModule.module.id,
            action : "UserModule"
          }
          this.showNotification("info", "Please wait...");
          let response = await this.userService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Module " + (userModule.isActive == 1 ? 'de-activated' : 'activated'));
            this.commonSharedService.userModulesListObject.next({
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

  approveUserModule(userModule : any)
  {
    let params = {
      "uuid" : userModule.id,
      "action" : "User Module"
    }
    const dialogRef = this.modalService.open(UserApprovedComponent, 
    { 
      size: 'sm', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  deleteUserModule(userModule : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete user module?',
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
          "id" : userModule.id,
          "user" : {
            "uuid" : this.uuid
          }
        };
        try
        {
          let response = await this.userService.deleteUserModule(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Module Deleted.");
            this.commonSharedService.userModulesListObject.next({result : "success"});
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
