import { Component, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonModule } from '@angular/common';
import { FileUploadValidators, FileUploadModule } from '@iplab/ngx-file-upload';
import { ActivatedRoute } from '@angular/router';

@Component({
<<<<<<< HEAD
    selector: 'app-user-profile',
    standalone : true,
    imports: [CommonModule, SharedModule, FileUploadModule],
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
 })
export class UserProfileComponent {
    @Input() public modalParams;
    filesControl = new FormControl<File[]>(null, FileUploadValidators.filesLimit(1));
    loadingClicked : boolean;
    profileClicked : boolean;
    userOnBoardingLink : any;
    userGrades : any[];
    masterUserGrades : any[];
    userProfileForm : FormGroup;
    saveClicked : boolean;
    isValidForm : boolean;
    userOnBoardingLinks : any;
    userCategories : any[];
    masterUserCategories : any[];
    submitted = false;
    profileForm : FormGroup;
    code : string;
    iconClass : string;
    message : string;
    colorClass : string;
    isRequired : boolean;

    constructor(private notifier: NotifierService,
        private commonSharedService: CommonSharedService,
        private commonService: CommonService,
        private userService : UserService,
        private formBuilder : FormBuilder,
        private route: ActivatedRoute
    ) {
    
        this.userGrades = [];
        this.userCategories = [];
        this.code = this.route.params['value'].code;
    }

