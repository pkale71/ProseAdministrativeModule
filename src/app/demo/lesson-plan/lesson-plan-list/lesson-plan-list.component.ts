import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { User } from 'src/app/theme/shared/model/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { SyllabusGradeSubjectChapter } from 'src/app/theme/shared/model/syllabus-grade-subject-chapter';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { SyllabusSubjectChapterTopic } from 'src/app/theme/shared/model/syllabus-subject-chapter-topic';
import { UserService } from 'src/app/theme/shared/service';
import { LessonPlanMaster } from 'src/app/theme/shared/model/lessonPlanMaster';
import { LessonPlanService } from 'src/app/theme/shared/service/lesson-plan.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { LessonPlanChangeStatusComponent } from '../lesson-plan-change-status/lesson-plan-change-status.component';
import { LessonPlanPrint } from '../lesson-plan-print/lesson-plan-print';
declare var $;

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lesson-plan-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './lesson-plan-list.component.html',
  styleUrls: ['./lesson-plan-list.component.scss']
})
export class LessonPlanListComponent {
  lessonPlans : LessonPlanMaster[];
  loginUser : User;
  academicYearForm : FormGroup;
  statusForm : FormGroup;
  gradeForm : FormGroup;
  subjectForm : FormGroup;
  chapterForm : FormGroup;
  topicForm : FormGroup;
  academicYears : AcademicYear[];
  grades : any[];
  subjects : SyllabusGradeSubject[];
  chapters : SyllabusGradeSubjectChapter[];
  topics : SyllabusSubjectChapterTopic[];
  searchGrade : boolean = false;
  searchSubject : boolean = false;
  searchChapter : boolean = false;
  searchTopic : boolean = false;
  searchClicked : boolean = false;
  isCurrent : number = 0;
  userTypeCode : string;
  downloadClicked  : boolean[] = [];

  constructor(private notifier: NotifierService, 
  private activatedRoute: ActivatedRoute,
  private modalService: NgbModal,
  private formbuilder: FormBuilder,
  public commonSharedService : CommonSharedService,
  private lessonPlanService : LessonPlanService,
  private commonService : CommonService,
  private userService : UserService,
  private router : Router, private schoolService : SchoolService)
  {
    this.lessonPlans = [];
    this.loginUser = this.commonSharedService.loginUser;
    this.userTypeCode = this.loginUser.userType.code;
    this.academicYears = this.activatedRoute.snapshot.data['academicYears'].data.academicYears;
    this.academicYears.unshift({uuid : "", year : "Select Academic Year"});
  }

