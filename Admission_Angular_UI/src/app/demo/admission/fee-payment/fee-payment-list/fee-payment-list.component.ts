import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';
import { UserService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-fee-payment-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './fee-payment-list.component.html',
  styleUrls: ['./fee-payment-list.component.scss']
})
export class FeePaymentListComponent 
{
  schoolForm : FormGroup;
  schoolingProgramForm : FormGroup;
  academicSessionForm : FormGroup;
  studyCenterForm : FormGroup;
  isValidForm : boolean;
  searchClicked : boolean;
  searchClickedSchool : boolean;
  searchClickedSchoolingProgram : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedStudyCenter : boolean;
  schools : any[];
  masterSchools : any[];
  schoolingPrograms : any[];
  academicSessions : any[];
  applicationForms : any[];
  studyCenters : any[];
  userTypeCode : string;
  loginUserUUID : string;
  moduleId : number;

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private userService : UserService,
    private commonService: CommonService, 
    private admissionService : AdmissionService,
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.schools = [];
    this.masterSchools = [];
    this.schoolingPrograms = [];
    this.academicSessions = [];
    this.applicationForms = [];
    this.studyCenters = [];
    this.userTypeCode = this.commonSharedService.loginUser?.userModule?.userType.code;
    this.loginUserUUID = this.commonSharedService.loginUser?.uuid;
    this.moduleId = this.commonSharedService.loginUser?.userModule?.module?.id;
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedSchool = false;
    this.searchClickedSchoolingProgram = false;
    this.searchClickedStudyCenter = false;
    this.isValidForm = true;

    this.schoolForm = this.formbuilder.group({
      school:['', Validators.required]
    });

    this.schoolingProgramForm = this.formbuilder.group({
      schoolingProgram:['', Validators.required]
    });

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['', Validators.required]
    });

    this.studyCenterForm = this.formbuilder.group({
      studyCenter:['']
    });

    this.getAcademicSessions();
    this.getStudyCenters();
////Check Filter Option From Local Storage
    if(localStorage.getItem("academicSessionId") != "" && localStorage.getItem("academicSessionId") != null)
    {
      this.academicSessionForm.get("academicSession").setValue(localStorage.getItem("academicSessionId") || "");
    }
    if(localStorage.getItem("schoolUUID") != "" && localStorage.getItem("schoolUUID") != null)
    {
      this.schoolForm.get("school").setValue(localStorage.getItem("schoolUUID") || "");
      this.getSchools('All', localStorage.getItem("schoolUUID"));
    }
    else
    {
      this.getSchools('All', '');
    }
    if(localStorage.getItem("schoolingProgramId") != "" && localStorage.getItem("schoolingProgramId") != null)
    {
      this.getSchoolSchoolingPrograms(localStorage.getItem("schoolUUID"), 'All', localStorage.getItem("schoolingProgramId") || '');
      this.schoolingProgramForm.get("schoolingProgram").setValue(localStorage.getItem("schoolingProgramId") || "");
    }
    if(localStorage.getItem("studyCenterUUID") != "" && localStorage.getItem("studyCenterUUID") != null)
    {
      this.studyCenterForm.get("studyCenter").setValue(localStorage.getItem("studyCenterUUID") || "");
    } 