    ngOnInit()
    {
        this.loadingClicked = false;
        this.profileClicked = false;
        this.saveClicked = false;
        this.isValidForm = true;
        this.isRequired = false;
        this.getUserGrades();
        this.getUserCategories();

        this.userProfileForm = this.formBuilder.group({
            'firstName' : ['', Validators.required],
            'lastName' : [''],
            'email' : ['', [Validators.required, Validators.email]],
            'mobile' : ['', [Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
            'password' : ['', Validators.required],
            'gender' : ['', Validators.required],
            'userGrade' : ['', Validators.required],
            'userCategory' : ['']
        });

        this.profileForm = this.formBuilder.group({
            'profilePic': this.filesControl
        });

        this.getOnBoardingLink(this.code);
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    onSelectProfile(event) 
    {
        if (this.profileForm.get("profilePic").value)  
        {
            const file = this.profileForm.get("profilePic").value;
            let fSize : number =parseFloat((file[0].size / 1048576).toFixed(2));
            if(file[0].type == "image/jpg" || file[0].type == "image/jpeg" || file[0].type == "image/png")
            {
                if(fSize > 1)
                {
                    this.showNotification("warning", "File should be less than 1 MB");
                    this.filesControl.setValue([]);
                }
            }
            else
            {
                this.showNotification("warning", "Accept only [jpeg, png] file.");
                this.filesControl.setValue([]);
            }
        }
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
                this.profileForm.get("email").setValue("");
            }
            else if(checkFor == "Mobile")
            {
                this.profileForm.get("mobile").setValue("");
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
            let response = await this.commonService.getUserCategories().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.masterUserCategories = response.userCategories;
                this.userCategories = this.masterUserCategories;
                this.userCategories.unshift({ id : "", name : "Select User Category."});
            }
            else
            {
                this.userCategories = [];
                this.userCategories.unshift({ id : "", name : "Select User Category."});
            }
        } 
        catch (error) 
        {
        this.showNotification("error", error);
        }
    } 

    filterUserCategories()
    {
        this.userCategories = [];
        let userGradeId = this.userProfileForm.get("userGrade").value;
        let userGrades = this.masterUserGrades.filter(userGrade => userGrade.id == userGradeId);
        if(userGrades.length > 0)
        {    
            if(userGrades[0].code == "MOADM")
            {
                this.isRequired = true;
                this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code == "STFUSR");
                this.userCategories.unshift({ id : "", name : "Select User Category"});
                this.userProfileForm.controls["userCategory"].enable();
                this.userProfileForm.controls["userCategory"].addValidators(Validators.required);
                this.userProfileForm.updateValueAndValidity();
            }
            else if(userGrades[0].code == "MOUSR")
            {
                this.isRequired = true;
                this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code != "STFUSR");
                // this.userCategories.unshift({ id : "", name : "Select User Category"});
                this.userProfileForm.controls["userCategory"].enable();
                this.userProfileForm.controls["userCategory"].addValidators(Validators.required);
                this.userProfileForm.updateValueAndValidity();
            }
            else
            {
                this.isRequired = false;
                this.userProfileForm.controls["userCategory"].disable();
                this.userProfileForm.controls["userCategory"].clearAsyncValidators();
                this.userProfileForm.updateValueAndValidity();
            }
            
            if(this.userCategories.length == 2)
            {
                this.userProfileForm.get("userCategory").setValue(this.userCategories[1].id);
            }
            else
            {
                this.userProfileForm.get("userCategory").setValue(""); 
            }
        }
    }

    async getOnBoardingLink(code : string) 
    {
        try 
        {
            this.loadingClicked = true;
            let response = await this.userService.getOnBoardingLink(code).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.userOnBoardingLink = response.userOnBoardingLink;
                this.userProfileForm.patchValue(this.userOnBoardingLink);
                this.loadingClicked = false;
            }
            else
            {
                this.userOnBoardingLink = [];
                this.loadingClicked = false;
            }
        } 
        catch (error) 
        {
            this.iconClass = "fa fa-exclamation-circle text-danger";
            this.colorClass = "text-danger";
            this.message = error;
            this.profileClicked = true;
            this.loadingClicked = false;
        }
    }

    async saveUser()
    { 
        if(!this.saveClicked)
        {
            if(this.userProfileForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true; 
                try
                {
                    let formData = new FormData();
                    formData.append("firstName", this.userProfileForm.get("firstName").value);
                    formData.append("lastName", this.userProfileForm.get("lastName").value);
                    formData.append("email", this.userProfileForm.get("email").value);
                    formData.append("mobile", this.userProfileForm.get("mobile").value);
                    formData.append("password", this.userProfileForm.get("password").value);
                    formData.append("gender", this.userProfileForm.get("gender").value);
                    formData.append("userGrade", JSON.stringify({"id" : this.userProfileForm.get("userGrade").value}));
                    formData.append("userCategory", JSON.stringify({"id" : this.userProfileForm.get("userCategory").value}));
                    formData.append("userOnBoarding", JSON.stringify({"code" : this.code }));
                    if(this.profileForm.get("profilePic").value != null)
                    {
                        formData.append("profilePic", (this.profileForm.get("profilePic").value)[0]);
                    }
                    
                    let response = await this.userService.saveUser(formData).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.profileClicked = true;
                        this.iconClass = "fa fa-check-circle text-success";
                        this.message = "User Profile Created";
                        this.colorClass = "text-success";
                        this.saveClicked = false;
                        this.userProfileForm.reset();
                    }
                }
                catch(e)
                {
                    this.profileClicked = true;
                    this.iconClass = "fa fa-exclamation-circle text-danger";
                    this.colorClass = "text-danger";
                    this.message = e;
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
=======
  selector: 'app-user-profile',
  standalone : true,
  imports: [CommonModule, SharedModule, FileUploadModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
 })
export class UserProfileComponent {
  @Input() public modalParams;
  filesControl = new FormControl<File[]>(null, FileUploadValidators.filesLimit(1));
  loadingClicked : boolean;
  profileClicked : boolean;
  userOnBoardingLink : any;
  userGrades : any[];
  masterUserGrades : any[];
  userProfileForm : FormGroup;
  saveClicked : boolean;
  isValidForm : boolean;
  userOnBoardingLinks : any;
  userCategories : any[];
  masterUserCategories : any[];
  submitted = false;
  profileForm : FormGroup;
  code : string;
  iconClass : string;
  message : string;
  colorClass : string;
  isRequired : boolean;

  constructor(private notifier: NotifierService,
    private commonSharedService: CommonSharedService,
    private commonService: CommonService,
    private userService : UserService,
    private formBuilder : FormBuilder,
    private route: ActivatedRoute
  ) {
   
    this.userGrades = [];
    this.userCategories = [];
    this.code = this.route.params['value'].code;
  }

  ngOnInit()
  {
    this.loadingClicked = false;
    this.profileClicked = false;
    this.saveClicked = false;
    this.isValidForm = true;
    this.isRequired = false;
    this.getUserGrades();
    this.getUserCategories();

    this.userProfileForm = this.formBuilder.group({
      'firstName' : ['', Validators.required],
      'lastName' : [''],
      'email' : ['', [Validators.required, Validators.email]],
      'mobile' : ['', [Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      'password' : ['', Validators.required],
      'gender' : ['', Validators.required],
      'userGrade' : ['', Validators.required],
      'userCategory' : ['']
    })

    this.profileForm = this.formBuilder.group({
      'profilePic': this.filesControl
    });

    this.getOnBoardingLink(this.code);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  onSelectProfile(event) 
  {
    if (this.profileForm.get("profilePic").value)  
    {
      const file = this.profileForm.get("profilePic").value;
      let fSize : number =parseFloat((file[0].size / 1048576).toFixed(2));
      if(file[0].type == "image/jpg" || file[0].type == "image/jpeg" || file[0].type == "image/png")
      {
        if(fSize > 1)
        {
          this.showNotification("warning", "File should be less than 1 MB");
          this.filesControl.setValue([]);
        }
      }
      else
      {
        this.showNotification("warning", "Accept only [jpeg, png] file.");
        this.filesControl.setValue([]);
      }
    }
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
          this.profileForm.get("email").setValue("");
        }
        else if(checkFor == "Mobile")
        {
          this.profileForm.get("mobile").setValue("");
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
        this.userGrades = [];
      }
    } 
    catch (error) 
    {
      this.showNotification("error", error);
    }
  } 

  filterUserCategories()
  {
    this.userCategories = [];
    let userGradeId = this.userProfileForm.get("userGrade").value;
    let userGrades = this.masterUserGrades.filter(userGrade => userGrade.id == userGradeId);
    if(userGrades.length > 0)
    {    
      if(userGrades[0].code == "MOADM")
      {
        this.isRequired = true;
        this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code == "STFUSR");
        this.userCategories.unshift({ id : "", name : "Select User Category"});
        this.userProfileForm.controls["userCategory"].enable();
        this.userProfileForm.controls["userCategory"].addValidators(Validators.required);
        this.userProfileForm.updateValueAndValidity();
      }
      else if(userGrades[0].code == "MOUSR")
      {
        this.isRequired = true;
        this.userCategories = this.masterUserCategories.filter(userCategory => userCategory.code != "STFUSR");
        this.userCategories.unshift({ id : "", name : "Select User Category"});
        this.userProfileForm.controls["userCategory"].enable();
        this.userProfileForm.controls["userCategory"].addValidators(Validators.required);
        this.userProfileForm.updateValueAndValidity();
      }
      else
      {
        this.isRequired = false;
        this.userProfileForm.controls["userCategory"].disable();
        this.userProfileForm.controls["userCategory"].clearAsyncValidators();
        this.userProfileForm.updateValueAndValidity();
      }
      
      if(this.userCategories.length == 2)
      {
        this.userProfileForm.get("userCategory").setValue(this.userCategories[1].id);
      }
      else
      {
        this.userProfileForm.get("userCategory").setValue(""); 
      }
    }
  }

  async getOnBoardingLink(code : string) 
  {
    try 
    {
      this.loadingClicked = true;
      let response = await this.userService.getOnBoardingLink(code).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.userOnBoardingLink = response.userOnBoardingLink;
        this.userProfileForm.patchValue(this.userOnBoardingLink);
        this.loadingClicked = false;
      }
      else
      {
        this.userOnBoardingLink = [];
        this.loadingClicked = false;
      }
    } 
    catch (error) 
    {
      this.iconClass = "fa fa-exclamation-circle text-danger";
      this.colorClass = "text-danger";
      this.message = error;
      this.profileClicked = true;
      this.loadingClicked = false;
    }
  }

  async saveUser()
  { 
    if(!this.saveClicked)
    {
      if(this.userProfileForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true; 
        try
        {
          let formData = new FormData();
          formData.append("firstName", this.userProfileForm.get("firstName").value);
          formData.append("lastName", this.userProfileForm.get("lastName").value);
          formData.append("email", this.userProfileForm.get("email").value);
          formData.append("mobile", this.userProfileForm.get("mobile").value);
          formData.append("password", this.userProfileForm.get("password").value);
          formData.append("gender", this.userProfileForm.get("gender").value);
          formData.append("userGrade", JSON.stringify({"id" : this.userProfileForm.get("userGrade").value}));
          formData.append("userCategory", JSON.stringify({"id" : this.userProfileForm.get("userCategory").value}));
          formData.append("userOnBoarding", JSON.stringify({"code" : this.code }));
          if(this.profileForm.get("profilePic").value != null)
          {
            formData.append("profilePic", (this.profileForm.get("profilePic").value)[0]);
          }
          
          let response = await this.userService.saveUser(formData).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.profileClicked = true;
            this.iconClass = "fa fa-check-circle text-success";
            this.message = "User Profile Created";
            this.colorClass = "text-success";
            this.saveClicked = false;
            this.userProfileForm.reset();
          }
        }
        catch(e)
        {
          this.profileClicked = true;
          this.iconClass = "fa fa-exclamation-circle text-danger";
          this.colorClass = "text-danger";
          this.message = e;
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

>>>>>>> parent of c617e70 (ss)
}
