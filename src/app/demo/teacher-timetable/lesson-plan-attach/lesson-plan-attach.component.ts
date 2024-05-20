import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeachingScheduleDetail } from 'src/app/theme/shared/model/teachingScheduleDetail';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LessonPlanMaster } from 'src/app/theme/shared/model/lessonPlanMaster';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { FormBuilder } from '@angular/forms';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { LessonPlanService } from 'src/app/theme/shared/service/lesson-plan.service';
import { TeachingScheduleService } from 'src/app/theme/shared/service/teaching-schedule.service';
import { TeachingScheduleMaster } from 'src/app/theme/shared/model/teachingScheduleMaster';
import { User } from 'src/app/theme/shared/model/user';
import { DataTablesModule } from 'angular-datatables';
declare var $;

@Component({
  selector: 'app-lesson-plan-attach',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './lesson-plan-attach.component.html',
  styleUrls: ['./lesson-plan-attach.component.scss']
})
export class LessonPlanAttachComponent {
  @Input() public modalParams;
  teachingScheduleMaster : TeachingScheduleMaster;
  teachingScheduleDetail : TeachingScheduleDetail;
  lessonPlans : LessonPlanMaster[];
  attachDate : Date;
  saveClicked : boolean = false;
  searchLessionPlan : boolean = false;
  loginUser : User;
  selLessonPlanUUID : string = "";

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router,
    private lessonPlanService : LessonPlanService,
    private teachingScheduleService : TeachingScheduleService)
  {
    this.loginUser = this.commonSharedService.loginUser;
  }

  ngOnInit()
  {
    this.lessonPlans = [];
    this.attachDate = this.modalParams.attachDate;
    if(this.modalParams.teachingScheduleMaster)
    {
      this.teachingScheduleMaster = this.modalParams.teachingScheduleMaster;
    }
    if(this.modalParams.teachingScheduleDetail)
    {
      this.teachingScheduleDetail = this.modalParams.teachingScheduleDetail;
    }
    this.getLessonPlans();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  getSelectedLessonPlan(lessonPlanUUID : string)
  {
    if(this.selLessonPlanUUID != "")
    {
      if(this.selLessonPlanUUID.indexOf(lessonPlanUUID) == -1)
      {
        if(this.selLessonPlanUUID == "")
        {
          this.selLessonPlanUUID = lessonPlanUUID;
        }
        else
        {
          this.selLessonPlanUUID = this.selLessonPlanUUID + ',' + lessonPlanUUID;
        }
      }
      else
      {
        if(this.selLessonPlanUUID.split(",").length > 1)
        {
          this.selLessonPlanUUID = this.selLessonPlanUUID.replace(lessonPlanUUID, "");
          if(this.selLessonPlanUUID.charAt(0) == ',')
          {
            this.selLessonPlanUUID = this.selLessonPlanUUID.substring(1,this.selLessonPlanUUID.length);
          }
          if(this.selLessonPlanUUID.charAt(this.selLessonPlanUUID.length-1) == ',')
          {
            this.selLessonPlanUUID = this.selLessonPlanUUID.substring(0,this.selLessonPlanUUID.length-1);
          }
        }
        else
        {
          this.selLessonPlanUUID = this.selLessonPlanUUID.replace(lessonPlanUUID, "");
        }
      }
    }
    else
    {
      this.selLessonPlanUUID = lessonPlanUUID;
    }
  }

  async getLessonPlans()
  {
    try
    {
      let academicYearUUID : string = this.commonSharedService.currentAcademicYear.uuid;
      let schoolUUID : string = this.loginUser.schools[0].uuid;
      let gradeId : number = this.teachingScheduleDetail.grade.id;
      let sectionUUID : string = this.teachingScheduleDetail.section.uuid;
      let subjectUUID : string = this.teachingScheduleDetail.subject.uuid;
      let status : string = "Approved";
      let userUUID : string = this.loginUser.uuid;
      if(academicYearUUID != "" && schoolUUID != "" && gradeId > 0 && sectionUUID != "" && subjectUUID != "" 
      && status != "" && userUUID != "")
      {
        this.searchLessionPlan = true;
        let response = await this.lessonPlanService.getUnAllocatedLessonPlans(academicYearUUID, schoolUUID, gradeId, sectionUUID, subjectUUID, status, userUUID).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblLessonPlan').DataTable().clear().destroy();
          this.lessonPlans = response.data.lessonPlans;
          setTimeout(function(){
            $('#tblLessonPlan').DataTable();
          },1000);
          this.searchLessionPlan = false;
        }
      }
    }
    catch(e)
    {
      $('#tblLessonPlan').DataTable().clear().destroy();
      this.lessonPlans = [];
      setTimeout(function(){
        $('#tblLessonPlan').DataTable();
      },1000);
      this.searchLessionPlan = false;
      this.showNotification("error", "Lesson Plan Not Applied.");
    }
  }

  async attachLessonPlan()
  {
    if(this.selLessonPlanUUID != "")
    {
      try
      {
        this.saveClicked = true;
        let tempJSON = {
          "teachingScheduleDetail" : {"uuid" : this.teachingScheduleDetail.uuid},
          "lessonPlanMaster" : {"uuid" : this.selLessonPlanUUID}
        }
        let response = await this.teachingScheduleService.attachLessonPlan(tempJSON).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification("success", "Lesson Plan Applied");
          this.commonSharedService.teachingScheduleListObject.next(
            {
              result : "success"
            });
          this.saveClicked = false;
        }
      }
      catch(e : any)
      {
        this.showNotification("error", "Lesson Plan Not Applied");
        this.saveClicked = false;
      }
    }
    else
    {
      this.showNotification("warning", "Select Lesson Plan");
      this.selLessonPlanUUID = "";
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
