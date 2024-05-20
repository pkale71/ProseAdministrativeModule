import { Component, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { User } from 'src/app/theme/shared/model/user';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { SyllabusSubjectChapterTopic } from 'src/app/theme/shared/model/syllabus-subject-chapter-topic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/theme/shared/service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { GradeScheduleSettingService } from 'src/app/theme/shared/service/grade-schedule-setting.service';
import { GradeScheduleSetting } from 'src/app/theme/shared/model/gradeScheduleSetting';
import { LessonPlanDescription } from 'src/app/theme/shared/model/lessonPlanDescription';
import { SafeHtmlPipe } from 'src/app/theme/shared/custom-pipe/safe-html-pipe.pipe';
import { CurriculumUpload } from 'src/app/theme/shared/model/curriculum-upload';
import { CurriculumService } from 'src/app/theme/shared/service/curriculum.service';
import { CurriculumResourceFilterPipe } from 'src/app/theme/shared/custom-pipe/curriculum-resource-filter.pipe';
import { LessonPlanMaster } from 'src/app/theme/shared/model/lessonPlanMaster';
import { LessonPlanService } from 'src/app/theme/shared/service/lesson-plan.service';

// third party
import { TagInputModule } from 'ngx-chips';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lesson-plan-add',
  standalone: true,
  imports: [CommonModule, SharedModule, SafeHtmlPipe, CurriculumResourceFilterPipe, TagInputModule],
  templateUrl: './lesson-plan-add.component.html',
  styleUrls: ['./lesson-plan-add.component.scss']
})
export class LessonPlanAddComponent {
  oldLessonPlan : LessonPlanMaster = null;
  academicYear : AcademicYear;
  loginUser : User;
  lessonPlanMasterForm : FormGroup;
  lessonPlanDescriptionForm : FormGroup;
  lessonPlanDescriptions : any[];
  curriculumUploads : CurriculumUpload[];
  gradeForm : FormGroup;
  subjectForm : FormGroup;
  chapterForm : FormGroup;
  topicForm : FormGroup;
  grades : any[];
  subjects : SyllabusGradeSubject[];
  chapters : SyllabusGradeSubjectChapter[];
  topics : SyllabusSubjectChapterTopic[];
  searchGrade : boolean = false;
  searchSubject : boolean = false;
  searchChapter : boolean = false;
  durationClicked : boolean = false;
  searchTopic : boolean = false;
  isValidForm1 : boolean = true;
  isValidForm2 : boolean = true;
  // isValidForm3 : boolean = true;
  editIndex : number = -1;
  resourceSearch : string = "";
  saveClicked : boolean = false;
  searchResource : boolean = false;

  constructor(private location : Location, private commonSharedService : CommonSharedService,
    private notifier: NotifierService, private activatedRoute: ActivatedRoute, 
    private userService : UserService, private commonService : CommonService, 
    private formbuilder: FormBuilder, private curriculumService : CurriculumService,
    private lessonPlanService : LessonPlanService, private router : Router,
    private gradeScheduleSettingService : GradeScheduleSettingService)
  {
    this.loginUser = this.commonSharedService.loginUser;
    this.academicYear = this.commonSharedService.currentAcademicYear;
    if(this.activatedRoute.snapshot.data['oldLessonPlan'])
    {
      this.oldLessonPlan = this.activatedRoute.snapshot.data['oldLessonPlan'].data.lessonPlan;
    }
  }

