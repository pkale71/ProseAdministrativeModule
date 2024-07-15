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
  selector: 'app-business-partner-contract-add',
  standalone: true,
  imports: [CommonModule, SharedModule, SelectModule],
  templateUrl: './business-partner-contract-add.component.html',
  styleUrls: ['./business-partner-contract-add.component.scss']
})
export class BusinessPartnerContractAddComponent {
  @Input() public modalParams;
  uuid : string;  
  addBusinessPartnerContractForm : FormGroup;
  searchClicked : boolean;
  isValidForm: boolean;
  saveClicked : boolean;
  businessPartner : any;

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

    this.addBusinessPartnerContractForm = this.formbuilder.group({
      businessPartner: {"uuid" : this.uuid },
      contractFrom: ['', Validators.required],
      contractTo: ['', [Validators.required]],
    },
      { validators: this.dateValidator() });

    this.getBusinessPartner(this.uuid); 
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getBusinessPartner(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getBusinessPartner(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.businessPartner = response.businessPartner;
      this.searchClicked = false;
    }
    else
    {
      this.businessPartner = [];
      this.searchClicked = false;
    }
  }

  dateValidator() 
  {
    const contractFrom = this.addBusinessPartnerContractForm.get('contractFrom').value;
    const contractTo = this.addBusinessPartnerContractForm.get('contractTo').value;
    let validate : boolean = false;
    if (contractFrom && contractTo && new Date(contractFrom) > new Date(contractTo)) {
      this.addBusinessPartnerContractForm.get('contractTo').setErrors({ dateRange: true });
       validate = true;
    }
    return validate;
  }

  async saveBusinessPartnerContract()
  {
    if(!this.saveClicked)
    {
      if(this.addBusinessPartnerContractForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.businessService.saveBusinessPartnerContract(this.addBusinessPartnerContractForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Business Partner Contract Saved");            
            this.commonSharedService.businessPartnerContractHistoryDocumentListObject.next({result : "success"});
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
