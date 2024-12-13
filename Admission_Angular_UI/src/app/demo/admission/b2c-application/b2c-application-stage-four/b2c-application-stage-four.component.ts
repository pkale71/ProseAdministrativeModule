import { CommonModule, Location } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-b2c-application-stage-four',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './b2c-application-stage-four.component.html',
  styleUrls: ['./b2c-application-stage-four.component.scss']
})
export class B2cApplicationStageFourComponent 
{
  uuid : string;
  studentProfileData : any;
  parentProfileData : any;
  subjectGroupData : any;
  sportProfileData : any;
  undergoneEducationData : any;
  undertakingDocument : any;
  studentDocuments : any[];
  studentProfileClicked : boolean;
  parentProfileClicked : boolean;
  subjectGroupClicked : boolean;
  sportProfileClicked : boolean;
  undergoneProfileClicked : boolean;
  studentDocClicked : boolean;
  addApplicationForm4 : FormGroup;
  undertakingDocFiles : any[] = ["",""];
  studentDocFiles : any[] = ["",""];
  saveUndertakingClicked : boolean[] = [false, false];
  deleteUndertakingClicked : boolean[] = [false, false];
  undertakingDocumentClicked : boolean;
  downloadUndertakingClicked : boolean[] = [false, false];
  generateClicked : boolean[] = [false, false];
  saveStudentDocClicked : boolean[] = [];
  deleteStudentDocClicked : boolean[] = [];
  downloadStudentDocClicked : boolean[] = [];

  constructor(private notifier: NotifierService, 
  public commonSharedService : CommonSharedService,
  private commonService : CommonService,
  private admissionService : AdmissionService,
  private formbuilder: FormBuilder,
  private modalService: NgbModal, 
  private location : Location, 
  private route: ActivatedRoute, 
  private router : Router)
  {
    this.uuid = this.route.params['value'].uuid;
    this.studentProfileClicked = false;
    this.parentProfileClicked = false;
    this.subjectGroupClicked = false;
    this.sportProfileClicked = false;
    this.undergoneProfileClicked = false;
    this.undertakingDocumentClicked = false;
    this.studentDocClicked = false;
    this.studentDocuments = [];

    this.getApplicationStudentProfile(this.uuid);
    this.getApplicationParentProfile(this.uuid);
    this.getApplicationSubjectGroup(this.uuid);
    this.getApplicationSportEngagement(this.uuid);
    this.getApplicationUndergoneEducation(this.uuid);
    this.getApplicationUndertakingDocument(this.uuid);
    this.getApplicationStudentDocuments(this.uuid);
  }

