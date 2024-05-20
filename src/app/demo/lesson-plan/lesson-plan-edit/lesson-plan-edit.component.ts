import { Component, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { User } from 'src/app/theme/shared/model/user';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { Grade } from 'src/app/theme/shared/model/grade';
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
  selector: 'app-lesson-plan-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, SafeHtmlPipe, CurriculumResourceFilterPipe, TagInputModule],
  templateUrl: './lesson-plan-edit.component.html',
  styleUrls: ['./lesson-plan-edit.component.scss']
})
export class LessonPlanEditComponent {
  lessonPlan : LessonPlanMaster;
  loginUser : User;
  lessonPlanMasterForm : FormGroup;
  lessonPlanDescriptionForm : FormGroup;
  lessonPlanDescriptions : any[];
  //lessonPlanResourceForm : FormGroup;
  curriculumUploads : CurriculumUpload[];
  gradeForm : FormGroup;
  subjectForm : FormGroup;
  chapterForm : FormGroup;
  topicForm : FormGroup;
  grades : Grade[];
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
  //isValidForm3 : boolean = true;
  editIndex : number = -1;
  resourceSearch : string = "";
  saveClicked1 : boolean = false;
  saveClicked2 : boolean = false;
  //saveClicked3 : boolean = false;
  searchResource : boolean = false;

  constructor(private location : Location, private commonSharedService : CommonSharedService,
    private notifier: NotifierService, private activatedRoute: ActivatedRoute, 
    private userService : UserService, private commonService : CommonService, 
    private formbuilder: FormBuilder, private curriculumService : CurriculumService,
    private lessonPlanService : LessonPlanService, private router : Router,
    private gradeScheduleSettingService : GradeScheduleSettingService)
  {
    this.loginUser = this.commonSharedService.loginUser;
    this.lessonPlan = this.activatedRoute.snapshot.data['lessonPlan'].data.lessonPlan;
  }

  ngOnInit()
  {
    this.lessonPlanDescriptions = [];
    this.curriculumUploads = [];
    this.lessonPlanMasterForm = this.formbuilder.group({
      "uuid" : ['', Validators.required],
      "oldLessonPlan" : this.formbuilder.group({"uuid" : ['']}),
      "academicYear" : this.formbuilder.group({"uuid" : [this.lessonPlan.academicYear.uuid, Validators.required]}),
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

    this.gradeForm.get("grade").disable();
    this.subjectForm.get("subject").disable();
    this.chapterForm.get("chapter").disable();
    this.topicForm.get("topic").disable();
///set LessonPlan Data
    this.lessonPlanMasterForm.patchValue(this.lessonPlan);
    this.lessonPlanMasterForm.get("learningOutcome").setValue(this.lessonPlan.learningOutcome.split("<br />").join("\n"));
    this.getAssignedGrades();
    this.gradeForm.get("grade").setValue(this.lessonPlan.grade.id);
    this.getAssignedGradeSubjects();
    this.subjectForm.get("subject").setValue(this.lessonPlan.subject.uuid);
    this.getChapters();
    this.chapterForm.get("chapter").setValue(this.lessonPlan.chapter.uuid);
    this.getTopics();
    this.topicForm.get("topic").setValue(this.lessonPlan.topic.uuid);
    this.getAllCurriculumUploads();
    this.lessonPlanDescriptions = this.lessonPlan.lessonPlanDescriptions;
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getDuration(gradeId : number)
  {
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let academicYearUUID : string = this.lessonPlan.academicYear.uuid;
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
    this.grades = [];
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let academicYearUUID : string = this.lessonPlan.academicYear.uuid;
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
          this.searchGrade = false;
        }
      }
      catch(e)
      {
        this.searchGrade = false;
        this.grades = [];
      }
    }
  }

