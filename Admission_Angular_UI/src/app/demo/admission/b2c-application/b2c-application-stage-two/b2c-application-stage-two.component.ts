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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-b2c-application-stage-two',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './b2c-application-stage-two.component.html',
  styleUrls: ['./b2c-application-stage-two.component.scss']
})
export class B2cApplicationStageTwoComponent 
{
  uuid : string;
  feeStructureForm : FormGroup;
  tieupSchoolForm : FormGroup;
  addApplicationForm2 : FormGroup;
  studentProfileData : any;
  studentProfileClicked : boolean;
  feeStructureClicked : boolean;
  tieupSchoolClicked : boolean;
  saveClicked : boolean;
  isValidForm : boolean;
  feeStructures : any[];
  feeStructure : any;
  tieupSchools : any[];
  feeTypes : any[];
  discountTypes : any[];
  feeInstallments : any[];
  feeTotal : any;
  feeTypeTotal : number = 0;
  discountTypeTotal : number = 0;

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
    this.feeStructureClicked = false;
    this.tieupSchoolClicked = false;
    this.saveClicked = false;
    this.isValidForm = true;
    this.feeStructures = [];
    this.tieupSchools = [];
    this.feeTypes = [];
    this.discountTypes = [];
    this.feeInstallments = [];
    this.getApplicationStudentProfile(this.uuid);
    this.getTieupSchools();
  }

  ngOnInit() 
  {
    this.feeStructureForm = this.formbuilder.group({
      feeStructure:['', Validators.required]
    });

    this.tieupSchoolForm = this.formbuilder.group({
      tieupSchool:['']
    });

    this.addApplicationForm2 = this.formbuilder.group({
      application: this.formbuilder.group({ 'uuid': [this.uuid, Validators.required] }),
      feeStructure : this.formbuilder.group({ 'uuid': [''] }),
      tieupSchool : this.formbuilder.group({"uuid" : ['']}),
      taxApplicable : ['', Validators.required],
      installments : ['', Validators.required],
      otherDiscount : ['', [Validators.required, Validators.pattern('^[0-9]{1,11}$')]],
      grossAmount : ['', Validators.required]
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
    /////Get Fee Structure
        let schoolUUID = this.studentProfileData?.school?.uuid;
        let schoolingProgramId = this.studentProfileData?.schoolingProgram?.id;
        let academicSessionId = this.studentProfileData?.academicSession?.id;
        let batchYearId = this.studentProfileData?.academicSession?.id;
        let syllabusId = this.studentProfileData?.syllabus?.id;
        let gradeCategoryId = this.studentProfileData?.gradeCategory?.id;
        
        this.getFeeStrucutres(schoolUUID, schoolingProgramId, academicSessionId, batchYearId, syllabusId, gradeCategoryId, this.studentProfileData?.admissionDate);
    ////////
        this.studentProfileClicked = false;
    }
    else
    {
        this.studentProfileData = "";
        this.studentProfileClicked = false;
    }
  }

  async getTieupSchools() 
  {
    this.tieupSchoolClicked = true;
    let response = await this.commonService.getTieUpSchools('Active').toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.tieupSchools = response.tieUpSchools;
        this.tieupSchools.unshift({"uuid" : "", "name" : "Select Tie-Up School"});
    ////////
        this.tieupSchoolClicked = false;
    }
    else
    {
        this.tieupSchools = [];
        this.tieupSchoolClicked = false;
    }
  }

  async getFeeStrucutres(schoolUUID : string, schoolingProgramId : number, academicSessionId : number, batchYearId : number, syllabusId : number, gradeCategoryId : number, date : string) 
  {  
    try
    {
      this.feeStructureClicked = true;
      let response = await this.commonService.getFeeStructures(schoolUUID, schoolingProgramId, academicSessionId, batchYearId, syllabusId, gradeCategoryId, "Active", date).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.feeStructures = response.feeStructures;
        this.feeStructures.unshift({"uuid" : "", "feeCategory" : {"id" : "", "name" : "Select Fee Structure"}});
        this.feeStructureClicked = false;
      }
      else
      {
        this.feeStructures = [];
        this.feeStructureClicked = false;
      }
    }
    catch(e)
    {
      this.feeStructures = [];
      this.showNotification("error", e);
      this.feeStructureClicked = false;
    }
  }

  generateFeeStructureCalc()
  {
    this.feeTypeTotal = 0;
    this.discountTypeTotal = 0;
    this.feeTypes = this.feeStructure.feeTypes;
    this.discountTypes = this.feeStructure.discountTypes;
    this.feeInstallments = this.feeStructure.feeInstallments;
    this.feeTotal = this.feeStructure.totals[0];

    if(this.addApplicationForm2.get("otherDiscount").value != "")
    {
      if(this.discountTypes.filter(dt=>dt.discountType.name === "Other Discount").length == 0)
      {
        this.discountTypes.push({"id" : "", "discountType" : {"id" : "", "name" : "Other Discount"}, "amount" : this.addApplicationForm2.get("otherDiscount").value});
      }
      else
      {
        this.discountTypes[this.discountTypes.length-1].amount = this.addApplicationForm2.get("otherDiscount").value;
      }
    }

    this.feeTypes.forEach(feeType => {
      this.feeTypeTotal = this.feeTypeTotal + parseFloat(feeType.amount);
    });
    
    this.discountTypes.forEach(discountType => {
      this.discountTypeTotal = this.discountTypeTotal + parseFloat(discountType.amount);
    });

    this.feeTotal.totalDiscount = (this.discountTypeTotal).toFixed(2);
    this.feeTotal.netAmount = (this.feeTypeTotal - this.discountTypeTotal).toFixed(2);
    this.feeTotal.grossAmount = (parseFloat(this.feeTotal.netAmount) + parseFloat(this.feeTotal.taxAmount)).toFixed(2);

    this.addApplicationForm2.get("grossAmount").setValue(this.feeTotal.grossAmount);
    
    this.feeInstallments.forEach(installment => {
      installment.amount = ((parseFloat(this.feeTotal.grossAmount)*parseFloat(installment.installmentRate))/100).toFixed(2);
    });
  }

  async getFeeStructureData(uuid : string)
  {
    let tempFeeStructure = this.feeStructures.filter(fs=>fs.uuid == uuid);
    if(tempFeeStructure.length > 0)
    {
      let taxApplicable = "";
      if(tempFeeStructure[0].taxApplicable == 1)
      {
        taxApplicable = tempFeeStructure[0].rate + "%";
      }
      else
      {
        taxApplicable = 'No';
      }
      this.addApplicationForm2.get("taxApplicable").setValue(taxApplicable);
      this.addApplicationForm2.get("installments").setValue(tempFeeStructure[0].totalInstallment > 1 ? 'Yes' : 'No');
      this.addApplicationForm2.get("grossAmount").setValue("");
    }

    try
    {
      this.feeStructureClicked = true;
      let response = await this.commonService.getFeeStructure(uuid, this.studentProfileData?.admissionDate).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.showNotification('info', "Fetching & Validating Fee Structure....");
        this.feeStructure = response.feeStructure;
        if(this.feeStructure != "")
        {
          this.feeStructure = response.feeStructure;
          this.addApplicationForm2.get("grossAmount").setValue(this.feeStructure.totals[0].grossAmount);
          this.addApplicationForm2.get("otherDiscount").setValue("0");
          this.generateFeeStructureCalc();
          this.showNotification('success', "Fee Structure Data Fetched And Validated");
          this.feeStructureClicked = false;
        }
        else if(this.feeStructureForm.get("feeStructure").value != "")
        {
          this.feeStructure = [];
          this.feeStructureForm.get("feeStructure").setValue("");
          this.addApplicationForm2.get("taxApplicable").setValue("");
          this.addApplicationForm2.get("installments").setValue("");
          this.addApplicationForm2.get("otherDiscount").setValue("");
          this.addApplicationForm2.get("grossAmount").setValue("");
          this.feeTypes = [];
          this.discountTypes = [];
          this.feeInstallments = [];
          this.feeTotal = "";
          this.showNotification('error', "Fee Structure Not Configured For Academic Year : " + this.studentProfileData?.academicSession?.year);
          this.feeStructureClicked = false;
        }
        else
        {
          this.feeStructure = [];
          this.feeStructureForm.get("feeStructure").setValue("");
          this.addApplicationForm2.get("taxApplicable").setValue("");
          this.addApplicationForm2.get("installments").setValue("");
          this.addApplicationForm2.get("otherDiscount").setValue("");
          this.addApplicationForm2.get("grossAmount").setValue("");
          this.feeTypes = [];
          this.discountTypes = [];
          this.feeInstallments = [];
          this.feeTotal = "";
          this.feeStructureClicked = false;
        }
      }
      else
      {
        this.feeStructure = [];
        this.feeStructureForm.get("feeStructure").setValue("");
        this.addApplicationForm2.get("taxApplicable").setValue("");
        this.addApplicationForm2.get("installments").setValue("");
        this.addApplicationForm2.get("otherDiscount").setValue("");
        this.addApplicationForm2.get("grossAmount").setValue("");
        this.feeTypes = [];
        this.discountTypes = [];
        this.feeInstallments = [];
        this.feeTotal = "";
        this.feeStructureClicked = false;
      }
    }
    catch(e)
    {
      this.feeStructure = [];
      this.feeStructureForm.get("feeStructure").setValue("");
      this.addApplicationForm2.get("taxApplicable").setValue("");
      this.addApplicationForm2.get("installments").setValue("");
      this.addApplicationForm2.get("otherDiscount").setValue("");
      this.addApplicationForm2.get("grossAmount").setValue("");
      this.feeTypes = [];
      this.discountTypes = [];
      this.feeInstallments = [];
      this.feeTotal = "";
      this.showNotification("error", e);
      this.feeStructureClicked = false;
    }
  }

  async saveApplicationForm2()
  {
    try
    {
      if(this.addApplicationForm2.valid && this.feeStructureForm.valid && !this.saveClicked)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.addApplicationForm2.controls['feeStructure'].get("uuid").setValue(this.feeStructureForm.get("feeStructure").value);
        if(this.tieupSchoolForm.valid)
        {
          this.addApplicationForm2.controls['tieupSchool'].get("uuid").setValue(this.tieupSchoolForm.get("tieupSchool").value);
        }
        let response = await this.admissionService.saveB2CApplicationForm2(this.addApplicationForm2.value).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification('success', "Application Form Details Saved");
          this.router.navigateByUrl("/b2cApplication/detail/B2C/" + response.uuid);
          this.saveClicked = false;
        }
        else
        {
          this.showNotification('error', "Application Form Details Not Saved");
          this.saveClicked = false;
        } 
      }
      else
      {
        this.isValidForm = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.saveClicked = false;
    }
  }

  back()
  {
      this.location.back();
  }
}
