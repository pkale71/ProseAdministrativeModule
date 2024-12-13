import { CommonModule, Location } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-b2c-application-stage-five',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './b2c-application-stage-five.component.html',
  styleUrls: ['./b2c-application-stage-five.component.scss']
})
export class B2cApplicationStageFiveComponent 
{
  uuid : string;
  addApplicationForm5 : FormGroup;
  paymentMethodForm : FormGroup;
  studentProfileData : any;
  subjectGroupData : any;
  feeStructureData : any;
  paymentMethods : any[];
  studentProfileClicked : boolean;
  subjectGroupClicked : boolean;
  feeStructureClicked : boolean;
  paymentMethodClicked : boolean;
  saveClicked : boolean;
  isValidForm : boolean;
  isOtherPaymentMethod : boolean;
  curDate : string;

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
    this.paymentMethods = [];
    this.studentProfileClicked = false;
    this.subjectGroupClicked = false;
    this.feeStructureClicked = false;
    this.paymentMethodClicked = false;
    this.isValidForm = true;
    this.saveClicked = false;
    this.isOtherPaymentMethod = false;
    this.curDate = moment(new Date()).format('YYYY-MM-DD');

    this.getApplicationStudentProfile(this.uuid);
    this.getApplicationSubjectGroup(this.uuid);
    this.getApplicationFeeStructure(this.uuid);
    this.getPaymentMethods();
  }

  ngOnInit() 
  {
    this.paymentMethodForm = this.formbuilder.group({
      paymentMethod: ['', Validators.required],
    });

    this.addApplicationForm5 = this.formbuilder.group({
      application: this.formbuilder.group({ 'uuid': [this.uuid, Validators.required] }),
      bankReference: [''],
      paymentDate : ['', Validators.required],
      totalAmount : ['', [Validators.required, Validators.pattern('^[0-9]{1,11}$')]]
    });
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  async getPaymentMethods() 
  {
    this.paymentMethodClicked = true;
    let response = await this.admissionService.getPaymentMethods().toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.paymentMethods = response.paymentMethods;
        this.paymentMethods.unshift({"id" : "", "name" : "Select Payment Method"});
        this.paymentMethodClicked = false;
    }
    else
    {
        this.paymentMethods = [];
        this.paymentMethodClicked = false;
    }
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

  checkPaymentMethod(id : number)
  {
    this.isOtherPaymentMethod = false;
    if(id > 0)
    {
      let filterPaymentMethod = this.paymentMethods.filter(pm=>pm.id == id);
      if (filterPaymentMethod.length > 0) 
      {
        if(filterPaymentMethod[0].name != 'Cash')
        {
          this.addApplicationForm5.controls['bankReference'].addValidators(Validators.required);
          this.addApplicationForm5.updateValueAndValidity();
          this.addApplicationForm5.get("bankReference").setValue("");
          this.isOtherPaymentMethod = true;
        }
        else
        {
          this.addApplicationForm5.controls['bankReference'].removeValidators(Validators.required);
          this.addApplicationForm5.updateValueAndValidity();
          this.addApplicationForm5.get("bankReference").setValue("");
        }
      }
      else
      {
        this.addApplicationForm5.controls['bankReference'].removeValidators(Validators.required);
        this.addApplicationForm5.updateValueAndValidity();
        this.addApplicationForm5.get("bankReference").setValue("");
      }
    }
    else
    {
      this.addApplicationForm5.controls['bankReference'].removeValidators(Validators.required);
      this.addApplicationForm5.updateValueAndValidity();
      this.addApplicationForm5.get("bankReference").setValue("");
    }
  }

  feeAmountBifercation(totalAmount : number)
  {
    const grossAmount: number = parseFloat(this.feeStructureData?.total?.grossAmount);
    if (totalAmount <= grossAmount) 
    {
      for (let installment of this.feeStructureData?.installments || []) 
      {
        if (totalAmount > 0) 
        {
          const installmentAmount = parseFloat(installment.amount);
          if (installmentAmount >= totalAmount) 
          {
            installment.amountPaid = totalAmount;
            totalAmount = 0;
          } 
          else 
          {
            installment.amountPaid = installmentAmount;
            totalAmount -= installmentAmount;
          }
        } 
        else 
        {
          installment.amountPaid = 0;
        }
      }
    } 
    else 
    {
      this.addApplicationForm5.get("totalAmount").setValue("");
      this.feeStructureData?.installments?.forEach(installment => 
      {
        installment.amountPaid = 0;
      });
      this.showNotification('warning', "Amount Entered Is More Than Total Fees");
    }
  }

  prepareJSON()
  {
    let data : any = "";
    let feeInstallmentIds = "";
    let amounts = "";
    for (let installment of this.feeStructureData?.installments || []) 
    {
      if(parseFloat(installment.amountPaid) > 0)
      {
        if(feeInstallmentIds == "")
        {
          feeInstallmentIds = installment.id;
        }
        else
        {
          feeInstallmentIds = feeInstallmentIds + "," + installment.id;
        }

        if(amounts == "")
        {
          amounts = installment.amountPaid;
        }
        else
        {
          amounts = amounts + "," + installment.amountPaid;
        }
      }
    }
    if(feeInstallmentIds != "" && amounts != "")
    {
      data = {
        "application" : {"uuid" : this.uuid},
        "applicationFeeInstallment" : {"id" : feeInstallmentIds},
        "paymentDate" : this.addApplicationForm5.get("paymentDate").value,
        "paymentMethod" : {"id" : this.paymentMethodForm.get("paymentMethod").value},
        "bankReference" : this.addApplicationForm5.get("bankReference").value,
        "totalAmount" : this.addApplicationForm5.get("totalAmount").value,
        "amount" : amounts
      }
    }
    return data;
  }

  async saveApplicationForm5()
  {
    try
    {
      if(this.addApplicationForm5.valid && this.paymentMethodForm.valid)
      {
        if(parseFloat(this.addApplicationForm5.get("totalAmount").value) == 0)
        {
          this.showNotification('warning', "Amount Should Be Greater Than Zero");
          this.addApplicationForm5.get("totalAmount").setValue("");
          this.saveClicked = true;
        }
        else
        {
          this.isValidForm = true;
          this.saveClicked = true;
          let JSONData = this.prepareJSON();
          
          let response = await this.admissionService.saveB2CApplicationForm5(JSONData).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification('success', "Fee Payment Paid And Student Enrolled");
            this.router.navigateByUrl("/b2cApplication/detail/B2C/" + this.uuid);
            this.saveClicked = false;
          }
          else
          {
            this.showNotification('error', "Fee Payment Failed");
            this.saveClicked = false;
          } 
        }        
      }
      else
      {
        this.isValidForm = false;
        this.saveClicked = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.isValidForm = false;
      this.saveClicked = false;
    }
  }

  back()
  {
    this.router.navigateByUrl("/b2cApplication/registrations");
  }
}
