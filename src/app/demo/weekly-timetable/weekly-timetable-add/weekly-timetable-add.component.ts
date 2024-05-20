import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { Router } from '@angular/router';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { WeeklyTimeTableService } from 'src/app/theme/shared/service/weekly-timetable.service'; 

// third party
import Swal from 'sweetalert2';
import { User } from 'src/app/theme/shared/model/user';
import { WeeklyTimetableTemplate } from 'src/app/theme/shared/model/weeklyTimetableTemplate';
import { UserAssignSubject } from 'src/app/theme/shared/model/user-assign-subject';
import { SchoolGradeSection } from 'src/app/theme/shared/model/school-grade-section';

@Component({
  selector: 'app-weekly-timetable-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './weekly-timetable-add.component.html',
  styleUrls: ['./weekly-timetable-add.component.scss']
})
export class WeeklyTimetableAddComponent {
  @Input() public modalParams;
  subjects : SyllabusGradeSubject[];
  teachers : User[];
  teachingUsers : User[]
  addWeeklyTimeTableForm: FormGroup;
  subjectForm: FormGroup;
  teacherForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  teacherClicked : boolean;
  subjectClicked : boolean;
  weeklyTimeTable : WeeklyTimetableTemplate;
  weeklyTimeTableRow : any;
  maxPeriods : number;
  columnNumber : number = -1;
  rowNumber : number = -1;

  constructor(
    private router : Router,
    private commonService: CommonService, 
    private userService: UserService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    public weeklyTimeTableService : WeeklyTimeTableService) 
  {
  }
  
  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;
    this.teachers = [];
    this.teachingUsers = [];
    this.subjects = [];
    this.addWeeklyTimeTableForm = this.formbuilder.group({
      uuid:['', Validators.required],
      dayNumber: ['', Validators.required],
      grade: this.formbuilder.group({ 'id': ['', Validators.required] }),
      section: this.formbuilder.group({ 'uuid': ['', Validators.required] }),
      gradeSection: ['',[Validators.required]],
      period : ['', Validators.required],
      subject: this.formbuilder.group({ 'uuid': [''] }),
      allocatedTo: this.formbuilder.group({ 'uuid': [''] })
    });

    this.subjectForm = this.formbuilder.group({
      'subject': ['', [Validators.required]]
    });

    this.teacherForm = this.formbuilder.group({
      'allocateTo': ['', [Validators.required]]
    });

  //Get Modal Params
    this.addWeeklyTimeTableForm.get("gradeSection").disable();
    this.addWeeklyTimeTableForm.get("period").disable();
    if(parseInt(this.modalParams.rowNumber) >= 0)
    {
      this.rowNumber = this.modalParams.rowNumber
    }
    if(parseInt(this.modalParams.columnNumber) >= 0)
    {
      this.columnNumber = this.modalParams.columnNumber
    }

    if(this.modalParams.maxPriods)
    {
      this.maxPeriods = this.modalParams.maxPriods;
    }
    if(this.modalParams.weeklyTimeTableRow)
    {
      this.weeklyTimeTableRow = this.modalParams.weeklyTimeTableRow;
    }
    if(this.modalParams.weeklyTimeTableRow && this.modalParams.weeklyTimeTable)
    {
      this.weeklyTimeTable = this.modalParams.weeklyTimeTable;
      this.addWeeklyTimeTableForm.get("uuid").setValue(this.weeklyTimeTable.uuid);
      this.addWeeklyTimeTableForm.get("dayNumber").setValue(this.weeklyTimeTableRow.dayNumber);
      this.addWeeklyTimeTableForm.controls['grade'].get("id").setValue(this.weeklyTimeTable.grade.id);
      this.addWeeklyTimeTableForm.controls['section'].get("uuid").setValue(this.weeklyTimeTable.section.uuid);
      this.addWeeklyTimeTableForm.get("gradeSection").setValue(this.weeklyTimeTable.grade.name + '-' + this.weeklyTimeTable.section.name);
      this.addWeeklyTimeTableForm.get("period").setValue('Period-' + this.weeklyTimeTable.periodNumber);
      this.getTeachers(this.commonSharedService.currentAcademicYear.uuid, this.commonSharedService.loginUser.schools[0]?.uuid, this.weeklyTimeTable?.grade?.id);
      this.getSubjects(this.commonSharedService.loginUser.schools[0]?.syllabus.id, this.weeklyTimeTable?.grade?.id);
    }   
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSubjects(syllabusId : number, gradeId : number) 
  {
    if(syllabusId > 0 && gradeId > 0)
    {
      try
      {
        this.subjectClicked = true;
        let response = await this.commonService.getGradeSubjects(syllabusId, gradeId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.subjects = response.data.gradeSubjects;
          this.subjectClicked = false;
          this.subjects.unshift({uuid : "", name : "Select Subject"});
        }
      }
      catch(e : any)
      {
        this.subjects = [];
        this.subjects.unshift({uuid : "", name : "Select Subject"});
        this.subjectClicked = false;
      }
    }
  }

