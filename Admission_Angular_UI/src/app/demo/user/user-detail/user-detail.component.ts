import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from 'src/app/theme/shared/service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// third party
import Swal from 'sweetalert2';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { DataTablesModule } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModuleApprovalComponent } from '../user-module-approval/user-module-approval.component';
import { UserModuleRoleTypeAddComponent } from '../user-module-role-type-add/user-module-role-type-add.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent 
{
    user : any;
    searchClicked : boolean;
    uuid : string;
    userUUID : any; 
    userModules : any[];

    constructor(private router : Router,
    private notifier: NotifierService, 
    private commonService : CommonService,
    private userService : UserService,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    public commonSharedService : CommonSharedService,
    private location : Location, 
    private route: ActivatedRoute
    )
    {
        this.uuid = this.route.params['value'].uuid;
    }

    ngOnInit() 
    {
        this.searchClicked = false;
        this.userModules = [];
        this.getUser(this.uuid);
        this.getUserModules(this.uuid, 'All', this.commonSharedService.loginUser?.userModule?.module?.id);
    }

    showNotification(type: string, message: string): void 
    {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
    }  

    public userModuleListResult:any = this.commonSharedService.userModulesListObject.subscribe(res =>{
    if(res.result == "success")
    {
        this.getUserModules(this.uuid, 'All', this.commonSharedService.loginUser?.userModule?.module?.id);
        // let userUUID = res.userUUID;
    }
    })

    // get user
    async getUser(uuid : string) 
    {
    this.searchClicked = true;
    let response = await this.userService.getUser(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.user = response.user;
        this.searchClicked = false;
    }
    else
    {
        this.user = [];
        this.searchClicked = false;
    }
    }

    // get user module
    async getUserModules(userUUID : string, action : string, moduleId : number) 
    {
        this.searchClicked = true;
        let response = await this.userService.getUserModules(userUUID, action, moduleId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            $('#tblUserModule').DataTable().destroy();
            this.userModules = response.userModules;
            setTimeout(function(){
                $('#tblUserModule').DataTable();
            },800);
            this.searchClicked = false;
            this.modalService.dismissAll();
        }
        else
        {
            this.userModules = [];
            this.searchClicked = false;
            this.modalService.dismissAll();
        }
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
                    let response = await this.userService.updateUserModuleStatus(tempJson).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "User Module " + (userModule.isActive == 1 ? 'De-activated' : 'Activated'));
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
        const dialogRef = this.modalService.open(UserModuleApprovalComponent, 
        { 
            size: 'sm', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }
    
    assignUserTypeRole(userModule : any)
    {
        let params = {
            "id" : userModule.id,
            "uuid" : this.uuid,
            "moduleId" : userModule.module.id
        }
        const dialogRef = this.modalService.open(UserModuleRoleTypeAddComponent, 
        { 
            size: 'sm', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }

    moduleAccessibility(userModule : any)
    {
        this.router.navigateByUrl("/user/accessibility/" + this.uuid + "/" + userModule.module.id);
    }

    back()
    {
        this.location.back();
    }
}