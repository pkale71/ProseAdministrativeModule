import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { UserApprovedComponent } from '../user-approved/user-approved.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent 
{
    user : any[];
    masterUser : any[];
    userGrades : any[];
    masterUserCategories : any[];
    userCategories : any[];
    userGradeForm : FormGroup;
    userCategoryForm : FormGroup;
    searchClicked : boolean;
    isRequired : boolean; 
    masterUserGrades : any[];
    
    constructor(private router : Router,
        private formbuilder : FormBuilder,
        private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private userService: UserService, 
        private commonService : CommonService,
        public commonSharedService : CommonSharedService)
    {
        // this.masterUsers = this.activatedRoute.snapshot.data['users'].data.users;
        // this.users = this.masterUsers;
        // this.loginUser = this.commonSharedService.loginUser;
        // this.userRole = this.loginUser.role;
    }
    
    ngOnInit() 
    {
        this.searchClicked = false;
        this.isRequired = false;
        this.userCategories = [];
        this.userGrades = [];
        this.user = [];

        this.userGradeForm = this.formbuilder.group({
            'userGrade': ['0']
        });
        this.userCategoryForm = this.formbuilder.group({
            'userCategory': ['0']
        }); 
        
        this.getUserGrades();
        this.getUserCategories();
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

    //get user Grades
    async getUserGrades()
    {
        try 
        {
            let response = await this.commonService.getUserGrades().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.masterUserGrades = response.userGrades;
                this.userGrades = this.masterUserGrades;
                this.userGrades.unshift({ id : "0", name : "All" });
            }
            else
            {
                this.userGrades = [];
                this.userGrades.unshift({ id : "0", name : "All"});
            }
        } 
        catch(error) 
        {
            this.showNotification("error", error);
        }
    }

    //get user category
    async getUserCategories()
    {
        try 
        {
            let response = await this.commonService.getUserCategories().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.masterUserCategories = response.userCategories;
                this.userCategories = this.masterUserCategories;
                this.userCategories.unshift({ id : "0", name : "All" });
            }
            else
            {
                this.userCategories = [];
                this.userCategories.unshift({ id : "0", name : "All" });
            }
        } 
        catch(error) 
        {
            this.showNotification("error", error);
        }
    } 

    filterUserCategories()
    {
        this.userCategories = [];
        let userGradeId = this.userGradeForm.get("userGrade").value;
        let userGrades = this.masterUserGrades.filter(userGrade => userGrade.id == userGradeId);
        if(userGrades.length > 0)
        {    
            if(userGrades[0].code == "MOADM")
            {
                this.isRequired = true;
                this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code == "STFUSR");
                this.userCategories.unshift({ id : "0", name : "All"});
                this.userCategoryForm.controls["userCategory"].enable();
                this.userCategoryForm.controls["userCategory"].addValidators(Validators.required);
                this.userCategoryForm.updateValueAndValidity();
            }
            else if(userGrades[0].code == "MOUSR")
            {
                this.isRequired = true;
                this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code != "STFUSR");
                // this.userCategories.unshift({ id : "0", name : "All"});
                this.userCategoryForm.controls["userCategory"].enable();
                this.userCategoryForm.controls["userCategory"].addValidators(Validators.required);
                this.userCategoryForm.updateValueAndValidity();
            }
            else
            {
                this.isRequired = false;
                this.userCategoryForm.controls["userCategory"].disable();
                this.userCategoryForm.controls["userCategory"].clearAsyncValidators();
                this.userCategoryForm.updateValueAndValidity();
            }   
            if(this.userCategories.length == 2)
            {
                this.userCategoryForm.get("userCategory").setValue(this.userCategories[1].id);
            }
            else
            {
                this.userCategoryForm.get("userCategory").setValue(""); 
            }
        }
    }

    async getUsers() 
    {
        try
        {
            let userGradeId = this.userGradeForm.get("userGrade").value;
            let userCategoryId = this.userCategoryForm.get("userCategory").value;
            if(userGradeId != undefined && userGradeId != '')
            {
                this.searchClicked = true;
                let response = await this.userService.getUsers(userGradeId, userCategoryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    $('#tblUser').DataTable().destroy();
                    this.masterUser = response.user;
                    this.user = this.masterUser;
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
                }    
            }
            else
            {
                this.user = [];
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
                    this.showNotification("success", "User " + (user.isActive == 1 ? 'De-activated' : 'Activated'));
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
    
    approvedUser(uuid : string)
    {
        let params = {
            "uuid" : uuid,
            "action" : "User"
        }
        const dialogRef = this.modalService.open(UserApprovedComponent, 
        { 
            size: 'sm', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }

    editUser(uuid : string)
    {
        let params = {
            "uuid" : uuid
        }
        const dialogRef = this.modalService.open(UserEditComponent, 
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
}
