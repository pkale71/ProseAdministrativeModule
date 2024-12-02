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
  selector: 'app-school-schooling-program-edit',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './school-schooling-program-edit.component.html',
  styleUrls: ['./school-schooling-program-edit.component.scss']
})
export class SchoolSchoolingProgramEditComponent {
  @Input() public modalParams;
  batchTypeClicked : boolean;
  batchTypes : Array<IOption>;
  searchClicked : boolean;
  saveClicked : boolean;
  isValidForm : boolean;
  editSchoolSchoolingProgramForm : FormGroup;
  academicSessionForm : FormGroup;
  batchTypeForm : FormGroup;
  academicSessions : any[];
  schoolSchoolingProgram : any;
  curDate : string;
  schoolingCategoryId : number;
  schoolUUID : string;

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
    
    this.editSchoolSchoolingProgramForm = this.formbuilder.group({
      id : ['', Validators.required],
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
    this.pathFormValue(this.modalParams.schoolingProgramDetail);
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  pathFormValue(schoolSchoolingProgram : any)
  {
    this.editSchoolSchoolingProgramForm.patchValue(schoolSchoolingProgram);
    this.academicSessionForm.get("academicSession").setValue(schoolSchoolingProgram.academicSession.id);
    this.getBatchTypes(this.academicSessionForm.get("academicSession").value, schoolSchoolingProgram.batchTypes, 'Active');
    let batchTypes : any = [];
    for(let j = 0; j<schoolSchoolingProgram.batchTypes.length; j++)
    {
        batchTypes.push(schoolSchoolingProgram.batchTypes[j].id.toString());
    }
    this.batchTypeForm.get('batchTypes').setValue(batchTypes);    
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

  async getBatchTypes(academicSessionId : number, selBatchTypes : any[], action : string) 
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
        if(selBatchTypes.length > 0)
        {
          for(let k=0;k<selBatchTypes.length;k++)
          {
            let filterbatchType = tempBatchTypes.filter(tempBatchType => tempBatchType.value === selBatchTypes[k].id)
            if(filterbatchType.length == 0)
            {
              tempBatchTypes.push({
                'value' : selBatchTypes[k].id.toString(),
                'label' : selBatchTypes[k].name
              });
            }
          }
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
      if(this.editSchoolSchoolingProgramForm.valid && this.academicSessionForm.valid && this.batchTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          this.editSchoolSchoolingProgramForm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
          this.editSchoolSchoolingProgramForm.controls["batchTypeIds"].setValue(this.batchTypeForm.get("batchTypes").value.toString());

          let response = await this.businessService.updateSchoolSchoolingProgramValidity(this.editSchoolSchoolingProgramForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Schooling Program Detail Saved");
            this.commonSharedService.schoolSchoolingProgramDetailListObject.next({result : "success"});
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
