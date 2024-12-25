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
import moment from 'moment';

@Component({
  selector: 'app-fee-payment-detail',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './fee-payment-detail.component.html',
  styleUrls: ['./fee-payment-detail.component.scss']
})
export class FeePaymentDetailComponent 
{
  uuid : string;
  feePaymentForm : FormGroup;
  paymentMethodForm : FormGroup;
  studentProfileData : any;
  feeStructureData : any;
  masterFeeStructureData : any;
  feePayments : any[];
  paymentMethods : any[];
  totalAmount : number = 0;
  totalPaid : number = 0;
  totalDue : number = 0;
  totalPayments : number = 0;
  totalBankCharges : number = 0;
  totalFeeTypes : number = 0;
  totalDiscountTypes : number = 0;
  studentProfileClicked : boolean;
  feeStructureClicked : boolean;
  feePaymentClicked : boolean;
  saveClicked : boolean;
  isValidForm : boolean;
  isOtherPaymentMethod : boolean;
  paymentMethodClicked : boolean;
  curDate : string;
  amounts : string;
  feeInstallmentIds : string;

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
    this.feePaymentClicked = false;
    this.saveClicked = false;
    this.isValidForm = true;
    this.isOtherPaymentMethod = false;
    this.paymentMethodClicked = false;
    this.feePayments = [];
    this.paymentMethods = [];
    this.amounts = "";
    this.feeInstallmentIds = "";
    this.curDate = moment(new Date()).format('YYYY-MM-DD');

    this.getApplicationStudentProfile(this.uuid);
    this.getApplicationFeeStructure(this.uuid);
    this.getApplicationFeePayments(this.uuid);
    this.getPaymentMethods();
  }

  ngOnInit() 
  {
    this.paymentMethodForm = this.formbuilder.group({
      paymentMethod: ['', Validators.required],
    });

    this.feePaymentForm = this.formbuilder.group({
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

  async getApplicationFeeStructure(uuid : string) 
  {
    this.feeStructureClicked = true;
    this.feeStructureData = "";
    this.totalAmount = 0;
    this.totalPaid = 0;
    this.totalDue = 0;
    this.totalFeeTypes = 0;
    this.totalDiscountTypes = 0;
    let response = await this.admissionService.getApplicationFeeStructure(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.feeStructureData = response.feeStructure;
      this.masterFeeStructureData = response.feeStructure;
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
          this.feePaymentForm.controls['bankReference'].addValidators(Validators.required);
          this.feePaymentForm.updateValueAndValidity();
          this.feePaymentForm.get("bankReference").setValue("");
          this.isOtherPaymentMethod = true;
        }
        else
        {
          this.feePaymentForm.controls['bankReference'].removeValidators(Validators.required);
          this.feePaymentForm.updateValueAndValidity();
          this.feePaymentForm.get("bankReference").setValue("");
        }
      }
      else
      {
        this.feePaymentForm.controls['bankReference'].removeValidators(Validators.required);
        this.feePaymentForm.updateValueAndValidity();
        this.feePaymentForm.get("bankReference").setValue("");
      }
    }
    else
    {
      this.feePaymentForm.controls['bankReference'].removeValidators(Validators.required);
      this.feePaymentForm.updateValueAndValidity();
      this.feePaymentForm.get("bankReference").setValue("");
    }
  }

  feeAmountBifercation(totalAmount : number)
  {
    totalAmount = parseFloat(totalAmount.toString()) || 0;
    this.amounts = "";
    this.feeInstallmentIds = "";
    this.feeStructureData = JSON.parse(JSON.stringify(this.masterFeeStructureData));
    const grossAmount: number = this.totalDue;
    if (totalAmount <= grossAmount) 
    {
      for (let installment of this.feeStructureData?.installments || []) 
      {
        if (totalAmount > 0) 
        {
          let installmentAmount : number = parseFloat(installment.amount) - parseFloat(installment.amountPaid);
          if (installmentAmount >= totalAmount) 
          {
            installment.amountPaid = parseFloat(installment.amountPaid) + totalAmount;
            
            if(this.amounts == "")
            {
              this.amounts = totalAmount.toString();
            }
            else
            {
              this.amounts = this.amounts + "," + totalAmount;
            }
            totalAmount = 0;
            //////////
            if(this.feeInstallmentIds == "")
            {
              this.feeInstallmentIds = installment.id;
            }
            else
            {
              this.feeInstallmentIds = this.feeInstallmentIds + "," + installment.id;
            }
          } 
          else 
          {
            if(installmentAmount > 0)
            {
              installment.amountPaid = parseFloat(installment.amountPaid) + parseFloat(installmentAmount.toString());
              totalAmount -= installmentAmount;
              
              if(this.amounts == "")
              {
                this.amounts = installmentAmount.toString();              
              }
              else
              {
                this.amounts = this.amounts + "," + installmentAmount.toString();
              }
              //////////
              if(this.feeInstallmentIds == "")
              {
                this.feeInstallmentIds = installment.id;
              }
              else
              {
                this.feeInstallmentIds = this.feeInstallmentIds + "," + installment.id;
              }
            }
          }
        } 
      }
    } 
    else 
    {
      this.feePaymentForm.get("totalAmount").setValue("");
      this.showNotification('warning', "Amount Entered Is More Than Total Fees");
    }
  }

  prepareJSON()
  {
    let data : any = "";
    if(this.feeInstallmentIds != "" && this.amounts != "")
    {
      data = {
        "application" : {"uuid" : this.uuid},
        "applicationFeeInstallment" : {"id" : this.feeInstallmentIds},
        "paymentDate" : this.feePaymentForm.get("paymentDate").value,
        "paymentMethod" : {"id" : this.paymentMethodForm.get("paymentMethod").value},
        "bankReference" : this.feePaymentForm.get("bankReference").value,
        "totalAmount" : this.feePaymentForm.get("totalAmount").value,
        "amount" : this.amounts
      }
    }
    return data;
  }

  async saveFeePayment()
  {
    try
    {
      if(this.feePaymentForm.valid && this.paymentMethodForm.valid && !this.saveClicked)
      {
        if(parseFloat(this.feePaymentForm.get("totalAmount").value) == 0)
        {
          this.showNotification('warning', "Amount Should Be Greater Than Zero");
          this.feePaymentForm.get("totalAmount").setValue("");
          this.saveClicked = true;
        }
        else
        {
          this.isValidForm = true;
          this.saveClicked = true;
          let JSONData = this.prepareJSON();
          
          let response = await this.admissionService.saveFeePayment(JSONData).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification('success', "Fee Payment Saved");
            this.getApplicationFeeStructure(this.uuid);
            this.getApplicationFeePayments(this.uuid);
            this.feePaymentForm.reset();
            this.paymentMethodForm.reset();
            this.feePaymentForm.controls['application'].setValue({"uuid" : this.uuid});
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
    this.router.navigateByUrl("/feeCollections");
  }
}
