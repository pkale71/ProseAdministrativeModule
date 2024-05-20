import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeachingScheduleDetail } from 'src/app/theme/shared/model/teachingScheduleDetail';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { LessonPlanMappingService } from 'src/app/theme/shared/service/lesson-plan-mapping.service';
import { TeachingScheduleMaster } from 'src/app/theme/shared/model/teachingScheduleMaster';
import { User } from 'src/app/theme/shared/model/user';
import { DataTablesModule } from 'angular-datatables';
import { LessonPlanMapping } from 'src/app/theme/shared/model/lessonPlanMapping';
import Swal from 'sweetalert2';
import { LessonPlanAttachComponent } from '../lesson-plan-attach/lesson-plan-attach.component';
declare var $;

@Component({
  selector: 'app-lesson-plan-show',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './lesson-plan-show.component.html',
  styleUrls: ['./lesson-plan-show.component.scss']
})
export class LessonPlanShowComponent {
  @Input() public modalParams;
  lessonPlanMappingForm : FormGroup[];
  teachingScheduleMaster : TeachingScheduleMaster;
  teachingScheduleDetail : TeachingScheduleDetail;
  attachDate : Date;
  todayDate : Date;
  saveClicked : boolean[] = [];
  deleteClicked : boolean[] = [];
  searchLessionPlanMapping : boolean = false;
  loginUser : User;
  selLessonPlanUUID : string = "";
  lessonPlanMappings : LessonPlanMapping[];
  minDate : any;
  maxDate : any;
  isSameDate : boolean = false;
  isFutureDate : boolean = false;

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router,
    private lessonPlanMappingService : LessonPlanMappingService,
    private modalService: NgbModal)
  {
    this.loginUser = this.commonSharedService.loginUser;
    this.todayDate = new Date();
    this.minDate = {day : this.todayDate.getDate(), month: (this.todayDate.getMonth() + 1), year: this.todayDate.getFullYear()};
    this.maxDate = {day : this.todayDate.getDate(), month: (this.todayDate.getMonth() + 1), year: this.todayDate.getFullYear()};
  }

  ngOnInit()
  {
    this.lessonPlanMappingForm = [];
    this.lessonPlanMappings = [];
    this.attachDate = this.modalParams.attachDate;
    if(this.attachDate.getDate() == this.todayDate.getDate() && this.attachDate.getMonth() == this.todayDate.getMonth() && this.attachDate.getFullYear() == this.todayDate.getFullYear())
    {
      this.isSameDate = true;
      this.isFutureDate = true;
    }
    if(this.attachDate >= this.todayDate)
    {
      this.isFutureDate = true;
    }

    if(this.modalParams.teachingScheduleMaster)
    {
      this.teachingScheduleMaster = this.modalParams.teachingScheduleMaster;
    }
    if(this.modalParams.teachingScheduleDetail)
    {
      this.teachingScheduleDetail = this.modalParams.teachingScheduleDetail;
    }
    this.getLessonPlanMappings();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  setMinDate(i : number, data : any)
  {
    this.lessonPlanMappingForm[i].get("minDate").setValue(JSON.parse(JSON.stringify(data)));
  }

  async getLessonPlanMappings()
  {
    try
    {
      let academicYearUUID : string = this.commonSharedService.currentAcademicYear.uuid;
      let schoolUUID : string = this.loginUser.schools[0].uuid;
      let gradeId : number = this.teachingScheduleDetail.grade.id;
      let sectionUUID : string = this.teachingScheduleDetail.section.uuid;
      let subjectUUID : string = this.teachingScheduleDetail.subject.uuid;
      let userUUID : string = this.loginUser.uuid;
      let applyDate : string = this.attachDate.getFullYear() + "-" + ((this.attachDate.getMonth() + 1) < 10 ? ("0" + (this.attachDate.getMonth() + 1)) : (this.attachDate.getMonth() + 1)) + "-" + (this.attachDate.getDate() < 10 ? ("0" + this.attachDate.getDate()) : this.attachDate.getDate());
      
      if(academicYearUUID != "" && schoolUUID != "" && gradeId > 0 && sectionUUID != "" && subjectUUID != "" 
      && userUUID != "")
      {
        this.searchLessionPlanMapping = true;
        let response = await this.lessonPlanMappingService.getLessonPlanMappings(userUUID, academicYearUUID, schoolUUID, gradeId, sectionUUID, subjectUUID, applyDate).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblLessonPlanMapping').DataTable().clear().destroy();
          this.lessonPlanMappings = response.data.lessonPlanMappings;
          setTimeout(function(){
            $('#tblLessonPlanMapping').DataTable();
          },1000);
  ///set Dynamic Form
          for(let i=0;i<this.lessonPlanMappings.length;i++)
          {
            let startDate : any = null;
            let endDate : any = null;
            if(this.lessonPlanMappings[i].startDate)
            {
              let data : string[] = this.lessonPlanMappings[i].startDate.toString().split("-");
              startDate = {year : parseInt(data[0]), month : parseInt(data[1]), day : parseInt(data[2])};
            }
            if(this.lessonPlanMappings[i].endDate)
            {
              let data : string[] = this.lessonPlanMappings[i].endDate.toString().split("-");
              endDate = {year : parseInt(data[0]), month : parseInt(data[1]), day : parseInt(data[2])};
            }
            this.lessonPlanMappingForm[i] = this.formbuilder.group({
              uuid:[this.lessonPlanMappings[i].uuid],
              startDate: new FormControl(startDate),
              endDate: new FormControl(endDate),
              minDate: new FormControl(startDate)
            });
            this.saveClicked[i] = false;
            this.deleteClicked[i] = false;
          }
          this.searchLessionPlanMapping = false;
        }
      }
    }
    catch(e)
    {
      $('#tblLessonPlanMapping').DataTable().clear().destroy();
      this.lessonPlanMappings = [];
      setTimeout(function(){
        $('#tblLessonPlanMapping').DataTable();
      },1000);
      this.searchLessionPlanMapping = false;
      this.showNotification("error", "Lesson Plan Not Applied.");
    }
  }

  attachLessonPlan()
  {
    this.modalService.dismissAll();
    let params = {
      "attachDate" : this.attachDate,
      "teachingScheduleMaster" : this.teachingScheduleMaster,
      "teachingScheduleDetail" : this.teachingScheduleDetail
    }
    const dialogRef = this.modalService.open(LessonPlanAttachComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  async saveLessonPlanMappping(i : number, lessonPlanMappingData : any)
  {
    if(lessonPlanMappingData != "")
    {
      try
      {
        if(lessonPlanMappingData.startDate != null && lessonPlanMappingData.startDate?.year != undefined && lessonPlanMappingData.startDate?.month != undefined && lessonPlanMappingData.startDate?.day != undefined)
        {
          lessonPlanMappingData.startDate = lessonPlanMappingData.startDate.year + "-" + (lessonPlanMappingData.startDate.month < 10 ? '0' + lessonPlanMappingData.startDate.month : lessonPlanMappingData.startDate.month) + "-" + (lessonPlanMappingData.startDate.day < 10 ? '0' + lessonPlanMappingData.startDate.day : lessonPlanMappingData.startDate.day);
        }
        else
        {
          lessonPlanMappingData.startDate = "";
        }
        if(lessonPlanMappingData.endDate != "" && lessonPlanMappingData.endDate?.year != undefined && lessonPlanMappingData.endDate?.month != undefined && lessonPlanMappingData.endDate?.day != undefined)
        {
          lessonPlanMappingData.endDate = lessonPlanMappingData.endDate.year + "-" + (lessonPlanMappingData.endDate.month < 10 ? '0' + lessonPlanMappingData.endDate.month : lessonPlanMappingData.endDate.month) + "-" + (lessonPlanMappingData.endDate.day < 10 ? '0' + lessonPlanMappingData.endDate.day : lessonPlanMappingData.endDate.day);
        }
        else
        {
          lessonPlanMappingData.endDate = "";
        }
        if(lessonPlanMappingData.startDate)
        {
          this.saveClicked[i]= true;
          let response = await this.lessonPlanMappingService.updateLessonPlanMapping(lessonPlanMappingData).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Lesson Plan Detail Updated");
            this.getLessonPlanMappings();
            this.saveClicked[i] = false;
          }
        }
        else
        {
          this.lessonPlanMappingForm[i].get("endDate").setValue(null);
          this.showNotification("warning", "Start Date Is Missing");
        }
      }
      catch(e : any)
      {
        this.showNotification("error", e);
        this.saveClicked[i] = false;
      }
    }
    else
    {
      this.showNotification("warning", "Select Lesson Plan");
      this.selLessonPlanUUID = "";
    }
  }

  async deleteLessonPlanMapping(i : number, uuid : string)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete Lesson Plan?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
        
      } 
      else 
      {
        this.deleteClicked[i] = true;
        let tempJSON = { 
          "uuid" : uuid
        };
        try
        {
          let response = await this.lessonPlanMappingService.deleteLessonPlanMapping(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Lesson Plan Deleted.");
            this.getLessonPlanMappings();
            this.deleteClicked[i] = false;
          }
        }
        catch(e : any)
        {
          this.showNotification("error", e);
          this.deleteClicked[i] = false;
        }
      }
    });
  }

  playLessonPlan(lessonPlanUUID : string)
  {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/lessonPlan/player/' + lessonPlanUUID);
  }

  closeModal()
  {
    this.commonSharedService.teachingScheduleListObject.next(
      {
        result : "success"
      });
  }
}