  ngOnInit() 
  {
    this.addApplicationForm4 = this.formbuilder.group({
      application: this.formbuilder.group({ 'uuid': [this.uuid, Validators.required] }),
    });
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

  async getApplicationSportEngagement(uuid : string) 
  {
    this.sportProfileClicked = true;
    let response = await this.admissionService.getApplicationSportEngagement(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.sportProfileData = response.sportEngagment;
        this.sportProfileClicked = false;
    }
    else
    {
        this.sportProfileData = "";
        this.sportProfileClicked = false;
    }
  }

  async getApplicationUndergoneEducation(uuid : string) 
  {
    this.undergoneProfileClicked = true;
    let response = await this.admissionService.getApplicationUndergoneEducation(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.undergoneEducationData = response.undergoneEducation;
        this.undergoneProfileClicked = false;
    }
    else
    {
        this.undergoneEducationData = "";
        this.undergoneProfileClicked = false;
    }
  }

  async getApplicationUndertakingDocument(uuid : string)
  {
    this.undertakingDocumentClicked = true;
    let response = await this.admissionService.getApplicationUndertakingDocument(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.undertakingDocument = response.undertakingDocument;
        this.undertakingDocumentClicked = false;
    }
    else
    {
        this.undertakingDocument = "";
        this.undertakingDocumentClicked = false;
    }
  }

  async getApplicationStudentDocuments(uuid : string) 
  {
    this.studentDocClicked = true;
    let response = await this.admissionService.getApplicationStudentDocuments(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.studentDocuments = response.studentDocuments;
        this.studentDocClicked = false;
    }
    else
    {
        this.studentDocuments = [];
        this.studentDocClicked = false;
    }
  }

  undertakingfileChange(event : any, i : number)
  {         
    const file = event.target.files[0]; 
    let fSize : number = parseFloat((file.size / 1024).toFixed(2));
    if(file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'application/pdf')
    {
      if(fSize > 0)
      {
          this.undertakingDocFiles[i] = file;
      }
    }
  }

  async saveUndertakingDoc(i : number, docName : string)
  {
    try
    {
      if(this.undertakingDocFiles[i] != "")
      {
        this.saveUndertakingClicked[i] = true;
        let formData = new FormData();
        formData.append("application", JSON.stringify({"uuid" : this.uuid}));
        formData.append("documentName", docName);
        formData.append("documentFile", this.undertakingDocFiles[i])

        let response = await this.admissionService.saveApplicationForm4(formData).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification('success', "Application Document Uploaded");
          this.undertakingDocFiles[i] = "";
          this.getApplicationUndertakingDocument(response.uuid);
          this.saveUndertakingClicked[i] = false;
        }
        else
        {
          this.showNotification('error', "Application Document Not Saved");
          this.saveUndertakingClicked[i] = false;
        } 
      }
      else
      {
        this.showNotification('info', "Select (PDF, JPEG, PNG) File");
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.saveUndertakingClicked[i] = false;
    }
  }

  async deleteApplicationDoc(i : number, studentDocumentId : number, docName : string)
  {
    try
    {      
      if(docName != "")
      {
        this.deleteUndertakingClicked[i] = true;
      }
      else
      {
        this.deleteStudentDocClicked[i] = true;
      }
      let jsonData = {
        "application" : {"uuid" : this.uuid},
        "documentName" : docName,
        "applicationStudentDocument" : {"id" : (studentDocumentId > 0 ? studentDocumentId : "")}
      }
      
      let response = await this.admissionService.deleteApplicationDoc(jsonData).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        if(docName != "")
        {
          this.showNotification('success', "Application Document Deleted");
          this.getApplicationUndertakingDocument(this.uuid);
          this.deleteUndertakingClicked[i] = false;
        }
        else
        {
          this.showNotification('success', "Student Document Deleted");
          this.getApplicationStudentDocuments(this.uuid);
          this.deleteStudentDocClicked[i] = false;
        }
      }
      else
      {
        if(docName != "")
        {
          this.showNotification('error', "Application Document Not Deleted");
          this.deleteUndertakingClicked[i] = false;
        }
        else
        {
          this.showNotification('error', "Student Document Not Deleted");
          this.deleteStudentDocClicked[i] = false;
        }
      } 
    }
    catch(e)
    {
      this.showNotification("error", e);
      if(docName != "")
      {
        this.deleteUndertakingClicked[i] = false;
      }
      else
      {
        this.deleteStudentDocClicked[i] = false;
      }
    }
  }

  async downloadApplicationDoc(i : number, studentDocumentId : number, docName : string, fileName : string)
  {
    try
    {      
      if(docName != "")
      {
        this.downloadUndertakingClicked[i] = true;
      }
      else
      {
        this.downloadStudentDocClicked[i] = true;
      }
      let jsonData = {
        "application" : {"uuid" : this.uuid},
        "documentName" : docName,
        "applicationStudentDocument" : {"id" : (studentDocumentId > 0 ? studentDocumentId : "")}
      }
      
      let response = await this.admissionService.downloadApplicationDoc(jsonData).toPromise();
      if (response) 
      {
        this.commonSharedService.DirectFileDownload(response, fileName);
        if(docName != "")
        {
          this.downloadUndertakingClicked[i] = false;
          this.showNotification('success', "Application Document Download Completed");
          this.getApplicationUndertakingDocument(this.uuid);
        }
        else
        {
          this.downloadStudentDocClicked[i] = false;
          this.showNotification('success', "Student Document Download Completed");
          this.getApplicationStudentDocuments(this.uuid);
        }
      }
      else
      {
        if(docName != "")
        {
          this.showNotification('error', "Application Document Download Not Completed");
          this.downloadUndertakingClicked[i] = false;
        }
        else
        {
          this.showNotification('error', "Student Document Download Not Completed");
          this.downloadStudentDocClicked[i] = false;
        }
      } 
    }
    catch(e)
    {
      this.showNotification("error", e);
      if(docName != "")
      {
        this.downloadUndertakingClicked[i] = false;
      }
      else
      {
        this.downloadStudentDocClicked[i] = false;
      }
    }
  }

