import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
// import { start } from '@popperjs/core';

@Component({
  selector: 'app-grade-category-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './academic-session-add.component.html',
  styleUrls: ['./academic-session-add.component.scss'],
  providers: [DatePipe]
})
export class AcademicSessionAddComponent {
  @Input() public modalParams;
  addAcademicSessionForm: FormGroup;
  isValidForm: boolean;
  saveClicked: boolean;
  isOpenAdmissionSessions: any[];

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

  ngOnInit() {
    this.isValidForm = true;
    this.saveClicked = false;

    this.addAcademicSessionForm = this.formbuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      isAdmissionOpen: ['', Validators.required],
      isCurrentSession: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
  });

    this.addAcademicSessionForm.get('isAdmissionOpen').setValue('0');
    this.addAcademicSessionForm.get('isCurrentSession').setValue('0');
  }

  onSelect() {
    let startDate = this.addAcademicSessionForm.value.startDate;
    startDate = this.datePipe.transform(startDate, 'yyy');
    let endDate = this.addAcademicSessionForm.value.endDate;
    endDate = this.datePipe.transform(endDate, 'yyy');
    let name: any = startDate + '-' + endDate;
    this.addAcademicSessionForm.get("name").setValue(name);
  }

  dateValidator() {
    const startDate = this.addAcademicSessionForm.get('startDate').value;
    const endDate = this.addAcademicSessionForm.get('endDate').value;
    let validate : boolean = false;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      this.addAcademicSessionForm.get('endDate').setErrors({ dateRange: true });
       validate = true;
    }
    return validate;
  }

  showNotification(type: string, message: string): void {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveAcademisSession() 
  {
    if(!this.dateValidator())
      {
    if (!this.saveClicked) 
      {
        if (this.addAcademicSessionForm.valid)
         {
            this.isValidForm = true;
            this.saveClicked = true;
              try 
                {
                  let response = await this.commonService.saveAcademicSession(this.addAcademicSessionForm.value).toPromise();
                  if (response.status_code == 200 && response.message == 'success') 
                      {
                        this.showNotification("success", "Academic Session Saved");
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

  closeModal() {
    this.activeModal.close();
  }
}