  async getTeachers(academicYearUUID : string, schoolUUID : string, gradeId : number) 
  {
    if(academicYearUUID != "" && schoolUUID != "" && gradeId > 0)
    {
      try
      {
        this.teacherClicked = true;
        let response = await this.userService.getCompleteTeachGrades(academicYearUUID, schoolUUID, gradeId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.teachingUsers = response.data.teachingUsers;
          this.teacherClicked = false;
        }
      }
      catch(e : any)
      {
        this.teachingUsers = [];
        this.teachers = [];
        this.teacherClicked = false;
      }
    }
  }

  filterTeachers(subjectUUID : string)
  {
    if(subjectUUID != "" && this.weeklyTimeTable != null)
    {
      this.teacherClicked = true;
      let sectionUUID = this.weeklyTimeTable?.section.uuid;
      this.teacherForm.get("allocateTo").setValue("");
      this.teachers = [];
      this.teacherForm.get("allocateTo").setValue("");
      for(let i=0;i<this.teachingUsers.length;i++)
      {
        let userAssignSubjects : UserAssignSubject[] = [];
        userAssignSubjects = this.teachingUsers[i].userAssignSubjects;
        for(let k=0; k<userAssignSubjects.length;k++)
        {
          if(userAssignSubjects[k].assignedSubject.uuid == subjectUUID)
          {
            let sections : SchoolGradeSection[] = [];
            sections = userAssignSubjects[k].subjectAllocatedSections;
            for(let l=0; l<sections.length;l++)
            {
              if(sections[l].uuid == sectionUUID)
              {
                this.teachers.push(this.teachingUsers[i]);
              }
            }
          }
        }
      } 
      this.teachers.unshift({uuid : "", name : "Select Teacher"});
      this.teacherClicked =false;     
    }
    else
    {
      this.teachers = [];
      this.teachers.unshift({uuid : "", name : "Select Teacher"});
      this.teacherClicked =false;
    }
  }

  isSubjectAllocated(subjectUUID : string)
  {
    let res : string = "";
    for(let i=1;i<=this.maxPeriods;i++)
    {
      if(this.weeklyTimeTableRow["period-" + i].subject?.uuid != null)
      {
        if(this.weeklyTimeTableRow["period-" + i].subject?.uuid == subjectUUID)
        {
          res = this.weeklyTimeTableRow["period-" + i].uuid;
          break;
        }
      }
    }
    return res;
  }

  async saveWeeklyTimeTable()
  {
    try
    {
      this.addWeeklyTimeTableForm.get("gradeSection").enable();
      this.addWeeklyTimeTableForm.get("period").enable();
      if(!this.saveClicked && this.addWeeklyTimeTableForm.valid && this.subjectForm.valid && this.teacherForm.valid)
      {
//Check For Duplicate Subject Allocation
        // let dupliateSubjectUUId = this.isSubjectAllocated(this.subjectForm.get("subject").value);
        // if(dupliateSubjectUUId == "")
        // {
          this.addWeeklyTimeTableForm.get("gradeSection").disable();
          this.addWeeklyTimeTableForm.get("period").disable();
          this.saveClicked = true;
          this.isValidForm = true;
          this.addWeeklyTimeTableForm.controls["subject"].get("uuid").setValue(this.subjectForm.get("subject").value);
          this.addWeeklyTimeTableForm.controls["allocatedTo"].get("uuid").setValue(this.teacherForm.get("allocateTo").value);
          let response = await this.weeklyTimeTableService.updateWeeklyTimeTable(this.addWeeklyTimeTableForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Teacher Allocated");
            this.saveClicked = false;
            this.commonSharedService.weeklyTimeTableListObject.next({result : "success", 
              data : response.data.weeklyTimeTable,
              rowNumber : this.rowNumber,
              columnNumber : this.columnNumber 
            })
          }
        // }
        // else
        // {
        //   this.showNotification("error", "Subject Already Allocated");
        //   this.saveClicked = false;
        //   this.commonSharedService.weeklyTimeTableListObject.next({result : "error", 
        //     subjectUUID : dupliateSubjectUUId,
        //     rowNumber : this.rowNumber,
        //     columnNumber : this.columnNumber 
        //   })
        // }
      }
      else
      {
        this.isValidForm = false;
      }
    }
    catch(e : any)
    {
      let result : any = e;
      this.showNotification("error", result?.message);
      this.saveClicked = false;
      this.commonSharedService.weeklyTimeTableListObject.next({result : "error", 
        allocatedUUID : result?.data?.uuid,
        rowNumber : this.rowNumber,
        columnNumber : this.columnNumber 
      })
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}


