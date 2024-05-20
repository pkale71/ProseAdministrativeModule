import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Syllabus } from 'src/app/theme/shared/model/syllabus';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { IOption, SelectModule } from 'ng-select';
import { UserType } from 'src/app/theme/shared/model/userType';
import { SchoolUserSetting } from 'src/app/theme/shared/model/school-user-setting';

// third party
import { FileUploadValidators, FileUploadModule } from '@iplab/ngx-file-upload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-school-add',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule, FileUploadModule],
  templateUrl: './school-add.component.html',
  styleUrls: ['./school-add.component.scss']
})
export class SchoolAddComponent {
  @Input() public modalParams;
  filesControl = new FormControl<File[]>(null, FileUploadValidators.filesLimit(1));
  syllabuses : Syllabus[];
  userTypes : UserType[];
  schoolUserSettings : SchoolUserSetting[];
  gradeCategories : Array<IOption>;
  addSchoolForm: FormGroup;
  logoForm : FormGroup;
  schoolUserSettingForm: FormGroup;
  syllabusForm: FormGroup;
  userTypeForm: FormGroup;
  gradeCategoryForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

  constructor(private commonService: CommonService, 
    private schoolService: SchoolService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
  {
    
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;
    this.syllabuses = [];
    this.schoolUserSettings = [];

    this.addSchoolForm = this.formbuilder.group({
      uuid:[''],
      name: ['',Validators.required],
      location: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      contact1: ['',[Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      contact2: ['',[Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]],
      syllabus: this.formbuilder.group({ 'id': [''] }),
      gradeCategory: [''],
      curriculumUpload: ['',[Validators.required]],
      curriculumComplete: ['',[Validators.required]],
      schoolUserSetting : ['']
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', [Validators.required]]
    });
    
    this.syllabusForm = this.formbuilder.group({
      'syllabus': ['', [Validators.required]]
    });

    this.userTypeForm = this.formbuilder.group({
      'userType': ['']
    });

    this.logoForm = this.formbuilder.group({
      'logo': this.filesControl
    });

    this.schoolUserSettingForm = this.formbuilder.group({
      'canUpload': [''],
      'canVerify': [''],
      'canPublish': [''],
    });

    this.getSyllabuses();
    this.getGradeCategories();
    this.getUserTypes();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSyllabuses() 
  {
    let response = await this.commonService.getSyllabuses().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.syllabuses = response.data.syllabuses;
    }
  }

  async getUserTypes() 
  {
    let response = await this.commonService.getUserTypes().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.userTypes = response.data.userTypes;
    }
  }

  async getGradeCategories() 
  {
    /////////get Grade Categories
    let tempGradeCategories : Array<IOption> = [];
    let response = await this.commonService.getGradeCategories().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      let gradeCategories : any[] = response.data.gradeCategories;
      for(let i=0;i<gradeCategories.length;i++)
      {
        tempGradeCategories.push({
            "value" : gradeCategories[i].id.toString(),
            "label": gradeCategories[i].name
        })
      }
      this.gradeCategories = this.commonSharedService.prepareSelectOptions(tempGradeCategories);
    }
  }

  applySetting()
  {
    /////
    let userTypeId : number = this.userTypeForm.get("userType").value ? this.userTypeForm.get("userType").value : 0;
    let canUpload : number = this.schoolUserSettingForm.get("canUpload").value === true ? 1 : 0;
    let canVerify : number = this.schoolUserSettingForm.get("canVerify").value === true ? 1 : 0;
    let canPublish : number = this.schoolUserSettingForm.get("canPublish").value === true ? 1 : 0;
    
    if(userTypeId > 0 && (canUpload > 0 || canVerify > 0 || canPublish > 0))
    {
      if(this.schoolUserSettings.length > 0)
      {
      //check data exist in the table
        let existUserType : SchoolUserSetting[] = this.schoolUserSettings.filter(schoolUserSetting => schoolUserSetting.userType.id == userTypeId);
        let existCanUpload : SchoolUserSetting[] = this.schoolUserSettings.filter(schoolUserSetting => schoolUserSetting.canUpload == canUpload && schoolUserSetting.userType.id == userTypeId && canUpload > 0);
        let existCanVerify : SchoolUserSetting[] = this.schoolUserSettings.filter(schoolUserSetting => schoolUserSetting.canVerify == canVerify && schoolUserSetting.userType.id == userTypeId && canVerify > 0);
        let existCanPublish : SchoolUserSetting[] = this.schoolUserSettings.filter(schoolUserSetting => schoolUserSetting.canPublish == canPublish && schoolUserSetting.userType.id == userTypeId && canPublish > 0);
        
        if(existUserType.length == 0 && existCanUpload.length == 0 && existCanVerify.length == 0 && existCanPublish.length == 0)
        {
          let schoolUserSettingJSON : SchoolUserSetting = new SchoolUserSetting();
          let tempUserType : UserType[] = this.userTypes.filter(userType => userType.id == userTypeId);
          schoolUserSettingJSON.userType = tempUserType[0];
          schoolUserSettingJSON.canUpload = canUpload;
          schoolUserSettingJSON.canVerify = canVerify;
          schoolUserSettingJSON.canPublish = canPublish;

          this.schoolUserSettings.push(schoolUserSettingJSON);
        }
        else
        {
          if(existUserType.length > 0)
          {
            this.showNotification("warning", "User Type Already Exist In The Setting");
          }
          if(existCanUpload.length > 0)
          {
            this.showNotification("warning", "Can Upload Already Exist For Same User Type In The Setting");
          }
          if(existCanVerify.length > 0)
          {
            this.showNotification("warning", "Can Verify Already Exist In The Setting");
          }
          if(existCanPublish.length > 0)
          {
            this.showNotification("warning", "Can Publish Already Exist In The Setting");
          }
        }
      }
      else
      {
        let schoolUserSettingJSON : SchoolUserSetting = new SchoolUserSetting();
        let tempUserType : UserType[] = this.userTypes.filter(userType => userType.id == userTypeId);
        schoolUserSettingJSON.userType = tempUserType[0];
        schoolUserSettingJSON.canUpload = canUpload;
        schoolUserSettingJSON.canVerify = canVerify;
        schoolUserSettingJSON.canPublish = canPublish;

        this.schoolUserSettings.push(schoolUserSettingJSON);
      }
    }
    else
    {
      if(userTypeId == 0)
      {
        this.showNotification("warning", "Select User Type");        
      }
      if(canUpload == 0 && canVerify == 0 && canPublish == 0)
      {
        this.showNotification("warning", "Select Any One From [Can Upload, Can Verify, Can Publish]");        
      }
    }
  }

  onSelectLogo(event) 
  {
    if (this.logoForm.get("logo").value) 
    {
      const file = this.logoForm.get("logo").value;
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

  deleteSchoolUserSetting(index : number)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete curriculum user setting?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
        
      } else {
        this.schoolUserSettings.splice(index,1);
        this.showNotification('info', "Curriculum User Setting Deleted");
      }
    });    
  }

  async saveSchool()
  {
    if(!this.saveClicked)
    {
      if(this.addSchoolForm.valid && this.syllabusForm.valid && this.gradeCategoryForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        
        this.addSchoolForm.get("gradeCategory").setValue(this.gradeCategoryForm.get("gradeCategory").value.toString());
        this.addSchoolForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
       
        if(this.schoolUserSettings.length > 0)
        {
          this.addSchoolForm.get("schoolUserSetting").setValue(this.schoolUserSettings);
        }
/////////Create Form Data
        let formData = new FormData();
        formData.append("uuid","");
        formData.append("name", this.addSchoolForm.get("name").value);
        formData.append("location", this.addSchoolForm.get("location").value);
        formData.append("email", this.addSchoolForm.get("email").value);
        formData.append("contact1", this.addSchoolForm.get("contact1").value);
        formData.append("contact2", this.addSchoolForm.get("contact2").value);
        formData.append("syllabus", JSON.stringify(this.addSchoolForm.controls["syllabus"].value));
        formData.append("gradeCategory", this.addSchoolForm.get("gradeCategory").value);
        formData.append("curriculumUpload", this.addSchoolForm.get("curriculumUpload").value);
        formData.append("curriculumComplete", this.addSchoolForm.get("curriculumComplete").value);
        formData.append("schoolUserSetting", JSON.stringify(this.addSchoolForm.get("schoolUserSetting").value));
        
        if(this.logoForm.get("logo").value != null)
        {
          formData.append("logoFile", (this.logoForm.get("logo").value)[0]);
        }
        else
        {
          formData.append("logoFile","");
        }
///////
        try
        {
          let response = await this.schoolService.saveSchool(formData).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "School Created");
              this.closeModal();
              this.router.navigateByUrl("/school/detail/" + response.data.uuid);
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
