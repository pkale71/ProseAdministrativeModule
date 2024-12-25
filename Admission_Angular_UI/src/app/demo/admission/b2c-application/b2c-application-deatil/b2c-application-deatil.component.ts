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
import { StudentProfileEditComponent } from '../../student-profile-edit/student-profile-edit.component';
import { ParentProfileEditComponent } from '../../parent-profile-edit/parent-profile-edit.component';

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
  totalAmount : number = 0;
  totalPaid : number = 0;
  totalDue : number = 0;
  totalPayments : number = 0;
  totalBankCharges : number = 0;
  totalFeeTypes : number = 0;
  totalDiscountTypes : number = 0;
  studentProfileData : any;
  parentProfileData : any;
  subjectGroupData : any;
  feeStructureData : any;
  sportProfileData : any;
  undergoneEducationData : any;
  undertakingDocument : any;
  feePayments : any[];
  studentProfileClicked : boolean;
  parentProfileClicked : boolean;
  subjectGroupClicked : boolean;
  feeStructureClicked : boolean;
  sportProfileClicked : boolean;
  feePaymentClicked : boolean;
  undergoneProfileClicked : boolean;
  studentDocProfileClicked : boolean;
  undertakingDocFiles : any[] = ["",""];
  studentDocFiles : any[] = ["",""];
  studentDocuments : any[];
  saveUndertakingClicked : boolean[] = [false, false];
  deleteUndertakingClicked : boolean[] = [false, false];
  undertakingDocumentClicked : boolean;
  downloadUndertakingClicked : boolean[] = [false, false];
  saveStudentDocClicked : boolean[] = [];
  deleteStudentDocClicked : boolean[] = [];
  downloadStudentDocClicked : boolean[] = [];
  studentDocClicked : boolean;
  generateClicked : boolean[] = [false, false];

  constructor(private notifier: NotifierService, 
  public commonSharedService : CommonSharedService,
  private commonService : CommonService,
  private admissionService : AdmissionService,
  private modalService: NgbModal, 
  private location : Location, 
  private route: ActivatedRoute, 
  private router : Router)
  {
    this.uuid = this.route.params['value'].uuid;
    this.applicationFor = this.route.params['value'].applicationFor;
    this.studentProfileClicked = false;
    this.parentProfileClicked = false;
    this.subjectGroupClicked = false;
    this.feeStructureClicked = false;
    this.sportProfileClicked = false;
    this.undergoneProfileClicked = false;
    this.studentDocProfileClicked = false;
    this.undertakingDocumentClicked = false;
    this.studentDocClicked = false;
    this.studentDocuments = [];
    this.feePayments = [];
    this.feePaymentClicked = false;

    this.getApplicationStudentProfile(this.uuid);
    this.getApplicationParentProfile(this.uuid);
    this.getApplicationSubjectGroup(this.uuid);
    this.getApplicationFeeStructure(this.uuid);
    this.getApplicationSportEngagement(this.uuid);
    this.getApplicationUndergoneEducation(this.uuid);
    this.getApplicationUndertakingDocument(this.uuid);
    this.getApplicationStudentDocuments(this.uuid);
    this.getApplicationFeePayments(this.uuid);
  }
  
  ngOnInit() 
  {
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  public updateProfileResult:any = this.commonSharedService.updateProfileObject.subscribe(res =>
  {
    if(res.result == "success" && res.action == "Student")
    {
      this.getApplicationStudentProfile(this.uuid);
    }
    else if(res.result == "success" && res.action == "Parent")
    {
      this.getApplicationParentProfile(this.uuid);
    }
  })

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
    this.totalAmount = 0;
    this.totalPaid = 0;
    this.totalDue = 0;
    let response = await this.admissionService.getApplicationFeeStructure(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.feeStructureData = response.feeStructure;
      this.feeStructureClicked = false;
      //Calculate Total Dues
      for(let i=0;i<this.feeStructureData?.installments.length;i++)
      {
        this.totalAmount = this.totalAmount + parseFloat(this.feeStructureData?.installments[i]?.amount);
        this.totalPaid = this.totalPaid + parseFloat(this.feeStructureData?.installments[i]?.amountPaid);
        this.totalDue = this.totalDue + (parseFloat(this.feeStructureData?.installments[i]?.amount) - parseFloat(this.feeStructureData?.installments[i]?.amountPaid));
      }

      //Calculate Total Fee Types
      for(let i=0;i<this.feeStructureData?.feeTypes.length;i++)
      {
        this.totalFeeTypes = this.totalFeeTypes + parseFloat(this.feeStructureData?.feeTypes[i]?.amount);
      }

      //Calculate Total Discount Types
      for(let i=0;i<this.feeStructureData?.discountTypes.length;i++)
      {
        this.totalDiscountTypes = this.totalDiscountTypes + parseFloat(this.feeStructureData?.discountTypes[i]?.amount);
      }
    }
    else
    {
        this.feeStructureData = "";
        this.feeStructureClicked = false;
    }
  }

  async getApplicationFeePayments(uuid : string) 
  {
    this.feePaymentClicked = true;
    this.totalBankCharges = 0;
    this.totalPayments = 0;
    let response = await this.admissionService.getApplicationFeePayments(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.feePayments = response.feePayments;
        //Calculate Total Payments And Bank Charges
        for(let i=0;i<this.feePayments.length;i++)
        {
          this.totalBankCharges = this.totalBankCharges + parseFloat(this.feePayments[i]?.bankCharges);
          this.totalPayments = this.totalPayments + parseFloat(this.feePayments[i]?.amount);
        }
        this.feePaymentClicked = false;
    }
    else
    {
        this.feePayments = [];
        this.feePaymentClicked = false;
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
    let response = await this.admissionService.getApplicationUndertakingDocument(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.undertakingDocument = response.undertakingDocument;
    }
    else
    {
        this.undertakingDocument = "";
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
    if(file != "")
    {
      let fSize : number = parseFloat((file.size / 1024).toFixed(2));
      if(file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'application/pdf')
      {
        if(fSize > 0)
        {
            this.undertakingDocFiles[i] = file;
        }
      }
    }
  }

  async saveUndertakingDoc(i : number, studentDocumentId : number, docName : string)
  {
    try
    {
      if(this.undertakingDocFiles[i] != "")
      {
        this.saveUndertakingClicked[i] = true;
        let jsonData = {
          "application" : {"uuid" : this.uuid},
          "documentName" : docName,
          "applicationStudentDocument" : {"id" : (studentDocumentId > 0 ? studentDocumentId : "")}
        }
        
        let response = await this.admissionService.deleteApplicationDoc(jsonData).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
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
          this.showNotification('error', "Old Application Document Not Deleted");
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
      Swal.fire({
      customClass: {
        container: 'my-Admission_Form'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Remove Uploaded Document?',
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
      }); 
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
    if(file != "")
    {
      let fSize : number = parseFloat((file.size / 1024).toFixed(2));
      if(file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'application/pdf')
      {
        if(fSize > 0)
        {
            this.studentDocFiles[i] = file;
        }
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

  async updateBankCharges(feePaymentId : number, amount : number)
  {
    Swal.fire({
      title: '',
      text: 'Bank Charges',
      input: 'text', // Input type
      inputPlaceholder: 'Bank Charges',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      inputAttributes: {
        maxlength: '11', // Limit input length to 11 digits
        inputmode: 'numeric' // Ensure numeric keyboard on mobile devices
      },
      preConfirm: (value) => {
        return new Promise((resolve, reject) => {
          if (!value) 
          {
            reject('Please Enter A Value!');
          } 
          else if (!/^\d+(\.\d{1,2})?$/.test(value)) 
          {
            reject('Enter A Valid Amount!');
          } 
          else if (value.replace('.', '').length > 11) 
          {
            reject('Value Must Not Exceed 11 Digits!');
          } 
          else if(parseFloat(value) > amount)
          {
            reject("Entered Bank Charges More Than Paid Amount !");
          }
          else 
          {
            resolve(value);
          }
        }).catch((err) => 
        {
          Swal.showValidationMessage(err); // Show validation message
        });
      }
    }).then(async (result : any) => {
      if (result.isConfirmed) 
      {       
        this.showNotification('info', "Processing...");
        let jsonData = {
          "application" : {"uuid" : this.uuid},
          "feePayment" : {"id" : feePaymentId},
          "amount" : result.value
        }
        let response = await this.admissionService.updateFeePaymentBankCharges(jsonData).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification('success', "Bank Charges Saved");
          this.getApplicationFeePayments(this.uuid);
        }
        else
        {
          this.showNotification('error', "Bank Charges Not Saved");
        } 
      }
    });
  }

  downloadReceipt(feePayment : any)
  {
    try
    {
      this.commonSharedService.generateReceiptPDF(this.studentProfileData.studentName, this.studentProfileData.grade.name, this.studentProfileData.enrollmentNumber, feePayment);
    }
    catch(e)
    {
      this.showNotification("error", e);
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
      "sportName" : this.sportProfileData?.businessPartner?.coach?.uuid ? this.sportProfileData?.businessPartner?.coach?.businessVerticalType?.name : this.sportProfileData?.otherAcademySport,
      "coachName" : this.sportProfileData?.businessPartner?.coach?.uuid ? this.sportProfileData?.businessPartner?.coach?.name : this.sportProfileData?.otherAcademyCoach,
      "coachMobile" : this.sportProfileData?.businessPartner?.coach?.uuid ? this.sportProfileData?.businessPartner?.coach?.mobile : this.sportProfileData?.otherAcademyCoachMobile,
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
      this.showNotification('error', e);
    }
  }

  updateStudentProfile()
  {
    let profileData = {
      "application" : {"uuid" : this.uuid},
      "studentName" : this.studentProfileData?.studentName,
      "dob" : this.studentProfileData?.dob,
      "gender" : {"id" : this.studentProfileData?.gender?.id},
      "nationality" : this.studentProfileData?.nationality,
      "aadharNumber" : this.studentProfileData?.aadharNumber,
      "passportNumber" : this.studentProfileData?.passportNumber
    }
    const dialogRef = this.modalService.open(StudentProfileEditComponent, 
    { 
      size: 'lg', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {studentProfile : profileData};
  }

  updateParentProfile()
  {
    let profileData = {
      "id" : this.parentProfileData?.id,
      "name" : this.parentProfileData?.name,
      "email" : this.parentProfileData?.email,
      "mobile" : this.parentProfileData?.mobile,
      "relationship" : this.parentProfileData?.relationship,
      "aadharNumber" : this.parentProfileData?.aadharNumber,
      "passportNumber" : this.parentProfileData?.passportNumber,
      "panNumber" : this.parentProfileData?.panNumber,
      "address" : this.parentProfileData?.address,
      "country" : this.parentProfileData?.country,
      "state" : this.parentProfileData?.state,
      "district" : this.parentProfileData?.district,
      "city" : this.parentProfileData?.city,
      "pincode" : this.parentProfileData?.pincode
    }
    
    const dialogRef = this.modalService.open(ParentProfileEditComponent, 
    { 
      size: 'lg', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {parentProfile : profileData};
  }

  back()
  {
    this.router.navigateByUrl("/b2cApplication/admissions");
  }
}
