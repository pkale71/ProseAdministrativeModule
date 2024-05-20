import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { WeeklyTimetableTemplate } from 'src/app/theme/shared/model/weeklyTimetableTemplate';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { GradeScheduleSettingService } from 'src/app/theme/shared/service/grade-schedule-setting.service';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { TeachingScheduleService } from 'src/app/theme/shared/service/teaching-schedule.service';
import { WeeklyTimeTableService } from 'src/app/theme/shared/service/weekly-timetable.service';
import { Convert12HrsTimeFormatPipe } from "../../../theme/shared/custom-pipe/convert12-hrs-time-format.pipe";
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-weekly-timetable-create',
  standalone: true,
  templateUrl: './weekly-timetable-create.component.html',
  styleUrls: ['./weekly-timetable-create.component.scss'],
  imports: [CommonModule, SharedModule, Convert12HrsTimeFormatPipe]
})
export class WeeklyTimetableCreateComponent {
  @Input() public modalParams;
  gradeScheduleSettingForm : FormGroup;
  isValidForm : boolean = true;
  currentMonthYear : string;
  schoolUUID : string;
  userTypeCode : string;
  academicYearForm : FormGroup;
  sectionForm : FormGroup;
  gradeForm : FormGroup;
  searchClicked : boolean;
  gradeClicked : boolean;
  createClicked : boolean;
  grades : any[];
  academicYears : AcademicYear[];
  weeklyTimeTable : WeeklyTimetableTemplate[];

  constructor(private activeModal: NgbActiveModal,
    private formbuilder : FormBuilder,
    private notifier: NotifierService, 
    private router : Router,
    private weeklyTimeTableService : WeeklyTimeTableService,
    private teachingScheduleService : TeachingScheduleService,
    private gradeScheduleSettingService : GradeScheduleSettingService,
    private schoolService : SchoolService,
    private commonService : CommonService,
    public commonSharedService : CommonSharedService)
  {
    let date = new Date();
    this.currentMonthYear = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2);
    this.userTypeCode = this.commonSharedService.loginUser?.userType?.code;
  }

  ngOnInit() : void
  {
    this.schoolUUID = this.commonSharedService.loginUser.schools[0].uuid;
    this.grades = [];
    this.weeklyTimeTable = [];
    this.academicYears = [];
    this.createClicked = false;
    
    this.gradeScheduleSettingForm = this.formbuilder.group({
      uuid:['', Validators.required],
      academicYear: this.formbuilder.group({ 'uuid': ['', Validators.required] }),
      school: this.formbuilder.group({ 'uuid': [this.schoolUUID, Validators.required] }),
      grade: this.formbuilder.group({ 'id': ['', Validators.required] }),
      numberOfPeriods: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}')]],
      duration: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}')]],
      startTime: ['',[Validators.required]],
      lunchAfterPeriod: ['', [Validators.required, Validators.pattern('^[0-9]{1,1}')]],
      lunchDuration: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}')]],
      snackAfterPeriod: ['', [Validators.pattern('^[0-9]{1,1}')]],
      snackDuration: ['', [Validators.pattern('^[0-9]{1,2}')]],
      monthYear: [this.currentMonthYear, Validators.required]
    });

    this.gradeForm = this.formbuilder.group({
      'grade': ['', [Validators.required]]
    });

    this.academicYearForm = this.formbuilder.group({
      'academicYear': ['', [Validators.required]]
    });

    this.getAcademicYears();
    this.getSchoolGrades(this.schoolUUID);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicYears() 
  {
    let response = await this.commonService.getAcademicYears().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      let isCurrent : boolean = false;
      let academicYears : AcademicYear[] = response.data.academicYears;
      for(let i=0;i<academicYears.length;i++)
      {
        if(academicYears[i].isCurrent == 1)
        {
          isCurrent = true;
        }
        if(isCurrent)
        {
          this.academicYears.push(academicYears[i]);
        }
      }
      if(this.academicYears.length > 0)
      {
        this.academicYearForm.get("academicYear").setValue(this.academicYears[this.academicYears.length-1].uuid);
      }
    }
  }

  async getSchoolGrades(schoolUUID :string) 
  {
    let tempGrade : any = {"id" : "", "name" : "Select Grade"};
    if(schoolUUID != "")
    {
      this.gradeClicked = true;
      let response = await this.schoolService.getSchoolGrades(schoolUUID).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.grades = response.data.grades;
        this.grades.unshift(tempGrade);
        this.gradeClicked= false;
      }
    }
    else
    {
      this.grades = [];
      this.grades.unshift(tempGrade);
      this.gradeClicked= false;
    }
  }

  async getGradeScheduleSetting(schoolUUID) 
  {
    try
    {
      let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
      let gradeId : number = this.gradeForm.get("grade").value;
      let monthYear = this.gradeScheduleSettingForm.get("monthYear").value;
      this.weeklyTimeTable = [];
      if(schoolUUID != "" && academicYearUUID != "" && gradeId > 0)
      {
        this.searchClicked = true;
        let response = await this.gradeScheduleSettingService.getGradeScheduleSettings(academicYearUUID, schoolUUID, gradeId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.gradeScheduleSettingForm.patchValue(response.data.gradeScheduleSettings[0]);
          this.gradeScheduleSettingForm.get("monthYear").setValue(monthYear);
          this.searchClicked = false;
        }
      }
      else
      {
        this.gradeScheduleSettingForm.reset();
        this.searchClicked= false;
        this.gradeScheduleSettingForm.get("monthYear").setValue(monthYear);
      }
    }
    catch(e:any)
    {
      this.showNotification("warning", e);
      this.searchClicked= false;
    }
  }

  checkLunchPeriod(value : number, field : string, action : string)
  {
    let totalPeriods : number = this.gradeScheduleSettingForm.get("numberOfPeriods").value;
    if(value == 0 || value > totalPeriods)
    {
      this.showNotification("info", action + " Not Greater Than Total Periods");
      this.gradeScheduleSettingForm.get(field).setValue("");
    }
  }

  async createWeeklyTimeTable()
  {
    if(!this.createClicked && this.academicYearForm.valid && this.gradeForm.valid && this.gradeScheduleSettingForm.valid)
    {
      let monthYear : string[] = (this.gradeScheduleSettingForm.get("monthYear").value).split("-");
      let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
      let gradeId : number = this.gradeForm.get("grade").value;
      this.weeklyTimeTable = [];
      try
      {
        this.isValidForm = true;
        this.createClicked = true;
        let temJSON = {
          grade : {id : gradeId},
          school : {uuid : this.schoolUUID},
          academicYear : {uuid : academicYearUUID},
          lunchAfterPeriod : this.gradeScheduleSettingForm.get("lunchAfterPeriod").value,
          lunchDuration : this.gradeScheduleSettingForm.get("lunchDuration").value,
          snackAfterPeriod : this.gradeScheduleSettingForm.get("snackAfterPeriod").value,
          snackDuration : this.gradeScheduleSettingForm.get("snackDuration").value,
          monthNumber : monthYear[1],
          year : monthYear[0]
        }
        let response = await this.weeklyTimeTableService.createWeeklyTimeTable(temJSON).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.createClicked = false;
          this.showNotification("success", "Weekly Time Table Created");
          this.commonSharedService.generatedWeeklyTimeTableObject.next({result : "success", 
            monthYear : this.gradeScheduleSettingForm.get("monthYear").value,
            academicYearUUID : academicYearUUID,
            gradeId : gradeId 
          })
        }
      }
      catch(e :any)
      {
        this.createClicked = false;
        this.showNotification("warning", e);
      }
    }
    else
    {
      this.isValidForm = false;
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