  ngOnInit() 
  {
    this.grades = [];
    this.subjects = [];
    this.chapters = [];
    this.academicYearForm = this.formbuilder.group({
      'academicYear': ['', [Validators.required]]
    });
    
    this.statusForm = this.formbuilder.group({
      'status': ['', [Validators.required]]
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
//Get Local Storage Value
    if(localStorage.getItem("LessonPlanFilter"))
    {
      let storageData = JSON.parse(localStorage.getItem("LessonPlanFilter"));
      this.academicYearForm.get("academicYear").setValue(storageData.academicYear);
      this.statusForm.get("status").setValue(storageData.status);
      this.getAssignedGrades();
      this.gradeForm.get("grade").setValue(storageData.grade);
      if(storageData.grade)
      {
        this.getAssignedGradeSubjects();
        this.subjectForm.get("subject").setValue(storageData.subject);
      }
      if(storageData.subject)
      {
        this.getChapters();
        this.chapterForm.get("chapter").setValue(storageData.chapter);
      }
      this.getTopics();
      this.topicForm.get("topic").setValue(storageData.topic);
      this.getLessonPlans();
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  public lessonPlanAddResult:any = this.commonSharedService.lessonPlanListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getLessonPlans();
    }
  })

  async getAssignedGrades() 
  {
    let tempGrade : any = {"id" : "", "name" : "Select Grade"};
    this.grades = [];
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
    if(schoolUUID != "" && academicYearUUID != "" && this.loginUser != null)
    {
      this.isCurrent = this.academicYears.filter(academicYear => academicYear.uuid == academicYearUUID)[0].isCurrent;
      try
      {
        this.searchGrade = true;
        this.topicForm.get("topic").setValue("");
        this.gradeForm.get("grade").setValue("");
        if(this.userTypeCode !='SCHVP' && this.userTypeCode !='SCHPL')
        {
          let response = await this.userService.getTeachGrades(this.loginUser.uuid, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.grades = response.data.grades;
            this.grades.unshift(tempGrade);
            this.searchGrade = false;
          }
        }
        else
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
        this.grades.unshift({
          "id": 0, "name": "Select Grade",
          gradeSubjects: [],
          userAssignedSections: [],
          userAssignedSubjects: []
        });
      }
    }
    else
    {
      this.grades.unshift(tempGrade);
    }
  }

  async getAssignedGradeSubjects() 
  {
    this.subjects = [];
    let schoolUUID : string = this.loginUser.schools[0].uuid;
    let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
    let gradeId : number = this.gradeForm.get("grade").value;
    let syllabusId : number = this.loginUser.schools[0].syllabus?.id;
    
    if(schoolUUID != "" && academicYearUUID != "" && gradeId > 0 && syllabusId > 0 && this.loginUser != null)
    {
      try
      {
        this.searchSubject = true;
        if(this.userTypeCode !='SCHVP' && this.userTypeCode !='SCHPL')
        {
          let response = await this.userService.getTeachSubjects(this.loginUser.uuid, gradeId, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.subjects = response.data.gradeSubjects;
            this.subjects.unshift({
              "uuid": "", "name": "Select Subject"
            });
            this.searchSubject = false;
          }
        }
        else
        {
          let response = await this.commonService.getGradeSubjects(this.loginUser.schools[0].syllabus.id, gradeId).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.subjects = response.data.gradeSubjects;
            this.subjects.unshift({
              "uuid": "", "name": "Select Subject"
            });
            this.searchSubject = false;
          }
        }
      }
      catch(e)
      {
        this.subjects = [];
        this.subjects.unshift({
          "uuid": "", "name": "Select Subject"
        });
        this.searchSubject = false;
      }
    }
    else
    {
      //this.showNotification("info", "Select Academc Year, School & Grade");
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
          this.chapters.unshift({
            "uuid": "", "name": "Select Chapter",
          });
          this.searchChapter = false;
        }
      }
      catch(e)
      {
        this.chapters = [];
        this.chapters.unshift({
          "uuid": "", "name": "Select Chapter",
        });
        this.searchChapter = false;
      }
    }
    else
    {
      this.chapters.unshift({
        "uuid": "", "name": "Select Chapter",
      });
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
          this.topics.unshift({
            "uuid": "", "name": "All",
            userChapterCompleteStatuses: []
          });
          this.searchTopic = false;
        }
      }
      catch(e)
      {
        this.topics = [];
        this.topics.unshift({
          "uuid": "", "name": "All",
          userChapterCompleteStatuses: []
        });
        this.searchTopic = false;
      }
    }
  }

  async getLessonPlans() 
  {
    let academicYear : string = this.academicYearForm.get("academicYear").value;
    let school : string = this.loginUser.schools[0].uuid;
    let status : string = this.statusForm.get("status").value;
    let grade : number = this.gradeForm.get("grade").value;
    let subject : string = this.subjectForm.get("subject").value;
    let chapter : string = this.chapterForm.get("chapter").value;
    let topic : string = this.topicForm.get("topic").value;
    let userUUID : string = (this.userTypeCode == 'SCHPL' || this.userTypeCode == 'SCHVP') ? '' : this.loginUser.uuid;
    try
    {
      if(academicYear != "" && school != "" && status != "" && grade > 0 && subject != "")
      {
        this.searchClicked = true;
//Set Local Storage Variable
        let storageJSON = {
          "academicYear" : academicYear,
          "school" : school,
          "status" : status,
          "grade" : grade,
          "subject" : subject,
          "chapter" : chapter,
          "topic" : topic
        }
        localStorage.setItem("LessonPlanFilter", JSON.stringify(storageJSON));
/////
        let response = await this.lessonPlanService.getLessonPlans(academicYear, school, grade, subject, status, userUUID, chapter, topic).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblLessonPlan').DataTable().clear().destroy();
          this.lessonPlans = response.data.lessonPlans;
          setTimeout(function(){
            $('#tblLessonPlan').DataTable();
          },1000);
          this.searchClicked = false;
          this.modalService.dismissAll();
        }
        else
        {
          this.lessonPlans = [];
          this.searchClicked = false;
          this.modalService.dismissAll();
        }
      }
      else
      {
        this.showNotification("warning", "Select Academc Year, School, Grade, Subject & Status");
      }
    }
    catch(e)
    {
      this.lessonPlans = [];
      this.searchClicked = false;
      this.modalService.dismissAll();
    }
  }

  addLessonPlan()
  {
    this.router.navigateByUrl("/lessonPlan/add");
  }

  editLessonPlan(uuid : string)
  {
    this.router.navigateByUrl("/lessonPlan/edit/" + uuid);
  }

  detailLessonPlan(uuid : string)
  {
    this.router.navigateByUrl("/lessonPlan/detail/" + uuid);
  }

  deleteLessonPlan(uuid)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete lesson plan?',
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
          let response = await this.lessonPlanService.deleteLessonPlan(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Lesson Plan Deleted.");
            this.commonSharedService.lessonPlanListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", "Lesson Plan Not Deleted.");
        }
      }
    });
  }

  changeStatus(lessonPlan : LessonPlanMaster)
  {
    let params = {
      "uuid" : lessonPlan.uuid
    }
    const dialogRef = this.modalService.open(LessonPlanChangeStatusComponent, 
    { 
      size: 'sm', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  downloadLessonPlan(lessonPlanMaster : LessonPlanMaster, i : number)
  {
    this.downloadClicked[i] = true;
    this.showNotification("info", "Please Wait, Download Initiated...");
    const lessonPlanPrint = new LessonPlanPrint(this.lessonPlanService, this.notifier);
    lessonPlanPrint.download(lessonPlanMaster.uuid);
    this.downloadClicked[i] = false;
  }
}
