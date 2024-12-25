import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';
import moment from 'moment';

@Component({
  selector: 'app-student-profile-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './student-profile-edit.component.html',
  styleUrls: ['./student-profile-edit.component.scss']
})
export class StudentProfileEditComponent 
{
  @Input() public modalParams;
  updateStudentProfileForm: FormGroup;
  genderForm : FormGroup;
  genders : any[];
  isValidForm: boolean;
  genderClicked : boolean;
  saveClicked : boolean;
  curDate : string;

  constructor(
  private admissionService: AdmissionService, 
  private activeModal: NgbActiveModal,
  private notifier: NotifierService,
  private formbuilder: FormBuilder,
  public commonSharedService : CommonSharedService,
  )
  {
    this.isValidForm = false;
    this.genderClicked = false;
    this.genders = [];
    this.curDate = moment(new Date()).format('YYYY-MM-DD');
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.genderForm = this.formbuilder.group({
      gender:['']
    });

    this.updateStudentProfileForm = this.formbuilder.group({
      application: this.formbuilder.group({ 'uuid': ['', Validators.required] }),
      studentName:['', [Validators.required]],
      gender: this.formbuilder.group({ 'id': ['', Validators.required] }),
      dob: ['', [Validators.required]],
      nationality : ['', Validators.required],
      aadharNumber : ['', [Validators.required, Validators.pattern('^[0-9]{12,12}$'), Validators.minLength(12)]],
      passportNumber : ['']
    });  
    this.getGenders();
    this.updateStudentProfileForm.patchValue(this.modalParams.studentProfile);
    this.genderForm.get("gender").setValue(this.updateStudentProfileForm.controls["gender"].get("id").value);
  }

  async getGenders() 
  {  
    try
    {
      let response = await this.admissionService.getGenders().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.genders = response.genders;
        this.genders.unshift({id : "", name : "Select Gender"});
      }
      else
      {
        this.genders = [];
      }
    }
    catch(e)
    {
      this.genders = [];
      this.showNotification("error", e);
    }
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveStudentProfile()
  {
    if(!this.saveClicked)
    {
      if(this.updateStudentProfileForm.valid && this.genderForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          this.updateStudentProfileForm.controls["gender"].get("id").setValue(this.genderForm.get("gender").value);

          let response = await this.admissionService.updateStudentProfile(this.updateStudentProfileForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Student Profile Saved");
              this.commonSharedService.updateProfileObject.next({result : "success", action : "Student"});
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
