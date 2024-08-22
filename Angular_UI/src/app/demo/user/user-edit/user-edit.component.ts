import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { Router } from '@angular/router';
// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-user-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {
    @Input() public modalParams;
    user : any;
    uuid : string;
    userGrades : any[];
    userCategories : any[];
    masterUserGrades : any[];
    masterUserCategories : any[];
    editUserForm: FormGroup;
    userGradeForm: FormGroup;
    userCategoryForm: FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;
    masterUser : any[];
    isRequired : boolean;

    constructor(
        private commonService: CommonService, 
        private userService: UserService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        private router : Router,
        public commonSharedService : CommonSharedService,
    ) 
    {
    }

    ngOnInit() 
    {
        //get Modal params
        this.uuid = this.modalParams.uuid;
        this.userGrades = [];
        this.userCategories = [];
        this.masterUserGrades = [];
        this.masterUserCategories = [];
        this.isValidForm = true;
        this.saveClicked = false;
        this.isRequired = false;
        this.getUserCategories();

        this.editUserForm = this.formbuilder.group({
            uuid: this.uuid,
            firstName: ['',[Validators.pattern('^[a-zA-Z ]*$'), Validators.required]],
            lastName: ['',[Validators.pattern('^[a-zA-Z ]*$')]],
            gender: ['', Validators.required],
            email: ['',[Validators.required, Validators.email]],
            mobile: ['',[Validators.required, Validators.pattern('^[0-9]{10,15}'), Validators.maxLength(15), Validators.minLength(10)]],
            userGrade: this.formbuilder.group({ 'id': [''] }),
            userCategory: this.formbuilder.group({ 'id': [''] }),
        });

        this.userGradeForm = this.formbuilder.group({
            'userGrade': ['', [Validators.required]]
        });
        this.userCategoryForm = this.formbuilder.group({
            'userCategory': ['']
        });

        this.editUserForm.get("gender").disable();    
        this.getUser(this.uuid);    
        this.getUserGrades();
    }

    async getUser(uuid : string) 
    {
        let response = await this.userService.getUser(uuid).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.user = response.user;
            this.editUserForm.patchValue(this.user);
            this.userGradeForm.get("userGrade").setValue(this.user.userGrade.id);
            this.userCategoryForm.get("userCategory").setValue(this.user.userCategory.id);
        }
        else
        {
            this.user = [];
        }
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async checkDuplicateEmailMobile(checkFor : string, value : string) 
    {
        let data = {
            "checkFor" : checkFor,
            "value" : value,
            "uuid"  :  this.editUserForm.get("uuid").value
        }
        try
        {
            let response = await this.userService.checkDuplicateEmailMobile(data).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            if(checkFor == "Email")
            {
                this.editUserForm.get("email").setValue(this.user.email);
            }
            else if(checkFor == "Mobile")
            {
                this.editUserForm.get("mobile").setValue(this.user.mobile);
            }
        }
    }

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
                this.userGrades.unshift({ id : "", name : "Select User Grade"});
                this.filterUserCategories(this.user.userCategory.id);
            }
            else
            {
                this.userGrades = [];
            }
        } 
        catch (error) 
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
            }
            else
            {
                this.masterUserCategories = [];
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
        }
    } 

    filterUserCategories(userCategoryId : string)
    {
        try
        {
            let userGradeId = this.userGradeForm.get("userGrade").value;
            let userGrades = this.masterUserGrades.filter(userGrade => userGrade.id == userGradeId);
            if(userGrades.length > 0)
            {  
                if(userGrades[0].code == "MOADM")
                {
                    this.isRequired = true;
                    this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code == "STFUSR");
                    this.userCategories.unshift({ id : "", name : "Select User Category"});
                    this.userCategoryForm.controls["userCategory"].enable();
                    this.userCategoryForm.controls["userCategory"].addValidators(Validators.required);
                    this.userCategoryForm.updateValueAndValidity();
                    this.userCategoryForm.get("userCategory").setValue(userCategoryId);
                }
                else if(userGrades[0].code == "MOUSR")
                {
                    this.isRequired = true;
                    this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code != "STFUSR");
                    this.userCategories.unshift({ id : "", name : "Select User Category"});
                    this.userCategoryForm.controls["userCategory"].enable();
                    this.userCategoryForm.controls["userCategory"].addValidators(Validators.required);
                    this.userCategoryForm.updateValueAndValidity();
                    this.userCategoryForm.get("userCategory").setValue(userCategoryId);
                }
                else
                {
                    this.userCategories = [];
                    this.isRequired = false;
                    this.userCategoryForm.controls["userCategory"].disable();
                    this.userCategoryForm.controls["userCategory"].clearAsyncValidators();
                    this.userCategoryForm.updateValueAndValidity();
                    this.userCategoryForm.get("userCategory").setValue(userCategoryId);
                }                
                if(this.userCategories.length == 2)
                {
                    this.userCategoryForm.get("userCategory").setValue(this.userCategories[1].id);
                }
                else
                {
                    this.userCategoryForm.get("userCategory").setValue(userCategoryId); 
                }
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }
    
    // async getUsers() 
    // {
    //   let response = await this.userService.getUsers().toPromise();
    //   if (response.status_code == 200 && response.message == 'success') 
    //   {
    //     this.masterUser = response.user;
    //     this.user = this.masterUser;
    //   }
    //   else
    //   {
    //     this.user = [];
    //   }
    // }

    async saveUser()
    {
        if(!this.saveClicked)
        {
            // this.editUserForm.get("gender").enable();
            // this.userCategoryForm.get("userCategory").enable();
            if(this.editUserForm.valid && this.userGradeForm.valid && ((this.isRequired && this.userCategoryForm.valid) || (!this.isRequired && !this.userCategoryForm.valid)))
            {
                this.editUserForm.get("gender").disable();
                this.userCategoryForm.get("userCategory").disable();
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let tempJson = {
                        uuid : this.user.uuid,
                        userGrade : {"id" : this.userGradeForm.get("userGrade").value},
                        userCategory : {"id" : this.userCategoryForm.get("userCategory").value}
                    }
                    let response = await this.userService.updateUser(tempJson).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "User Updated");
                        this.closeModal();
                        this.commonSharedService.userListObject.next({result : "success"});
                    }
                }
                catch(e)
                {
                    this.showNotification("error", e);
                    this.isValidForm = false;
                    this.saveClicked = false;
                }
            }
            else
            {
                this.isValidForm = false;
                this.saveClicked = false;
            }
        }
    }

    closeModal()
    {
        this.activeModal.close(); 
    }
}
