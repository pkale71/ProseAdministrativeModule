import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';
import { IOption, SelectModule } from 'ng-select';
import { BusinessService } from 'src/app/theme/shared/service/business.service';

@Component({
  selector: 'app-study-center-agreement-add',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './study-center-agreement-add.component.html',
  styleUrls: ['./study-center-agreement-add.component.scss']
})
export class StudyCenterAgreeMentAddComponent {
  @Input() public modalParams;
  uuid : string;  
  addStudyCenterAgreementForm : FormGroup;
  searchClicked : boolean;
  isValidForm: boolean;
  saveClicked : boolean;
  studyCenter : any;

  constructor(
    private commonService: CommonService, 
    private businessService: BusinessService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    private router : Router,
    private route: ActivatedRoute,
    public commonSharedService : CommonSharedService,
   ) 
  {
  }

  ngOnInit() 
  {
    //get Modal params
    this.uuid = this.modalParams.uuid;
    this.isValidForm = true;
    this.saveClicked = false;
    this.searchClicked = false;

    this.addStudyCenterAgreementForm = this.formbuilder.group({
      studyCenter: {"uuid" : this.uuid },
      agreementFrom: ['', Validators.required],
      agreementTo: ['', [Validators.required]],
    },
      // { validators: this.dateValidator() }
      );

    this.getStudyCenter(this.uuid); 
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getStudyCenter(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getStudyCenter(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.studyCenter = response.studyCenter;
      this.searchClicked = false;
    }
    else
    {
      this.studyCenter = [];
      this.searchClicked = false;
    }
  }

  dateValidator() 
  {
    const agreementFrom = this.addStudyCenterAgreementForm.get('agreementFrom').value;
    const agreementTo = this.addStudyCenterAgreementForm.get('agreementTo').value;
    let validate : boolean = false;
    if (agreementFrom && agreementTo && new Date(agreementFrom) > new Date(agreementTo)) {
      this.addStudyCenterAgreementForm.get('agreementTo').setErrors({ dateRange: true });
       validate = true;
    }
    return validate;
  }

  async saveStudyCenterAgreement()
  {
    if(!this.saveClicked)
    {
      if(this.addStudyCenterAgreementForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.businessService.saveStudyCenterAgreement(this.addStudyCenterAgreementForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Study Center Agreement Saved");            
            this.commonSharedService.studyCenterAgreementHistoryDocumentListObject.next({result : "success"});
            this.closeModal();
            this.saveClicked = false;
            this.isValidForm = false;
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
