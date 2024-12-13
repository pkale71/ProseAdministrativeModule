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
  selector: 'app-b2c-application-stage-three',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './b2c-application-stage-three.component.html',
  styleUrls: ['./b2c-application-stage-three.component.scss']
})
export class B2cApplicationStageThreeComponent 
{
  uuid : string;
  studentProfileData : any;
  parentProfileData : any;
  addApplicationForm3 : FormGroup;
  parentCountryForm : FormGroup;
  parentStateForm : FormGroup;
  parentDistrictForm : FormGroup;
  parentCityForm : FormGroup;
  sportCountryForm : FormGroup;
  sportStateForm : FormGroup;
  sportDistrictForm : FormGroup;
  sportCityForm : FormGroup;
  formalCountryForm : FormGroup;
  formalStateForm : FormGroup;
  formalDistrictForm : FormGroup;
  formalCityForm : FormGroup;
  businessPartnerForm : FormGroup;
  coachForm : FormGroup;
  formalSyllabusForm : FormGroup;
  formalGradeForm : FormGroup;
  parentCountries : any[];
  parentStates : any[];
  parentDistricts : any[];
  parentCities : any[];
  sportCountries : any[];
  sportStates : any[];
  sportDistricts : any[];
  sportCities : any[];
  formalCountries : any[];
  formalStates : any[];
  formalDistricts : any[];
  formalCities : any[];
  businessPartners : any[];
  businessPartnerCoaches : any[];
  formalSyllabuses : any[];
  formalGrades : any[];
  studentDocuments : any[];
  saveClicked : boolean;
  isValidForm : boolean;
  parentCountryClicked : boolean;
  parentStateClicked : boolean;
  parentDistrictClicked : boolean;
  parentCityClicked : boolean;
  sportCountryClicked : boolean;
  sportStateClicked : boolean;
  sportDistrictClicked : boolean;
  sportCityClicked : boolean;
  formalCountryClicked : boolean;
  formalStateClicked : boolean;
  formalDistrictClicked : boolean;
  formalCityClicked : boolean;
  studentProfileClicked : boolean;
  parentProfileClicked : boolean;
  businessPartnerClicked : boolean;
  coachClicked : boolean;
  formalSyllabusClicked : boolean;
  formalGradeClicked : boolean;
  studentDocumentClicked : boolean;
  curDate : string;

  constructor(private notifier: NotifierService, 
  public commonSharedService : CommonSharedService,
  private commonService : CommonService,
  private admissionService : AdmissionService,
  private formbuilder: FormBuilder,
  private modalService: NgbModal, 
  private location : Location, 
  private route: ActivatedRoute,
  private router : Router, 
  private cdRef: ChangeDetectorRef)
  {
    this.uuid = this.route.params['value'].uuid;
    this.studentProfileClicked = false;
    this.parentProfileClicked = false;
    this.parentCountryClicked = false;
    this.parentStateClicked = false;
    this.parentDistrictClicked = false;
    this.parentCityClicked = false;
    this.sportCountryClicked = false;
    this.sportStateClicked = false;
    this.sportDistrictClicked = false;
    this.sportCityClicked = false;
    this.formalCountryClicked = false;
    this.formalStateClicked = false;
    this.formalDistrictClicked = false;
    this.formalCityClicked = false;
    this.businessPartnerClicked = false;
    this.coachClicked = false;
    this.formalSyllabusClicked = false;
    this.formalGradeClicked = false;
    this.studentDocumentClicked = false;
    this.isValidForm = true;
    this.saveClicked = false;
    this.parentCountries = [];
    this.parentStates = [];
    this.parentDistricts = [];
    this.parentCities = [];
    this.sportCountries = [];
    this.sportStates = [];
    this.sportDistricts = [];
    this.sportCities = [];
    this.formalCountries = [];
    this.formalStates = [];
    this.formalDistricts = [];
    this.formalCities = [];
    this.formalSyllabuses = [];
    this.formalGrades = [];
    this.studentDocuments = [];
    this,this.businessPartners = [];
    this.businessPartnerCoaches = [];
    this.studentDocuments = [];
    this.curDate = moment(new Date()).format('YYYY-MM-DD');
  }