  ngOnInit()
  {
    this.lessonPlanDescriptions = [];
    this.curriculumUploads = [];


    this.lessonPlanMasterForm = this.formbuilder.group({
      "uuid" : [''],
      "oldLessonPlan" : this.formbuilder.group({"uuid" : ['']}),
      "academicYear" : this.formbuilder.group({"uuid" : [this.academicYear.uuid, Validators.required]}),
      "school" : this.formbuilder.group({"uuid" : [this.loginUser.schools[0].uuid, Validators.required]}),
      "grade" : this.formbuilder.group({"id" : ['']}),
      "subject" : this.formbuilder.group({"uuid" : ['']}),
      "chapter" : this.formbuilder.group({"uuid" : ['']}),
      "topic" : this.formbuilder.group({"uuid" : ['']}),
      "methodology" : ['', Validators.required],
      "duration" : ['', Validators.required],
      "numberOfPeriods" : ['', [Validators.required, Validators.pattern('^[0-9]{1,3}')]],
      "prerequisite" : ['', Validators.required],
      "skills" : ['', Validators.required],
      "learningOutcome" : ['', Validators.required],
    });

    this.lessonPlanDescriptionForm = this.formbuilder.group({
      "uuid" : [''],
      "sequence" : ['', Validators.required],
      "teachingAid" : ['', Validators.required],
      "curriculumUploads" : ['', Validators.required]
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
      'topic': ['', Validators.required]
    });
    
    if(!this.oldLessonPlan || !this.oldLessonPlan.uuid)
    {
      this.getAssignedGrades();
    }
///get old lesson Plan
    else
    {
      this.getAssignedGrades();
      this.lessonPlanMasterForm.patchValue(this.oldLessonPlan);
//set old lesson plan and current academic year
      this.lessonPlanMasterForm.controls['oldLessonPlan'].get("uuid").setValue(this.oldLessonPlan.uuid);
      this.lessonPlanMasterForm.controls['academicYear'].get("uuid").setValue(this.commonSharedService.currentAcademicYear.uuid);
////
      this.lessonPlanMasterForm.get("learningOutcome").setValue(this.oldLessonPlan.learningOutcome.split("<br />").join("\n"));
      this.gradeForm.get("grade").setValue(this.oldLessonPlan.grade.id);
      this.getAssignedGradeSubjects();
      this.subjectForm.get("subject").setValue(this.oldLessonPlan.subject.uuid);
      this.getChapters();
      this.chapterForm.get("chapter").setValue(this.oldLessonPlan.chapter.uuid);
      this.getTopics();
      this.topicForm.get("topic").setValue(this.oldLessonPlan.topic.uuid);
      this.getAllCurriculumUploads();
      this.lessonPlanDescriptions = this.oldLessonPlan.lessonPlanDescriptions;
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getDuration(gradeId : number)
  {
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let academicYearUUID : string = this.academicYear.uuid;
    this.lessonPlanMasterForm.get("duration").setValue("");
    if(schoolUUID != "" && academicYearUUID != "" && gradeId > 0)
    { 
      this.durationClicked = true;
      try
      {
        let response = await this.gradeScheduleSettingService.getGradeScheduleSettings(academicYearUUID, schoolUUID, gradeId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          let gradeScheduleSetting : GradeScheduleSetting = response.data.gradeScheduleSettings[0];
          this.lessonPlanMasterForm.get("duration").setValue(gradeScheduleSetting.duration);
          this.durationClicked = false;
        }
      }
      catch(e: any)
      {
        this.showNotification("error", e);
        this.durationClicked = false;
      }
    }
  }

  denyInput(event : any)
  {
    event.preventDefault();
  }

  selectedResource(curriculumUpload : CurriculumUpload)
  {
    let resources : any[] = [];
    if(this.lessonPlanDescriptionForm.get("curriculumUploads").value?.length > 0)
    {
      resources = this.lessonPlanDescriptionForm.get("curriculumUploads").value;
    }
    if(curriculumUpload != null)
    {
      let duplicateResources : any[] = resources.find(resource=>resource.value === curriculumUpload.uuid);
      if(duplicateResources?.length == 0)
      {
        resources.push({"display": curriculumUpload.fileName, "value" : curriculumUpload.uuid});
      }
      else if(duplicateResources == null)
      {
        resources.push({"display": curriculumUpload.fileName, "value" : curriculumUpload.uuid});
      }
      this.lessonPlanDescriptionForm.get("curriculumUploads").setValue(resources);
    }
  }

  async getAllCurriculumUploads() 
  {
    this.curriculumUploads = [];
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let gradeId : number = this.gradeForm.get("grade").value;
    let status : string = "Published";
    let subjectUUID : string = this.subjectForm.get("subject").value;
    let chapterUUID : string = this.chapterForm.get("chapter").value;
    let topicUUID : string = this.topicForm.get("topic").value;

    if(schoolUUID != "" && status != "" && gradeId > 0 && subjectUUID != "" && chapterUUID != "" && topicUUID != "")
    {
      try
      {
        this.searchResource = true;
        let response = await this.curriculumService.getAllCurriculumUploads(schoolUUID, gradeId, subjectUUID, chapterUUID, topicUUID, status).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.curriculumUploads = response.data.curriculumUploads;
          this.searchResource = false;
        }
      }
      catch(e)
      {
        this.curriculumUploads = [];
        this.searchResource = false;
      }
    }
  }
  
  async getAssignedGrades() 
  {
    let tempGrade : any = {"id" : "", "name" : "Select Grade"};
    this.grades = [];
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let academicYearUUID : string = this.academicYear.uuid;
    if(schoolUUID != "" && academicYearUUID != "" && this.loginUser != null)
    {
      try
      {
        this.searchGrade = true;
        this.topicForm.get("topic").setValue("");
        this.gradeForm.get("grade").setValue("");
        let response = await this.userService.getTeachGrades(this.loginUser.uuid, schoolUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.grades = response.data.grades;
          this.grades.unshift(tempGrade);
          this.searchGrade = false;
        }
      }
      catch(e)
      {
        this.searchGrade = false;
        this.grades = [];
        this.grades.unshift(tempGrade);
      }
    }
  }

  async getAssignedGradeSubjects() 
  {
    let tempSubject : any = {"uuid" : "", "name" : "Select Subject"};
    this.subjects = [];
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let academicYearUUID : string = this.academicYear.uuid;
    let gradeId : number = this.gradeForm.get("grade").value;
    let syllabusId : number = this.loginUser.schools[0].syllabus?.id;
    
    if(schoolUUID != "" && academicYearUUID != "" && gradeId > 0 && syllabusId > 0 && this.loginUser != null)
    {
      try
      {
        this.searchSubject = true;
        let response = await this.userService.getTeachSubjects(this.loginUser.uuid, gradeId, schoolUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.subjects = response.data.gradeSubjects;
          this.subjects.unshift(tempSubject);
          this.searchSubject = false;
        }
      }
      catch(e)
      {
        this.subjects = [];
        this.subjects.unshift(tempSubject);
        this.searchSubject = false;
      }
      this.getDuration(gradeId);
    }
  }

  async getChapters() 
  {
    let tempChapter : any = {"uuid" : "", "name" : "Select Chapter"};
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
  }
  
  async getTopics() 
  {
    let tempTopic : any = {"uuid" : "", "name" : "Select Topic"};
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
  }

  addLessionPlanDescription()
  {
    if(this.lessonPlanDescriptionForm.valid)
    {
      let sequence : any = this.lessonPlanDescriptionForm.get("sequence").value;
      let teachingAid : any = this.lessonPlanDescriptionForm.get("teachingAid").value;
      this.lessonPlanDescriptionForm.get("sequence").setValue(sequence.replace(/\n/g, '<br />'));
      this.lessonPlanDescriptionForm.get("teachingAid").setValue(teachingAid.replace(/\n/g, '<br />'));
      this.isValidForm2 = true;
      let resources : any[] = this.lessonPlanDescriptionForm.get("curriculumUploads").value;
      let curriculumUploads : any[] = [];
      for(let j=0;j<resources?.length;j++)
      {
        curriculumUploads.push({"uuid" : resources[j].value, "fileName" : resources[j].display});
      }
      let tempJSON = {
        "uuid" : "",
        "sequence" : this.lessonPlanDescriptionForm.get("sequence").value,
        "teachingAid" : this.lessonPlanDescriptionForm.get("teachingAid").value,
        "curriculumUploads" : curriculumUploads
      }
      if(this.editIndex == -1)
      {
        this.lessonPlanDescriptions.push(tempJSON);
      }
      else
      {
        this.lessonPlanDescriptions[this.editIndex] = tempJSON;
        this.editIndex = -1;
      }
      this.lessonPlanDescriptionForm.reset();
    }
    else
    {
      this.isValidForm2 = false;
    }
  }

  editLessonPlanDescription(lessonPlanDescription : any, i)
  {
    this.editIndex = i;
    this.lessonPlanDescriptionForm.patchValue(lessonPlanDescription);
    let sequence : any = this.lessonPlanDescriptionForm.get("sequence").value;
    let teachingAid : any = this.lessonPlanDescriptionForm.get("teachingAid").value;
    this.lessonPlanDescriptionForm.get("sequence").setValue(sequence.split("<br />").join("\n"));
    this.lessonPlanDescriptionForm.get("teachingAid").setValue(teachingAid.split("<br />").join("\n"));
    let resources : any[] = lessonPlanDescription.curriculumUploads;
    let curriculumUploads : any[] = [];
    for(let j=0;j<resources?.length;j++)
    {
      curriculumUploads.push({"value" : resources[j].uuid, "display" : resources[j].fileName});
    }
    this.lessonPlanDescriptionForm.get("curriculumUploads").setValue(curriculumUploads);
  }

  cancelEdit(label : string)
  {
    if(label == 'Description')
    {
      this.editIndex = -1;
      this.lessonPlanDescriptionForm.reset();
    }
  }

  deleteLessonPlanDescription(index : number)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete description?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
        
      } 
      else 
      {
        this.lessonPlanDescriptions.splice(index, 1);
      }
    });
  }

  prevTab(nav1 : any, tabId : number)
  {
    nav1.select(tabId);
  }
  
  nextTab(nav1 : any, tabId : number)
  {
    if(tabId == 2)
    {
      if(this.gradeForm.valid && this.subjectForm.valid && this.chapterForm.valid && this.topicForm.valid
        && this.lessonPlanMasterForm.valid)
      {
        this.isValidForm1 = true;
  //get curriculum Uploads
        this.getAllCurriculumUploads();
        nav1.select(tabId);
      }
      else
      {
        this.isValidForm1 = false;
      }
    }
  }

  async saveLessionPlan()
  {
    if(this.lessonPlanMasterForm.valid && this.gradeForm.valid && this.subjectForm.valid && this.chapterForm.valid && this.topicForm.valid && this.lessonPlanDescriptions.length > 0)
    {
      let learningOutcome : any = this.lessonPlanMasterForm.get("learningOutcome").value;
      this.lessonPlanMasterForm.get("learningOutcome").setValue(learningOutcome.replace(/\n/g, '<br />'));
      this.lessonPlanMasterForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
      this.lessonPlanMasterForm.controls["subject"].get("uuid").setValue(this.subjectForm.get("subject").value);
      this.lessonPlanMasterForm.controls["chapter"].get("uuid").setValue(this.chapterForm.get("chapter").value);
      this.lessonPlanMasterForm.controls["topic"].get("uuid").setValue(this.topicForm.get("topic").value);

      let tempJSON : LessonPlanMaster = this.lessonPlanMasterForm.value;
      tempJSON.lessonPlanDescriptions = this.lessonPlanDescriptions;
      try
      {
        this.saveClicked = true;
        let response = await this.lessonPlanService.createLessonPlan(tempJSON).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification("success", response.warningMessage ? response.warningMessage : "Lesson Plan Saved");
          this.router.navigateByUrl("/lessonPlan/detail/" + response.data.uuid);
          this.saveClicked = false;
        }
      }
      catch(e : any)
      {
        this.showNotification("error", "Lesson Plan Not Saved");
        this.saveClicked = false;
      }
    }
  }
  
  back()
  {
    this.location.back();
  }
}