  studentfileChange(event : any, i : number)
  {         
    const file = event.target.files[0]; 
    let fSize : number = parseFloat((file.size / 1024).toFixed(2));
    if(file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'application/pdf')
    {
      if(fSize > 0)
      {
          this.studentDocFiles[i] = file;
      }
    }
  }

  async saveStudentDoc(i : number, studentDocumentId : number)
  {
    try
    {
      if(this.studentDocFiles[i] != "")
      {
        this.saveStudentDocClicked[i] = true;
        let formData = new FormData();
        formData.append("application", JSON.stringify({"uuid" : this.uuid}));
        formData.append("studentDocument", JSON.stringify({"id" : studentDocumentId}));
        formData.append("documentFile", this.studentDocFiles[i])

        let response = await this.admissionService.saveApplicationStudentDocs(formData).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification('success', "Student Document Uploaded");
          this.studentDocFiles[i] = "";
          this.getApplicationStudentDocuments(this.uuid);
          this.saveStudentDocClicked[i] = false;
        }
        else
        {
          this.showNotification('error', "Application Document Not Saved");
          this.saveStudentDocClicked[i] = false;
        } 
      }
      else
      {
        this.showNotification('info', "Select (PDF, JPEG, PNG) File");
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.saveStudentDocClicked[i] = false;
    }
  }

