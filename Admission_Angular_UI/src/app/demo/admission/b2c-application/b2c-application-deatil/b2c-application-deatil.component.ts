import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// third party
import Swal from 'sweetalert2';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';

@Component({
  selector: 'app-b2c-application-deatil',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './b2c-application-deatil.component.html',
  styleUrls: ['./b2c-application-deatil.component.scss']
})
export class B2cApplicationDeatilComponent 
{
  uuid : string;
  applicationFor : string;
  studentProfileData : any;
  parentProfileData : any;
  subjectGroupData : any;
  feeStructureData : any;
  studentProfileClicked : boolean;
  parentProfileClicked : boolean;
  subjectGroupClicked : boolean;
  feeStructureClicked : boolean;

  constructor(private notifier: NotifierService, 
  public commonSharedService : CommonSharedService,
  private commonService : CommonService,
  private admissionService : AdmissionService,
  private modalService: NgbModal, 
  private location : Location, 
  private route: ActivatedRoute)
  {
    this.uuid = this.route.params['value'].uuid;
    this.applicationFor = this.route.params['value'].applicationFor;
    this.studentProfileClicked = false;
    this.parentProfileClicked = false;
    this.subjectGroupClicked = false;
    this.feeStructureClicked = false;

    this.getApplicationStudentProfile(this.uuid);
    this.getApplicationParentProfile(this.uuid);
    this.getApplicationSubjectGroup(this.uuid);
    this.getApplicationFeeStructure(this.uuid);
  }
  
  ngOnInit() 
  {
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  async getApplicationStudentProfile(uuid : string) 
  {
    this.studentProfileClicked = true;
    let response = await this.admissionService.getApplicationStudentProfile(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.studentProfileData = response.studentProfile;
        this.studentProfileClicked = false;
    }
    else
    {
        this.studentProfileData = "";
        this.studentProfileClicked = false;
    }
  }

  async getApplicationParentProfile(uuid : string) 
  {
    this.parentProfileClicked = true;
    let response = await this.admissionService.getApplicationParentProfile(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.parentProfileData = response.parentProfile;
        this.parentProfileClicked = false;
    }
    else
    {
        this.parentProfileData = "";
        this.parentProfileClicked = false;
    }
  }

  async getApplicationSubjectGroup(uuid : string) 
  {
    this.subjectGroupClicked = true;
    let response = await this.admissionService.getApplicationSubjectGroup(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.subjectGroupData = response.subjectGroup;
        this.subjectGroupClicked = false;
    }
    else
    {
        this.subjectGroupData = "";
        this.subjectGroupClicked = false;
    }
  }

  async getApplicationFeeStructure(uuid : string) 
  {
    this.feeStructureClicked = true;
    let response = await this.admissionService.getApplicationFeeStructure(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.feeStructureData = response.feeStructure;
        this.feeStructureClicked = false;
    }
    else
    {
        this.subjectGroupData = "";
        this.feeStructureClicked = false;
    }
  }

  back()
  {
      this.location.back();
  }
}
