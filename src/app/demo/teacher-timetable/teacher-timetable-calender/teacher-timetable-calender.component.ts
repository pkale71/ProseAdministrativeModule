// Angular Import
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Bootstrap
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardModule } from 'src/app/theme/shared/components';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { NotifierService } from 'angular-notifier';
import { TeachingScheduleService } from 'src/app/theme/shared/service/teaching-schedule.service';
import { TeachingScheduleMaster } from 'src/app/theme/shared/model/teachingScheduleMaster';

// Third party
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, startOfMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { TeachingScheduleDetail } from 'src/app/theme/shared/model/teachingScheduleDetail';
import { Convert12HrsTimeFormatPipe } from 'src/app/theme/shared/custom-pipe/convert12-hrs-time-format.pipe';
import { LessonPlanAttachComponent } from '../lesson-plan-attach/lesson-plan-attach.component';
import { LessonPlanShowComponent } from '../lesson-plan-show/lesson-plan-show.component';

@Component({
  selector: 'app-teacher-timetable-calender',
  standalone: true,
  imports: [CommonModule, CardModule, SharedModule, Convert12HrsTimeFormatPipe],
  templateUrl: './teacher-timetable-calender.component.html',
  styleUrls: ['./teacher-timetable-calender.component.scss']
})
export class TeacherTimetableCalenderComponent {
  colors: Record<string, EventColor> = {
    red: {
      primary: '#673ab7',
      secondary: '#2196f3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    },
    green: {
      primary: '#198754',
      secondary: '#FDF1BA'
    }
  };

  // Public props
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  startAcademicYearDate: Date = new Date();
  endAcademicYearDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  refresh = new Subject<void>();
  currentAcademicYear : AcademicYear = this.commonSharedService.currentAcademicYear;
  schoolUUID : string = this.commonSharedService.loginUser.schools[0].uuid;
  userTypeCode : string = this.commonSharedService.loginUser.userType?.code;
  prevVisible : boolean = true;
  nextVisible : boolean = true;
  teachingSchedule : TeachingScheduleMaster[];

  // constructor
  constructor(private modal: NgbModal, private commonSharedService : CommonSharedService,
    private teachingScheduleService : TeachingScheduleService, private notifier: NotifierService,
    private cardModule : CardModule, private modalService: NgbModal) 
  {
    this.teachingSchedule = [];
    this.viewDate = new Date(this.viewDate.toISOString().split('T')[0]);
    if(this.currentAcademicYear != null)
    {
      this.startAcademicYearDate = new Date(this.currentAcademicYear.startDate);
      this.endAcademicYearDate = new Date(this.currentAcademicYear.endDate);
      this.getTeachingSchedule();
    }
  }

  public teachingScheduleAddResult:any = this.commonSharedService.teachingScheduleListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.viewDate.setHours(5,30);
      this.viewDate = new Date(this.viewDate.toISOString().split('T')[0]);
      this.getTeachingSchedule();
      this.modalService.dismissAll();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }
  
