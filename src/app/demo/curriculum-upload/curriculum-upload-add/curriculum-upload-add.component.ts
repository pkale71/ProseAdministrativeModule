import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { School } from 'src/app/theme/shared/model/school';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CurriculumService } from 'src/app/theme/shared/service/curriculum.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import { TagInputModule } from 'ngx-chips';
import { FileUploadValidators, FileUploadModule } from '@iplab/ngx-file-upload';
import Swal from 'sweetalert2';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { SyllabusSubjectChapterTopic } from 'src/app/theme/shared/model/syllabus-subject-chapter-topic';
import { MaterialType } from 'src/app/theme/shared/model/material-type';
import { FileType } from 'src/app/theme/shared/model/file-type';
import { User } from 'src/app/theme/shared/model/user';
import { UserService } from 'src/app/theme/shared/service';
import { Syllabus } from 'src/app/theme/shared/model/syllabus';
import { SchoolService } from 'src/app/theme/shared/service/school.service';

@Component({
  selector: 'app-curriculum-upload-add',
  standalone: true,
  imports: [CommonModule, SharedModule, FileUploadModule, TagInputModule],
  templateUrl: './curriculum-upload-add.component.html',
  styleUrls: ['./curriculum-upload-add.component.scss']
})
export class CurriculumUploadAddComponent {
  @Input() public modalParams;
  filesControl = new FormControl<File[]>(null, FileUploadValidators.filesLimit(1));
  schools : School[];
  academicYears : AcademicYear[];
  materialTypes : any[];
  grades : any[];
  subjects : SyllabusGradeSubject[];
  chapters : SyllabusGradeSubjectChapter[];
  topics : SyllabusSubjectChapterTopic[];
  uploadCurriculumForm: FormGroup;
  curriculumFileForm : FormGroup;
  academicYearForm: FormGroup;
  schoolForm: FormGroup;
  materialTypeForm: FormGroup;
  gradeForm : FormGroup;
  subjectForm : FormGroup;
  chapterForm : FormGroup;
  topicForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  unVerifyFiles : string[];
  selectedFileTypes : FileType[];
  loginUser : User;
  curriculumUploadAs : string = "";
  uploadedFiles: Array<File> = [];
  totalSize : number = 0;
  searchAcademicYear : boolean = false;
  searchGrade : boolean = false;
  searchSubject : boolean = false;
  searchChapter : boolean = false;
  searchTopic : boolean = false;
  urlFileTypeExist : boolean = false;

  constructor(private commonService: CommonService,
    private schoolService : SchoolService, 
    private curriculumService: CurriculumService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private userService : UserService)
  {
    this.loginUser = this.commonSharedService.loginUser;
//Check User Can Upload In Which School
    this.schools = [];
    this.checkUserCanUploadForSchool(0, this.loginUser.schools);
////
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;
    this.selectedFileTypes = [];
    this.academicYears = [];
    this.grades = [];
    this.subjects = [];
    this.chapters = [];
    this.topics = [];
    this.unVerifyFiles = [];
    
    this.uploadCurriculumForm = this.formbuilder.group({
      uuid:[''],
      academicYear: this.formbuilder.group({ 'uuid': [''] }),
      school: this.formbuilder.group({ 'uuid': [''] }),
      grade: this.formbuilder.group({ 'id': [''] }), 
      gradeSubject: this.formbuilder.group({ 'uuid': [''] }),
      subjectChapter: this.formbuilder.group({ 'uuid': [''] }),
      chapterTopic: this.formbuilder.group({ 'uuid': [''] }),
      materialType: this.formbuilder.group({ 'uuid': [''] }),
      urls: ['']
    });

    this.academicYearForm = this.formbuilder.group({
      'academicYear': ['', [Validators.required]]
    });
    
    this.schoolForm = this.formbuilder.group({
      'school': ['', [Validators.required]]
    });

    this.materialTypeForm = this.formbuilder.group({
      'materialType': ['', [Validators.required]]
    });

    this.gradeForm = this.formbuilder.group({
      'grade': ['', [Validators.required]]
    });

    this.subjectForm = this.formbuilder.group({
      'subject': ['', [Validators.required]]
    });

    this.chapterForm = this.formbuilder.group({
      'chapter': ['', [Validators.required]]
    });

    this.topicForm = this.formbuilder.group({
      'topic': ['']
    });

    this.curriculumFileForm = this.formbuilder.group({
      'curriculumFile': this.filesControl
    });

    this.getAcademicYears();
    this.getMaterialTypes();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async checkUserCanUploadForSchool(i, schools : School[])
  {
//Check User Can Upload For Which School
    if(i < schools.length)
    {
      let response = await this.schoolService.getSchool(schools[i].uuid).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        let tempSchool : School = response.data.school;
        let tempUploadSettings = tempSchool.schoolUserSetting;
        for(let k=0;k<tempUploadSettings.length;k++)
        {
          if(tempUploadSettings[k].userType.code == this.loginUser.userType.code && tempUploadSettings[k].canUpload == 1)
          {
            this.schools.push(schools[i]);
            break;
          }
        }
        this.schools.unshift({uuid : "", name : "Select School"});
        i++;
        this.checkUserCanUploadForSchool(i, schools);          
      }
    }
  }