  async downloadApplicationFormPDF()
  {
    this.generateClicked[0] = true;
    this.showNotification('info', "Downloading Application Form");
    let studentProfile = {
      "applicationNumber" : this.studentProfileData?.applicationNumber,
      "academicYear" : this.studentProfileData?.academicSession?.year,
      "submission" : this.studentProfileData?.profileCompletion?.name == 'Admission Team' ? 'Ofline' : 'Online',
      "name" : this.studentProfileData?.studentName,
      "dob" : this.studentProfileData?.dob,
      "gender" : this.studentProfileData?.gender?.name,
      "nationality" : this.studentProfileData?.nationality,
      "aadharNumber" : this.studentProfileData?.aadharNumber,
      "passportNumber" : this.studentProfileData?.passportNumber,
      "grade" : this.studentProfileData?.grade?.name,
      "batchTime" : `${this.commonSharedService.convertTo12HourFormat(this.subjectGroupData?.batchType?.startTime)} - ${this.commonSharedService.convertTo12HourFormat(this.subjectGroupData?.batchType?.endTime)}`
    };

    let parentProfile = {
      "name" : this.parentProfileData?.name,
      "relationship" : this.parentProfileData?.relationship,
      "mobile" : this.parentProfileData?.mobile,
      "email" : this.parentProfileData?.email,
      "address" : this.parentProfileData?.address,
      "aadharNumber" : this.parentProfileData?.aadharNumber,
      "panNumber" : this.parentProfileData?.panNumber,
      "passportNumber" : this.parentProfileData?.passportNumber
    };

    let sportProfile = {
      "sportName" : this.sportProfileData?.sportName || "",
      "coachName" : this.sportProfileData?.businessPartner?.coach?.uuid ? this.sportProfileData?.businessPartner?.coach?.name : this.sportProfileData?.otherAcademyCoach,
      "coachMobile" : this.sportProfileData?.businessPartner?.coach?.mobile || "",
      "academyName" : this.sportProfileData?.businessPartner?.uuid ? this.sportProfileData?.businessPartner?.name : this.sportProfileData?.otherAcademyName,
      "academyAddress" : this.sportProfileData?.businessPartner?.uuid ? this.sportProfileData?.businessPartner?.address : this.sportProfileData?.otherAcademyAddress
    };
    
    let subjects : any[] = [];
    for(let i=0;i<this.subjectGroupData?.subjects.length;i++)
    {
      subjects.push([(i + 1), this.subjectGroupData?.subjects[i].name])
    }
    try
    {
      let response = await this.commonService.getSchoolLogo(this.studentProfileData?.school?.uuid).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        let logoBase64 = response.fileData;
        this.commonSharedService.applicationFormPdfGeneration(logoBase64, studentProfile, parentProfile, sportProfile, subjects);
        this.generateClicked[0] = false;
        this.showNotification('success', "Download Completed");
      }
      else
      {
        this.commonSharedService.applicationFormPdfGeneration("", studentProfile, parentProfile, sportProfile, subjects);
        this.generateClicked[0] = false;
        this.showNotification('success', "Download Completed");
      }      
    }
    catch(e)
    {
      this.commonSharedService.applicationFormPdfGeneration("", studentProfile, parentProfile, sportProfile, subjects);
      this.generateClicked[0] = false;
      this.showNotification('success', "Download Completed");
    }
  }

  async downloadUndertakingFormPDF()
  {
    this.showNotification('info', "Downloading Undertaking Form");
    this.generateClicked[1] = true;
    let studentProfile = {
      "applicationNumber" : this.studentProfileData?.applicationNumber,
      "school" : `${this.studentProfileData?.school?.name} - ${this.studentProfileData?.schoolingProgram?.name}`,
      "admissionDate" : this.studentProfileData?.admissionDate,
      "academicYear" : this.studentProfileData?.academicSession?.year,
      "submission" : this.studentProfileData?.profileCompletion?.name == 'Admission Team' ? 'Ofline' : 'Online',
      "name" : this.studentProfileData?.studentName,
      "dob" : this.studentProfileData?.dob,
      "gender" : this.studentProfileData?.gender?.name,
      "nationality" : this.studentProfileData?.nationality,
      "aadharNumber" : this.studentProfileData?.aadharNumber,
      "passportNumber" : this.studentProfileData?.passportNumber,
      "grade" : this.studentProfileData?.grade?.name,
      "batchTime" : `${this.commonSharedService.convertTo12HourFormat(this.subjectGroupData?.batchType?.startTime)} - ${this.commonSharedService.convertTo12HourFormat(this.subjectGroupData?.batchType?.endTime)}`
    };

    let parentProfile = {
      "name" : this.parentProfileData?.name,
      "relationship" : this.parentProfileData?.relationship,
      "mobile" : this.parentProfileData?.mobile,
      "email" : this.parentProfileData?.email,
      "address" : this.parentProfileData?.address,
      "aadharNumber" : this.parentProfileData?.aadharNumber,
      "panNumber" : this.parentProfileData?.panNumber,
      "passportNumber" : this.parentProfileData?.passportNumber
    };

    let batches : any[] = [];
    try
    {
      let response1 = await this.commonService.getSchoolSchoolingProgramBatches(this.studentProfileData?.school?.uuid, this.studentProfileData?.schoolingProgram?.id, this.studentProfileData?.admissionDate).toPromise();
      
      if (response1.status_code == 200 && response1.message == 'success') 
      {
        ////////getBatches
        let tempBatches : any[] = response1.schoolSchoolingProgramBatches;
        let sno : number = 1;
        tempBatches.forEach((batch) => {
          let batchTime = `${this.commonSharedService.convertTo12HourFormat(batch.startTime)} - ${this.commonSharedService.convertTo12HourFormat(batch.endTime)}`;
          batches.push([sno, batch.name, batchTime]);
          sno++;
        });
        ////////////
        let response = await this.commonService.getSchoolLogo(this.studentProfileData?.school?.uuid).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          let logoBase64 = response.fileData;
          this.commonSharedService.undertakingFormPdfGeneration(logoBase64, studentProfile, parentProfile, batches);
          this.generateClicked[1] = false;
          this.showNotification('success', "Download Completed");
        }
        else
        {
          this.commonSharedService.undertakingFormPdfGeneration("", studentProfile, parentProfile, batches);
          this.generateClicked[1] = false;
          this.showNotification('success', "Download Completed");
        }     
      } 
    }
    catch(e)
    {
      this.commonSharedService.undertakingFormPdfGeneration("", studentProfile, parentProfile, batches);
      this.generateClicked[1] = false;
      this.showNotification('success', "Download Completed");
    }
  }

  back()
  {
    this.router.navigateByUrl("/b2cApplication/registrations");
  }
}
