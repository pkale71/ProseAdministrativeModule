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
    selector: 'app-business-partner-coach-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './business-partner-coach-add.component.html',
    styleUrls: ['./business-partner-coach-add.component.scss']
})
export class BusinessPartnerCoachAddComponent {
    @Input() public modalParams;
    uuid : string;  
    addBusinessPartnerCoachForm : FormGroup;
    businessVerticalForm : FormGroup;
    businessVerticalTypeForm : FormGroup;
    coachForm : FormGroup;
    searchClicked : boolean;
    isValidForm: boolean;
    saveClicked : boolean;
    businessPartner : any;  
    businessVerticals : any[];

    businessVerticalTypes : any[];
    coaches : Array<IOption>;

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

        this.addBusinessPartnerCoachForm = this.formbuilder.group({
            businessPartner: {"uuid" : this.uuid },
            coaches: this.formbuilder.group({ "id" : ['']}),
            businessVertical : this.formbuilder.group({ 'id' : ['']}),
            businessVerticalTypes : this.formbuilder.group({ 'id' : ['']}),
        });
        
        this.businessVerticalForm = this.formbuilder.group({
            'businessVertical' : ['', Validators.required]
        })
        this.businessVerticalTypeForm = this.formbuilder.group({
            'businessVerticalType' : ['', Validators.required]
        })
        this.coachForm = this.formbuilder.group({
            'coaches' : ['', Validators.required]
        })

        this.getBusinessPartner(this.uuid); 
        this.getBusinessVerticals('Active');
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
    
    // get business vertical
    async getBusinessVerticals(action : string) 
    {  
        try
        {
            let response = await this.businessService.getBusinessVerticals('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            { 
                this.businessVerticals = response.businessVerticals;
                this.businessVerticals.unshift({ id : '', name : "Select Business Vertical"});
            }
            else
            {
                this.businessVerticals = [];
                this.businessVerticals.unshift({ id : '', name : "Select Business Vertical"});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }
    
    //get business vertical type
    async getBusinessVerticalTypes(action : string) 
    {  
        try
        {
            let businessVerticalId = this.businessVerticalForm.get("businessVertical").value;
            if(businessVerticalId != undefined && businessVerticalId != "")
            {
                this.searchClicked = true; 
                let response = await this.businessService.getBusinessVerticalTypes(businessVerticalId, 0, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                { 
                    this.businessVerticalTypes = response.businessVerticalTypes;
                    this.businessVerticalTypes.unshift({ id : '', name : "Select Business Vertical Type"});
                    this.searchClicked = false;
                }
                else
                {
                    this.businessVerticalTypes = [];
                    this.businessVerticalTypes.unshift({ id : '', name : "Select Business Vertical Type"});
                    this.searchClicked = false;
                }
            } 
            else
            {
                this.businessVerticalTypes = [];
                this.businessVerticalTypes.unshift({ id : '', name : "Select Business Vertical Type"});
                this.searchClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    // get coaches
    async getCoaches(action : string) 
    { 
        try
        {
            let businessVerticalTypeId = this.businessVerticalTypeForm.get('businessVerticalType').value;
            if(businessVerticalTypeId != undefined && businessVerticalTypeId != '')
            {
                this.searchClicked = true;
                let tempCoaches : Array<IOption> = [];
                let response = await this.businessService.getCoaches(0, businessVerticalTypeId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    let coaches : any[] = response.coaches;
                    for(let i = 0; i < coaches.length; i++)
                    {
                        tempCoaches.push({
                            'value' : coaches[i].uuid.toString(),
                            'label' : coaches[i].name
                        })
                    }
                    this.coaches = this.commonSharedService.prepareSelectOptions(tempCoaches);
                    this.searchClicked = false;
                }
            }  
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    async saveBusinessPartnerCoach()
    {
        if(!this.saveClicked)
        {
            if(this.addBusinessPartnerCoachForm.valid && this.businessVerticalForm.valid && this.businessVerticalTypeForm.valid && this.coachForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let tempJSON = {
                        businessPartner : { "uuid" : this.uuid},
                        coachUUIDs : this.coachForm.get('coaches').value.toString(),
                    }
                    let response = await this.businessService.saveBusinessPartnerCoach(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Business Partner Coach Saved");            
                        this.commonSharedService.businessPartnerCoachContractHistoryDocumentListObject.next({result : "success"});
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
