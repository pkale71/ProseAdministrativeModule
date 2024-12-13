import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';

@Component({
  selector: 'app-b2c-application-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './b2c-application-list.component.html',
  styleUrls: ['./b2c-application-list.component.scss']
})
export class B2cApplicationListComponent 
{
  schoolForm : FormGroup;
  schoolingProgramForm : FormGroup;
  academicSessionForm : FormGroup;
  applicationStatusForm : FormGroup;
  isValidForm : boolean;
  searchClicked : boolean;
  searchClickedSchool : boolean;
  searchClickedSchoolingProgram : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedStatus : boolean;
  schools : any[];
  schoolingPrograms : any[];
  academicSessions : any[];
  applicationForms : any[];
  applicationStatuses : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService, 
    private admissionService : AdmissionService,
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.schools = [];
    this.schoolingPrograms = [];
    this.academicSessions = [];
    this.applicationForms = [];
    this.applicationStatuses = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedSchool = false;
    this.searchClickedSchoolingProgram = false;
    this.searchClickedStatus = false;
    this.isValidForm = true;

    this.schoolForm = this.formbuilder.group({
      school:['']
    });

    this.schoolingProgramForm = this.formbuilder.group({
      schoolingProgram:['']
    });

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['']
    });

    this.applicationStatusForm = this.formbuilder.group({
      applicationStatus:['']
    });

    this.getAcademicSessions();
    this.getSchools('All');
    this.getApplicationStatuses();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSchools(action : string) 
  {
    try
    {
        this.searchClickedSchool = true;
        let response = await this.commonService.getSchools(action, "").toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schools = response.schools;
            this.schools.unshift({ uuid : "", name : "Select School" });
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

  async getSchoolSchoolingPrograms(schoolUUID : string, action : string) 
  {
    try
    {
        this.searchClickedSchoolingProgram = true;
        this.schoolingProgramForm.get("schoolingProgram").setValue("");
        let response = await this.commonService.getSchoolSchoolingPrograms(schoolUUID, action, "").toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolingPrograms = response.schoolSchoolingPrograms;
            this.schoolingPrograms.unshift({schoolingProgram : { id : "", name : "Select Schooling Program" }});
            this.searchClickedSchoolingProgram = false;
        }
        else
        {
            this.schoolingPrograms.unshift({ uuid : "", name : "Select Schooling Program" });
            this.searchClickedSchoolingProgram = false;
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

  async getApplicationStatuses() 
  {  
    try
    {
      this.searchClickedStatus = true;
      let response = await this.admissionService.getApplicationStatuses().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.applicationStatuses = response.applicationStatuses;
        this.applicationStatuses.unshift({"id" : "", "name" : "Select Application Status"});
        this.searchClickedStatus = false;
      }
      else
      {
        this.applicationStatuses = [];
        this.applicationStatuses.unshift({"id" : "", "name" : "Select Application Status"});
        this.searchClickedStatus = false;
      }
    }
    catch(e)
    {
      this.applicationStatuses = [];
      this.showNotification("error", e);
      this.searchClickedStatus = false;
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
        let applicationStatusId = this.applicationStatusForm.get("applicationStatus").value;

        this.isValidForm = true;
        this.searchClicked = true;
        let response = await this.admissionService.getApplicationForms('B2C', schoolUUID, schoolingProgramId, academicSessionId, applicationStatusId).toPromise();
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

  addApplicationForm()
  {
    this.router.navigateByUrl("/b2cApplication/b2cApplicationStage1/add");
  }

  proceedApplicationForm(applicationForm : any)
  {
    if(applicationForm?.applicationStatus?.name == "Registered")
    {
      this.router.navigateByUrl("/b2cApplication/b2cApplicationStage2/add/" + applicationForm?.uuid);
    }
    else if(applicationForm?.applicationStatus?.name == "Fee Configured" && applicationForm?.profileCompletion?.name != "Parent")
    {
      this.router.navigateByUrl("/b2cApplication/b2cApplicationStage3/add/" + applicationForm?.uuid);
    }
    else if(applicationForm?.applicationStatus?.name == "Submitted" && applicationForm?.profileCompletion?.name != "Parent")
    {
      this.router.navigateByUrl("/b2cApplication/b2cApplicationStage4/add/" + applicationForm?.uuid);
    }
    else if(applicationForm?.applicationStatus?.name == "Undertaking Accepted" && applicationForm?.profileCompletion?.name != "Parent")
    {
      this.router.navigateByUrl("/b2cApplication/b2cApplicationStage5/add/" + applicationForm?.uuid);
    }
  }

  detailApplicationForm(applicationUUID : string)
  {
    this.router.navigateByUrl("/b2cApplication/detail/B2C/" + applicationUUID);
  }

  generateBlankForm()
  {
    this.router.navigateByUrl("/b2cApplication/blankForm");
  }
}
