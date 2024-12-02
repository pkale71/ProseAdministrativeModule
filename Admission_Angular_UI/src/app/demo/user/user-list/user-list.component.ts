import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent 
{
    users : any[];
    activeUsers : any[];
    deActiveUsers : any[];
    pendingUsers : any[];
    deActiveHRUsers : any[];

    searchClicked : boolean;
    
    constructor(private router : Router,
        private formbuilder : FormBuilder,
        private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private userService: UserService, 
        private commonService : CommonService,
        public commonSharedService : CommonSharedService)
    {
    }
    
    ngOnInit() 
    {
        this.searchClicked = false;
        this.users = [];
        this.activeUsers = [];
        this.deActiveUsers = [];
        this.pendingUsers = [];
        this.deActiveHRUsers = [];

        this.getUsers();
    }

    applyTogglePassword(i : number)
    {
        let togglePassword = document.querySelector('#togglePassword_'+i);
        let password = document.querySelector('#password_'+i);

        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the icon
        let className = togglePassword.getAttribute("class");
        if(className == "fa fa-eye-slash")
        {
            togglePassword.setAttribute("class","fa fa-eye");
        }
        else
        {
            togglePassword.setAttribute("class","fa fa-eye-slash");
        }    
    }

    public userAddResult:any = this.commonSharedService.userListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getUsers();
        }
    })

    async getUsers() 
    {
        try
        {
            let moduleId = this.commonSharedService.loginUser.userModule?.module?.id;
            if(moduleId != '')
            {
                this.searchClicked = true;
                let response = await this.userService.getModuleUsers(moduleId).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    $('#tblActiveUser').DataTable().destroy();
                    $('#tblDeactiveUser').DataTable().destroy();
                    $('#tblDeactiveHRUser').DataTable().destroy();
                    $('#tblPndingUser').DataTable().destroy();
                    this.users = response.moduleUsers;
                    this.activeUsers = this.users.filter(user => user.userStatus == 'Active');
                    this.deActiveUsers = this.users.filter(user => user.userStatus == 'Deactive');
                    this.pendingUsers = this.users.filter(user => user.userStatus == 'Pending');
                    this.deActiveHRUsers = this.users.filter(user => user.userStatus == 'Deactive By HR Admin');
                    
                    setTimeout(function(){
                        $('#tblActiveUser').DataTable();
                        $('#tblDeactiveUser').DataTable();
                        $('#tblDeactiveHRUser').DataTable();
                        $('#tblPendingUser').DataTable();
                    },800);
                    this.searchClicked = false;
                    this.modalService.dismissAll();
                }
                else
                {
                    this.users = [];
                    this.activeUsers = [];
                    this.deActiveUsers = [];
                    this.pendingUsers = [];
                    this.deActiveHRUsers = [];
                    this.searchClicked = false;
                }    
            }
            else
            {
                this.users = [];
                this.activeUsers = [];
                this.deActiveUsers = [];
                this.pendingUsers = [];
                this.deActiveHRUsers = [];
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

    detailUser(uuid : string)
    {
        this.router.navigateByUrl("/user/detail/" + uuid);
    }
}
