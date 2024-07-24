import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRoleAddComponent } from '../user-role-add/user-role-add.component';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-role-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.scss']
})
export class UserRoleListComponent 
{
  userRoles : any[];
  searchClicked : boolean;
  
  constructor(private router : Router,
    private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService : CommonService,
    public commonSharedService : CommonSharedService)
  {
    // this.loginUser = this.commonSharedService.loginUser;
    // this.userRole = this.loginUser.role;
  }
  
  ngOnInit() 
  {
    this.searchClicked = false;
    this.userRoles = [];
    this.getUserRoles(0, 'All');
  }

  public userRoleAddResult:any = this.commonSharedService.userRoleListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getUserRoles(0, 'All');
    }
  })

  async getUserRoles(moduleId : number, action : string) 
  {   
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getUserRoles(moduleId, 'All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblUserRole').DataTable().destroy();
        this.userRoles = response.userRoles;
        setTimeout(function(){
          $('#tblUserRole').DataTable();
        },800);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.userRoles = [];
        this.searchClicked = false;
        this.modalService.dismissAll();
      }   
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  showNotification(type: string, message: string): void 
  {
    this.notifier.notify(type, message);
  }

  addUserRole()
  {
    const dialogRef = this.modalService.open(UserRoleAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  updateStatus(userRole : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (userRole.isActive == 1 ? 'de-active' : 'active') + ' the user role?',
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
            id : userRole.id,
            tableName : userRole.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "User Role " + (userRole.isActive == 1 ? 'de-activated' : 'activated'));
              this.commonSharedService.userRoleListObject.next({
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

  deleteUserRole(userRole : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete user role?',
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
        let tempJSON = { "id" : userRole.id };
        try
        {
          let response = await this.commonService.deleteUserRole(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Role Deleted.");
            this.commonSharedService.syllabusListObject.next({result : "success"});
            this.getUserRoles(0, 'All');
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
