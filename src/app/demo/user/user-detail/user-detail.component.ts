import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { User } from 'src/app/theme/shared/model/user';

// third party
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserAssignGradeComponent } from '../user-assign-grade/user-assign-grade.component';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
import { UserAssignGradeSectionComponent } from '../user-assign-grade-section/user-assign-grade-section.component';
import { SyllabusGradeSubject } from 'src/app/theme/shared/model/syllabus-grade-subject';
import { DataTablesModule } from 'angular-datatables';
import { UserAssignGradeSubjectComponent } from '../user-assign-grade-subject/user-assign-grade-subject.component';
import { Grade } from 'src/app/theme/shared/model/grade';
import { School } from 'src/app/theme/shared/model/school';
import { TeachingScheduleService } from 'src/app/theme/shared/service/teaching-schedule.service';
import { TeachingScheduleMaster } from 'src/app/theme/shared/model/teachingScheduleMaster';
import { Convert12HrsTimeFormatPipe } from 'src/app/theme/shared/custom-pipe/convert12-hrs-time-format.pipe';
import { TeachingScheduleDetail } from 'src/app/theme/shared/model/teachingScheduleDetail';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule, Convert12HrsTimeFormatPipe],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  user : User;
  academicYears : AcademicYear[];
  assignedGrades : any[];
  assignedGradeSubjects : Grade[];
  schools : School[];
  assignedGradeSections : SyllabusGradeSubject[];
  academicYearForm : FormGroup;
  academicYearForm1 : FormGroup;
  academicYearForm2 : FormGroup;
  addEngagedForm : FormGroup;
  schoolForm1 : FormGroup;
  schoolForm2 : FormGroup;
  engagedUsersForm : FormGroup[];
  searchClicked : boolean;
  searchClicked1 : boolean;
  searchClicked2 : boolean;
  isCurrentAcademicYear : boolean;
  isCurrentAcademicYear1 : boolean;
  isCurrentAcademicYear2 : boolean;
  searchTeachingScheduleClicked : boolean;
  engagedUsers : User[];
  teachingScheduleMasters : TeachingScheduleMaster[];
  teachingScheduleDetails : TeachingScheduleDetail[];
  minDate : any;
  maxDate : any;
  todayDate : Date;
  selDate : Date;
  loginUser : User;
  isValidForm : boolean = true;
  userTypeCode : string = "";
  engageSaveClicked : boolean[] = [];
  selDateIndex : number = 0;
  isPresent : boolean = false;

  constructor(private notifier: NotifierService, 
    private commonService : CommonService,
    private modalService: NgbModal,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService, 
    public commonSharedService : CommonSharedService,
    private location : Location, 
    private teachingScheduleService : TeachingScheduleService)
    {
      this.user = this.activatedRoute.snapshot.data['user'].data.user;
      this.schools = JSON.parse(JSON.stringify(this.user.schools));
      this.loginUser = this.commonSharedService.loginUser;
      this.userTypeCode = this.loginUser.userType.code;
      //////////////////
      this.todayDate = new Date();
      this.todayDate = new Date(this.todayDate.setHours(5,30,0,0));

      let startDate : any = (this.commonSharedService.currentAcademicYear.startDate).split("-");
      this.minDate = {day : parseInt(startDate[2]), month: parseInt(startDate[1]), year: parseInt(startDate[0])};
      let endDate : any = (this.commonSharedService.currentAcademicYear.endDate).split("-");
      this.maxDate = {day : parseInt(endDate[2]), month: parseInt(endDate[1]), year: parseInt(endDate[0])};
    }

    ngOnInit() 
    {
      this.isCurrentAcademicYear = false;
      this.isCurrentAcademicYear1 = false;
      this.isCurrentAcademicYear2 = false;
      this.searchTeachingScheduleClicked = false;
      this.searchClicked = false;
      this.searchClicked1 = false;
      this.searchClicked2 = false;
      this.engagedUsersForm = [];
      this.academicYears = [];
      this.assignedGrades = [];
      this.assignedGradeSubjects = [];
      this.assignedGradeSections = [];
      this.teachingScheduleMasters = [];
      this.teachingScheduleDetails = [];

      this.addEngagedForm = this.formbuilder.group({
        fromDate: ['', Validators.required],
        toDate : ['', Validators.required]
      });

      this.academicYearForm = this.formbuilder.group({
        academicYear: ['']
      });

      this.academicYearForm1 = this.formbuilder.group({
        academicYear: ['']
      });

      this.academicYearForm2 = this.formbuilder.group({
        academicYear: ['']
      });

      this.schoolForm1 = this.formbuilder.group({
        school: ['']
      });

      this.schoolForm2 = this.formbuilder.group({
        school: ['']
      });
      
      if(this.schools.length > 0)
      {
        this.schoolForm1.get("school").setValue(this.schools[0].uuid);
        this.schoolForm2.get("school").setValue(this.schools[0].uuid);
      }
      
      this.getAcademicYears();
      if(this.user?.userType?.code == 'SCHCD' || this.user?.userType?.code == 'SUBHD' || this.user?.userType?.code == 'TECHR')
      {        
        this.getEngagedUsers();
      }
    }

    showNotification(type: string, message: string): void 
    {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
    }

    public userAssignedGradeResult:any = this.commonSharedService.userAssignedGradeListObject.subscribe(res =>{
      if(res.result == "success")
      {
        let schoolUUID = res.schoolUUID;
        let academicYearUUID = res.academicYearUUID;
        let userUUID = res.userUUID;
        this.getUserAssignedGrades(academicYearUUID, userUUID, schoolUUID);
      }
    })

    public userAssignedGradeSubjectResult:any = this.commonSharedService.userAssignedGradeSubjectListObject.subscribe(res =>{
      if(res.result == "success")
      {
        let schoolUUID = res.schoolUUID;
        let academicYearUUID = res.academicYearUUID;
        let userUUID = res.userUUID;
        this.getUserAssignedGradeSubjects(academicYearUUID, userUUID, schoolUUID);
      }
    })

    public userAssignedGradeSectionResult:any = this.commonSharedService.userAssignedGradeSectionListObject.subscribe(res =>{
      if(res.result == "success")
      {
        let academicYearUUID = res.academicYearUUID;
        let schoolUUID = res.schoolUUID;
        let userUUID = res.userUUID;
        this.getUserAssignedGradeSections(academicYearUUID, userUUID, schoolUUID);
      }
    })

    checkCurrentAcademicYear(academicYearUUID : string, checkFor : string)
    {
      if(checkFor == "Grade")
      {
        this.isCurrentAcademicYear = false;
      }
      else if(checkFor == "Subject")
      {
        this.isCurrentAcademicYear2 = false;
      }
      else if(checkFor == "Sections")
      {
        this.isCurrentAcademicYear1 = false;
      }
      let tempAcademicYear : AcademicYear[] = this.academicYears.filter(academicYear => academicYear.uuid == academicYearUUID);
      if(tempAcademicYear.length > 0)
      {
        if(tempAcademicYear[0].isCurrent == 1)
        {
          if(checkFor == "Grade")
          {
            this.isCurrentAcademicYear = true;
          }
          else if(checkFor == "Subject")
          {
            this.isCurrentAcademicYear2 = true;
          }
          else if(checkFor == "Sections")
          {
            this.isCurrentAcademicYear1 = true;
          }
        }
      }
    }

    async getUserAssignedGrades(academicYearUUID : string, userUUID : string, schoolUUID : string) 
    {
      if(userUUID != "" && academicYearUUID != "")
      {
        this.assignedGrades = [];
        this.searchClicked = true;
        try
        {
          let response = await this.userService.getAssignedGrades(userUUID, academicYearUUID, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            $('#tblAssignedGrade').DataTable().clear().destroy();
            this.assignedGrades = response.data.assignedGrades;
            setTimeout(function(){
              $('#tblAssignedGrade').DataTable();
            },500);
            this.searchClicked = false;
            this.checkCurrentAcademicYear(academicYearUUID, "Grade");
            this.modalService.dismissAll();
          }
        }
        catch(e)
        {
          $('#tblAssignedGrade').DataTable().clear().destroy();
          this.searchClicked = false;
          setTimeout(function(){
            $('#tblAssignedGrade').DataTable();
          },500);
        }
      }
      else
      {
        this.showNotification("info", "Select Academic Year");
      }
    }

    async getUserAssignedGradeSubjects(academicYearUUID : string, userUUID : string, schoolUUID : string) 
    {
      if(userUUID != "" && academicYearUUID != "")
      {
        this.assignedGradeSubjects = [];
        this.searchClicked2 = true;
        try
        {
          let response = await this.userService.getAssignedGradeSubjects(userUUID, academicYearUUID, schoolUUID).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            $('#tblAssignedGradeSubject').DataTable().clear().destroy();
            this.assignedGradeSubjects = response.data.assignedSubjects;
            setTimeout(function(){
              $('#tblAssignedGradeSubject').DataTable();
            },500);
            this.searchClicked2 = false;
            this.checkCurrentAcademicYear(academicYearUUID, "Subject");
            this.modalService.dismissAll();
          }
        }
        catch(e)
        {
          $('#tblAssignedGradeSubject').DataTable().clear().destroy();
          this.searchClicked2 = false;
          setTimeout(function(){
            $('#tblAssignedGradeSubject').DataTable();
          },500);
        }
      }
      else
      {
        this.showNotification("info", "Select Academic Year");
      }
    }

    async getUserAssignedGradeSections(academicYearUUID : string, userUUID : string, schoolUUID : string) 
    {
      if(userUUID != "" && academicYearUUID != "")
      {
        this.assignedGradeSections = [];
        this.searchClicked1 = true;
        try
        {
          let response = await this.userService.getAssignedGradeSections(userUUID, academicYearUUID, schoolUUID, 0).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            $('#tblAssignedGradeSection').DataTable().clear().destroy();
            this.assignedGradeSections = response.data.assignedSections;
            setTimeout(function(){
              $('#tblAssignedGradeSection').DataTable();
            },500);
            this.searchClicked1 = false;
            this.checkCurrentAcademicYear(academicYearUUID, "Sections");
            this.modalService.dismissAll();
          }
        }
        catch(e)
        {
          $('#tblAssignedGradeSection').DataTable().clear().destroy();
          this.searchClicked1 = false;
          setTimeout(function(){
            $('#tblAssignedGradeSection').DataTable();
          },500);
        }
      }
      else
      {
        this.showNotification("info", "Select Academic Year");
      }
    }

    async getAcademicYears() 
    {
      let response = await this.commonService.getAcademicYears().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicYears = response.data.academicYears;
        for(let i=0;i<this.academicYears.length;i++)
        {
          if(this.academicYears[i].isCurrent == 1)
          {
            this.academicYearForm.get("academicYear").setValue(this.academicYears[i].uuid);
            this.academicYearForm1.get("academicYear").setValue(this.academicYears[i].uuid);
            this.academicYearForm2.get("academicYear").setValue(this.academicYears[i].uuid);
            break;
          }
        }
////Show Assigned Grades
        let academicYearUUID = this.academicYearForm.get("academicYear").value;
        let schoolUUID1 = this.schoolForm1.get("school").value;
        let schoolUUID2 = this.schoolForm2.get("school").value;
        if(this.user.userType.code == "SCHCD")
        {
          this.getUserAssignedGrades(academicYearUUID, this.user.uuid, schoolUUID1);
        }
        else if(this.user.userType.code == "SUBHD")
        {
          this.getUserAssignedGradeSubjects(academicYearUUID, this.user.uuid, schoolUUID1);
        }
        this.getUserAssignedGradeSections(academicYearUUID, this.user.uuid, schoolUUID2);
      }
    }

    addAssignGrades()
    {
      let params = {
        "schoolUUID" : this.user.schools[0].uuid,
        "userUUID" : this.user.uuid
      }
      const dialogRef = this.modalService.open(UserAssignGradeComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    addAssignGradeSubjects()
    {
      let params = {
        "schoolUUID" : this.user.schools[0].uuid,
        "userUUID" : this.user.uuid
      }
      const dialogRef = this.modalService.open(UserAssignGradeSubjectComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    addAssignGradeSections()
    {
      let params = {
        "schoolUUID" : this.user.schools[0]?.uuid,
        "userUUID" : this.user.uuid
      }
      const dialogRef = this.modalService.open(UserAssignGradeSectionComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = params;
    }

    deleteAssignedGrade(uuid : string, name : string)
    {
      let schoolUUID = this.schoolForm1.get('school').value;
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete assigned grade [' + name + ']?',
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
          let tempJSON = {"uuid" : uuid};
          let response = await this.userService.deleteUserAssignGrade(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Assigned Grade Deleted");
            this.commonSharedService.userAssignedGradeListObject.next({
              academicYearUUID : this.academicYearForm.get("academicYear").value,
              userUUID : this.user.uuid,
              schoolUUID : schoolUUID,
              result : "success"
            });
          }
        }
      });   
    }

    deleteAssignedSubject(uuid : string, gradeName : string, name : string)
    {
      let schoolUUID = this.schoolForm1.get('school').value;
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete assigned subject [' + name + '] for grade [' +gradeName+ ']?',
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
          let tempJSON = {"uuid" : uuid};
          let response = await this.userService.deleteUserAssignGradeSubject(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Assigned Grade Subject Deleted");
            this.commonSharedService.userAssignedGradeSubjectListObject.next({
              academicYearUUID : this.academicYearForm.get("academicYear").value,
              userUUID : this.user.uuid,
              schoolUUID : schoolUUID,
              result : "success"
            });
          }
        }
      });   
    }

    deleteAssignedGradeSection(uuid : string, gradeName : string, name : string)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete assigned section [' + gradeName+" "+name + ']?',
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
          let tempJSON = {"uuid" : uuid};
          let response = await this.userService.deleteUserAssignGradeSection(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Assigned Grade Section Deleted");
            this.commonSharedService.userAssignedGradeSectionListObject.next({
              academicYearUUID : this.academicYearForm.get("academicYear").value,
              schoolUUID : this.schoolForm2.get("school").value,
              userUUID : this.user.uuid,
              result : "success"
            });
          }
        }
      });
    }

    async getEngagedUsers()
    {
      try
      {
        let response = await this.userService.getUsers(this.loginUser.role.id, 0, this.loginUser.schools[0].uuid).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.engagedUsers = response.data.users;
          this.engagedUsers = this.engagedUsers.filter(user=>{return (user.uuid != this.user.uuid)});
          let tempUser : User = { uuid : "", fullName : "Select Teacher" };
          this.engagedUsers.unshift(tempUser);
        }
      }
      catch(e : any)
      {
        this.engagedUsers = [];
        let tempUser : User = { uuid : "", name : "Select Teacher" };
        this.engagedUsers.unshift(tempUser);
      }
    }

    async getTeachingSchedule(academicYearUUID : string, userUUID : string, nav1 : any)
    {
      if(this.addEngagedForm.valid)
      {
        try
        {
          this.isValidForm = true;
          let fromDate = this.addEngagedForm.get("fromDate").value;
          let toDate = this.addEngagedForm.get("toDate").value;
          fromDate = fromDate.year + "-" + fromDate.month + "-" + fromDate.day;
          toDate = toDate.year + "-" + toDate.month + "-" + toDate.day;
          this.searchTeachingScheduleClicked = true;
          let response = await this.teachingScheduleService.getEngagedTeachingSchedules(userUUID, academicYearUUID, fromDate, toDate).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.teachingScheduleMasters = response.data.teachingSchedule;
            this.searchTeachingScheduleClicked = false;
      ///assign first Teaching Schedule Details
            this.showSchedulePeriods(this.teachingScheduleMasters[0], nav1, 1);
          }
        }
        catch(e : any)
        {
          this.engagedUsers = [];
          this.searchTeachingScheduleClicked = false;
        }
      }
      else
      {
        this.isValidForm = false;
      }
    }

    showSchedulePeriods(selTeachingScheduleMaster : TeachingScheduleMaster, nav1 : any, tabId : number)
    {
      this.selDate = new Date(selTeachingScheduleMaster.scheduleDate);
      for(let j=0;j<selTeachingScheduleMaster.teachingScheduleDetails.length;j++)
      {
        this.engagedUsersForm[j] = this.formbuilder.group({
          engagedUser:[selTeachingScheduleMaster.teachingScheduleDetails[j].engagedBy.uuid ? 
          selTeachingScheduleMaster.teachingScheduleDetails[j].engagedBy.uuid : '']
        });
        this.engageSaveClicked[j] = false;
      }
      this.teachingScheduleDetails = selTeachingScheduleMaster.teachingScheduleDetails;
      this.selDateIndex = tabId - 1;
      
      this.isPresent = selTeachingScheduleMaster.isPresent == 1 ? true : false;
      nav1.select(tabId);
    }

    setIsPresent()
    {
      this.isPresent  = this.isPresent ? false : true;
    }

    async saveEngageData(teachingScheduleDetailUUID : string, index : number)
    {
      if(this.engagedUsersForm[index].get("engagedUser").value && this.engagedUsersForm[index].get("engagedUser").value != "")
      {
        try
        {
          this.engageSaveClicked[index] = true;
          let tempJSON = {
            isPresent : this.isPresent ? 1 : 0,
            teachingScheduleDetail :[{
                    uuid : teachingScheduleDetailUUID,
                    engagedBy : {uuid : this.engagedUsersForm[index].get("engagedUser").value}
            }]
          }
          let response = await this.teachingScheduleService.updateEngagedTeachingSchedule(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Engaged Teacher Saved");
            this.teachingScheduleMasters[this.selDateIndex].isPresent = this.isPresent ? 1 : 0;
            this.teachingScheduleMasters[this.selDateIndex].teachingScheduleDetails[index].engagedBy.uuid = this.engagedUsersForm[index].get("engagedUser").value;
            this.engageSaveClicked[index] = false;
          }
        }
        catch(e : any)
        {
          this.showNotification("error", e);
          this.engageSaveClicked[index] = false;
        }
      }
      else
      {
        this.showNotification("warning", "Select Engaged Teacher");
      }
    }

    async deleteEngageData(teachingScheduleDetailUUID : string, index : number)
    {
      if(teachingScheduleDetailUUID != "")
      {
        try
        {
          Swal.fire({
            customClass: {
              container: 'my-swal'
            },
            title: 'Confirmation',
            text: 'Are you sure to release engaged teacher?',
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true
          }).then(async (willDelete) => {
            if (willDelete.dismiss) 
            {
              
            } 
            else 
            {
              this.engageSaveClicked[index] = true;
              this.showNotification("info", "Please wait...");
              let tempJSON = { 
                "uuid" : teachingScheduleDetailUUID
              };
              try
              {
                let response = await this.teachingScheduleService.deleteEngagedTeachingSchedule(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                  this.showNotification("success", "Engaged Teacher Released");
                  this.engagedUsersForm[index].get("engagedUser").setValue("");
                  this.teachingScheduleMasters[this.selDateIndex].teachingScheduleDetails[index].engagedBy.uuid = null;
                  this.teachingScheduleMasters[this.selDateIndex].teachingScheduleDetails[index].engagedBy.name = null;
                  this.teachingScheduleMasters[this.selDateIndex].isPresent = response.data.isPresent;
                  this.engageSaveClicked[index] = false;
                }
              }
              catch(e)
              {
                this.showNotification("error", "Engaged Teacher Not Released");
                this.engageSaveClicked[index] = false;
              }
            }
          });
        }
        catch(e : any)
        {
          this.showNotification("error", "Engaged Teacher Not Released");
          this.engageSaveClicked[index] = false;
        }
      }
    }

    back()
    {
      this.location.back();
    }
}
