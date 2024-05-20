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
import { YearCalenderService } from 'src/app/theme/shared/service/year-calender.service';
import { YearCalender } from 'src/app/theme/shared/model/yearCalender';
import { YearCalenderAddComponent } from '../year-calender-add/year-calender-add.component';
import { YearCalenderEditComponent } from '../year-calender-edit/year-calender-edit.component';

// Third party
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, startOfMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-year-calender-list',
  standalone: true,
  imports: [CommonModule, CardModule, SharedModule],
  templateUrl: './year-calender-list.component.html',
  styleUrls: ['./year-calender-list.component.scss']
})
export class YearCalenderListComponent {
  // Private props
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
    }
  };

  // Public props
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  startAcademicYearDate: Date = new Date();
  endAcademicYearDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  refresh = new Subject<void>();
  currentAcademicYear : AcademicYear = this.commonSharedService.currentAcademicYear;
  schoolUUID : string = this.commonSharedService.loginUser.schools[0].uuid;
  userTypeCode : string = this.commonSharedService.loginUser.userType?.code;
  prevVisible : boolean = true;
  nextVisible : boolean = true;
  cardComponentObject : any;
  yearCalenders : YearCalender[];

  // constructor
  constructor(private modal: NgbModal, private commonSharedService : CommonSharedService,
    private yearCalenderService : YearCalenderService, private notifier: NotifierService,
    private cardModule : CardModule, private modalService: NgbModal) 
  {
    this.yearCalenders = [];
    this.viewDate = new Date(this.viewDate.toISOString().split('T')[0]);
    if(this.currentAcademicYear != null)
    {
      this.startAcademicYearDate = new Date(this.currentAcademicYear.startDate);
      this.endAcademicYearDate = new Date(this.currentAcademicYear.endDate);
    }
  }

  public yearCalenderCardComponentResult:any = this.commonSharedService.yearCalenderCardComponentObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.cardComponentObject = res.object;
      this.checkAcademicYearLimit();
    }
  })

  public yearCalenderAddResult:any = this.commonSharedService.yearCalenderListObject.subscribe(res =>{
    if(res.result == "success")
    {
      if(res.oper == "Add")
      {
        this.activeDayIsOpen = true;
      }
      else
      {
        this.activeDayIsOpen = false;
      }
      this.getYearCalenderByMonth(this.viewDate.getMonth() + 1, this.viewDate.getFullYear(), this.schoolUUID);
      this.modalService.dismissAll();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getYearCalenderByMonth(monthNumber: number, year : number, schoolUUID: string)
  {
    this.showNotification("info", "Please Wait, Loading Year Calendar......");
    let response = await this.yearCalenderService.getYearCalenderByMonth(monthNumber, year, schoolUUID).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.yearCalenders = response.data.yearCalender;
  //Get Month Calendar Data
      this.events =[];
      for(let i = 0; i < this.yearCalenders.length; i++)
      {
        if(this.yearCalenders[i].remark != null)
        {
          if(this.viewDate == new Date(this.yearCalenders[i].calenderDate))
          {
            this.activeDayIsOpen = true;
          }
          let actions : CalendarEventAction[] = null;
          if(new Date(this.yearCalenders[i].calenderDate) >= this.viewDate)
          {
            actions = this.actions;
          }
          let dataJSON = {
            id : this.yearCalenders[i].id,  
            start: startOfDay(new Date(this.yearCalenders[i].calenderDate)),
            end: endOfDay(new Date(this.yearCalenders[i].calenderDate)),
            title: this.yearCalenders[i].remark,
            color: { ...this.colors['yellow'] },
            actions: (this.userTypeCode == 'SCHPL' || this.userTypeCode == 'SCHVP') ? actions : null,
          }
          this.events.push(dataJSON);
        }
      }
  ///
      if(this.yearCalenders.length > 0)
      {
        this.cardComponentObject.yearCalenderGenerated = true;
      }
      else
      {
        this.cardComponentObject.yearCalenderGenerated = false;
      }

      this.showNotification("success", "Year Calendar Loaded");
    }
  }
  async generateYearCalender() 
  {
    if(this.commonSharedService.loginUser)
    {
      try
      {
        this.cardComponentObject.yearCalenderClicked = true;
        let tempJSON  = {
          "academicYear" : {uuid : this.commonSharedService.currentAcademicYear.uuid},
          "school" : {uuid : this.commonSharedService.loginUser.schools[0].uuid},
        }
        let response = await this.yearCalenderService.generateYearCalender(tempJSON).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.cardComponentObject.yearCalenderGenerated = true;
          this.cardComponentObject.yearCalenderClicked = false;
          this.showNotification("success", "Year Calender Generated For " + this.commonSharedService.currentAcademicYear.year);
        }
      }
      catch(e: any)
      {
        this.cardComponentObject.yearCalenderClicked = false;
        this.showNotification("warning", e);
      }
    }
    else
    {
      this.showNotification("warning", "Academic Year Not Set");
    }
  }
  
  // Public methods
  

  actions: CalendarEventAction[] = [
    {
      label: '&nbsp;<span class="btn-sm badge bg-primary" title="Edit"><i class="fas fa-fw fa-pencil-alt"></i></span>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '&nbsp;<span class="btn-sm badge bg-danger" title="Delete"><i class="fas fa-fw fa-trash-alt"></i></span>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
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
      }
      this.viewDate = date;
    }
    if(events.length === 0)
    {
      let curDate = new Date();
      if(date > curDate)
      {
        if(this.userTypeCode == 'SCHPL' || this.userTypeCode == 'SCHVP')
        {
          let selDate : string = this.viewDate.getFullYear() + "-" + ((this.viewDate.getMonth() + 1) < 10 ? ("0"+(this.viewDate.getMonth() + 1)):(this.viewDate.getMonth() + 1)) + "-" + (this.viewDate.getDate() < 10 ? ("0"+(this.viewDate.getDate())):(this.viewDate.getDate()));
          let filteredData = this.yearCalenders.filter((yearCalender) => (yearCalender.calenderDate).toString() == selDate);
          if(filteredData.length > 0) 
          {
            let params = {
              "id" : filteredData[0].id
            }
            const dialogRef = this.modalService.open(YearCalenderAddComponent, 
            { 
              size: 'md', backdrop: 'static' 
            });
            dialogRef.componentInstance.modalParams = params;
          }
        }
      }
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
    if(action == "Edited")
    {
      let params = {
        "id" : event.id,
        "remark" : event.title
      }
      const dialogRef = this.modalService.open(YearCalenderEditComponent, 
      { 
        size: 'md', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }
    else if(action == "Deleted")
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete event?',
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
            "id" : event.id,
            "remark" : "",
            "isTeaching" : 1
          };
          try
          {
            let response = await this.yearCalenderService.updateYearCalender(tempJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Event Deleted.");
              this.commonSharedService.yearCalenderListObject.next({result : "success", oper : "Delete"});
            }
          }
          catch(e)
          {
            this.showNotification("error", "Event Not Deleted.");
          }
        }
      });
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
    this.getYearCalenderByMonth(this.viewDate.getMonth() + 1, this.viewDate.getFullYear(), this.schoolUUID);
  }
}
