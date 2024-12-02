import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOption, SelectModule } from 'ng-select';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

@Component({
  selector: 'app-school-schooling-program-add',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './school-schooling-program-add.component.html',
  styleUrls: ['./school-schooling-program-add.component.scss']
})
export class SchoolSchoolingProgramAddComponent {
  @Input() public modalParams;
  batchTypeClicked : boolean;
  batchTypes : Array<IOption>;
  searchClicked : boolean;
  saveClicked : boolean;
  isValidForm : boolean;
  addSchoolSchoolingProgramForm : FormGroup;
  academicSessionForm : FormGroup;
  batchTypeForm : FormGroup;
  schoolUUID : string;
  schoolSchoolingProgram : any;
  academicSessions : any[];
  curDate : string;

  constructor(private notifier: NotifierService, 
    private commonService : CommonService,
    private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal, 
    public commonSharedService : CommonSharedService,
    private location : Location, 
    private route: ActivatedRoute,
    private router : Router,
    private businessService: BusinessService
  )
  {
    this.getAcademicSessions();
    this.curDate = moment(new Date()).format('YYYY-MM-DD');
  }

  ngOnInit() 
  {
    this.schoolUUID = this.modalParams.schoolUUID;
    this.schoolSchoolingProgram = this.modalParams.schoolSchoolingProgram;
    this.batchTypeClicked = false;
    this.isValidForm = true;
    this.searchClicked = false;
    this.saveClicked = false;
    this.academicSessions = [];
    
    this.addSchoolSchoolingProgramForm = this.formbuilder.group({
      school : this.formbuilder.group({ 'uuid' : [this.schoolUUID, Validators.required]}),
      academicSession : this.formbuilder.group({ 'id' : ['']}),
      schoolingProgram : [this.schoolSchoolingProgram.schoolingProgram?.name, Validators.required],
      schoolSchoolingProgram : this.formbuilder.group({ 'id' : [this.schoolSchoolingProgram.id, Validators.required]}),
      startDate : ['', Validators.required],
      endDate : ['', Validators.required],
      admissionStartDate : ['', Validators.required],
      admissionEndDate : ['', Validators.required],
      batchTypeIds : ['']
    });

    this.academicSessionForm = this.formbuilder.group({
      'academicSession' : ['', Validators.required]
    });

    this.batchTypeForm = this.formbuilder.group({
      'batchTypes' : ['', Validators.required]
    });
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  async getAcademicSessions() 
  {  
    try
    {
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = response.academicSessions;
        this.academicSessions.unshift({ id : '', year : "Select Academic Session" });
      }
      else
      {
        this.academicSessions = [];
        this.academicSessions.unshift({ id : "", year : "Select Academic Session" });
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  async getBatchTypes(academicSessionId : number, action : string) 
  {  
    try
    {
      this.batchTypeClicked = true;
      this.batchTypeForm.get('batchTypes').reset();
      let tempBatchTypes : Array<IOption> = [];
      let response = await this.commonService.getBatchTypes(academicSessionId, action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      { 
        let batchTypes : any[] = response.batchTypes;
        for(let i = 0; i < batchTypes.length; i++)
        {
          tempBatchTypes.push({
              'value' : batchTypes[i].id.toString(),
              'label' : batchTypes[i].name
          });
        }
        this.batchTypes = this.commonSharedService.prepareSelectOptions(tempBatchTypes);
        this.batchTypeClicked = false;
      }
    }
    catch(e)
    {
      this.batchTypes = [];
      this.showNotification("error", e);
      this.batchTypeClicked = false;
    }
  }

  async saveSchoolSchoolingProgram()
  {
    if(!this.saveClicked)
    {
      if(this.addSchoolSchoolingProgramForm.valid && this.academicSessionForm.valid && this.batchTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          this.addSchoolSchoolingProgramForm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
          this.addSchoolSchoolingProgramForm.controls["batchTypeIds"].setValue(this.batchTypeForm.get("batchTypes").value.toString());

          let response = await this.businessService.saveSchoolSchoolingProgramValidity(this.addSchoolSchoolingProgramForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Schooling Program Detail Saved");
            this.commonSharedService.schoolSchoolingProgramListObject.next({result : "success"});
            this.closeModal();
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
        this.isValidForm = false;
        this.saveClicked = false;
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
