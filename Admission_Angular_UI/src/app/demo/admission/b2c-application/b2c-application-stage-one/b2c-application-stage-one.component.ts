import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import moment from 'moment';
import { UserService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-b2c-application-stage-one',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './b2c-application-stage-one.component.html',
  styleUrls: ['./b2c-application-stage-one.component.scss']
})
export class B2cApplicationStageOneComponent 
{
  applicationTypeForm : FormGroup;
  schoolForm : FormGroup;
  schoolingProgramForm : FormGroup;
  academicSessionForm : FormGroup;
  siblingTypeForm : FormGroup;
  addApplicationForm1 : FormGroup;
  lastAcademicSessionForm : FormGroup;
  batchTypeForm : FormGroup;
  genderForm : FormGroup;
  studentForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  syllabusForm : FormGroup;
  subjectGroupForm : FormGroup;
  profileCompletionForm : FormGroup;
  parentUndertakingForm : FormGroup;
  studyCenterForm : FormGroup;
  leadStudentTypeForm : FormGroup;
  marketLeadTypeForm : FormGroup;
  walkinModeForm : FormGroup;
  applicationTypes : any[];
  schools : any[];
  masterSchools : any[];
  schoolingPrograms : any[];
  academicSessions : any[];
  siblingTypes : any[];
  lastAcademicSessions : any[];
  masterAcademicSessions : any[];
  applicationStudents : any[];
  gradeCategories : any[];
  grades : any[];
  syllabuses : any[];
  subjectGroups : any[];
  subjectGroupAllocations : any[];
  profileCompletions : any[];
  undertakings : any[];
  minSubject : number;
  maxSubject : number;
  genders : any[];
  batchTypes : any[];
  studyCenters : any[];
  leadStudentTypes : any[];
  marketLeadTypes : any[];
  walkinModes : any[];
  selectedSubjects : string;
  isValidForm : boolean;
  searchClickedApplicationType : boolean;
  searchClickedSchool : boolean;
  searchClickedSchoolingProgram : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedSiblingType : boolean;
  searchClickedStudent : boolean;
  searchClickedGrade : boolean;
  searchClickedSyllabus : boolean;
  searchClickedSubjectGroup : boolean;
  isSiblingForm : boolean;
  isLastAdmission : boolean;
  searchClickedBatch : boolean;
  searchClickedSubject : boolean;
  searchClickedCompletion : boolean;
  searchClickedUndertaking : boolean;
  searchClickedStudyCenter : boolean;
  searchClickedLeadStudent : boolean;
  searchClickedMarketLead : boolean;
  searchClickedWalkIn : boolean;
  isWalkInMode : boolean;
  curDate : string;
  saveClicked : boolean;
  userTypeCode : string;
  loginUserUUID : string;
  moduleId : number;

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService, 
    private admissionService : AdmissionService,
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router, 
    private location : Location)
  {
    this.schools = [];
    this.masterSchools = [];
    this.schoolingPrograms = [];
    this.academicSessions = [];
    this.applicationTypes = [];
    this.siblingTypes = [];
    this.lastAcademicSessions = [];
    this.masterAcademicSessions = [];
    this.applicationStudents = [];
    this.batchTypes = [];
    this.gradeCategories = [];
    this.grades = [];
    this.syllabuses = [];
    this.subjectGroups = [];
    this.profileCompletions = [];
    this.undertakings = [];
    this.subjectGroupAllocations = [];
    this.studyCenters = [];
    this.leadStudentTypes = [];
    this.marketLeadTypes = [];
    this.walkinModes = [];
    this.searchClickedApplicationType = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedSchool = false;
    this.searchClickedSchoolingProgram = false;
    this.searchClickedBatch = false;
    this.isValidForm = true;
    this.searchClickedStudent = false;
    this.searchClickedGrade = false;
    this.searchClickedSyllabus = false;
    this.searchClickedSubjectGroup = false;
    this.searchClickedSubject = false;
    this.isSiblingForm = false;
    this.isLastAdmission = false;
    this.searchClickedCompletion = false;
    this.searchClickedUndertaking = false;
    this.searchClickedStudyCenter = false;
    this.searchClickedLeadStudent = false;
    this.searchClickedMarketLead = false;
    this.searchClickedWalkIn = false;
    this.isWalkInMode = false;
    this.saveClicked = false;
    this.curDate = moment(new Date()).format('YYYY-MM-DD');
    this.userTypeCode = this.commonSharedService.loginUser?.userModule?.userType.code;
    this.loginUserUUID = this.commonSharedService.loginUser?.uuid;
    this.moduleId = this.commonSharedService.loginUser?.userModule?.module?.id;
  }

  ngOnInit() 
  {
    this.siblingTypeForm = this.formbuilder.group({
      siblingType:['']
    });

    this.batchTypeForm = this.formbuilder.group({
      batchType:['', Validators.required]
    });

    this.schoolForm = this.formbuilder.group({
      school:['', Validators.required]
    });

    this.schoolingProgramForm = this.formbuilder.group({
      schoolingProgram:['', Validators.required]
    });

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['', Validators.required]
    });

    this.applicationTypeForm = this.formbuilder.group({
      applicationType:['', Validators.required]
    });

    this.lastAcademicSessionForm = this.formbuilder.group({
      lastAcademicSession:['']
    });

    this.studentForm = this.formbuilder.group({
      student:['']
    });

    this.genderForm = this.formbuilder.group({
      gender:['', Validators.required]
    });

    this.gradeCategoryForm = this.formbuilder.group({
      gradeCategory:['', Validators.required]
    });
    
    this.gradeForm = this.formbuilder.group({
      grade:['', Validators.required]
    });

    this.syllabusForm = this.formbuilder.group({
      syllabus:['', Validators.required]
    });

    this.subjectGroupForm = this.formbuilder.group({
      subjectGroup:['', Validators.required]
    });

    this.profileCompletionForm = this.formbuilder.group({
      profileCompletion:['', Validators.required]
    });

    this.parentUndertakingForm = this.formbuilder.group({
      parentUndertaking:['', Validators.required]
    });

    this.studyCenterForm = this.formbuilder.group({
      studyCenter:['', Validators.required]
    });

    this.leadStudentTypeForm = this.formbuilder.group({
      leadStudentType:['', Validators.required]
    });

    this.marketLeadTypeForm = this.formbuilder.group({
      marketLeadType:['', Validators.required]
    });

    this.walkinModeForm = this.formbuilder.group({
      walkinMode:['']
    });

    this.addApplicationForm1 = this.formbuilder.group({
      "applicationFor" : ['B2C', Validators.required],
      "lastEnrollment" : [''],
      "admissionDate" : ['', Validators.required],
      "batchYear" : ['', Validators.required],
      "studentName" : ['', Validators.required],
      "parentName" : ['', Validators.required],
      "parentEmail" : ['', [Validators.required, Validators.email]],
      "parentMobile" : ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$'), Validators.maxLength(15), Validators.minLength(10)]],
      "relationship" : ['', Validators.required]
    })

    this.getAcademicSessions();
    this.getApplicationTypes();
    this.getSiblingTypes();
    this.getGenders();
    this.getSyllabuses(0);
    this.getStudentProfileCompletions();
    this.getStudyCenters();
    this.getLeadStudentTypes();
    this.getMarketLeadTypes();
    this.getWalkInModes();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getApplicationStudents(academicSessionId : number) 
  {  
    try
    {
      if(academicSessionId > 0)
      {
        this.searchClickedStudent = true;
        let response = await this.admissionService.getApplicationStudents(academicSessionId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.applicationStudents = response.applicationStudents;
          this.applicationStudents.unshift({"uuid" : "", "studentName" : "Select Student"});
          this.searchClickedStudent = false;
        }
        else
        {
          this.applicationStudents = [];
          this.applicationStudents.unshift({"uuid" : "", "studentName" : "Select Student"});
          this.searchClickedStudent = false;
        }
      }
      else
      {
        this.applicationStudents = [];
        this.applicationStudents.unshift({"uuid" : "", "studentName" : "Select Student"});
      }
    }
    catch(e)
    {
      this.applicationStudents = [];
      this.applicationStudents.unshift({"uuid" : "", "studentName" : "Select Student"});
      this.showNotification("error", e);
      this.searchClickedStudent = false;
    }
  }

  async getApplicationTypes() 
  {  
    try
    {
      this.searchClickedApplicationType = true;
      let response = await this.admissionService.getApplicationTypes().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.applicationTypes = response.applicationTypes;
        if(this.applicationTypes.length > 0)
        {
          this.applicationTypeForm.get("applicationType").setValue(this.applicationTypes[0].id);
        }
        this.searchClickedApplicationType = false;
      }
      else
      {
        this.applicationTypes = [];
        this.searchClickedApplicationType = false;
      }
    }
    catch(e)
    {
      this.applicationTypes = [];
      this.showNotification("error", e);
      this.searchClickedApplicationType = false;
    }
  }

  async getGenders() 
  {  
    try
    {
      let response = await this.admissionService.getGenders().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.genders = response.genders;
        this.genders.unshift({id : "", name : "Select Gender"});
      }
      else
      {
        this.genders = [];
      }
    }
    catch(e)
    {
      this.genders = [];
      this.showNotification("error", e);
    }
  }

  async getGradeCategories(syllabusId : number) 
  {  
    try
    {
      this.gradeCategoryForm.get("gradeCategory").setValue("");
      this.gradeCategories = [];
      if(this.syllabuses.length > 0 && syllabusId > 0)
      {
        let filterSyllabuses : any[] = this.syllabuses.filter(syllabus=>syllabus.id == syllabusId);
        
        if(filterSyllabuses.length > 0)
        {
          this.gradeCategories = filterSyllabuses[0].gradeCategories;
          this.gradeCategories.unshift({"id" : "", "name" : "Select Grade Category"});
        }
      }
    }
    catch(e)
    {
      this.gradeCategories = [];
      this.showNotification("error", e);
    }
  }

  async getGrades(gradeCategoryId : number) 
  {  
    try
    {
      //////////
      this.gradeForm.get("grade").setValue("");
      this.searchClickedGrade = true;
      let response = await this.commonService.getGrades(gradeCategoryId, 'Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.grades = response.grades;
        this.grades.unshift({id : "", name : "Select Grade"});
        this.searchClickedGrade = false;
      }
      else
      {
        this.grades = [];
        this.searchClickedGrade = false;
      }
    }
    catch(e)
    {
      this.grades = [];
      this.searchClickedGrade = false;
      this.showNotification("error", e);
    }
  }

  async getSyllabuses(gradeCategoryId : number) 
  {  
    try
    {
      this.syllabusForm.get("syllabus").setValue("");
      this.searchClickedSyllabus = true;
      let response = await this.commonService.getSyllabuses(gradeCategoryId, 'Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.syllabuses = response.syllabuses;
        this.syllabuses.unshift({id : "", name : "Select Syllabus"});
        this.searchClickedSyllabus = false;
      }
      else
      {
        this.syllabuses = [];
        this.searchClickedSyllabus = false;
      }
    }
    catch(e)
    {
      this.syllabuses = [];
      this.searchClickedSyllabus = false;
      this.showNotification("error", e);
    }
  }
 
  async getSubjectGroups(gradeCategoryId : number, gradeId : number, syllabusId : number) 
  {  
    try
    {
      this.subjectGroupForm.get("subjectGroup").setValue("");
      this.searchClickedSubjectGroup = true;
      let response = await this.commonService.getSubjectGroups(syllabusId, gradeCategoryId, gradeId, 'Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.subjectGroups = response.subjectGroups;
        this.subjectGroups.unshift({id : "", groupName : "Select Subject Group"});
        this.searchClickedSubjectGroup = false;
      }
      else
      {
        this.subjectGroups = [];
        this.searchClickedSubjectGroup = false;
      }
    }
    catch(e)
    {
      this.subjectGroups = [];
      this.searchClickedSubjectGroup = false;
      this.showNotification("error", e);
    }
  }

  async getSubjects(subjectGroupId : number) 
  {  
    try
    {
      this.selectedSubjects = "";
      if(subjectGroupId > 0)
      {
        this.searchClickedSubject = true;
        let response = await this.commonService.getSubjectGroupAllocations(subjectGroupId, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.subjectGroupAllocations = response.subjectGroupAllocations;
      ////Get Subject Group Minimum And Maximum Subject
          let tempSubjectGroups = this.subjectGroups.filter(subjectGroup=>subjectGroup.id == subjectGroupId);
          if(tempSubjectGroups.length > 0)
          {
            this.minSubject = tempSubjectGroups[0].minSubject;
            this.maxSubject = tempSubjectGroups[0].maxSubject;
          }
      //////
      ////Mandatory Subject Selections
          this.subjectGroupAllocations.forEach((allocation) => {
            allocation.subject.isSelected = allocation.subject?.isMandatory === 1;
            if(allocation.subject.isSelected)
            {
              if(this.selectedSubjects == "")
              {
                this.selectedSubjects = allocation?.subject.id;
              }
              else
              {
                this.selectedSubjects = this.selectedSubjects + "," + allocation?.subject.id;
              }
            }
          });
      /////////////
          this.searchClickedSubject = false;
        }
        else
        {
          this.subjectGroupAllocations = [];
          this.searchClickedSubject = false;
        }
      }
      else
      {
        this.subjectGroupAllocations = [];
        this.searchClickedSubject = false;
      }
    }
    catch(e)
    {
      this.subjectGroupAllocations = [];
      this.searchClickedSubject = false;
      this.showNotification("error", e);
    }
  }

  selSubjects(event : any)
  {
    if(!event.target.checked)
    {
      this.selectedSubjects = this.commonSharedService.removeCommaSeperatedString(this.selectedSubjects, event.target.value);
    }
    else if(event.target.checked)
    {
      if(this.selectedSubjects == "")
      {
        this.selectedSubjects = event.target.value;
      }
      else
      {
        this.selectedSubjects = this.selectedSubjects + "," + event.target.value;
      }
    }
  }

  async getSiblingTypes() 
  {  
    try
    {
      this.searchClickedSiblingType = true;
      let response = await this.admissionService.getSiblingTypes().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.siblingTypes = response.siblingTypes;
        this.siblingTypes.unshift({id : "", name : "Select Sibling Type"});
        this.searchClickedSiblingType = false;
      }
      else
      {
        this.siblingTypes = [];
        this.searchClickedSiblingType = false;
      }
    }
    catch(e)
    {
      this.siblingTypes = [];
      this.showNotification("error", e);
      this.searchClickedSiblingType = false;
    }
  }

  async getSchools(date : string) 
  {
    try
    {
        this.searchClickedSchool = true;
        let response : any = "";
        if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
        {
          response = await this.userService.getUserSchoolSchoolingPrograms(this.loginUserUUID, this.moduleId).toPromise();
        }
        else
        {
          response = await this.commonService.getSchools('Active', "").toPromise();
        }
        if (response.status_code == 200 && response.message == 'success') 
        {
          if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
          {
            this.masterSchools = response.userSchoolSchoolingPrograms;
            this.schools = this.masterSchools.map(function(item) {
              return { uuid : item.school.uuid, name : item.school.name };
            });
          }
          else
          {
            this.schools = response.schools;
          }
          this.schools.unshift({ uuid : "", name : "Select School" });
          this.searchClickedSchool = false;
        }
        else
        {
            this.schools.unshift({ uuid : "", name : "Select School" });
            this.searchClickedSchool = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSchool = false;
    }
  }

  async getSchoolSchoolingPrograms(schoolUUID : string, date : string) 
  {
    try
    {
        this.searchClickedSchoolingProgram = true;
        this.schoolingPrograms = [];
        this.schoolingProgramForm.get("schoolingProgram").setValue("");
        if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
        {
          let filterSchool : any = this.masterSchools.filter(x => x.school.uuid == schoolUUID);
          if(filterSchool.length > 0)
          {
            this.schoolingPrograms = filterSchool[0].schoolingPrograms;
            this.schoolingPrograms.unshift({id : "", name : "Select Schooling Program"});
          }
          this.searchClickedSchoolingProgram = false;
        }
        else
        {
          let response = await this.commonService.getSchoolSchoolingPrograms(schoolUUID, 'Active', '').toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            response.schoolSchoolingPrograms.forEach(element => {
              this.schoolingPrograms.push({id : element.schoolingProgram.id, name : element.schoolingProgram.name });
            });
            this.schoolingPrograms.unshift({ id : "", name : "Select Schooling Program" });
            this.searchClickedSchoolingProgram = false;
          }
          else
          {
            this.schoolingPrograms.unshift({ id : "", name : "Select Schooling Program" });
            this.searchClickedSchoolingProgram = false;
          }
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSchoolingProgram = false;
    }
  }

  async getSchoolSchoolingProgramBatches(schoolUUID : string, schoolingProgramId : number, date : string) 
  {
    try
    {
        this.searchClickedBatch = true;
        this.batchTypeForm.get("batchType").setValue("");
        let response = await this.commonService.getSchoolSchoolingProgramBatches(schoolUUID, schoolingProgramId, date).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.batchTypes = response.schoolSchoolingProgramBatches;
            this.batchTypes.unshift({id : "", name : "Select Batch Type" });
            this.searchClickedBatch = false;
        }
        else
        {
            this.batchTypes.unshift({ id : "", name : "Select Batch Type" });
            this.searchClickedBatch = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedBatch = false;
    }
  }

  async getAcademicSessions() 
  {  
    try
    {
      this.searchClickedAcademicSession = true;
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = response.academicSessions.filter(academicSession => academicSession.isCurrentSession === 1);
        this.masterAcademicSessions = response.academicSessions;
        this.searchClickedAcademicSession = false;
        if(this.academicSessions.length > 0)
        {
          this.academicSessionForm.get("academicSession").setValue(this.academicSessions[0].id);
          this.addApplicationForm1.get("batchYear").setValue(this.academicSessions[0].batchYear);
        }
      }
      else
      {
        this.academicSessions = [];
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        this.addApplicationForm1.get("batchYear").setValue("");
        this.searchClickedAcademicSession = false;
      }
    }
    catch(e)
    {
      this.academicSessions = [];
      this.addApplicationForm1.get("batchYear").setValue("");
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
    }
  }

  checkForApplicationType(applicationTypeId : number)
  {
    let filterApplicationTypes = this.applicationTypes.filter(applicationType=>applicationType.id == applicationTypeId);
    if(filterApplicationTypes.length > 0)
    {
      if(filterApplicationTypes[0].name == "Sibling Application")
      {
        this.isSiblingForm = true;
        /////////////
        this.siblingTypeForm.get("siblingType").addValidators(Validators.required);
        this.lastAcademicSessionForm.get("lastAcademicSession").addValidators(Validators.required);
        this.addApplicationForm1.get("lastEnrollment").addValidators(Validators.required);
        this.studentForm.get("student").addValidators(Validators.required);
      }
      else
      {
        this.isSiblingForm = false;
        ///////////////
        this.siblingTypeForm.get("siblingType").removeValidators(Validators.required);
        this.lastAcademicSessionForm.get("lastAcademicSession").removeValidators(Validators.required);
        this.addApplicationForm1.get("lastEnrollment").removeValidators(Validators.required);
        this.studentForm.get("student").removeValidators(Validators.required);
      }
    }
    else
    {
      this.isSiblingForm = false;
      ///////////////
      this.siblingTypeForm.get("siblingType").removeValidators(Validators.required);
      this.lastAcademicSessionForm.get("lastAcademicSession").removeValidators(Validators.required);      
      this.addApplicationForm1.get("lastEnrollment").removeValidators(Validators.required);     
      this.studentForm.get("student").removeValidators(Validators.required);      
    }

    this.siblingTypeForm.get("siblingType").setValue("");
    this.lastAcademicSessionForm.get("lastAcademicSession").setValue("");
    this.addApplicationForm1.get("lastEnrollment").setValue("");        
    this.studentForm.get("student").setValue("");
    this.addApplicationForm1.get("parentName").setValue("");
    this.addApplicationForm1.get("parentEmail").setValue("");
    this.addApplicationForm1.get("parentMobile").setValue("");
    this.applicationStudents = [];
    this.lastAcademicSessions = [];
    this.siblingTypeForm.updateValueAndValidity();
    this.lastAcademicSessionForm.updateValueAndValidity();
    this.addApplicationForm1.updateValueAndValidity();
    this.studentForm.updateValueAndValidity();
  }

  checkForSiblingApplication(siblingTypeId : number)
  {
    this.lastAcademicSessions = [];
    if(siblingTypeId == 1)
    {
      this.isLastAdmission = true;
      this.lastAcademicSessions = this.masterAcademicSessions.filter(academicSession => academicSession.isCurrentSession != 1);
      this.lastAcademicSessions.unshift({"id" : "", "year" : "Select Last Academic Year"});
      this.lastAcademicSessionForm.get("lastAcademicSession").setValue("");
      this.addApplicationForm1.get("lastEnrollment").setValue("");        
      this.studentForm.get("student").setValue("");
      this.applicationStudents = [];
    }
    else
    {
      this.isLastAdmission = false
      this.lastAcademicSessions = this.masterAcademicSessions.filter(academicSession => academicSession.isCurrentSession == 1);
      this.lastAcademicSessions.unshift({"id" : "", "year" : "Select Current Academic Year"});
      this.lastAcademicSessionForm.get("lastAcademicSession").setValue("");
      this.addApplicationForm1.get("lastEnrollment").setValue("");        
      this.studentForm.get("student").setValue("");
      this.applicationStudents = [];
    }
  }

  getStudentData(uuid : string)
  {
    this.addApplicationForm1.get("lastEnrollment").setValue("");
    let filterStudents = this.applicationStudents.filter(student=>student.uuid === uuid);
    if(filterStudents.length > 0)
    {
      if(this.isLastAdmission)
      {
        this.addApplicationForm1.get("lastEnrollment").setValue(filterStudents[0].enrollmentNumber);
        this.addApplicationForm1.get("parentName").setValue(filterStudents[0].parent?.name);
        this.addApplicationForm1.get("parentEmail").setValue(filterStudents[0].parent?.email);
        this.addApplicationForm1.get("parentMobile").setValue(filterStudents[0].parent?.mobile);
      }
      else
      {
        this.addApplicationForm1.get("lastEnrollment").setValue(filterStudents[0].applicationNumber);
        this.addApplicationForm1.get("parentName").setValue(filterStudents[0].parent?.name);
        this.addApplicationForm1.get("parentEmail").setValue(filterStudents[0].parent?.email);
        this.addApplicationForm1.get("parentMobile").setValue(filterStudents[0].parent?.mobile);
      }
    }
  }

  async getStudentProfileCompletions() 
  {  
    try
    {
      this.searchClickedCompletion = true;
      let response = await this.admissionService.getStudentProfileCompletions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.profileCompletions = response.studentProfileCompletions;
        this.profileCompletions.unshift({id : "", name : "Select Profile Completion"});
        this.searchClickedCompletion = false;
      }
      else
      {
        this.profileCompletions = [];
        this.searchClickedCompletion = false;
      }
    }
    catch(e)
    {
      this.profileCompletions = [];
      this.showNotification("error", e);
      this.searchClickedCompletion = false;
    }
  }

  async getParentUndertakings(profileCompletionId : number) 
  {  
    try
    {
      this.searchClickedUndertaking = true;
      let response = await this.admissionService.getParentUndertakings(profileCompletionId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.undertakings = response.parentUndertakings;
        this.undertakings.unshift({id : "", name : "Select Undertaking"});
        this.searchClickedUndertaking = false;
      }
      else
      {
        this.undertakings = [];
        this.searchClickedUndertaking = false;
      }
    }
    catch(e)
    {
      this.undertakings = [];
      this.showNotification("error", e);
      this.searchClickedUndertaking = false;
    }
  }

  async getStudyCenters() 
  {  
    try
    {
      this.searchClickedStudyCenter = true;
      let response : any = "";
      if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
      {
        response = await this.userService.getUserStudyCenters(this.loginUserUUID, this.moduleId).toPromise();
      }
      else
      {
        response = await this.commonService.getStudyCenters(0, 'Active').toPromise();
      }
      if (response.status_code == 200 && response.message == 'success') 
      {
        if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
        {
          response.userStudyCenters.forEach(element => {
            this.studyCenters.push({uuid : element.studyCenter.uuid, name : element.studyCenter.name });
          });
        }
        else
        {
          this.studyCenters = response.studyCenters;
        }
        this.studyCenters.unshift({uuid : "", name : "Select Study Center"});
        this.searchClickedStudyCenter = false;
      }
      else
      {
        this.studyCenters = [];
        this.searchClickedStudyCenter = false;
      }
    }
    catch(e)
    {
      this.studyCenters = [];
      this.showNotification("error", e);
      this.searchClickedStudyCenter = false;
    }
  }

  async getLeadStudentTypes() 
  {  
    try
    {
      this.searchClickedLeadStudent = true;
      let response = await this.admissionService.getLeadStudentTypes().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.leadStudentTypes = response.leadStudentTypes;
        this.leadStudentTypes.unshift({id : "", name : "Select Lead Student Tpye"});
        this.searchClickedLeadStudent = false;
      }
      else
      {
        this.leadStudentTypes = [];
        this.searchClickedLeadStudent = false;
      }
    }
    catch(e)
    {
      this.leadStudentTypes = [];
      this.showNotification("error", e);
      this.searchClickedLeadStudent = false;
    }
  }

  async getMarketLeadTypes() 
  {  
    try
    {
      this.searchClickedMarketLead = true;
      let response = await this.admissionService.getMarketLeadTypes().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.marketLeadTypes = response.marketLeadTypes;
        this.marketLeadTypes.unshift({id : "", name : "Select Market Lead Tpye"});
        this.searchClickedMarketLead = false;
      }
      else
      {
        this.marketLeadTypes = [];
        this.searchClickedMarketLead = false;
      }
    }
    catch(e)
    {
      this.marketLeadTypes = [];
      this.showNotification("error", e);
      this.searchClickedMarketLead = false;
    }
  }

  async getWalkInModes() 
  {  
    try
    {
      this.searchClickedWalkIn = true;
      let response = await this.admissionService.getWalkInModes().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.walkinModes = response.walkInModes;
        this.walkinModes.unshift({id : "", name : "Select Market Lead Tpye"});
        this.searchClickedWalkIn = false;
      }
      else
      {
        this.walkinModes = [];
        this.searchClickedWalkIn = false;
      }
    }
    catch(e)
    {
      this.walkinModes = [];
      this.showNotification("error", e);
      this.searchClickedWalkIn = false;
    }
  }

  checkWalkinLead(marketLeadTypeId : number)
  {
    if(marketLeadTypeId > 0)
    {
      this.walkinModeForm.get("walkinMode").setValue("");
      let tempMarketLeads = this.marketLeadTypes.filter(marketLeadType=>marketLeadType.id == marketLeadTypeId);
      if(tempMarketLeads.length > 0)
      {
        if(tempMarketLeads[0].name == "Walk-In")
        {
          this.isWalkInMode = true;
          this.walkinModeForm.get("walkinMode").setValidators(Validators.required);
        }
        else
        {
          this.isWalkInMode = false;          
          this.walkinModeForm.get("walkinMode").removeValidators(Validators.required);
          
        }
      }
      else
      {
        this.isWalkInMode = false;
        this.walkinModeForm.get("walkinMode").removeValidators(Validators.required);
      }
    }
    else
    {
      this.isWalkInMode = false;
      this.walkinModeForm.get("walkinMode").removeValidators(Validators.required);
    }
    this.walkinModeForm.get("walkinMode").setValue("");
    this.walkinModeForm.updateValueAndValidity();
  }

  createApplicationFormJSON()
  {
    let dataJSON : any = "";
    let subjects = this.selectedSubjects.toString().split(",");
    if(subjects.length < this.minSubject && subjects.length > this.maxSubject)
    {
      this.showNotification("info", "Min : " + this.minSubject + " And Max : " + this.maxSubject + " Subjects Should Be Selected");
    }
    else
    {
      dataJSON = {
        "applicationType" : {"id" : this.applicationTypeForm.get("applicationType").value},
        "school" : {"uuid" : this.schoolForm.get("school").value},
        "schoolingProgram" : {"id" : this.schoolingProgramForm.get("schoolingProgram").value},
        "academicSession" : {"id" : this.academicSessionForm.get("academicSession").value},
        "batchYear" : {"id" : this.academicSessionForm.get("academicSession").value},
        "siblingType" : {"id" : this.isSiblingForm ? this.siblingTypeForm.get("siblingType").value : ""},
        "lastAcademicSession" : {"id" : (this.isSiblingForm && this.isLastAdmission) ? this.lastAcademicSessionForm.get("lastAcademicSession").value : ""},
        "lastYearEnrollment" : {"uuid" : (this.isSiblingForm && this.isLastAdmission) ? this.studentForm.get("student").value : ""},
        "currentAcademicSession" : {"id" : (this.isSiblingForm && !this.isLastAdmission) ? this.lastAcademicSessionForm.get("lastAcademicSession").value : ""},
        "currentYearApplication" : {"uuid" : (this.isSiblingForm && !this.isLastAdmission) ? this.studentForm.get("student").value : ""},
        "studentName" : this.addApplicationForm1.get("studentName").value,
        "parentName" : this.addApplicationForm1.get("parentName").value,
        "parentEmail" : this.addApplicationForm1.get("parentEmail").value,
        "parentMobile" : this.addApplicationForm1.get("parentMobile").value,
        "gender" : {"id" : this.genderForm.get("gender").value},
        "studentRelationship" : this.addApplicationForm1.get("relationship").value,
        "syllabus" : {"id" : this.syllabusForm.get("syllabus").value},
        "gradeCategory" : {"id" : this.gradeCategoryForm.get("gradeCategory").value},
        "grade" : {"id" : this.gradeForm.get("grade").value},
        "subjectGroup" : {"id" : this.subjectGroupForm.get("subjectGroup").value},
        "batchType" : {"id" : this.batchTypeForm.get("batchType").value},
        "studentProfileCompletion" : {"id" : this.profileCompletionForm.get("profileCompletion").value},
        "parentUndertaking" : {"id" : this.parentUndertakingForm.get("parentUndertaking").value},
        "admissionDate" : this.addApplicationForm1.get("admissionDate").value,
        "studyCenter" : {"uuid" : this.studyCenterForm.get("studyCenter").value},
        "leadStudentType" : {"id" : this.leadStudentTypeForm.get("leadStudentType").value},
        "marketLeadType" : {"id" : this.marketLeadTypeForm.get("marketLeadType").value},
        "walkInMode" : {"id" : this.isWalkInMode ? this.walkinModeForm.get("walkinMode").value : ""},
        "subjectIds" : this.selectedSubjects
      };
    }
    return dataJSON;
  }

  async saveApplicationForm1()
  {
    try
    {
      if(this.applicationTypeForm.valid && this.academicSessionForm.valid && this.schoolForm.valid && this.schoolingProgramForm.valid && this.genderForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.batchTypeForm.valid && this.syllabusForm.valid && this.subjectGroupForm.valid && this.studyCenterForm.valid && this.profileCompletionForm.valid && this.parentUndertakingForm.valid && this.selectedSubjects != "" && this.leadStudentTypeForm.valid && this.marketLeadTypeForm.valid && this.walkinModeForm.valid && this.siblingTypeForm.valid && this.lastAcademicSessionForm.valid && this.studentForm.valid && !this.saveClicked)
      {
        this.isValidForm = true;
        let dataJSON = this.createApplicationFormJSON();
        if(dataJSON != "")
        {
          this.saveClicked = true;
          let response = await this.admissionService.saveB2CApplicationForm1(dataJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            ////Manage Filter Option To Local Storage
              localStorage.setItem("schoolUUID", this.schoolForm.get("school").value);
              localStorage.setItem("schoolingProgramId", this.schoolingProgramForm.get("schoolingProgram").value);
              localStorage.setItem("academicSessionId", this.academicSessionForm.get("academicSession").value);
              localStorage.setItem("studyCenterUUID", this.studyCenterForm.get("studyCenter").value);
              localStorage.setItem("applicationStatusId", "");
            //////////
            this.showNotification('success', "Application Form Details Saved");
            this.router.navigateByUrl("/b2cApplication/detail/B2C/" + response.uuid);
            this.saveClicked = false;
          }
          else
          {
            this.showNotification('error', "Application Form Details Not Saved");
            this.saveClicked = false;
          }          
        }
      }
      else
      {
        this.isValidForm = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.saveClicked = false;
    }
  }

  back()
  {
    this.location.back();
  }
}
