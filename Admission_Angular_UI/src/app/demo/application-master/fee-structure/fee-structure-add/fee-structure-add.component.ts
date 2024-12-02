import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fee-structure-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './fee-structure-add.component.html',
  styleUrls: ['./fee-structure-add.component.scss']
})
export class FeeStructureAddComponent 
{
  addFeeStructureForm: FormGroup;
  feeStructureInstallmentForm : FormGroup[];
  feeStructureFeeTypeForm : FormGroup[];
  feeStructureDiscountTypeForm : FormGroup[];
  feeStructureTaxRateForm : FormGroup[];
  schoolForm : FormGroup;
  currencyForm : FormGroup;
  feeCategoryForm : FormGroup;
  schoolingProgramForm : FormGroup;
  academicSessionForm : FormGroup;
  taxRateForm : FormGroup;
  batchYearForm : FormGroup;
  syllabusForm : FormGroup;
  gradeCategoryForm : FormGroup;
  searchClicked : boolean;
  searchClickedSchool : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedSyllabus : boolean;
  searchClickedCurrency : boolean;
  searchClickedFeeCategory : boolean;
  searchClickedGradeCategory : boolean;
  searchClickedBatchYear : boolean;
  searchClickedSchoolingProgram : boolean;
  searchClickedTaxRate : boolean;
  isValidForm : boolean;
  isValidForm1 : boolean;
  isValidForm2 : boolean;
  isValidForm3 : boolean;
  isValidForm4 : boolean;
  saveClicked : boolean;
  schools : any[];
  academicSessions : any[];
  batchYears : any[];
  syllabuses : any[];
  currencies : any[];
  feeCategories : any[];
  gradeCategories : any[];
  schoolingPrograms : any[];
  feeTypes : any[];
  discountTypes : any[];
  taxTypes : any[];
  taxRates : any[][];
  msgLabel : string[] = ['','','',''];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router,
    private location : Location)
  {
    this.schools = [];
    this.academicSessions = [];
    this.syllabuses = [];
    this.gradeCategories = [];
    this.batchYears = [];
    this.schoolingPrograms = [];
    this.currencies = [];
    this.feeCategories = [];
    this.feeTypes = [];
    this.discountTypes = [];
    this.taxTypes = [];
    this.taxRates = [];
    this.msgLabel[0] = "";
    this.msgLabel[1] = "";
    this.msgLabel[2] = "";
    this.msgLabel[3] = "";
  }

  ngOnInit() 
  {    
    this.searchClickedCurrency = false;
    this.searchClickedFeeCategory = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedSchool = false;
    this.searchClickedBatchYear = false;
    this.searchClickedSyllabus = false;
    this.searchClickedGradeCategory = false;
    this.searchClickedSchoolingProgram = false;
    this.searchClickedTaxRate = false;
    this.isValidForm = true;
    this.isValidForm1 = true;
    this.isValidForm2 = true;
    this.isValidForm3 = true;
    this.isValidForm4 = true;
    this.saveClicked = false;
    this.feeStructureInstallmentForm = [];
    this.feeStructureFeeTypeForm = [];
    this.feeStructureDiscountTypeForm = [];
    this.feeStructureTaxRateForm = [];

    this.addFeeStructureForm = this.formbuilder.group({
      school: this.formbuilder.group({ 'uuid': [''] }),
      schoolingProgram: this.formbuilder.group({ 'id': [''] }),
      academicSession: this.formbuilder.group({ 'id': [''] }),
      batchYear: this.formbuilder.group({ 'id': [''] }),
      syllabus: this.formbuilder.group({ 'id': [''] }),
      gradeCategory: this.formbuilder.group({ 'id': [''] }),
      currency: this.formbuilder.group({ 'id': [''] }),
      feeCategory: this.formbuilder.group({ 'id': [''] }),
      totalInstallment: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
      validityFrom: ['',[Validators.required]],
      validityTo: ['',[Validators.required]],
      taxApplicable: ['1',[Validators.required]]
    });

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['', Validators.required]
    });

    this.batchYearForm = this.formbuilder.group({
      batchYear:['', Validators.required]
    });

    this.schoolForm = this.formbuilder.group({
      school:['', Validators.required]
    });

    this.syllabusForm = this.formbuilder.group({
      syllabus:['', Validators.required]
    });

    this.schoolingProgramForm = this.formbuilder.group({
      schoolingProgram:['', Validators.required]
    });

    this.gradeCategoryForm = this.formbuilder.group({
      gradeCategory:['', Validators.required]
    });

    this.currencyForm = this.formbuilder.group({
      currency:['', Validators.required]
    });
    
    this.feeCategoryForm = this.formbuilder.group({
      feeCategory:['', Validators.required]
    });

    this.getAcademicSessions();
    this.getSchools('All');
    this.getSyllabuses(0, 'All');
    this.getCurrencies();
    this.getFeeCategories('Active');
    this.getFeeTypes('Active');
    this.getDiscountTypes('Active');
    this.getTaxTypes('Active');
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getFeeTypes(action : string) 
  {
    try
    {
        let response = await this.commonService.getFeeTypes(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.feeTypes = response.feeTypes;
            this.feeTypes.unshift({ id : "", name : "Select Fee Type" });
        }
        else
        {
            this.feeTypes.unshift({ id : "", name : "Select Fee Type" });
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
    }
  }

  async getDiscountTypes(action : string) 
  {
    try
    {
        let response = await this.commonService.getDiscountTypes(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.discountTypes = response.discountTypes;
            this.discountTypes.unshift({ id : "", name : "Select Discount Type" });
        }
        else
        {
            this.discountTypes.unshift({ id : "", name : "Select Discount Type" });
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
    }
  }

  async getTaxTypes(action : string) 
  {
    try
    {
      let response = await this.commonService.getTaxTypes(action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.taxTypes = response.taxTypes;
        this.taxTypes.unshift({ id : "", name : "Select Tax Type" });
      }
      else
      {
        this.taxTypes.unshift({ id : "", name : "Select Tax Type" });
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  async getTaxRates(academicSessionId : number, taxTypeId : number,  action : string, i : number) 
  {
    try
    {
      if(!academicSessionId)
      {
        this.showNotification("warning", "Select Academic Session");
        this.isTaxApplicable(0);
      }
      else if(academicSessionId && taxTypeId && action != "")
      {
        this.taxRates[i] = [];
        let response = await this.commonService.getTaxRates(academicSessionId, taxTypeId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.taxRates[i] = response.taxRates;
          this.taxRates[i].unshift({ id : "", rate : "Select Tax Rate" });
        }
        else
        {
          this.taxRates[i].unshift({ id : "", rate : "Select Tax Rate" });
        }
      }
      else
      {
        this.taxRates[i].unshift({ id : "", rate : "Select Tax Rate" });
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
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
      this.schoolingProgramForm.get("schoolingProgram").setValue("");
      this.searchClickedSchoolingProgram = true;
      let response = await this.commonService.getSchoolSchoolingPrograms(schoolUUID, action, "").toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
          this.schoolingPrograms = response.schoolSchoolingPrograms;
          this.schoolingPrograms.unshift({schoolingProgram : { id : "", name : "Select Schooling Program" }});
          this.searchClickedSchoolingProgram = false;
      }
      else
      {
          this.schoolingPrograms.unshift({schoolingProgram : { id : "", name : "Select Schooling Program" }});
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
      this.searchClickedBatchYear = true;  
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = JSON.parse(JSON.stringify(response.academicSessions));
        this.batchYears = JSON.parse(JSON.stringify(response.academicSessions));
        this.searchClickedAcademicSession = false;
        this.searchClickedBatchYear = false;
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        this.batchYears.unshift({"id" : "", "batchYear" : "Select Batch Year"});
      }
      else
      {
        this.academicSessions = [];
        this.batchYears = [];
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        this.batchYears.unshift({"id" : "", "batchYear" : "Select Batch Year"});
        this.searchClickedAcademicSession = false;
        this.searchClickedBatchYear = false;
      }
    }
    catch(e)
    {
      this.academicSessions = [];
      this.batchYears = [];
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
      this.searchClickedBatchYear = false;
    }
  }

  async getSyllabuses(gradeCategoryId : number, action : string) 
  {
    try
    {
        this.searchClickedSyllabus = true;
        let response = await this.commonService.getSyllabuses(gradeCategoryId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.syllabuses = response.syllabuses;
            this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
            this.searchClickedSyllabus = false;
        }
        else
        {
            this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
            this.searchClickedSyllabus = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSyllabus = false;
    }
  }

  async getGradeCategories(syllabusId : number) 
  {
    this.gradeCategoryForm.get("gradeCategory").setValue("");
    this.searchClickedGradeCategory = true;
    let filterGradeCategories = this.syllabuses.filter(syllabus => syllabus.id == syllabusId);
    if(filterGradeCategories.length > 0)
    {
      this.gradeCategories = [];
      this.gradeCategories = filterGradeCategories[0].gradeCategories;
      if (!this.gradeCategories.some(gradeCategory => gradeCategory.id === "")) 
      {
        this.gradeCategories.unshift({ id: "", name: "Select Grade Category" });
      }
      this.searchClickedGradeCategory = false;
      
    }
    else
    {
      this.gradeCategories = [];
      if (!this.gradeCategories.some(gradeCategory => gradeCategory.id === "")) 
      {
        this.gradeCategories.unshift({ id: "", name: "Select Grade Category" });
      }
      this.searchClickedGradeCategory = false;
    }
  }

  async getCurrencies() 
  {
    try
    {
        this.searchClickedCurrency = true;
        let response = await this.commonService.getCurrencies().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.currencies = response.currencies;
            this.currencies.unshift({ id : "", name : "Select Currency" });
            this.searchClickedCurrency = false;
        }
        else
        {
            this.currencies.unshift({ id : "", name : "Select Currency" });
            this.searchClickedCurrency = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedCurrency = false;
    }
  }

  async getFeeCategories(action : string) 
  {
    try
    {
        this.searchClickedFeeCategory = true;
        let response = await this.commonService.getFeeCategories(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.feeCategories = response.feeCategories;
            this.feeCategories.unshift({ id : "", name : "Select Fee Category" });
            this.searchClickedFeeCategory = false;
        }
        else
        {
            this.feeCategories.unshift({ id : "", name : "Select Fee Category" });
            this.searchClickedFeeCategory = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedFeeCategory = false;
    }
  }

  addInstallments(totalInstallment : number)
  {
    this.feeStructureInstallmentForm = [];
    for(let i : number=0;i<totalInstallment;i++)
    {
      let name = this.commonSharedService.getOrdinal((i+1), "Installment");
      this.feeStructureInstallmentForm[i] = this.formbuilder.group({
          name : new FormControl(name, Validators.required),
          installmentPercent : new FormControl('', [Validators.required, Validators.pattern('^[0-9.]{1,5}$')]),
          dueDate : new FormControl('', Validators.required)
      })
    }
  }

  addFeeType()
  {
    let i : number = this.feeStructureFeeTypeForm.length;
    if(i > 0)
    {
      if(this.feeStructureFeeTypeForm[i-1].valid)
      {
        this.isValidForm2 = true;
        this.feeStructureFeeTypeForm[i] = this.formbuilder.group({
            feeTypeId : new FormControl('', Validators.required),
            amount : new FormControl('', [Validators.required, Validators.pattern('^[0-9.]{1,11}$')])
        })
      }
      else
      {
        this.isValidForm2 = false;
      }
    }
    else
    {
      this.feeStructureFeeTypeForm[i] = this.formbuilder.group({
        feeTypeId : new FormControl('', Validators.required),
        amount : new FormControl('', [Validators.required, Validators.pattern('^[0-9.]{1,11}$')])
      })
    }
  }

  deleteFeeType()
  {
      let i : number = this.feeStructureFeeTypeForm.length - 1;
      this.feeStructureFeeTypeForm[i].controls['feeTypeId'].setValue("");
      this.feeStructureFeeTypeForm[i].controls['amount'].setValue("");
      this.feeStructureFeeTypeForm.splice(i, 1);
  }
  
  checkDuplicateFeeType(feeTypeId : number, i : number)
  {
    let tempFeeTypes = this.feeStructureFeeTypeForm.filter(form1 => form1.get('feeTypeId').value === feeTypeId);
    if(tempFeeTypes.length > 1)
    {
      this.showNotification("warning", "Fee Type Already In The List");
      this.feeStructureFeeTypeForm[i].controls['feeTypeId'].setValue("");
    }
  }

  addDiscountType()
  {
    let i : number = this.feeStructureDiscountTypeForm.length;
    if(i > 0)
    {
      if(this.feeStructureDiscountTypeForm[i-1].valid)
      {
        this.isValidForm3 = true;
        this.feeStructureDiscountTypeForm[i] = this.formbuilder.group({
            discountTypeId : new FormControl('', Validators.required),
            amount : new FormControl('', [Validators.required, Validators.pattern('^[0-9.]{1,11}$')])
        })
      }
      else
      {
        this.isValidForm3 = false;
      }
    }
    else
    {
      this.feeStructureDiscountTypeForm[i] = this.formbuilder.group({
        discountTypeId : new FormControl('', Validators.required),
        amount : new FormControl('', [Validators.required, Validators.pattern('^[0-9.]{1,11}$')])
      })
    }
  }

  deleteDiscountType()
  {
      let i : number = this.feeStructureDiscountTypeForm.length - 1;
      this.feeStructureDiscountTypeForm[i].controls['discountTypeId'].setValue("");
      this.feeStructureDiscountTypeForm[i].controls['amount'].setValue("");
      this.feeStructureDiscountTypeForm.splice(i, 1);
  }
  
  checkDuplicateDiscountType(discountTypeId : number, i : number)
  {
    let tempDiscountTypes = this.feeStructureDiscountTypeForm.filter(form1 => form1.get('discountTypeId').value === discountTypeId);
    if(tempDiscountTypes.length > 1)
    {
      this.showNotification("warning", "Discount Type Already In The List");
      this.feeStructureDiscountTypeForm[i].controls['discountTypeId'].setValue("");
    }
  }

  isTaxApplicable(value : number)
  {
    if(value == 0)
    {
      for(let i=0;i<this.feeStructureTaxRateForm.length;i++)
      {
        this.feeStructureTaxRateForm[i].controls['taxTypeId'].setValue("");
        this.feeStructureTaxRateForm[i].controls['taxRateId'].setValue("");
      }
      this.feeStructureTaxRateForm = [];
    }
  }

  addTaxRate()
  {
    let i : number = this.feeStructureTaxRateForm.length;
    if(i > 0)
    {
      if(this.feeStructureTaxRateForm[i-1].valid)
      {
        this.isValidForm4 = true;
        this.feeStructureTaxRateForm[i] = this.formbuilder.group({
            taxTypeId : new FormControl('', Validators.required),
            taxRateId : new FormControl('', Validators.required),
        })
      }
      else
      {
        this.isValidForm4 = false;
      }
    }
    else
    {
      this.feeStructureTaxRateForm[i] = this.formbuilder.group({
        taxTypeId : new FormControl('', Validators.required),
        taxRateId : new FormControl('', Validators.required),
      })
    }
  }

  deleteTaxRate()
  {
      let i : number = this.feeStructureTaxRateForm.length - 1;
      this.feeStructureTaxRateForm[i].controls['taxTypeId'].setValue("");
      this.feeStructureTaxRateForm[i].controls['taxRateId'].setValue("");
      this.feeStructureTaxRateForm.splice(i, 1);
  }
  
  checkDuplicateTaxRate(taxRateId : number, i : number)
  {
    let tempTaxRates = this.feeStructureTaxRateForm.filter(form1 => form1.get('taxRateId').value === taxRateId);
    if(tempTaxRates.length > 1)
    {
      this.showNotification("warning", "Tax Rate Already In The List");
      this.feeStructureTaxRateForm[i].controls['taxRateId'].setValue("");
    }
  }

  checkFormValidity(form : FormGroup[], k : number)
  {
    let isValid : boolean = false;
    let c : number = 0;
    let totalPercent : number = 0;
    for(let i=0;i<form.length;i++)
    {
      if(form[i].valid)
      {
        c++;
        if(k == 0)
        {
          totalPercent = totalPercent + parseFloat(form[i].get("installmentPercent").value);
        }
      }
    }
    if(form.length == c)
    {
      isValid = true;
      this.msgLabel[k] = "";
      if(k == 0 && totalPercent != 100)
      {
        this.msgLabel[k] = "Total Of Installment(%) Should Be 100";
      }
    }
    else
    {
      this.msgLabel[k] = "Please Fill All Entries";
    }
    return isValid;
  }

  createFinalJSON()
  {
    let tempJSON = this.addFeeStructureForm.value;
    tempJSON.school.uuid = this.schoolForm.get("school").value;
    tempJSON.schoolingProgram.id = this.schoolingProgramForm.get("schoolingProgram").value;
    tempJSON.academicSession.id = this.academicSessionForm.get("academicSession").value;
    tempJSON.batchYear.id = this.batchYearForm.get("batchYear").value;
    tempJSON.syllabus.id = this.syllabusForm.get("syllabus").value;
    tempJSON.gradeCategory.id = this.gradeCategoryForm.get("gradeCategory").value;
    tempJSON.feeCategory.id = this.feeCategoryForm.get("feeCategory").value;
    tempJSON.currency.id = this.currencyForm.get("currency").value;
 ///////////   
    let tempInstallmentJSON = [];
    for(let i=0;i<this.feeStructureInstallmentForm.length;i++)
    {
      tempInstallmentJSON.push(this.feeStructureInstallmentForm[i].value)
    }
    tempJSON['feeStructureInstallments'] = tempInstallmentJSON;
  ///////////   
    let tempFeeTypeJSON = [];
    for(let i=0;i<this.feeStructureFeeTypeForm.length;i++)
    {
      tempFeeTypeJSON.push({
        "feeType" : {"id" : this.feeStructureFeeTypeForm[i].get("feeTypeId").value},
        "amount" : this.feeStructureFeeTypeForm[i].get("amount").value
      })
    }
    tempJSON['feeStructureFeeTypes'] = tempFeeTypeJSON;
  ///////////   
    let tempDiscountTypeJSON = [];
    for(let i=0;i<this.feeStructureDiscountTypeForm.length;i++)
    {
      tempDiscountTypeJSON.push({
        "discountType" : {"id" : this.feeStructureDiscountTypeForm[i].get("discountTypeId").value},
        "amount" : this.feeStructureDiscountTypeForm[i].get("amount").value
      })
    }
    tempJSON['feeStructureDiscountTypes'] = tempDiscountTypeJSON;
  ///////////   
    let tempTaxRateJSON = [];
    for(let i=0;i<this.feeStructureTaxRateForm.length;i++)
    {
      tempTaxRateJSON.push({
        "taxType" : {"id" : this.feeStructureTaxRateForm[i].get("taxTypeId").value},
        "taxRate" : {"id" : this.feeStructureTaxRateForm[i].get("taxRateId").value}
      })
    }
    tempJSON['feeStructureTaxRates'] = tempTaxRateJSON;

    return tempJSON;
  }

  async saveFeeStructure()
  {
    if(!this.saveClicked)
    {
      if(this.addFeeStructureForm.valid && this.schoolForm.valid && this.schoolingProgramForm.valid && this.academicSessionForm.valid && this.batchYearForm.valid && this.syllabusForm.valid && this.gradeCategoryForm.valid && this.feeCategoryForm.valid && this.currencyForm.valid && this.feeStructureInstallmentForm.length > 0 && this.checkFormValidity(this.feeStructureInstallmentForm, 0) && this.feeStructureFeeTypeForm.length > 0 && this.checkFormValidity(this.feeStructureFeeTypeForm, 1) && this.checkFormValidity(this.feeStructureDiscountTypeForm, 3) && ((this.addFeeStructureForm.get("taxApplicable").value == 1 && this.feeStructureTaxRateForm.length > 0) || (this.addFeeStructureForm.get("taxApplicable").value == 0 && this.feeStructureTaxRateForm.length == 0)) && this.checkFormValidity(this.feeStructureTaxRateForm, 2))
      {
        this.msgLabel[0] = "";
        this.msgLabel[1] = "";
        this.msgLabel[2] = "";
        let finalJSON = this.createFinalJSON();
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.commonService.saveFeeStructure(finalJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Fee Structure Saved");
              this.router.navigateByUrl("/admissionMaster/feeStructure/detail/" + response.uuid);
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.isValidForm = false;
          this.saveClicked = false;
        }
      }
      else
      {
        if(this.feeStructureInstallmentForm.length == 0)
        {
          this.msgLabel[0] = "Please Fill The Details";
        }
        else
        {
          this.msgLabel[0] = "";
          this.checkFormValidity(this.feeStructureInstallmentForm, 0);
        }
        if(this.feeStructureFeeTypeForm.length == 0)
        {
          this.msgLabel[1] = "Please Fill The Details";
        }
        else
        {
          this.msgLabel[1] = "";
          this.checkFormValidity(this.feeStructureFeeTypeForm, 1);
        }
        if(this.addFeeStructureForm.get("taxApplicable").value == 1 && this.feeStructureTaxRateForm.length == 0)
        {
          this.msgLabel[2] = "Please Fill The Details";
        }
        else
        {
          this.msgLabel[2] = "";
          this.checkFormValidity(this.feeStructureTaxRateForm, 2);
        }
        this.isValidForm = false;
        this.saveClicked = false;
      }
    }
  }

  back()
  {
    this.location.back();
  }
}