  async getAcademicYears() 
  {
    try
    {
      this.searchAcademicYear = true;
      let response = await this.commonService.getAcademicYears().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicYears = response.data.academicYears;
        ///set current academicYear
        for(let i=0;i<this.academicYears.length;i++)
        {
          if(this.academicYears[i].isCurrent == 1)
          {
            this.academicYearForm.get("academicYear").setValue(this.academicYears[i].uuid);
            this.searchAcademicYear = false;
            break;
          }
        }
        this.academicYears.unshift({uuid : "", year : "Select Academic Year"});
      }
    }
    catch(e)
    {
      this.academicYears = [];
      this.academicYears.unshift({uuid : "", year : "Select Academic Year"});
      this.searchAcademicYear = false;
    }
  }

  async getMaterialTypes() 
  {
    let response = await this.commonService.getMaterialTypes().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.materialTypes = response.data.materialTypes;
      this.materialTypes.unshift({id : "", name : "Select Material Type"});
    }
  }

  async getAssignedGrades() 
  {
    let tempGrade = {"id" : "", "name" : "Select Grade"};
    this.grades = [];
    let schoolUUID : string = this.schoolForm.get("school").value;
    let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
    let syllabus : Syllabus = this.schools.filter(school => school.uuid == schoolUUID)[0]?.syllabus;
    if(schoolUUID != "" && academicYearUUID != "" && this.loginUser != null)
    {
      try
      {
        this.searchGrade = true;
  //Check Curriculum Upload As Chapter-wise OR Topic-wise
        this.curriculumUploadAs = this.loginUser.schools.filter(school => school.uuid == schoolUUID)[0]?.curriculumUpload;
  ///
        if(this.loginUser.userType.code == "SCHCD")
        {
          let response = await this.userService.getAssignedGrades(this.loginUser.uuid, academicYearUUID, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            let assignedGrades = response.data.assignedGrades;
            for(let i=0;i<assignedGrades.length;i++)
            {
              for(let k=0;k<assignedGrades[i].userSuperviseGrades.length;k++)
              {
                this.grades.push(assignedGrades[i].userSuperviseGrades[k].assignedGrade);
              }
            }
            this.grades.unshift(tempGrade);
            this.searchGrade = false;
          }
        }
        else if(this.loginUser.userType.code == "SUBHD")
        {
          let response = await this.userService.getAssignedGradeSubjects(this.loginUser.uuid, academicYearUUID, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.grades = response.data.assignedSubjects;
            this.grades.unshift(tempGrade);
            this.searchGrade = false;
          }
        }
        else if(this.loginUser.userType.code == "TECHR")
        {
          let response = await this.userService.getTeachGrades(this.loginUser.uuid, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.grades = response.data.grades;
            this.grades.unshift(tempGrade);
            this.searchGrade = false;
          }
        }
        else if(this.loginUser.userType.code == "SCHPL" || this.loginUser.userType.code == "SCHVP" || this.loginUser.userType.code == "CURHD" || this.loginUser.userType.code == "HDOFA")
        {
          let response = await this.schoolService.getSchoolGrades(schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.grades = response.data.grades;
            this.grades.unshift(tempGrade);
            this.searchGrade = false;
          }
        }
      }
      catch(e)
      {
        this.searchGrade = false;
        this.grades = [];
        this.grades.unshift(tempGrade);
      }
    }
    else
    {
      this.grades.unshift(tempGrade);
      this.showNotification("info", "Select Academc Year & School");
    }
  }

  async getAssignedGradeSubjects() 
  {
    let tempSubject = {"uuid" : "", "name" : "Select Subject"};
    this.subjects = [];
    let schoolUUID : string = this.schoolForm.get("school").value;
    let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
    let gradeId : number = this.gradeForm.get("grade").value;
    let syllabus : Syllabus = this.schools.filter(school => school.uuid == schoolUUID)[0]?.syllabus;
    
    if(schoolUUID != "" && academicYearUUID != "" && gradeId > 0 && this.loginUser != null)
    {
      try
      {
        this.searchSubject = true;
        if(this.loginUser.userType.code == "SCHCD")
        {
          let response = await this.commonService.getGradeSubjects(syllabus.id, gradeId).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.subjects = response.data.gradeSubjects;
            this.subjects.unshift(tempSubject);
            this.searchSubject = false;
          }
        }
        else if(this.loginUser.userType.code == "SUBHD")
        {
          let response = await this.userService.getAssignedGradeSubjects(this.loginUser.uuid, academicYearUUID, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            let assignedGrades = response.data.assignedSubjects;
            for(let i=0;i<assignedGrades.length;i++)
            {
              for(let k=0;k<assignedGrades[i].userAssignedSubjects.length;k++)
              {
                this.subjects.push(assignedGrades[i].userAssignedSubjects[k].assignedSubject);
              }
            }
            this.subjects.unshift(tempSubject);
            this.searchSubject = false;
          }
        }
        else if(this.loginUser.userType.code == "TECHR")
        {
          let response = await this.userService.getTeachSubjects(this.loginUser.uuid, gradeId, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.subjects = response.data.gradeSubjects;
            this.subjects.unshift(tempSubject);
            this.searchSubject = false;
          }
        }
        else if(this.loginUser.userType.code == "SCHPL" || this.loginUser.userType.code == "SCHVP" || this.loginUser.userType.code == "CURHD" || this.loginUser.userType.code == "HDOFA")
        {
          let response = await this.commonService.getGradeSubjects(syllabus.id, gradeId).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.subjects = response.data.gradeSubjects;
            this.subjects.unshift(tempSubject);
            this.searchSubject = false;
          }
        }
      }
      catch(e)
      {
        this.subjects = [];
        this.subjects.unshift(tempSubject);
        this.searchSubject = false;
      }
    }
    else
    {
      this.subjects.unshift(tempSubject);
      this.showNotification("info", "Select Academc Year, School & Grade");
    }
  }

  async getChapters() 
  {
    let tempChapter = {"uuid" : "", "name" : "Select Chapter"};
    this.chapters = [];
    let subjectUUID : string = this.subjectForm.get("subject").value;
    if(subjectUUID && this.loginUser != null)
    {
      try
      {
        this.searchChapter = true;
        let response = await this.commonService.getSubjectChapters(subjectUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.chapters = response.data.subjectChapters;
          this.chapters.unshift(tempChapter);
          this.searchChapter = false;
        }
      }
      catch(e)
      {
        this.chapters = [];
        this.chapters.unshift(tempChapter);
        this.searchChapter = false;
      }
    }
    else
    {
      this.chapters.unshift(tempChapter);
      this.showNotification("info", "Select Chapter");
    }
  }

  async getTopics() 
  {
    let tempTopic = {"uuid" : "", "name" : "Select Topic", "userChapterCompleteStatuses": []};
    if(this.curriculumUploadAs == 'Topic-wise')
    {
      this.topics = [];
      let chapterUUID : string = this.chapterForm.get("chapter").value;
      if(chapterUUID && this.loginUser != null)
      {
        try
        {
          this.searchTopic = true;
          let response = await this.commonService.getChapterTopics(chapterUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.topics = response.data.chapterTopics;
            this.topics.unshift(tempTopic);
            this.searchTopic = false;
          }
        }
        catch(e)
        {
          this.topics = [];
          this.topics.unshift(tempTopic);
          this.searchTopic = false;
        }
      }
      else
      {
        this.showNotification("info", "Select Topic");
        this.topics.unshift(tempTopic);
      }
    }
    else
    {
      this.topics = [];
      this.topics.unshift(tempTopic);
    }
  }

  getMaterialFileTypes()
  {
    this.urlFileTypeExist = false;
    this.uploadCurriculumForm.get("urls").setValue("");
    this.unVerifyFiles = [];
    this.uploadedFiles = [];
    let uuid : string = this.materialTypeForm.get("materialType").value;
    let existMaterialTypes : MaterialType[] = this.materialTypes.filter(materialType => materialType.uuid == uuid);
    if(existMaterialTypes.length > 0)
    {
      this.selectedFileTypes = existMaterialTypes[0].fileTypes;
      for(let i=0;this.selectedFileTypes.length;i++)
      {
        if(this.selectedFileTypes[i].name.toLowerCase() == "url")
        {
          this.urlFileTypeExist = true;
          break;
        }
      }
    }
    else
    {
      this.selectedFileTypes = [];
    }
  }

  checkUploadFileType(mimeType)
  {
    let isValid : boolean = false;
    
    for(let i=0;i<this.selectedFileTypes.length;i++)
    {
      if(this.selectedFileTypes[i].mimeType.includes(mimeType))
      {
        isValid = true;
        break;
      }
    }
    return isValid;
  }

  onSelectCurriculumUrls() 
  {
    let urls : any[] = this.uploadCurriculumForm.get("urls").value;
    for(let i=0;i<urls.length;i++)
    {
      let urlValue : string = urls[i].value;
      if(urlValue.substring(0,8) != "https://")
      {
        this.unVerifyFiles.push(urlValue);
        urls.splice(i,1);
      }
      else if(urlValue.substring(0,8) == "https://")
      {
        let duplicateUrls : any[] = urls.find(url=>url.value === urlValue);
        if(duplicateUrls.length > 0)
        {
          urls.splice(i,1);
        }
      }
    }
    this.uploadCurriculumForm.get("urls").setValue(urls);
  }

  onSelectCurriculumFiles(event) 
  {
    this.unVerifyFiles = [];
    let materialType : string = this.materialTypeForm.get("materialType").value;
    if(materialType != "")
    {
      if (this.curriculumFileForm.get("curriculumFile").value) 
      {
        let file = this.curriculumFileForm.get("curriculumFile").value;
        let fSize : number = 0;        
        for(let i=0;i<file.length;i++)
        {
          fSize = fSize + parseFloat((file[i].size / 1048576).toFixed(2));
          if(this.checkUploadFileType(file[i].type))
          {
            if(fSize > 50)
            {
              this.unVerifyFiles.push(file[i].name);
              this.showNotification("warning", "File size should be less than 50 MB");
              fSize = fSize - parseFloat((file[i].size / 1048576).toFixed(2));
              file.splice(i,1);
              this.curriculumFileForm.get("curriculumFile").setValue(file);
        //reset count
              file = this.curriculumFileForm.get("curriculumFile").value;
              i=0;
              fSize = 0;
            }
          }
          else
          {
            this.unVerifyFiles.push(file[i].name);
            fSize = fSize - parseFloat((file[i].size / 1048576).toFixed(2));
            file.splice(i,1);
            this.curriculumFileForm.get("curriculumFile").setValue(file);
          //reset count
            file = this.curriculumFileForm.get("curriculumFile").value;
            i=0;
            fSize = 0;
          }
        }
      }
      this.calcFileSize();
    }
    else
    {
      this.showNotification("info", "Select Material Type");
      this.filesControl.setValue([]);
    }
  }

  calcFileSize()
  {
    this.totalSize = 0;
    for(let i=0;i<this.uploadedFiles.length;i++)
    {
      let fSize : number = parseFloat((this.uploadedFiles[i].size / 1048576).toFixed(2));
      this.totalSize = parseFloat((parseFloat(this.totalSize.toString()) + parseFloat(fSize.toString())).toFixed(2));
    }
  }

  async saveUploadCurriculum()
  {
    let finalUrls : any[] = [];
    if(!this.saveClicked)
    {
      if(this.uploadCurriculumForm.valid && this.schoolForm.valid && this.gradeForm.valid && this.subjectForm.valid && this.chapterForm.valid && this.topicForm.valid && this.materialTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.uploadCurriculumForm.controls["academicYear"].get("uuid").setValue(this.academicYearForm.get("academicYear").value);
        this.uploadCurriculumForm.controls["school"].get("uuid").setValue(this.schoolForm.get("school").value);
        this.uploadCurriculumForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
        this.uploadCurriculumForm.controls["gradeSubject"].get("uuid").setValue(this.subjectForm.get("subject").value);
        this.uploadCurriculumForm.controls["subjectChapter"].get("uuid").setValue(this.chapterForm.get("chapter").value);
        this.uploadCurriculumForm.controls["chapterTopic"].get("uuid").setValue(this.topicForm.get("topic").value);
        this.uploadCurriculumForm.controls["materialType"].get("uuid").setValue(this.materialTypeForm.get("materialType").value);
////Re-construct Urls array
        if(this.uploadCurriculumForm.get("urls").value?.length > 0)
        {
          finalUrls = this.uploadCurriculumForm.get("urls").value.map((url : any) => url.value);
        }
/////////Create Form Data
        let formData = new FormData();
        formData.append("uuid","");
        formData.append("academicYear", JSON.stringify(this.uploadCurriculumForm.controls["academicYear"].value));
        formData.append("school", JSON.stringify(this.uploadCurriculumForm.controls["school"].value));
        formData.append("grade", JSON.stringify(this.uploadCurriculumForm.controls["grade"].value));
        formData.append("gradeSubject", JSON.stringify(this.uploadCurriculumForm.controls["gradeSubject"].value));
        formData.append("subjectChapter", JSON.stringify(this.uploadCurriculumForm.controls["subjectChapter"].value));
        if(this.curriculumUploadAs == 'Topic-wise')
        {
          formData.append("chapterTopic", JSON.stringify(this.uploadCurriculumForm.controls["chapterTopic"].value));
        }
        else
        {
          formData.append("chapterTopic", JSON.stringify({uuid : ""}));
        }
        formData.append("materialType", JSON.stringify(this.uploadCurriculumForm.controls["materialType"].value));
        
        let selUrls : string = "";
        for(let f=0;f<finalUrls.length;f++)
        {
          if(selUrls == "")
          {
            selUrls = finalUrls[f];
          }
          else
          {
            selUrls = selUrls + "," + finalUrls[f];
          }
        }
        formData.append("urls", selUrls);
        
        for(let f=0;f<this.uploadedFiles.length;f++)
        {
          formData.append("curriculumFiles", this.uploadedFiles[f]);
        }
        if(this.uploadedFiles.length == 0)
        {
          formData.append("curriculumFiles", "");
        }
///////
        try
        {
          let response = await this.curriculumService.saveCurriculum(formData).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Curriculum Files Saved");
              let storageJSON = {
                "academicYear" : this.academicYearForm.get("academicYear").value,
                "school" : this.schoolForm.get("school").value,
                "status" : "Uploaded",
                "grade" : "",
                "subject" : "",
                "chapter" : "",
                "topic" : ""
              }
              localStorage.setItem("CurriculumUploadFiler", JSON.stringify(storageJSON));
              this.closeModal();
              this.commonSharedService.curriculumUploadListObject.next({
                result : "success"
              });
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
