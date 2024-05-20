import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { School } from 'src/app/theme/shared/model/school';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { NotifierService } from 'angular-notifier';
import { Convert12HrsTimeFormatPipe } from "../../../theme/shared/custom-pipe/convert12-hrs-time-format.pipe";
import { GradeScheduleSettingService } from 'src/app/theme/shared/service/grade-schedule-setting.service';
import { WeeklyTimetableTemplate } from 'src/app/theme/shared/model/weeklyTimetableTemplate';
import { WeeklyTimeTableService } from 'src/app/theme/shared/service/weekly-timetable.service';
import { TeachingScheduleService } from 'src/app/theme/shared/service/teaching-schedule.service';

// third party
import Swal from 'sweetalert2';
import { WeeklyTimetableAddComponent } from '../weekly-timetable-add/weekly-timetable-add.component';
import { SchoolGradeSection } from 'src/app/theme/shared/model/school-grade-section';
import { WeeklyTimetableCreateComponent } from '../weekly-timetable-create/weekly-timetable-create.component';

@Component({
    selector: 'app-weekly-timetable-display',
    standalone: true,
    templateUrl: './weekly-timetable-display.component.html',
    styleUrls: ['./weekly-timetable-display.component.scss'],
    imports: [CommonModule, SharedModule, Convert12HrsTimeFormatPipe]
})
export class WeeklyTimetableDisplayComponent {
  school : School;
  grades : any[];
  academicYears : AcademicYear[];
  academicYearForm : FormGroup;
  sectionForm : FormGroup;
  gradeForm : FormGroup;
  searchClicked : boolean;
  gradeClicked : boolean;
  gradeScheduleSettingForm : FormGroup;
  schoolUUID : string;
  createClicked : boolean;
  weeklyTimeTable : WeeklyTimetableTemplate[];
  isValidForm : boolean = true;
  periods : number[] = [1,2,3,4,5,6,7];
  completeWeeklyTimeTable : WeeklyTimetableTemplate[];
  currentMonthYear : string;
  weeklyTimeTableData : any[] = [];
  sections : SchoolGradeSection[];
  completeTimeTableClicked : boolean;
  userTypeCode : string;
  maxPeriod : number = 0;
  classDays : number = 6;
  sectionClicked:boolean = false;
  techingScheduleClicked : boolean[] = [];
  dayNames : string[] = ["Sun", "Mon", "Tue", "Wed", "Thru", "Fri", "Sat"];

