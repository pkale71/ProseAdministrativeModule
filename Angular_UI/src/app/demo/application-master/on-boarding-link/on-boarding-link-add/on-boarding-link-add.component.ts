import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/theme/shared/service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
    selector: 'app-on-boarding-link-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './on-boarding-link-add.component.html',
    styleUrls: ['./on-boarding-link-add.component.scss']
})
export class OnBoardingLinkAddComponent {
    @Input() public modalParams;
    onBoardingLinkForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    userGrades: any[];
    masterUserGrades: any[];
    masterUserCategories: any[];
    userCategories: any[];
    isRequired: boolean;
    searchClickedGrade: boolean;

    constructor(private userService: UserService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private commonService: CommonService,
        private router: Router) 
        {
        }

    ngOnInit() {
        this.isValidForm = true;
        this.saveClicked = false;
        this.isRequired = false;
        this.searchClickedGrade = false;
        this.userGrades = [];
        this.userCategories = [];

        this.onBoardingLinkForm = this.formbuilder.group({
            id: [''], 
            email : ['',[Validators.required, Validators.email]],
            mobile: ['',[Validators.required, Validators.pattern('^[0-9]{10,15}'), Validators.maxLength(15), Validators.minLength(10)]],
            userGrade : this.formbuilder.group({ 'id' : ['', [Validators.required] ]}),
            userCategory : this.formbuilder.group({ 'id' : [''] })
        });

        this.getUserGrades();
    }

    showNotification(type: string, message: string): void {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async checkDuplicateEmailMobile(checkFor : string, value : string) 
    {
        if(value != "")
        {
            let data = {
                "checkFor" : checkFor,
                "value" : value,
                "uuid"  :  ""
            }
            try
            {
                let response = await this.commonService.duplicateEmailMobile(data).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
                
                if(checkFor == "Email")
                {
                    this.onBoardingLinkForm.get("email").setValue("");
                }
                else if(checkFor == "Mobile")
                {
                    this.onBoardingLinkForm.get("mobile").setValue("");
                }
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
                this.getUserCategories();
            }
            else
            {
                this.userGrades = [];
                this.userGrades.unshift({ id : "", name : "Select User Grade"});
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
            this.searchClickedGrade = true;
            let response = await this.commonService.getUserCategories().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.masterUserCategories = response.userCategories;
                this.userCategories = this.masterUserCategories;
                this.userCategories.unshift({ id : "", name : "Select User Category."});
                this.searchClickedGrade = false;
            }
            else
            {
                this.userCategories = [];
                this.userCategories.unshift({ id : "", name : "Select User Category."});
                this.searchClickedGrade = false;
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
            this.searchClickedGrade = false;
        }
    } 

    filterUserCategories()
    {
        this.userCategories = [];
        let userGradeId = this.onBoardingLinkForm.get("userGrade.id").value;
        let userGrades = this.masterUserGrades.filter(userGrade => userGrade.id == userGradeId);
        if(userGrades.length > 0)
        {    
            if(userGrades[0].code == "MOADM")
            {
                this.isRequired = true;
                this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code == "STFUSR");
                this.userCategories.unshift({ id : "", name : "Select User Category"});
                this.onBoardingLinkForm.get("userCategory.id").enable();
                this.onBoardingLinkForm.get("userCategory.id").addValidators(Validators.required);
                this.onBoardingLinkForm.get("userCategory.id").updateValueAndValidity();
            }
            else if(userGrades[0].code == "MOUSR")
            {
                this.isRequired = true;
                this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code != "STFUSR");
                // this.userCategories.unshift({ id : "", name : "Select User Category"});
                this.onBoardingLinkForm.get("userCategory.id").enable();
                this.onBoardingLinkForm.get("userCategory.id").addValidators(Validators.required);
                this.onBoardingLinkForm.get("userCategory.id").updateValueAndValidity();
            }
            else
            {
                this.isRequired = false;
                this.onBoardingLinkForm.get("userCategory.id").disable();
                this.onBoardingLinkForm.get("userCategory.id").clearValidators();
                this.onBoardingLinkForm.get("userCategory.id").updateValueAndValidity();
            }            
            if(this.userCategories.length == 2)
            {
                this.onBoardingLinkForm.get("userCategory.id").setValue(this.userCategories[1].id);
            }
            else
            {
                this.onBoardingLinkForm.get("userCategory.id").setValue(""); 
            }
        }
        console.log(this.onBoardingLinkForm.controls)
    }

    async saveOnBoardingLink() 
    {
        if (!this.saveClicked) 
        {
            if (this.onBoardingLinkForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;

                try 
                {
                    let tempJSON = {
                        email : this.onBoardingLinkForm.controls['email'].value,
                        mobile : this.onBoardingLinkForm.controls['mobile'].value,
                        userGrade : { id : this.onBoardingLinkForm.get('userGrade.id').value },
                        userCategory : { id : this.onBoardingLinkForm.get('userCategory.id').value}
                    }
                    let response = await this.userService.saveOnBoardingLink(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "User On-Boarding Saved Successfully");
                        this.commonSharedService.onBoardingLinkListObject.next({ result: "success" });
                        this.closeModal();
                    }
                }
                catch (e)
                {
                    this.showNotification("error", e);
                    this.isValidForm = false;
                    this.saveClicked = false;
                }
            }
            else {
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
