import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { School } from 'src/app/theme/shared/model/school';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { Grade } from 'src/app/theme/shared/model/grade';
import { GradeScheduleSettingService } from 'src/app/theme/shared/service/grade-schedule-setting.service';

// third party
import Swal from 'sweetalert2';
import { GradeScheduleSetting } from 'src/app/theme/shared/model/gradeScheduleSetting';

@Component({
  selector: 'app-grade-schedule-setting-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './grade-schedule-setting-edit.component.html',
  styleUrls: ['./grade-schedule-setting-edit.component.scss']
})
export class GradeScheduleSettingEditComponent {
  @Input() public modalParams;
  schools : School[];
  academicYears : AcademicYear[];
  grades : Grade[];
  academicYearForm : FormGroup;
  gradeForm : FormGroup;
  editGradeScheduleSettingForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  schoolUUID : string;
  gradeClicked : boolean = false;
  gradeScheduleSetting : GradeScheduleSetting;

  constructor(private commonService: CommonService, 
    private gradeScheduleSettingService: GradeScheduleSettingService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
  {
    
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;
    this.academicYears = [];
    this.editGradeScheduleSettingForm = this.formbuilder.group({
      uuid:['', Validators.required],
      academicYear: this.formbuilder.group({ 'uuid': [''] }),
      school: this.formbuilder.group({ 'uuid': ['', Validators.required] }),
      grade: this.formbuilder.group({ 'id': [''] }),
      numberOfPeriods: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}')]],
      duration: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}')]],
      startTime: ['',[Validators.required]],
    });

    this.gradeForm = this.formbuilder.group({
      'grade': ['', [Validators.required]]
    });
    
    this.academicYearForm = this.formbuilder.group({
      'academicYear': ['', [Validators.required]]
    });

    this.getAcademicYears();
    ///get modal params
    if(this.modalParams.gradeScheduleSetting)
    {
      this.gradeScheduleSetting = this.modalParams.gradeScheduleSetting;
      this.editGradeScheduleSettingForm.patchValue(this.gradeScheduleSetting);
      this.academicYearForm.controls['academicYear'].disable();
      this.gradeForm.controls['grade'].disable();
      this.academicYearForm.get("academicYear").setValue(this.gradeScheduleSetting.academicYear.uuid);
      this.gradeForm.get("grade").setValue(this.gradeScheduleSetting.grade.id);
      this.schoolUUID = this.gradeScheduleSetting.school.uuid;
      this.getUnschduleGrades();
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicYears() 
  {
    let response = await this.commonService.getAcademicYears().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      let isCurrent : boolean = false;
      let academicYears : AcademicYear[] = response.data.academicYears;
      for(let i=0;i<academicYears.length;i++)
      {
        if(academicYears[i].isCurrent == 1)
        {
          isCurrent = true;
        }
        if(isCurrent)
        {
          this.academicYears.push(academicYears[i]);
        }
      }
    }
  }

  async getUnschduleGrades() 
  {
    let academicYearUUID = this.academicYearForm.get("academicYear").value;
    if(this.schoolUUID != "" && academicYearUUID != "")
    {
      this.gradeClicked = true;
      let response = await this.gradeScheduleSettingService.getUnschduleGrades(academicYearUUID, this.schoolUUID).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.grades = response.data.unscheduledGrades;
    ///Set Edit Form Data For Grade
        this.grades.push(this.gradeScheduleSetting.grade);
        this.gradeClicked= false;
      }
    }
    else
    {
      this.grades = [];
      this.gradeClicked= false;
    }
  }

  async saveGradeScheduleSetting()
  {
    if(!this.saveClicked)
    {
      this.academicYearForm.controls['academicYear'].enable();
      this.gradeForm.controls['grade'].enable();
      if(this.editGradeScheduleSettingForm.valid && this.gradeForm.valid && this.academicYearForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.academicYearForm.controls['academicYear'].disable();
        this.gradeForm.controls['grade'].disable();
        
        this.editGradeScheduleSettingForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
        this.editGradeScheduleSettingForm.controls["academicYear"].get("uuid").setValue(this.academicYearForm.get("academicYear").value);
///////
        try
        {
          let response = await this.gradeScheduleSettingService.updateGradeScheduleSetting(this.editGradeScheduleSettingForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grade Schedule Setting Updated");

              this.commonSharedService.gradeScheduleSettingListObject.next({
                schoolUUID : this.schoolUUID,
                academicYearUUID : this.academicYearForm.get("academicYear").value,
                result : "success"
              });
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