  constructor(private router : Router,
    private formbuilder : FormBuilder,
    private notifier: NotifierService, 
    private modalService: NgbModal,
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

  ngOnInit() 
  {
    this.schoolUUID = this.commonSharedService.loginUser.schools[0].uuid;
    this.grades = [];
    this.weeklyTimeTable = [];
    this.completeWeeklyTimeTable = [];
    this.academicYears = [];
    this.createClicked = false;
    this.searchClicked = false;
    this.gradeClicked = false;
    this.completeTimeTableClicked = false;
  
    this.gradeScheduleSettingForm = this.formbuilder.group({
      academicYear: this.formbuilder.group({ 'uuid': ['', Validators.required] }),
      school: this.formbuilder.group({ 'uuid': [this.schoolUUID, Validators.required] }),
      grade: this.formbuilder.group({ 'id': ['', Validators.required] }),
      monthYear: [this.currentMonthYear, Validators.required]
    });

    this.gradeForm = this.formbuilder.group({
      'grade': ['', [Validators.required]]
    });

    this.sectionForm = this.formbuilder.group({
      'section': ['', [Validators.required]]
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

  public generatedWeeklyTimeTableObject:any = this.commonSharedService.generatedWeeklyTimeTableObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.academicYearForm.get("academicYear").setValue(res.academicYearUUID);
      this.gradeForm.get("grade").setValue(res.gradeId);
      this.gradeScheduleSettingForm.get("monthYear").setValue(res.monthYear);
      this.getSections();
      this.modalService.dismissAll();
      this.getCompleteWeeklyTimeTable();
    }
  });

  public weeklyTimeTableAddResult:any = this.commonSharedService.weeklyTimeTableListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.resetWeeklyTimeTableColumnColor();
      if(res.data && parseInt(res.rowNumber) >= 0 && parseInt(res.columnNumber) >= 0)
      {
        this.weeklyTimeTableData[res.rowNumber]["period-" + res.columnNumber] = res.data;
        this.weeklyTimeTableData[res.rowNumber]["period-" + res.columnNumber]["isDeleted"] = 0;
        this.weeklyTimeTableData[res.rowNumber]["period-" + res.columnNumber]["duplicateAllotColumnColor"] = {background : 'bg-success', text : 'text-dark'};
      }
      //Check For Class Allotment Completed Or Not
      this.checkIsAllocationDone(this.weeklyTimeTableData[res.rowNumber].gradeSection?.grade?.id, this.weeklyTimeTableData[res.rowNumber].gradeSection?.section?.uuid);
      //this.checkClassAllotmentComplete(res.rowNumber);
      /////
      this.modalService.dismissAll();
    }
    else if(res.result == "error" && res.allocatedUUID != "")
    {
      this.resetWeeklyTimeTableColumnColor();
  ///If Already Allocated Teacher in Same Period
      if(res.allocatedUUID)
      {
        for(let i=0;i<this.weeklyTimeTableData.length;i++)
        {
          if(this.weeklyTimeTableData[i]["period-" + res.columnNumber].uuid == res.allocatedUUID)
          {
            this.weeklyTimeTableData[i]["period-" + res.columnNumber]["duplicateAllotColumnColor"] = {background : 'bg-warning', text : 'text-dark'};
            break;
          }
        }
      }
  ///If Already Allocated Subject in Same Period
      else if(res.subjectUUID)
      {
        for(let k=1;k<=this.maxPeriod;k++)
        {
          if(this.weeklyTimeTableData[res.rowNumber]["period-" + k].uuid == res.subjectUUID)
          {
            this.weeklyTimeTableData[res.rowNumber]["period-" + k]["duplicateAllotColumnColor"] = {background : 'bg-warning', text : 'text-dark'};
            break;
          }
        }
      }
      this.modalService.dismissAll();
    }
  })

  resetWeeklyTimeTableColumnColor()
  {
    for(let i=0;i<this.weeklyTimeTableData.length;i++)
    {
        for(let k=1;k<=this.maxPeriod;k++)
        {
          if(this.weeklyTimeTableData[i]["period-" + k])
          {
            this.weeklyTimeTableData[i]["period-" + k]["duplicateAllotColumnColor"] = {background : 'bg-white', text : 'text-dark'};
          }
        }
    }
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
        this.getCompleteWeeklyTimeTable();
      }
    }
  }

  async getSections() 
  {
    let academicYearUUID = this.academicYearForm.get("academicYear")?.value;
    let gradeId : number = this.gradeForm.get("grade")?.value;
    this.sections = [];
    if(academicYearUUID != "" && gradeId > 0)
    {
      this.sectionClicked = true;
      try
      {
        let response = await this.commonService.getGrade(gradeId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          let tempGradeCategory = response.data.grade;
          
          let response1 = await this.schoolService.getSchoolGradeSections(academicYearUUID, this.schoolUUID, tempGradeCategory?.gradeCategory?.id, gradeId).toPromise();
          if (response1.status_code == 200 && response1.message == 'success') 
          {
            this.sections = response1.data.gradeSections?.gradeCategories?.grades?.sections;
            this.sections.unshift({"uuid" : "", "name" : "All"});
            this.sectionForm.get("section").setValue(""); 
            this.sectionClicked = false;         
          }
        }
      }
      catch(e : any)
      {
        this.sectionClicked = false;
      }
    }
    else
    {
      this.sectionForm.get("section").setValue("");
      this.sectionClicked = false;  
      this.showNotification("warning","Select Grade Ans Academic Year");
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
        this.getSections();
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

  createWeeklyTimeTable()
  {
    let params = {
      
    }
    const dialogRef = this.modalService.open(WeeklyTimetableCreateComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  async getCompleteWeeklyTimeTable()
  {
    try
    {
      if(this.schoolUUID != "" && this.academicYearForm.valid)
      {
        if(this.gradeScheduleSettingForm.get("monthYear").value != null)
        {
          let monthYear : string[] = (this.gradeScheduleSettingForm.get("monthYear").value).split("-");
          let academicYearUUID : string = this.academicYearForm.get("academicYear").value;
          let sectionUUID : string = this.sectionForm.get("section").value;
          let gradeId : number = this.gradeForm.get("grade").value;
          
          if(academicYearUUID != "" && this.schoolUUID != "" && gradeId > 0 && parseInt(monthYear[1]) > 0 && parseInt(monthYear[0]) > 0)
          {
            this.completeTimeTableClicked = true;
            let response1 = await this.weeklyTimeTableService.getWeeklyTimeTable(academicYearUUID, this.schoolUUID, gradeId, parseInt(monthYear[1]), parseInt(monthYear[0]), sectionUUID, 0).toPromise();
            if (response1.status_code == 200 && response1.message == 'success') 
            {
              this.completeWeeklyTimeTable = response1.data.weeklyTimeTable;
              this.completeTimeTableClicked= false;
          //Get Periods Array
              this.periods = [];
              this.maxPeriod = response1.data.maxPeriod;
              for(let i=1;i<=this.maxPeriod;i++)
              {
                this.periods[i-1] = i;
              }
          ////
              this.generateClassSectionWiseJSON();
            }
            else
            {
              this.showNotification("info", "Select Academic Year, Month/Year, Grade, Section");
            }
          }
        }
        else
        {
          this.showNotification("warning", "Select Month/Year");
        }
      }
      else
      {
        this.weeklyTimeTable = [];
        this.completeTimeTableClicked= false;
      }
    }
    catch(e:any)
    {
      this.showNotification("info", e);
      this.weeklyTimeTable = [];
      this.searchClicked= false;
    }
  }

  checkIsAllocationDone(gradeId : number, sectionUUID : string)
  {
    let isNotDoneFound : any[] = this.weeklyTimeTableData.filter(cWTT => {
      if(cWTT.gradeSection?.grade?.id === gradeId && cWTT.gradeSection?.section?.uuid === sectionUUID)
      {
        let p=1;
        for(;p<=this.maxPeriod;p++)
        {
          if(cWTT["period-"+p]?.allocatedTo?.uuid == null && cWTT["period-"+p]?.periodNumber > 0)
          {
            return(cWTT); 
          }
        }
      }
    });
    if(isNotDoneFound.length > 0)
    {
      this.weeklyTimeTableData.forEach(function(cWTT) {
        if (cWTT.gradeSection?.grade?.id === gradeId && cWTT.gradeSection?.section?.uuid === sectionUUID) {
          cWTT.isDone = 0;
        }
      });
    }
    else
    {
      this.weeklyTimeTableData.forEach(function(cWTT) {
        if (cWTT.gradeSection?.grade?.id === gradeId && cWTT.gradeSection?.section?.uuid === sectionUUID) {
          cWTT.isDone = 1;
        }
      });
    }
  }

  generateClassSectionWiseJSON()
  {
    if(this.completeWeeklyTimeTable.length > 0)
    {
      this.weeklyTimeTableData = [];
      let k =0;
      let isDone : number = 0;
      let cWTTs : WeeklyTimetableTemplate[] = this.completeWeeklyTimeTable;
      let gradeSection = {"grade" : cWTTs[0].grade, "section" : cWTTs[0].section};
      this.weeklyTimeTableData[0] = [];
      this.weeklyTimeTableData[0]["gradeSection"] = gradeSection;
 //Get Total Periods
      let totalPeriods : number = cWTTs.filter(cWTT => {
        return (cWTT.grade.id === gradeSection.grade.id && cWTT.section.uuid === gradeSection.section.uuid)
      }).length;
      totalPeriods = totalPeriods;
      let curPeriod : number = 1;
      let curDayNumber : number = 1;
      let i = 0;
      for( ;i<cWTTs.length;i++)
      {
        if(cWTTs[i].grade.id != gradeSection.grade.id || cWTTs[i].section.uuid != gradeSection.section.uuid || cWTTs[i].dayNumber != curDayNumber)
        {
  ///Fill All Allocation Done Or Not 
          this.techingScheduleClicked[k] = false;
          this.weeklyTimeTableData[k]["isDone"] = isDone;
          this.weeklyTimeTableData[k]["isApplied"] = cWTTs[i-1].isApplied;
          this.weeklyTimeTableData[k]["appliedBy"] = cWTTs[i-1].appliedBy;
          this.weeklyTimeTableData[k]["appliedOn"] = cWTTs[i-1].appliedOn;
          this.weeklyTimeTableData[k]["dayNumber"] = cWTTs[i-1].dayNumber;
          curDayNumber = cWTTs[i].dayNumber;
  /////check isDone for all days in grade/section
          if(cWTTs[i].grade.id != gradeSection.grade.id || cWTTs[i].section.uuid != gradeSection.section.uuid)
          {
            this.checkIsAllocationDone(gradeSection.grade?.id, gradeSection.section?.uuid);
          }
  /////////
          gradeSection = {"grade" : cWTTs[i].grade, "section" : cWTTs[i].section};
          k++;
          isDone = 0;
          this.weeklyTimeTableData[k] = [];
          this.weeklyTimeTableData[k]["gradeSection"] = gradeSection;
//Get Total Periods
          totalPeriods = cWTTs.filter(cWTT => {
            return (cWTT.grade.id === gradeSection.grade.id && cWTT.section.uuid === gradeSection.section.uuid)
          }).length;
          totalPeriods = totalPeriods;
          curPeriod = 1;
        }
        if(cWTTs[i].grade.id === gradeSection.grade.id && cWTTs[i].section.uuid === gradeSection.section.uuid && cWTTs[i].dayNumber === curDayNumber)
        {
          if(curPeriod <= totalPeriods)
          {
            let colName = "period-" + curPeriod;
  ///set duplicate backgroud color attribute in weekly timetable json
            cWTTs[i]["duplicateAllotColumnColor"] = {background : 'bg-white', text : 'text-dark'};
            cWTTs[i]["isDeleted"] = 0;
            this.weeklyTimeTableData[k][colName] = cWTTs[i];
            curPeriod++;
          }
        }
      }
  ////For Last Row
      if(i == cWTTs.length)
      {
  ///Fill All Allocation Done Or Not 
          this.techingScheduleClicked[k] = false;
          this.weeklyTimeTableData[k]["isDone"] = isDone;
          this.weeklyTimeTableData[k]["isApplied"] = cWTTs[i-1].isApplied;
          this.weeklyTimeTableData[k]["appliedBy"] = cWTTs[i-1].appliedBy;
          this.weeklyTimeTableData[k]["appliedOn"] = cWTTs[i-1].appliedOn;
          this.weeklyTimeTableData[k]["dayNumber"] = cWTTs[i-1].dayNumber;
          /////check isDone for all days in grade/section
          this.checkIsAllocationDone(gradeSection.grade?.id, gradeSection.section?.uuid);
      }
  ////Last Row End
    }
    else
    {
      this.weeklyTimeTableData = [];
    }
  }
  
  allocateTeacher(rowNumber : number, columnNumber : number, data : any)
  {
    if(data != null && (this.userTypeCode == 'SCHPL' || this.userTypeCode == 'SCHVP') && columnNumber >= 0 && rowNumber >= 0)
    {
      let params = {
        "weeklyTimeTable" : data,
        "weeklyTimeTableRow" : this.weeklyTimeTableData[rowNumber],
        "maxPriods" : this.maxPeriod,
        "columnNumber" : columnNumber,
        "rowNumber" : rowNumber
      }
      const dialogRef = this.modalService.open(WeeklyTimetableAddComponent, 
      { 
        size: 'lg', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }
  }

  async createTeachingSchedule(rowNumber, weeklyTimeTable : any)
  {
    let gradeId : number = weeklyTimeTable.gradeSection.grade.id;
    let sectionUUID : string = weeklyTimeTable.gradeSection.section.uuid;
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to Apply Time Table For ' + weeklyTimeTable.gradeSection.grade.name + '-' + weeklyTimeTable.gradeSection.section.name + ' ?',
      icon: 'info',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          let uuids = "";
          let isAllocated : number = 1;
          let allocationUUIDs: any[] = this.weeklyTimeTableData.filter(cWTT => {
            return(cWTT.gradeSection?.grade?.id === gradeId && cWTT.gradeSection?.section?.uuid === sectionUUID)
          });

          for(let a=0;a<allocationUUIDs.length;a++)
          {
            for(let i=1;i<=this.maxPeriod;i++)
            {
              if(allocationUUIDs[a]["period-" + i])
              {
                if(allocationUUIDs[a]["period-" + i].periodNumber > 0)
                {
                  if(allocationUUIDs[a]["period-" + i].allocatedTo.uuid == null)
                  {
                    isAllocated = 0;
                  }
                  else
                  {
                    if(uuids == "")
                    {
                      uuids = allocationUUIDs[a]["period-" + i].uuid;
                    }
                    else
                    {
                      uuids = uuids + "," + allocationUUIDs[a]["period-" + i].uuid;
                    }
                  }
                }
              }
            }
          }
          let monthYear : string[] = (this.gradeScheduleSettingForm.get("monthYear").value).split("-");
          if(uuids != "" && isAllocated == 1)
          {
            let teachingScheduleJSON = {
              uuid : uuids,
              monthNumber : monthYear[1],
              year : monthYear[0],
              school : {uuid : this.schoolUUID},
              academicYear : {uuid : this.academicYearForm.get("academicYear").value}
            }
            this.techingScheduleClicked[rowNumber] = true;
            this.showNotification("info", "Please wait...");
            let response = await this.teachingScheduleService.createTeachingSchedule(teachingScheduleJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Teaching Schedule Created For " + weeklyTimeTable.gradeSection.grade.name + '-' + weeklyTimeTable.gradeSection.section.name);
      /////////        
              let appliedByUser : any = {"uuid" : this.commonSharedService.loginUser.uuid, "name" : this.commonSharedService.loginUser.fullName};
              this.weeklyTimeTableData.forEach(function(aWTT) {
                if (aWTT.gradeSection?.grade?.id === gradeId && aWTT.gradeSection?.section?.uuid === sectionUUID) {
                  aWTT.isApplied = 1;
                  aWTT.appliedBy = appliedByUser;
                  aWTT.appliedOn = new Date();
                }
              });
              this.techingScheduleClicked[rowNumber] = false;
      /////////
            }
          }
          else
          {
            this.techingScheduleClicked[rowNumber] = false;
            this.showNotification("warning", "Teacher Allocation Not Completed");
          }
        }
        catch(e)
        {
          this.techingScheduleClicked[rowNumber] = false;
          this.showNotification("error", "User Status Not Updated");
        }
      }
    });  
  }

  DeleteAllotment(rowNumber : number, columnNumber : number, uuid : string)
  {
    if(uuid != "")
    {
      this.weeklyTimeTableData[rowNumber]["period-" + columnNumber]["isDeleted"] = 1;
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete the allotment?',
        icon: 'warning',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true 
      }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
        } 
        else 
        {        
          try
          {
            this.showNotification("info", "Please wait...");
            let tempJSON = {"uuid" : uuid};
            let response = await this.weeklyTimeTableService.deleteWeeklyTimeTable(tempJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.showNotification("success", "Teacher Allocation Deleted");
                this.weeklyTimeTableData[rowNumber]["period-" + columnNumber].subject.uuid = null;
                this.weeklyTimeTableData[rowNumber]["period-" + columnNumber].subject.name = null;
                this.weeklyTimeTableData[rowNumber]["period-" + columnNumber].allocatedTo.uuid = null;
                this.weeklyTimeTableData[rowNumber]["period-" + columnNumber].allocatedTo.name = null;
                this.weeklyTimeTableData[rowNumber]["period-" + columnNumber].isDeleted = 0;
                this.weeklyTimeTableData[rowNumber]["isDone"] = 0;
                this.weeklyTimeTableData[rowNumber]["period-" + columnNumber]["duplicateAllotColumnColor"] = {background : 'bg-white', text : 'text-dark'};
        /////check isDone for all days in grade/section       
                let gradeId= this.weeklyTimeTableData[rowNumber].gradeSection?.grade?.id;
                let sectoionUUID= this.weeklyTimeTableData[rowNumber].gradeSection?.section?.uuid;
                this.checkIsAllocationDone(gradeId, sectoionUUID);
            }
          }
          catch(e)
          {
            this.showNotification("error", "Teacher Allocation Not Updated");
          }
        }
      });   
    }
    else
    {
      this.showNotification("warning", "Allotment Not Found");
    }
  }
}
