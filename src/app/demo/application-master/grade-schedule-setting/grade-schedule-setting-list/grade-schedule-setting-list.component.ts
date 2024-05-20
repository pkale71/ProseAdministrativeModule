import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeScheduleSetting } from 'src/app/theme/shared/model/gradeScheduleSetting';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GradeScheduleSettingService } from 'src/app/theme/shared/service/grade-schedule-setting.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { GradeScheduleSettingAddComponent } from '../grade-schedule-setting-add/grade-schedule-setting-add.component';
import { GradeScheduleSettingEditComponent } from '../grade-schedule-setting-edit/grade-schedule-setting-edit.component';
import { School } from 'src/app/theme/shared/model/school';
import { SchoolService } from 'src/app/theme/shared/service/school.service';
import { Convert12HrsTimeFormatPipe } from 'src/app/theme/shared/custom-pipe/convert12-hrs-time-format.pipe';

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grade-schedule-setting-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule, Convert12HrsTimeFormatPipe],
  templateUrl: './grade-schedule-setting-list.component.html',
  styleUrls: ['./grade-schedule-setting-list.component.scss']
})
export class GradeScheduleSettingListComponent {
  gradeScheduleSettings : GradeScheduleSetting[];
  masterGradeScheduleSettings : GradeScheduleSetting[];
  academicYears : AcademicYear[];
  schools : School[];
  academicYearForm : FormGroup;
  schoolForm : FormGroup;
  searchClicked : boolean;
  userRole : string;
  userTypeCode : string;
  
  constructor(private router : Router,
    private formbuilder : FormBuilder,
    private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private gradeScheduleSettingService: GradeScheduleSettingService, 
    private commonService : CommonService,
    private schoolService : SchoolService,
    public commonSharedService : CommonSharedService)
  {
    this.masterGradeScheduleSettings = [];
    this.gradeScheduleSettings = [];
    this.academicYears = [];
    this.userRole = this.commonSharedService.loginUser?.role?.name;
    this.userTypeCode = this.commonSharedService.loginUser?.userType?.code;
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.academicYearForm = this.formbuilder.group({
      'academicYear': ['']
    });

    this.schoolForm = this.formbuilder.group({
      'school': ['']
    });

    if(this.userRole == "Head")
    {
      this.getSchools();
      this.getAcademicYears();
    }
    else
    {
      this.schools = this.commonSharedService.loginUser?.schools;
      this.schoolForm.get('school').setValue(this.schools[0].uuid);
      this.getAcademicYears();
    }
  }

  public gradeScheduleSettingAddResult:any = this.commonSharedService.gradeScheduleSettingListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.academicYearForm.get('academicYear').setValue(res.academicYearUUID);
      this.schoolForm.get('school').setValue(res.schoolUUID);
      this.getGradeScheduleSettings();
    }
  })

  async getSchools() 
  {
    let response = await this.schoolService.getSchools().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.schools = response.data.schools;
      let tempSchool : School = {"uuid" : "", "name" : "Select School"};
      this.schools.unshift(tempSchool);
    }
  }

  async getAcademicYears() 
  {
    let response = await this.commonService.getAcademicYears().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicYears = response.data.academicYears;
  ///set current academicYear
        for(let i=0;i<this.academicYears.length;i++)
        {
          if(this.academicYears[i].isCurrent == 1)
          {
            this.academicYearForm.get("academicYear").setValue(this.academicYears[i].uuid);
            break;
          }
        }
        if(this.userRole == "School")
        {
          this.getGradeScheduleSettings();
        }
      }
  }

  async getGradeScheduleSettings() 
  {
    let academicYearUUID = this.academicYearForm.get('academicYear').value;
    let schoolUUID = this.schoolForm.get('school').value;
    if(schoolUUID != "" && academicYearUUID != "")
    {
      this.searchClicked = true;
      let response = await this.gradeScheduleSettingService.getGradeScheduleSettings(academicYearUUID, schoolUUID, 0).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblGradeScheduleSetting').DataTable().clear().destroy();
        this.masterGradeScheduleSettings = response.data.gradeScheduleSettings;
        this.gradeScheduleSettings = this.masterGradeScheduleSettings;
        setTimeout(function(){
          $('#tblGradeScheduleSetting').DataTable();
        },800);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.masterGradeScheduleSettings = [];
        this.gradeScheduleSettings = [];
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
    }
    else
    {
      this.masterGradeScheduleSettings = [];
      this.gradeScheduleSettings = [];
      this.searchClicked = false;
      this.showNotification("warning", "Select Academic Year And School");
      this.modalService.dismissAll();
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  addGradeScheduleSetting()
  {
    let params = {
      "schoolUUID" : this.commonSharedService.loginUser?.schools[0].uuid
    }
    const dialogRef = this.modalService.open(GradeScheduleSettingAddComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  editGradeScheduleSetting(gradeScheduleSetting : GradeScheduleSetting) 
  {
    let params = {
      "gradeScheduleSetting" : gradeScheduleSetting
    }
    const dialogRef = this.modalService.open(GradeScheduleSettingEditComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  deleteGradeScheduleSetting(uuid)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete grade schedule setting?',
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
        let tempJSON = { "uuid" : uuid };
        try
        {
          let response = await this.gradeScheduleSettingService.deleteGradeScheduleSetting(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Grade Schedule Setting Deleted.");
            this.commonSharedService.gradeScheduleSettingListObject.next({
              schoolUUID : this.commonSharedService.loginUser?.schools[0].uuid,
              academicYearUUID : this.academicYearForm.get("academicYear").value,
              result : "success"
            });
          }
        }
        catch(e)
        {
          this.showNotification("error", "Grade Schedule Setting Not Deleted.");
        }
      }
    });
  }
}