  async getTeachingSchedule()
  {
    let startDate : Date = startOfMonth(this.viewDate);
    startDate.setDate(this.startAcademicYearDate.getDate());
    let endDate : Date = endOfMonth(this.viewDate);
    let fromDate : string = startDate.getFullYear() + '-' + ((startDate.getMonth() + 1) < 10 ? ('0' + (startDate.getMonth() + 1)) : (startDate.getMonth() + 1)) + '-' + (startDate.getDate() < 10 ? ('0' + startDate.getDate()) : startDate.getDate());
    let toDate : string = endDate.getFullYear() + '-' + ((endDate.getMonth() + 1) < 10 ? ('0' + (endDate.getMonth() + 1)) : (endDate.getMonth() + 1)) + '-' + (endDate.getDate() < 10 ? ('0' + endDate.getDate()) : endDate.getDate())
    this.showNotification("info","Please Wait, Loading Teaching Schedule...");
    let response = await this.teachingScheduleService.getTeachingSchedule(this.commonSharedService.loginUser.uuid, fromDate, toDate, 0).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.teachingSchedule = response.data.teachingSchedule;
  //Get Month Calendar Data
      this.events =[];
      for(let i = 0; i < this.teachingSchedule.length; i++)
      {
        if(this.teachingSchedule[i].teachingScheduleDetails.length > 0)
        {
          let tsds : TeachingScheduleDetail[] = this.teachingSchedule[i].teachingScheduleDetails;
    //get Teaching Class Data      
          for(let k=0;k<tsds.length;k++)
          {
  //Apply Actions Based on condition
            let actions : CalendarEventAction[] = null;
            let checkDate : Date = new Date();
            let isFilled : boolean = true;
            let isLessonPlan : boolean = true;
            checkDate.setHours(5,30);
            checkDate = new Date(checkDate.toISOString().split('T')[0]);
            if(new Date(this.teachingSchedule[i].scheduleDate) >= checkDate)
            {
              if(tsds[k].lessonPlanMappings.length > 0)
              {
                if(tsds[k].lessonPlanMappings[0].uuid)
                {
                  isLessonPlan = true;
        ///All Lesson Plan Filled Or Not                  
                  for(let m=0;m<tsds[k].lessonPlanMappings.length;m++)
                  {
                    if(!tsds[k].lessonPlanMappings[m].startDate || !tsds[k].lessonPlanMappings[m].endDate)
                    {
                      isFilled = false;
                      break;
                    }
                  }
                  if(!isFilled)
                  {
                    actions = this.appliedActions;
                  }
                  else
                  {
                    actions = this.filledActions;
                  }
                }
                else
                {
                  isFilled = false;
                  isLessonPlan = false;
                  actions = tsds[k].engagedBy?.uuid ? null : this.actions;
                }
              }
              else
              {
                isFilled = false;
                isLessonPlan = false;
                actions = tsds[k].engagedBy?.uuid ? null : this.actions;
              }
            }
            else
            {
              if(tsds[k].lessonPlanMappings.length > 0)
              {
                if(tsds[k].lessonPlanMappings[0].uuid)
                {
                  isLessonPlan = true;
          ///All Lesson Plan Filled Or Not
                  for(let m=0;m<tsds[k].lessonPlanMappings.length;m++)
                  {
                    if(!tsds[k].lessonPlanMappings[m].startDate || !tsds[k].lessonPlanMappings[m].endDate)
                    {
                      isFilled = false;
                      break;
                    }
                  }
                  if(!isFilled)
                  {
                    isFilled = false;
                    actions = this.appliedActions;
                  }
                  else
                  {
                    isFilled = true;
                    actions = this.filledActions;
                  }
                }
                else
                {
                  isFilled = false;
                  isLessonPlan = false;
                }
              }
              else
              {
                isFilled = false;
                isLessonPlan = false;
              }
            }
            if(this.viewDate == new Date(this.teachingSchedule[i].scheduleDate))
            {
              this.activeDayIsOpen = true;
            }            
            let remark = `
            <label class="col-md-1">&nbsp;P-${tsds[k].periodNumber}</label>
            <label class="col-md-2"><i class="fa fa-clock"></i>&nbsp; ${this.commonSharedService.convert12HrsTimeFormatPipe(tsds[k].startTime)} </label>
            <label class="col-md-2"><i class="fa fa-book"></i>&nbsp; ${tsds[k].subject?.name} </label>
            <label class="col-md-2"><i class="fa fa-building"></i>&nbsp; ${tsds[k].grade?.name}-${tsds[k].section?.name} </label>
            `;
            if(tsds[k].engagedBy?.uuid)
            {
              remark = remark + `&nbsp;<span class="btn-sm badge bg-danger" title="${tsds[k].engagedBy?.name}">
              <i class="fas fa-fw fa-user-shield"></i></span>`;
            }
            let dataJSON = {
              id : JSON.stringify({"data1" : this.teachingSchedule[i], "data2" : tsds[k]}),  
              start: startOfDay(new Date(this.teachingSchedule[i].scheduleDate)),
              end: endOfDay(new Date(this.teachingSchedule[i].scheduleDate)),
              title: remark,
              color: { ...!isFilled ? (isLessonPlan ? this.colors['yellow'] : this.colors['blue']) : this.colors['green'] },
              actions: (this.userTypeCode == 'SCHCD' || this.userTypeCode == 'SUBHD' || this.userTypeCode == 'TECHR') ? actions : null,
            }
            this.events.push(dataJSON);
          }
        }
      }
      this.showNotification("success", "Teaching Schedule Loaded");
    }
  }
  
  // Public methods
  actions: CalendarEventAction[] = [
    {
      label: '&nbsp;<span class="btn-sm badge bg-primary" title="Add Lesson Plan"><i class="fas fa-fw fa-plus"></i></span>',
      a11yLabel: 'Add',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Added', event);
      }
    }
  ];

  appliedActions: CalendarEventAction[] = [
    {
      label: '&nbsp;<span class="btn-sm badge bg-warning" title="Show Lesson Plan"><i class="fas fa-fw fa-book-open"></i></span>',
      a11yLabel: 'Fill/Show',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Filled', event);
      }
    }
  ];

  filledActions: CalendarEventAction[] = [
    {
      label: '&nbsp;<span class="btn-sm badge bg-success" title="Show Lesson Plan"><i class="fas fa-fw fa-book-open"></i></span>',
      a11yLabel: 'Fill/Show',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Done', event);
      }
    }
  ];

  events: CalendarEvent[] = [];
    
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        $("cal-event").removeClass();
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    //this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if(action == "Added")
    {
      let jsonData : any = JSON.parse(event.id.toString());
      let params = {
        "attachDate" : event.start,
        "teachingScheduleMaster" : jsonData.data1,
        "teachingScheduleDetail" : jsonData.data2
      }
      const dialogRef = this.modalService.open(LessonPlanAttachComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }
    else if(action == "Filled" || action == 'Done')
    {
      let jsonData : any = JSON.parse(event.id.toString());
      let params = {
        "attachDate" : event.start,
        "teachingScheduleMaster" : jsonData.data1,
        "teachingScheduleDetail" : jsonData.data2
      }
      const dialogRef = this.modalService.open(LessonPlanShowComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.checkAcademicYearLimit();
    this.activeDayIsOpen = false;
  }

  checkAcademicYearLimit()
  {
    let tempDate1 : string = (this.viewDate.toISOString().split('T')[0]);
    let startDate : Date = startOfMonth(new Date(tempDate1));
    startDate.setDate(this.startAcademicYearDate.getDate());
    let endDate : Date = endOfMonth(new Date(tempDate1));
    if(this.startAcademicYearDate >= startDate) //prev month
    {
      this.prevVisible = false;
    }
    else
    {
      this.prevVisible = true;
    }
    
    if(this.endAcademicYearDate <= endDate) //next month
    {
      this.nextVisible = false;
    }
    else
    {
      this.nextVisible = true;
    }
    this.getTeachingSchedule();
  }
}
