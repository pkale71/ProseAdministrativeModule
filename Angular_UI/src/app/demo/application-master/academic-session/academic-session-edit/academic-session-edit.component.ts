import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Router } from '@angular/router';
// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-academic-session-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './academic-session-edit.component.html',
  styleUrls: ['./academic-session-edit.component.scss'],
  providers: [DatePipe]
})
export class AcademicSessionEditComponent {
  @Input() public modalParams;
  editAcademicSessionForm: FormGroup;
  isValidForm: boolean;
  saveClicked: boolean;
  isOpenAdmissionSessions: any[];
  academicSession: any;

  constructor(private commonService: CommonService,
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService: CommonSharedService,
    private router: Router,
    public datePipe: DatePipe
  ) {

    this.isOpenAdmissionSessions = [{
      "id": 1,
      "name": "Yes"
    },
    {
      "id": 0,
      "name": "No"
    }]
  }

  ngOnInit() 
  {
    //get modal params
    this.academicSession = this.modalParams;
    this.isValidForm = true;
    this.saveClicked = false;

    this.editAcademicSessionForm = this.formbuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      isAdmissionOpen: ['', Validators.required],
      isCurrentSession: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    ///Assign Form Data
    this.editAcademicSessionForm.patchValue(this.academicSession);
    this.editAcademicSessionForm.get('isAdmissionOpen').setValue(this.academicSession.isAdmissionOpen);
    this.editAcademicSessionForm.get('isCurrentSession').setValue(this.academicSession.isCurrentSession);
  }

  onSelect() 
  {
    let startDate = this.editAcademicSessionForm.value.startDate;
    startDate = this.datePipe.transform(startDate, 'yyy');
    let endDate = this.editAcademicSessionForm.value.endDate;
    endDate = this.datePipe.transform(endDate, 'yyy');
    let name: any = startDate + '-' + endDate;
    this.editAcademicSessionForm.get("name").setValue(name);
  }

  dateValidator() 
  {
    const startDate = this.editAcademicSessionForm.get('startDate').value;
    const endDate = this.editAcademicSessionForm.get('endDate').value;
    let validate : boolean = false;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      this.editAcademicSessionForm.get('endDate').setErrors({ dateRange: true });
       validate = true;
    }
    return validate;
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveAcademicSession() 
  {
   if(!this.dateValidator())
    {
     if (!this.saveClicked) 
      {
        if (this.editAcademicSessionForm.valid)
          {
            this.isValidForm = true;
            this.saveClicked = true;
              try 
                {
                  let response = await this.commonService.updateAcademicSession(this.editAcademicSessionForm.value).toPromise();
                  if (response.status_code == 200 && response.message == 'success') 
                  {
                    this.showNotification("success", "Academic Session Updated");
                    this.commonSharedService.academicSessionListObject.next({ result: "success" });
                    this.closeModal();
                  }
                }
                catch (e) 
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
    else
    {
      this.showNotification("warning", "End date must be after start date.");
    }
  }
        
  closeModal()
  {
    this.activeModal.close();
  }     
}