/////
    if(localStorage.getItem("academicSessionId") != "" && localStorage.getItem("schoolUUID") != "" && localStorage.getItem("schoolingProgramId") != "")
    {
      this.getApplicationForms();
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSchools(action : string, selSchoolUUID : string) 
  {
    try
    {
        this.searchClickedSchool = true;
        let response : any = "";
        if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
        {
          response = await this.userService.getUserSchoolSchoolingPrograms(this.loginUserUUID, this.moduleId).toPromise();
        }
        else
        {
          response = await this.commonService.getSchools(action, "").toPromise();
        }
        if (response.status_code == 200 && response.message == 'success') 
        {
          if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
          {
            this.masterSchools = response.userSchoolSchoolingPrograms;
            this.schools = this.masterSchools.map(function(item) {
              return { uuid : item.school.uuid, name : item.school.name };
            });
          }
          else
          {
            this.schools = response.schools;
          }
          this.schools.unshift({ uuid : "", name : "Select School" });
          if(selSchoolUUID != "")
          {
            this.getSchoolSchoolingPrograms(selSchoolUUID, 'All', localStorage.getItem("schoolingProgramId"));
          }
          this.searchClickedSchool = false;
        }
        else
        {
            this.schools.unshift({ uuid : "", name : "Select School" });
            this.searchClickedSchool = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSchool = false;
    }
  }

  async getSchoolSchoolingPrograms(schoolUUID : string, action : string, selId : string = '') 
  {
    try
    {
      this.searchClickedSchoolingProgram = true;
      this.schoolingPrograms = [];
      
      if(selId == "")
      {
        this.schoolingProgramForm.get("schoolingProgram").setValue("");
      }

      if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
      {
        let filterSchool : any = this.masterSchools.filter(x => x.school.uuid == schoolUUID);
        if(filterSchool.length > 0)
        {
          this.schoolingPrograms = filterSchool[0].schoolingPrograms;
          this.schoolingPrograms.unshift({id : "", name : "Select Schooling Program" });
        }
        this.searchClickedSchoolingProgram = false;
      }
      else
      {
        let response = await this.commonService.getSchoolSchoolingPrograms(schoolUUID, action, "").toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          response.schoolSchoolingPrograms.forEach(element => {
            this.schoolingPrograms.push({id : element.schoolingProgram.id, name : element.schoolingProgram.name });
          });
          
          this.schoolingPrograms.unshift({ id : "", name : "Select Schooling Program" });
          this.searchClickedSchoolingProgram = false;
        }
        else
        {
            this.schoolingPrograms.unshift({ id : "", name : "Select Schooling Program" });
            this.searchClickedSchoolingProgram = false;
        }
      }        
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSchoolingProgram = false;
    }
  }

  async getAcademicSessions() 
  {  
    try
    {
      this.searchClickedAcademicSession = true;
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = JSON.parse(JSON.stringify(response.academicSessions));
        this.searchClickedAcademicSession = false;
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
      }
      else
      {
        this.academicSessions = [];
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        this.searchClickedAcademicSession = false;
      }
    }
    catch(e)
    {
      this.academicSessions = [];
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
    }
  }

  async getStudyCenters() 
  {  
    try
    {
      this.searchClickedStudyCenter = true;
      let response : any = "";
      if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
      {
        response = await this.userService.getUserStudyCenters(this.loginUserUUID, this.moduleId).toPromise();
      }
      else
      {
        response = await this.commonService.getStudyCenters(0, 'Active').toPromise();
      }
      if (response.status_code == 200 && response.message == 'success') 
      {
        if(this.userTypeCode != "ADMGN" && this.userTypeCode != "PTRCO")
        {
          response.userStudyCenters.forEach(element => {
            this.studyCenters.push({uuid : element.studyCenter.uuid, name : element.studyCenter.name });
          });
        }
        else
        {
          this.studyCenters = response.studyCenters;
        }
        this.studyCenters.unshift({uuid : "", name : "Select Study Center"});
        this.searchClickedStudyCenter = false;
      }
      else
      {
        this.studyCenters = [];
        this.searchClickedStudyCenter = false;
      }
    }
    catch(e)
    {
      this.studyCenters = [];
      this.showNotification("error", e);
      this.searchClickedStudyCenter = false;
    }
  }

  async getApplicationForms() 
  { 
    if(this.schoolForm.valid && this.schoolingProgramForm.valid && this.academicSessionForm.valid)
    {
      try
      {
        let schoolUUID = this.schoolForm.get("school").value;
        let schoolingProgramId = this.schoolingProgramForm.get("schoolingProgram").value;
        let academicSessionId = this.academicSessionForm.get("academicSession").value;
        let studyCenterUUID = this.studyCenterForm.get("studyCenter").value;
    ////Manage Filter Option To Local Storage
        localStorage.setItem("schoolUUID", schoolUUID);
        localStorage.setItem("schoolingProgramId", schoolingProgramId);
        localStorage.setItem("academicSessionId", academicSessionId);
        localStorage.setItem("studyCenterUUID", studyCenterUUID);
    ///////
        this.isValidForm = true;
        this.searchClicked = true;
        let response = await this.admissionService.getApplicationForms('B2C', schoolUUID, schoolingProgramId, academicSessionId, studyCenterUUID, 5).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblApplicationForm').DataTable().destroy();
          this.applicationForms = response.applicationForms;
          setTimeout(function(){
            $('#tblApplicationForm').DataTable();
          },1000);
          this.searchClicked = false;
        }
        else
        {
          this.applicationForms = [];
          this.searchClicked = false;
        }
      }
      catch(e)
      {
        this.applicationForms = [];
        this.searchClicked = false;
        this.showNotification("error", e);      
      }
    }
    else
    {
      this.isValidForm = false;
      this.applicationForms = [];
    }
  }

  detailFeePayment(applicationUUID : string)
  {
    this.router.navigateByUrl("/feeCollection/detail/" + applicationUUID);
  }
}