  async getAssignedGradeSubjects() 
  {
    this.subjects = [];
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let academicYearUUID : string = this.lessonPlan.academicYear.uuid;
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
          this.searchSubject = false;
        }
      }
      catch(e)
      {
        this.subjects = [];
        this.searchSubject = false;
      }
      this.getDuration(gradeId);
    }
  }

  async getChapters() 
  {
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
          this.searchChapter = false;
        }
      }
      catch(e)
      {
        this.chapters = [];
        this.searchChapter = false;
      }
    }
  }
  
  async getTopics() 
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
          this.searchTopic = false;
        }
      }
      catch(e)
      {
        this.topics = [];
        this.searchTopic = false;
      }
    }
  }

  async addLessionPlanDescription()
  {
    if(this.lessonPlanDescriptionForm.valid)
    {
      let sequence : any = this.lessonPlanDescriptionForm.get("sequence").value;
      let teachingAid : any = this.lessonPlanDescriptionForm.get("teachingAid").value;
      sequence = sequence.replace(/\n/g, '<br />');
      teachingAid = teachingAid.replace(/\n/g, '<br />');
      this.isValidForm2 = true;
      try
      {
        this.saveClicked2 = true;
        if(this.editIndex == -1)
        {
          let resources : any[] = this.lessonPlanDescriptionForm.get("curriculumUploads").value;
          let curriculumUploads : any[] = [];
          for(let j=0;j<resources?.length;j++)
          {
            curriculumUploads.push({"uuid" : resources[j].value, "fileName" : resources[j].display});
          }
          let tempJSON = {
            "lessonPlanMaster" : {"uuid" : this.lessonPlan.uuid},
            "sequence" : sequence,
            "teachingAid" : teachingAid,
            "curriculumUploads" : curriculumUploads
          }
          let response = await this.lessonPlanService.addLessonPlanDescription(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Lesson Plan Description Saved");
            let tempJSON1 = {
              "uuid" : response.data.uuid,
              "sequence" : sequence,
              "teachingAid" : teachingAid,
              "curriculumUploads" : curriculumUploads
            }
            this.lessonPlanDescriptions.push(tempJSON1);
            this.saveClicked2 = false;
            this.lessonPlanDescriptionForm.reset();
          }
        }
        else
        {
          let resources : any[] = this.lessonPlanDescriptionForm.get("curriculumUploads").value;
          let curriculumUploads : any[] = [];
          for(let j=0;j<resources?.length;j++)
          {
            curriculumUploads.push({"uuid" : resources[j].value, "fileName" : resources[j].display});
          }
          let tempJSON = {
            "uuid" : this.lessonPlanDescriptionForm.get("uuid").value,
            "sequence" : sequence,
            "teachingAid" : teachingAid,
            "curriculumUploads" : curriculumUploads
          }
          let response = await this.lessonPlanService.updateLessonPlanDescription(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Lesson Plan Description Saved");
            this.lessonPlanDescriptions[this.editIndex] = tempJSON;
            this.editIndex = -1;
            this.saveClicked2 = false;
            this.lessonPlanDescriptionForm.reset();
          }
        }
      }
      catch(e : any)
      {
        this.showNotification("error", e);
        this.saveClicked2 = false;
      }
      
      
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

  cancelAdd(label : string)
  {
    if(label == 'Master')
    {
      this.lessonPlanMasterForm.patchValue(this.lessonPlan);
      this.lessonPlanMasterForm.get("learningOutcome").setValue(this.lessonPlan.learningOutcome.split("<br />").join("\n"));
    }
    else if(label == 'Description')
    {
      this.editIndex = -1;
      this.lessonPlanDescriptionForm.reset();
    }
  }

  deleteLessonPlanDescription(uuid : string, index : number)
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
        this.showNotification("info", "Please wait...");
        let tempJSON = { 
          "uuid" : uuid
        };
        try
        {
          let response = await this.lessonPlanService.deleteLessonPlanDescription(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Lesson Plan Description Deleted.");
            this.lessonPlanDescriptions.splice(index, 1);
          }
        }
        catch(e)
        {
          this.showNotification("error", "Lesson Plan Description Not Deleted.");
        }
      }
    });
  }

  async saveLessonPlanMaster()
  {
    this.gradeForm.get("grade").enable();
    this.subjectForm.get("subject").enable();
    this.chapterForm.get("chapter").enable();
    this.topicForm.get("topic").enable();
    if(this.lessonPlanMasterForm.valid && this.gradeForm.valid && this.subjectForm.valid && this.chapterForm.valid && this.topicForm.valid)
    {
      this.isValidForm1 = true;
      this.gradeForm.get("grade").disable();
      this.subjectForm.get("subject").disable();
      this.chapterForm.get("chapter").disable();
      this.topicForm.get("topic").disable();
      
      this.lessonPlanMasterForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
      this.lessonPlanMasterForm.controls["subject"].get("uuid").setValue(this.subjectForm.get("subject").value);
      this.lessonPlanMasterForm.controls["chapter"].get("uuid").setValue(this.chapterForm.get("chapter").value);
      this.lessonPlanMasterForm.controls["topic"].get("uuid").setValue(this.topicForm.get("topic").value);

      let tempJSON : LessonPlanMaster = this.lessonPlanMasterForm.value;
      let learningOutcome : any = tempJSON.learningOutcome;
      tempJSON.learningOutcome = learningOutcome.replace(/\n/g, '<br />');
      try
      {
        this.saveClicked1 = true;
        let response = await this.lessonPlanService.updateLessonPlan(tempJSON).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification("success", "Lesson Plan Saved");
          let learningOutcome : any = this.lessonPlanMasterForm.get("learningOutcome").value;
          this.lessonPlanMasterForm.get("learningOutcome").setValue(learningOutcome.split("<br />").join("\n"));
          this.saveClicked1 = false;
        }
      }
      catch(e : any)
      {
        this.showNotification("error", "Lesson Plan Not Saved");
        this.saveClicked1 = false;
      }
    }
    else
    {
      this.isValidForm1 = false;
    }
  }
  
  back()
  {
    this.location.back();
  }
}