  ngOnInit() 
  {
    this.parentCountryForm = this.formbuilder.group({
      parentCountry:['', Validators.required]
    });

    this.parentStateForm = this.formbuilder.group({
      parentState:['', Validators.required]
    });

    this.parentDistrictForm = this.formbuilder.group({
      parentDistrict:['', Validators.required]
    });

    this.parentCityForm = this.formbuilder.group({
      parentCity:['', Validators.required]
    });

    this.sportCountryForm = this.formbuilder.group({
      sportCountry:['']
    });

    this.sportStateForm = this.formbuilder.group({
      sportState:['']
    });

    this.sportDistrictForm = this.formbuilder.group({
      sportDistrict:['']
    });

    this.sportCityForm = this.formbuilder.group({
      sportCity:['']
    });

    this.businessPartnerForm = this.formbuilder.group({
      businessPartner:['']
    });

    this.coachForm = this.formbuilder.group({
      coach:['']
    });

    this.formalCountryForm = this.formbuilder.group({
      formalCountry:['']
    });

    this.formalStateForm = this.formbuilder.group({
      formalState:['']
    });

    this.formalDistrictForm = this.formbuilder.group({
      formalDistrict:['']
    });

    this.formalCityForm = this.formbuilder.group({
      formalCity:['']
    });

    this.formalSyllabusForm = this.formbuilder.group({
      formalSyllabus:['']
    });

    this.formalGradeForm = this.formbuilder.group({
      formalGrade:['']
    });

    this.addApplicationForm3 = this.formbuilder.group({
      application: this.formbuilder.group({ 'uuid': [this.uuid, Validators.required] }),
      dob : ['', Validators.required],
      nationality : ['', Validators.required],
      aadharNumber : ['', [Validators.required, Validators.pattern('^[0-9]{12,12}$'), Validators.minLength(12)]],
      passportNumber : [''],
      parentAddress : ['', Validators.required],
      parentAadharNumber : ['', [Validators.required, Validators.pattern('^[0-9]{12,12}$'), Validators.minLength(12)]],
      parentPassportNumber : ['', [Validators.minLength(8), Validators.minLength(10)]],
      parentPanNumber : ['', [Validators.pattern("^[a-zA-Z]{5}[0-9]{4}[A-Za-z]{1}$"), Validators.minLength(10)]],
      isPracticingSport : [''],
      engagementDate : [''],
      otherAcademyName : [''],
      academyAddress : [''],
      otherAcademyCoach : [''],
      studentUndergone : ['Home Schooling', Validators.required],
      formalSchoolName : [''],
      formalAddress : [''],
      formalMedium : [''],
      formalLastYear : ['', Validators.pattern('^[0-9]{1,4}$')],
      declarationCorrect : ['', Validators.required]

    });

    this.getApplicationStudentProfile(this.uuid);
    this.getApplicationParentProfile(this.uuid);
    this.getBusinessPartners();
    this.getCountries("Active");
    this.getFormalSyllabuses();
    this.getFormalGrades();
    this.getStudentDocuments();
    this.checkPracticingSport();
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  async getStudentDocuments() 
  {
    this.studentDocumentClicked = true;
    let response = await this.commonService.getStudentDocuments('Active').toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.studentDocuments = response.studentDocuments;    
        this.studentDocumentClicked = false;
    }
    else
    {
        this.studentDocuments = [];
        this.studentDocumentClicked = false;
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

  async getBusinessPartners() 
  {
    this.businessPartnerClicked = true;
    let response = await this.commonService.getBusinessPartners(1, 'Active').toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.businessPartners = response.businessPartners;
        this.businessPartners.unshift({"uuid" : "", "name" : "Others"});    
        this.businessPartnerClicked = false;
    }
    else
    {
        this.businessPartners = [];
        this.businessPartnerClicked = false;
    }
  }

  async getBusinessPartnerCoaches(uuid : string) 
  {
    this.coachForm.get("coach").setValue("");
    if(uuid != "")
    {
      this.coachClicked = true;
      let response = await this.commonService.getBusinessPartnerCoaches(uuid).toPromise(); 
      if (response.status_code == 200 && response.message == 'success') 
      {
          this.businessPartnerCoaches = response.businessPartnerCoaches;
          this.businessPartnerCoaches.unshift({coach : {"uuid" : "", "name" : "Other"}});    
          this.coachClicked = false;
      }
      else
      {
          this.businessPartnerCoaches = [];
          this.coachClicked = false;
      }
    }
    else
    {
      this.businessPartnerCoaches = [];
    }
  }

  async getFormalSyllabuses() 
  {
    this.formalSyllabusClicked = true;
    let response = await this.commonService.getSyllabuses(0, 'Active').toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.formalSyllabuses = response.syllabuses;
        this.formalSyllabuses.unshift({"id" : "", "name" : "Select Syllabus"});    
        this.formalSyllabusClicked = false;
    }
    else
    {
        this.formalSyllabuses = [];
        this.formalSyllabusClicked = false;
    }
  }

