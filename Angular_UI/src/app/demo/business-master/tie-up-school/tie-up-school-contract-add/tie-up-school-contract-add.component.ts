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
    selector: 'app-tie-up-school-contract-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './tie-up-school-contract-add.component.html',
    styleUrls: ['./tie-up-school-contract-add.component.scss']
})
export class TieUpSchoolContractAddComponent {
    @Input() public modalParams;
    uuid : string;  
    addTieUpSchoolContractForm : FormGroup;
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

        this.addTieUpSchoolContractForm = this.formbuilder.group({
            tieUpSchool: {"uuid" : this.uuid },
            contractFrom: ['', Validators.required],
            contractTo: ['', [Validators.required]],
        },
        // { validators: this.dateValidator() }
        );

        this.getTieUpSchool(this.uuid); 
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getTieUpSchool(uuid : string) 
    {
        this.searchClicked = true;
        let response = await this.businessService.getTieUpSchool(uuid).toPromise(); 
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
        const contractFrom = this.addTieUpSchoolContractForm.get('contractFrom').value;
        const contractTo = this.addTieUpSchoolContractForm.get('contractTo').value;
        let validate : boolean = false;
        if (contractFrom && contractTo && new Date(contractFrom) > new Date(contractTo)) 
        {
            this.addTieUpSchoolContractForm.get('contractTo').setErrors({ dateRange: true });
            validate = true;
        }
        return validate;
    }

    async saveTieUpSchoolContract()
    {
        if(!this.saveClicked)
        {
            if(this.addTieUpSchoolContractForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let response = await this.businessService.saveTieUpSchoolContract(this.addTieUpSchoolContractForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Tie-Up School Contract Saved");            
                        this.commonSharedService.tieUpSchoolContractHistoryDocumentListObject.next({result : "success"});
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