  async getFormalGrades() 
  {
    this.formalGradeClicked = true;
    let response = await this.commonService.getGrades(0, 'Active').toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.formalGrades = response.grades;
        this.formalGrades.unshift({"id" : "", "name" : "Select Grade"});    
        this.formalGradeClicked = false;
    }
    else
    {
        this.formalGrades = [];
        this.formalGradeClicked = false;
    }
  }

  //get country
  async getCountries(action : string) 
  {  
      try
      {
          this.parentCountryClicked = true;
          this.sportCountryClicked = true;
          this.formalCountryClicked = true;
          let response = await this.commonService.getCountries(action).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.parentCountries = response.countries;
              this.parentCountries.unshift({ id : '', name : 'Select Country'});

              this.sportCountries = this.parentCountries;
              this.formalCountries = this.parentCountries;

              this.parentCountryClicked = false;
              this.sportCountryClicked = false;
              this.formalCountryClicked = false;
          }
          else
          { 
              this.parentCountries = [];
              this.sportCountries = [];
              this.formalCountries = [];
              this.parentCountries.unshift({ id : '', name : 'Select Country'});
              this.sportCountries.unshift({ id : '', name : 'Select Country'});
              this.formalCountries.unshift({ id : '', name : 'Select Country'});
              this.parentCountryClicked = false;
              this.sportCountryClicked = false;
              this.formalCountryClicked = false;
          }
      }
      catch(e)
      {
          this.showNotification("error", e);
          this.parentCountries = [];
          this.sportCountries = [];
          this.formalCountries = [];
          this.parentCountryClicked = false;
          this.sportCountryClicked = false;
          this.formalCountryClicked = false;
      }
  }
  
  //get state/region
  async getStateRegions(action : string, countryId : number, dataFor : string, selId : number = 0) 
  {  
    try
    {
      if(countryId != undefined && countryId > 0)
      {
        if(dataFor == "Parent")
        {
          this.parentStateClicked = true;  
          this.parentStateForm.get("parentState").setValue("");
        }
        else if(dataFor == "Sport")
        {
          this.sportStateClicked = true;  
          this.sportStateForm.get("sportState").setValue("");
        }
        else if(dataFor == "Formal")
        {
          this.formalStateClicked = true;  
          this.formalStateForm.get("formalState").setValue("");
        }
        let response = await this.commonService.getStateRegions(countryId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        { 
          if(dataFor == "Parent")
          {
            this.parentStates = response.stateRegions;
            this.parentStates.unshift({ id : '', name : 'Select State/Region'});
          ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.parentStateClicked = false;
          }
          else if(dataFor == "Sport")
          {
            this.sportStates = response.stateRegions;
            this.sportStates.unshift({ id : '', name : 'Select State/Region'});
      ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.sportStateClicked = false;
          }
          else if(dataFor == "Formal")
          {
            this.formalStates = response.stateRegions;
            this.formalStates.unshift({ id : '', name : 'Select State/Region'});
      ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.formalStateClicked = false;
          }
          if(selId > 0)
          {
            if(dataFor == "Parent")
            {
              this.parentStateForm.get("parentState").setValue(selId);
              ///Detect Change
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
            else if(dataFor == "Sport")
            {
              this.sportStateForm.get("sportState").setValue(selId);
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
            else if(dataFor == "Formal")
            {
              this.formalStateForm.get("formalState").setValue(selId);
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
          }
        }
        else
        {
          if(dataFor == "Parent")
          {
            this.parentStates = [];
            this.parentStates.unshift({ id : '', name : 'Select State/Region'});
            this.parentStateClicked = false;
          }
          else if(dataFor == "Sport")
          {
            this.sportStates = [];
            this.sportStates.unshift({ id : '', name : 'Select State/Region'});
            this.sportStateClicked = false;
          }
          else if(dataFor == "Formal")
          {
            this.formalStates = [];
            this.formalStates.unshift({ id : '', name : 'Select State/Region'});
            this.formalStateClicked = false;
          }
        }
      }
      else
      {
        if(dataFor == "Parent")
        {
          this.parentStates = [];
          this.parentStates.unshift({ id : '', name : 'Select State/Region'});
        }
        else if(dataFor == "Sport")
        {
          this.sportStates = [];
          this.sportStates.unshift({ id : '', name : 'Select State/Region'});
        }
        else if(dataFor == "Formal")
        {
          this.formalStates = [];
          this.formalStates.unshift({ id : '', name : 'Select State/Region'});
        }
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
      if(dataFor == "Parent")
      {
        this.parentStateClicked = false;
      }
      else if(dataFor == "Sport")
      {
        this.sportStateClicked = false;
      }
      else if(dataFor == "Formal")
      {
        this.formalStateClicked = false;
      }
    }
  }
  
  // get district
  async getDistricts(action : string, countryId : number, stateRegionId : number, dataFor : string, selId : number = 0) 
  {  
    try
    {
      if(countryId != undefined && countryId > 0 && stateRegionId != undefined && stateRegionId > 0)
      {
        if(dataFor == "Parent")
        {
          this.parentDistrictClicked = true;  
          this.parentDistrictForm.get("parentDistrict").setValue("");
        }
        else if(dataFor == "Sport")
        {
          this.sportDistrictClicked = true;  
          this.sportDistrictForm.get("sportDistrict").setValue("");
        }
        else if(dataFor == "Formal")
        {
          this.formalDistrictClicked = true;  
          this.formalDistrictForm.get("formalDistrict").setValue("");
        }
        let response = await this.commonService.getDistricts(countryId, stateRegionId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        { 
          if(dataFor == "Parent")
          {
            this.parentDistricts = response.districts;
            this.parentDistricts.unshift({ id : '', name : 'Select District'});
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.parentDistrictClicked = false;
          }
          else if(dataFor == "Sport")
          {
            this.sportDistricts = response.districts;
            this.sportDistricts.unshift({ id : '', name : 'Select District'});
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.sportDistrictClicked = false;
          }
          else if(dataFor == "Formal")
          {
            this.formalDistricts = response.districts;
            this.formalDistricts.unshift({ id : '', name : 'Select District'});
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.formalDistrictClicked = false;
          }

          if(selId > 0)
          {
            if(dataFor == "Parent")
            {
              this.parentDistrictForm.get("parentDistrict").setValue(selId);
              ///Detect Change
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
            else if(dataFor == "Sport")
            {
              this.sportDistrictForm.get("sportDistrict").setValue(selId);
              ///Detect Change
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
            else if(dataFor == "Formal")
            {
              this.formalDistrictForm.get("formalDistrict").setValue(selId);
              ///Detect Change
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
          }
        }
        else
        {
          if(dataFor == "Parent")
          {
            this.parentDistricts = [];
            this.parentDistricts.unshift({ id : '', name : 'Select District'});
            this.parentDistrictClicked = false;
          }
          else if(dataFor == "Sport")
          {
            this.sportDistricts = [];
            this.sportDistricts.unshift({ id : '', name : 'Select District'});
            this.sportDistrictClicked = false;
          }
          else if(dataFor == "Formal")
          {
            this.formalDistricts = [];
            this.formalDistricts.unshift({ id : '', name : 'Select District'});
            this.formalDistrictClicked = false;
          }
        }
      }
      else
      {
        if(dataFor == "Parent")
        {
          this.parentDistricts = [];
          this.parentDistricts.unshift({ id : '', name : 'Select District'});
        }
        else if(dataFor == "Sport")
        {
          this.sportDistricts = [];
          this.sportDistricts.unshift({ id : '', name : 'Select District'});
        }
        else if(dataFor == "Formal")
        {
          this.formalDistricts = [];
          this.formalDistricts.unshift({ id : '', name : 'Select District'});
        }
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
      if(dataFor == "Parent")
      {
        this.parentDistrictClicked = false;
      }
      else if(dataFor == "Sport")
      {
        this.sportDistrictClicked = false;
      }
      else if(dataFor == "Formal")
      {
        this.formalDistrictClicked = false;
      }
    }
  }

  //get city
  async getCities(action : string, countryId : number, stateRegionId : number, districtId : number, dataFor : string, selId : number = 0) 
  {  
    try
    {
      if(countryId != undefined && countryId > 0 && stateRegionId != undefined && stateRegionId > 0 && districtId != undefined && districtId > 0)
      {
        if(dataFor == "Parent")
        {
          this.parentCityClicked = true;  
          this.parentCityForm.get("parentCity").setValue("");
        }
        else if(dataFor == "Sport")
        {
          this.sportCityClicked = true;  
          this.sportCityForm.get("sportCity").setValue("");
        }
        else if(dataFor == "Formal")
        {
          this.formalCityClicked = true;  
          this.formalCityForm.get("formalCity").setValue("");
        }
        let response = await this.commonService.getCities(countryId, stateRegionId, districtId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        { 
          if(dataFor == "Parent")
          {
            this.parentCities = response.cities;
            this.parentCities.unshift({ id : '', name : 'Select City'});
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.parentCityClicked = false;
          }
          else if(dataFor == "Sport")
          {
            this.sportCities = response.cities;
            this.sportCities.unshift({ id : '', name : 'Select City'});
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.sportCityClicked = false;
          }
          else if(dataFor == "Formal")
          {
            this.formalCities = response.cities;
            this.formalCities.unshift({ id : '', name : 'Select City'});
            ///Detect Change
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            this.formalCityClicked = false;
          }

          if(selId > 0)
          {
            if(dataFor == "Parent")
            {
              this.parentCityForm.get("parentCity").setValue(selId);
              ///Detect Change
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
            else if(dataFor == "Sport")
            {
              this.sportCityForm.get("sportCity").setValue(selId);
              ///Detect Change
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
            else if(dataFor == "Sport")
            {
              this.formalCityForm.get("formalCity").setValue(selId);
              ///Detect Change
              this.cdRef.markForCheck();
              this.cdRef.detectChanges();
            }
          }
        }
        else
        {
          if(dataFor == "Parent")
          {
            this.parentCities = [];
            this.parentCities.unshift({ id : '', name : 'Select City'});
            this.parentCityClicked = false;
          }
          else if(dataFor == "Sport")
          {
            this.sportCities = [];
            this.sportCities.unshift({ id : '', name : 'Select City'});
            this.sportCityClicked = false;
          }
          else if(dataFor == "Formal")
          {
            this.formalCities = [];
            this.formalCities.unshift({ id : '', name : 'Select City'});
            this.formalCityClicked = false;
          }
        }
      }
      else
      {
        if(dataFor == "Parent")
        {
          this.parentCities = [];
          this.parentCities.unshift({ id : '', name : 'Select City'});
        }
        else if(dataFor == "Sport")
        {
          this.sportCities = [];
          this.sportCities.unshift({ id : '', name : 'Select City'});
        }
        else if(dataFor == "Formal")
        {
          this.formalCities = [];
          this.formalCities.unshift({ id : '', name : 'Select City'});
        }
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
      if(dataFor == "Parent")
      {
        this.parentCityClicked = false;
      }
      else if(dataFor == "Sport")
      {
        this.sportCityClicked = false;
      }
      else if(dataFor == "Formal")
      {
        this.formalCityClicked = false;
      }
    }
  }

  checkPracticingSport()
  {
    if($("#isPracticingSport").prop('checked'))
    {
      this.addApplicationForm3.get("isPracticingSport")?.setValue("1");

      this.addApplicationForm3.controls['engagementDate'].addValidators(Validators.required);
      this.addApplicationForm3.updateValueAndValidity();
      this.sportCountryForm.controls['sportCountry'].addValidators(Validators.required);
      this.sportCountryForm.controls['sportCountry'].updateValueAndValidity();
      this.sportStateForm.controls['sportState'].addValidators(Validators.required);
      this.sportStateForm.controls['sportState'].updateValueAndValidity();
      this.sportDistrictForm.controls['sportDistrict'].addValidators(Validators.required);
      this.sportDistrictForm.controls['sportDistrict'].updateValueAndValidity();
      this.sportCityForm.controls['sportCity'].addValidators(Validators.required);
      this.sportCityForm.controls['sportCity'].updateValueAndValidity();

      this.addApplicationForm3.controls["engagementDate"].enable();
      this.businessPartnerForm.controls['businessPartner'].enable();
      this.addApplicationForm3.controls['otherAcademyName'].enable();
      this.sportCountryForm.controls['sportCountry'].enable();
      this.sportStateForm.controls['sportState'].enable();
      this.sportDistrictForm.controls['sportDistrict'].enable();
      this.sportCityForm.controls['sportCity'].enable();
      this.addApplicationForm3.controls['academyAddress'].enable();
      this.addApplicationForm3.controls['otherAcademyCoach'].enable();
      this.addApplicationForm3.controls['otherAcademyName'].setValue("");
      this.addApplicationForm3.controls['otherAcademyName'].addValidators(Validators.required);
      this.addApplicationForm3.controls['academyAddress'].setValue("");
      this.addApplicationForm3.controls['otherAcademyCoach'].setValue("");
      this.addApplicationForm3.controls['otherAcademyCoach'].addValidators(Validators.required);
      this.addApplicationForm3.get("engagementDate").setValue("");
      this.businessPartnerForm.get("businessPartner").setValue("");
      this.sportCountryForm.get("sportCountry").setValue("");
      this.sportStateForm.get("sportState").setValue("");
      this.sportDistrictForm.get("sportDistrict").setValue("");
      this.sportCityForm.get("sportCity").setValue("");      
    }
    else
    {
      this.addApplicationForm3.get("isPracticingSport")?.setValue("");

      this.addApplicationForm3.controls['engagementDate'].removeValidators(Validators.required);
      this.addApplicationForm3.updateValueAndValidity();
      this.sportCountryForm.controls['sportCountry'].removeValidators(Validators.required);
      this.sportCountryForm.controls['sportCountry'].updateValueAndValidity();
      this.sportStateForm.controls['sportState'].removeValidators(Validators.required);
      this.sportStateForm.controls['sportState'].updateValueAndValidity();
      this.sportDistrictForm.controls['sportDistrict'].removeValidators(Validators.required);
      this.sportDistrictForm.controls['sportDistrict'].updateValueAndValidity();
      this.sportCityForm.controls['sportCity'].removeValidators(Validators.required);
      this.sportCityForm.controls['sportCity'].updateValueAndValidity();

      this.addApplicationForm3.controls["engagementDate"].disable();
      this.businessPartnerForm.controls['businessPartner'].disable();
      this.addApplicationForm3.controls['otherAcademyName'].disable();
      this.sportCountryForm.controls['sportCountry'].disable();
      this.sportStateForm.controls['sportState'].disable();
      this.sportDistrictForm.controls['sportDistrict'].disable();
      this.sportCityForm.controls['sportCity'].disable();
      this.addApplicationForm3.controls['academyAddress'].disable();
      this.addApplicationForm3.controls['otherAcademyCoach'].disable();
      this.addApplicationForm3.controls['otherAcademyName'].setValue("");
      this.addApplicationForm3.controls['otherAcademyName'].addValidators(Validators.required);
      this.addApplicationForm3.controls['academyAddress'].setValue("");
      this.addApplicationForm3.controls['otherAcademyCoach'].setValue("");
      this.addApplicationForm3.controls['otherAcademyCoach'].addValidators(Validators.required);
      this.addApplicationForm3.get("engagementDate").setValue("");
      this.businessPartnerForm.get("businessPartner").setValue("");
      this.sportCountryForm.get("sportCountry").setValue("");
      this.sportStateForm.get("sportState").setValue("");
      this.sportDistrictForm.get("sportDistrict").setValue("");
      this.sportCityForm.get("sportCity").setValue("");
    }
  }

  async getBusinessPartnerData(uuid : string)
  {
    if(uuid != "")
    {
      this.addApplicationForm3.controls['otherAcademyName'].disable();
      this.sportCountryForm.controls['sportCountry'].disable();
      this.sportStateForm.controls['sportState'].disable();
      this.sportDistrictForm.controls['sportDistrict'].disable();
      this.sportCityForm.controls['sportCity'].disable();
      this.addApplicationForm3.controls['academyAddress'].disable();
      this.addApplicationForm3.controls['otherAcademyName'].setValue("");
      this.addApplicationForm3.controls['otherAcademyName'].removeValidators(Validators.required);
      this.addApplicationForm3.controls['academyAddress'].setValue("");

      this.sportCountryForm.controls['sportCountry'].addValidators(Validators.required);
      this.sportCountryForm.controls['sportCountry'].updateValueAndValidity();
      this.sportStateForm.controls['sportState'].addValidators(Validators.required);
      this.sportStateForm.controls['sportState'].updateValueAndValidity();
      this.sportDistrictForm.controls['sportDistrict'].addValidators(Validators.required);
      this.sportDistrictForm.controls['sportDistrict'].updateValueAndValidity();
      this.sportCityForm.controls['sportCity'].addValidators(Validators.required);
      this.sportCityForm.controls['sportCity'].updateValueAndValidity();
      
  //////Get Coaches
      this.getBusinessPartnerCoaches(uuid);
  /////
      this.showNotification('info', "Fetching & Validating Academy Partner....");
      let businessPartner : any = this.businessPartners.filter(bp=>bp.uuid === uuid);
      if(businessPartner.length > 0)
      {
        try
        {
          let response = await this.commonService.getBusinessPartner(businessPartner[0]?.uuid).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            businessPartner = response.businessPartner;
            if(businessPartner != "")
            {
              this.sportCountryForm.get("sportCountry").setValue(businessPartner?.country?.id);
              this.addApplicationForm3.get("academyAddress").setValue(businessPartner?.address);
              this.getStateRegions('Active', businessPartner?.country?.id, "Sport", businessPartner?.stateRegion?.id);
              
              this.getDistricts('Active', businessPartner?.country?.id, businessPartner?.stateRegion?.id, "Sport", businessPartner?.district?.id);
              
              this.getCities('Active', businessPartner?.country?.id, businessPartner?.stateRegion?.id, businessPartner?.district?.id, "Sport", businessPartner?.city?.id);
              
              // this.showNotification('success', "Academy Partner Data Fetched And Validated");
            }
          }
        }
        catch(e)
        {
          this.sportCountryForm.get("sportCountry").setValue("");
          this.sportStateForm.get("sportState").setValue("");
          this.sportDistrictForm.get("sportDistrict").setValue("");
          this.sportCityForm.get("sportCity").setValue("");
          this.addApplicationForm3.get("academyAddress").setValue("");
          this.addApplicationForm3.get("otherAcademyCoach").setValue("");
          this.coachForm.get("coach").setValue("");
          this.sportStates = [];
          this.sportDistricts = [];
          this.sportCities = [];
          this.businessPartnerCoaches = [];
          this.showNotification("error", e);
        }
      }
      else
      {
        this.sportCountryForm.get("sportCountry").setValue("");
        this.sportStateForm.get("sportState").setValue("");
        this.sportDistrictForm.get("sportDistrict").setValue("");
        this.sportCityForm.get("sportCity").setValue("");
        this.addApplicationForm3.get("academyAddress").setValue("");
        this.addApplicationForm3.get("otherAcademyCoach").setValue("");
        this.sportStates = [];
        this.sportDistricts = [];
        this.sportCities = [];
        this.businessPartnerCoaches = [];
      }      
    }
    else
    {
      this.addApplicationForm3.controls['otherAcademyName'].enable();
      this.sportCountryForm.controls['sportCountry'].enable();
      this.sportStateForm.controls['sportState'].enable();
      this.sportDistrictForm.controls['sportDistrict'].enable();
      this.sportCityForm.controls['sportCity'].enable();
      this.addApplicationForm3.controls['academyAddress'].enable();
      this.addApplicationForm3.controls['otherAcademyName'].setValue("");
      this.sportCountryForm.controls['sportCountry'].setValue("");
      this.sportStateForm.controls['sportState'].setValue("");
      this.sportDistrictForm.controls['sportDistrict'].setValue("");
      this.sportCityForm.controls['sportCity'].setValue("");
      this.addApplicationForm3.controls['academyAddress'].setValue("");
      this.addApplicationForm3.controls['otherAcademyName'].addValidators(Validators.required);

      this.sportCountryForm.controls['sportCountry'].addValidators(Validators.required);
      this.sportCountryForm.controls['sportCountry'].updateValueAndValidity();
      this.sportStateForm.controls['sportState'].addValidators(Validators.required);
      this.sportStateForm.controls['sportState'].updateValueAndValidity();
      this.sportDistrictForm.controls['sportDistrict'].addValidators(Validators.required);
      this.sportDistrictForm.controls['sportDistrict'].updateValueAndValidity();
      this.sportCityForm.controls['sportCity'].addValidators(Validators.required);
      this.sportCityForm.controls['sportCity'].updateValueAndValidity();

      this.sportStates = [];
      this.sportDistricts = [];
      this.sportCities = [];
    }
    this.addApplicationForm3.updateValueAndValidity();
  }

  checkCoach(uuid : string)
  {
    if(uuid == "")
    {
      this.addApplicationForm3.controls['otherAcademyCoach'].enable();
      this.addApplicationForm3.controls['otherAcademyCoach'].setValue("");
      this.addApplicationForm3.controls['otherAcademyCoach'].addValidators(Validators.required);
    }
    else
    {
      this.addApplicationForm3.controls['otherAcademyCoach'].disable();
      this.addApplicationForm3.controls['otherAcademyCoach'].setValue("");
      this.addApplicationForm3.controls['otherAcademyCoach'].removeValidators(Validators.required);
    }
    this.addApplicationForm3.updateValueAndValidity();
  }

  applyFormalRequired(name : string)
  {
    if(name == "Formal Education")
    {
      this.addApplicationForm3.get("formalSchoolName").addValidators(Validators.required);
      this.addApplicationForm3.get("formalAddress").addValidators(Validators.required);
      this.addApplicationForm3.get("formalMedium").addValidators(Validators.required);
      this.addApplicationForm3.get("formalLastYear").addValidators(Validators.required);
      this.formalCountryForm.get("formalCountry").addValidators(Validators.required);
      this.formalStateForm.get("formalState").addValidators(Validators.required);
      this.formalDistrictForm.get("formalDistrict").addValidators(Validators.required);
      this.formalCityForm.get("formalCity").addValidators(Validators.required);
      this.formalSyllabusForm.get("formalSyllabus").addValidators(Validators.required);
      this.formalGradeForm.get("formalGrade").addValidators(Validators.required);

      this.addApplicationForm3.updateValueAndValidity();
      this.formalCountryForm.updateValueAndValidity();
      this.formalStateForm.updateValueAndValidity();
      this.formalDistrictForm.updateValueAndValidity();
      this.formalCityForm.updateValueAndValidity();
      this.formalSyllabusForm.updateValueAndValidity();
      this.formalGradeForm.updateValueAndValidity();

      this.addApplicationForm3.get("formalSchoolName").setValue("");
      this.addApplicationForm3.get("formalAddress").setValue("");
      this.addApplicationForm3.get("formalMedium").setValue("");
      this.addApplicationForm3.get("formalLastYear").setValue("");
      this.formalCountryForm.get("formalCountry").setValue("");
      this.formalStateForm.get("formalState").setValue("");
      this.formalDistrictForm.get("formalDistrict").setValue("");
      this.formalCityForm.get("formalCity").setValue("");
      this.formalSyllabusForm.get("formalSyllabus").setValue("");
      this.formalGradeForm.get("formalGrade").setValue("");
    }
    else
    {
      this.addApplicationForm3.get("formalSchoolName").removeValidators(Validators.required);
      this.addApplicationForm3.get("formalAddress").removeValidators(Validators.required);
      this.addApplicationForm3.get("formalMedium").removeValidators(Validators.required);
      this.addApplicationForm3.get("formalLastYear").removeValidators(Validators.required);
      this.formalCountryForm.get("formalCountry").removeValidators(Validators.required);
      this.formalStateForm.get("formalState").removeValidators(Validators.required);
      this.formalDistrictForm.get("formalDistrict").removeValidators(Validators.required);
      this.formalCityForm.get("formalCity").removeValidators(Validators.required);
      this.formalSyllabusForm.get("formalSyllabus").removeValidators(Validators.required);
      this.formalGradeForm.get("formalGrade").removeValidators(Validators.required);

      this.addApplicationForm3.updateValueAndValidity();
      this.formalCountryForm.updateValueAndValidity();
      this.formalStateForm.updateValueAndValidity();
      this.formalDistrictForm.updateValueAndValidity();
      this.formalCityForm.updateValueAndValidity();
      this.formalSyllabusForm.updateValueAndValidity();
      this.formalGradeForm.updateValueAndValidity();

      this.addApplicationForm3.get("formalSchoolName").setValue("");
      this.addApplicationForm3.get("formalAddress").setValue("");
      this.addApplicationForm3.get("formalMedium").setValue("");
      this.addApplicationForm3.get("formalLastYear").setValue("");
      this.formalCountryForm.get("formalCountry").setValue("");
      this.formalStateForm.get("formalState").setValue("");
      this.formalDistrictForm.get("formalDistrict").setValue("");
      this.formalCityForm.get("formalCity").setValue("");
      this.formalSyllabusForm.get("formalSyllabus").setValue("");
      this.formalGradeForm.get("formalGrade").setValue("");
    }
  }

  prepareDataJSON()
  {
    let dataJSON = {
      "application" : {"uuid" : this.uuid},
      "dob" : this.addApplicationForm3.get("dob").value,
      "nationality" : this.addApplicationForm3.get("nationality").value,
      "aadharNumber" : this.addApplicationForm3.get("aadharNumber").value,
      "passportNumber" : this.addApplicationForm3.get("passportNumber").value || "",
      "parentAddress" : this.addApplicationForm3.get("parentAddress").value,
      "parentAadharNumber" : this.addApplicationForm3.get("parentAadharNumber").value,
      "parentPassportNumber" : this.addApplicationForm3.get("parentPassportNumber").value || "",
      "parentPanNumber" : this.addApplicationForm3.get("parentPanNumber").value || "",
      "parentCountry" : {"id" : this.parentCountryForm.get("parentCountry").value},
      "parentState" : {"id" : this.parentStateForm.get("parentState").value},
      "parentDistrict" : {"id" : this.parentDistrictForm.get("parentDistrict").value},
      "parentCity" : {"id" : this.parentCityForm.get("parentCity").value}, 
      "isPracticingSport" : this.addApplicationForm3.get("isPracticingSport")?.value || "0",
      "engagementDate" : this.addApplicationForm3.get("engagementDate").value || "",
      "businessPartner" : {"uuid" : this.businessPartnerForm.get("businessPartner").value},
      "coach" : {"uuid" : (this.coachForm.get("coach").value != '' ? this.coachForm.get("coach").value : "")},
      "otherAcademyName" : (this.businessPartnerForm.get("businessPartner").value == '' ? this.addApplicationForm3.get("otherAcademyName").value : ""),
      "otherAcademyAddress" : (this.businessPartnerForm.get("businessPartner").value == '' ? this.addApplicationForm3.get("academyAddress").value : ""),
      "otherAcademyCountry" : {"id" : (this.businessPartnerForm.get("businessPartner").value == '' ? this.sportCountryForm.get("sportCountry").value : "")},
      "otherAcademyState" : {"id" : (this.businessPartnerForm.get("businessPartner").value == '' ? this.sportStateForm.get("sportState").value : "")},
      "otherAcademyDistrict" : {"id" : (this.businessPartnerForm.get("businessPartner").value == '' ? this.sportDistrictForm.get("sportDistrict").value : "")},
      "otherAcademyCity" : {"id" : (this.businessPartnerForm.get("businessPartner").value == '' ? this.sportCityForm.get("sportCity").value : "")},
      "otherAcademyCoach" : this.addApplicationForm3.get("otherAcademyCoach").value || "",
      "studentUndergone" : this.addApplicationForm3.get("studentUndergone").value,
      "formalSchoolName" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.addApplicationForm3.get("formalSchoolName").value : ""),
      "formalSchoolAddress" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.addApplicationForm3.get("formalAddress").value : ""),
      "formalCountry" : {"id" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.formalCountryForm.get("formalCountry").value : "")},
      "formalState" : {"id" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.formalStateForm.get("formalState").value : "")},
      "formalDistrict" : {"id" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.formalDistrictForm.get("formalDistrict").value : "")},
      "formalCity" : {"id" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.formalCityForm.get("formalCity").value : "")},
      "formalSyllabus" : {"id" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.formalSyllabusForm.get("formalSyllabus").value : "")},
      "formalGrade" : {"id" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.formalGradeForm.get("formalGrade").value : "")},
      "formalMedium" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.addApplicationForm3.get("formalMedium").value : ""),
      "formalLastAcademicYear" : (this.addApplicationForm3.get("studentUndergone").value == 'Formal Education' ? this.addApplicationForm3.get("formalLastYear").value : ""),
      "declarationCorrect" : this.addApplicationForm3.get("declarationCorrect").value
    }
    return(dataJSON);
  }

  async saveApplicationForm3()
  {
    try
    {
      if(this.businessPartnerForm.get("businessPartner").value != "" || this.addApplicationForm3.get("isPracticingSport")?.value == undefined || this.addApplicationForm3.get("isPracticingSport")?.value == "")
      {
        this.sportCountryForm.controls['sportCountry'].enable();
        this.sportStateForm.controls['sportState'].enable();
        this.sportDistrictForm.controls['sportDistrict'].enable();
        this.sportCityForm.controls['sportCity'].enable();
        this.addApplicationForm3.controls['academyAddress'].enable();
      }
      if(this.addApplicationForm3.get("isPracticingSport")?.value == "0")
      {
        this.addApplicationForm3.controls["engagementDate"].enable();
        this.businessPartnerForm.controls['businessPartner'].enable();
      }
      
      if(this.addApplicationForm3.valid && this.parentCountryForm.valid && this.parentStateForm.valid && this.parentDistrictForm.valid && this.parentCityForm.valid && this.sportCountryForm.valid && this.sportStateForm.valid && this.sportDistrictForm.valid && this.sportCityForm.valid && !this.saveClicked)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        let dataJSON = this.prepareDataJSON();
      
        if(this.addApplicationForm3.get("isPracticingSport")?.value == "0")
        {
          this.addApplicationForm3.controls["engagementDate"].disable();
          this.businessPartnerForm.controls['businessPartner'].disable();
        }
        if(this.businessPartnerForm.get("businessPartner").value != "")
        {
          this.sportCountryForm.controls['sportCountry'].disable();
          this.sportStateForm.controls['sportState'].disable();
          this.sportDistrictForm.controls['sportDistrict'].disable();
          this.sportCityForm.controls['sportCity'].disable();
          this.addApplicationForm3.controls['academyAddress'].disable();
        }
        let response = await this.admissionService.saveB2CApplicationForm3(dataJSON).toPromise();
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
        this.saveClicked = false;
      }
      else
      {
        this.isValidForm = false;
        if(this.businessPartnerForm.get("businessPartner").value != "")
        {
          this.sportCountryForm.controls['sportCountry'].disable();
          this.sportStateForm.controls['sportState'].disable();
          this.sportDistrictForm.controls['sportDistrict'].disable();
          this.sportCityForm.controls['sportCity'].disable();
          this.addApplicationForm3.controls['academyAddress'].disable();
        }
        if(this.addApplicationForm3.get("isPracticingSport")?.value == "")
        {
          this.addApplicationForm3.controls["engagementDate"].disable();
          this.businessPartnerForm.controls['businessPartner'].disable();

          this.sportCountryForm.controls['sportCountry'].disable();
          this.sportStateForm.controls['sportState'].disable();
          this.sportDistrictForm.controls['sportDistrict'].disable();
          this.sportCityForm.controls['sportCity'].disable();
          this.addApplicationForm3.controls['academyAddress'].disable();
        }
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.saveClicked = false;
      if(this.businessPartnerForm.get("businessPartner").value != "")
      {
        this.sportCountryForm.controls['sportCountry'].disable();
        this.sportStateForm.controls['sportState'].disable();
        this.sportDistrictForm.controls['sportDistrict'].disable();
        this.sportCityForm.controls['sportCity'].disable();
        this.addApplicationForm3.controls['academyAddress'].disable();
      }

      if(this.addApplicationForm3.get("isPracticingSport")?.value == "")
      {
        this.addApplicationForm3.controls["engagementDate"].disable();
        this.businessPartnerForm.controls['businessPartner'].disable();

        this.sportCountryForm.controls['sportCountry'].disable();
        this.sportStateForm.controls['sportState'].disable();
        this.sportDistrictForm.controls['sportDistrict'].disable();
        this.sportCityForm.controls['sportCity'].disable();
        this.addApplicationForm3.controls['academyAddress'].disable();
      }
    }
  }

  back()
  {
      this.location.back();
  }
}
