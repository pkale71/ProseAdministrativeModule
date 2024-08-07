import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-business-vertical-type-add',
    standalone: true,
    imports: [CommonModule, SharedModule, TagInputModule, FormsModule],
    templateUrl: './business-vertical-type-add.component.html',
    styleUrls: ['./business-vertical-type-add.component.scss']
})
export class BusinessVerticalTypeAddComponent 
{
    @Input() public modalParams;
    addBusinessVerticalTypeForm: FormGroup;
    businessVerticalForm: FormGroup;
    businessVerticalGroupForm: FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;
    searchClicked : boolean;
    businessVerticals : any[];
    businessVerticalGroups : any[];
    names : string[];

    constructor(private businessService: BusinessService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService,
        )
    {
    }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;
        this.searchClicked = false;
        this.businessVerticals = [];
        this.businessVerticalGroups = [];

        this.addBusinessVerticalTypeForm = this.formbuilder.group({
            id: [''],
            names: [[this.names], [Validators.required]],
            businessVertical: this.formbuilder.group({ "id" : [''] }),
            businessVerticalGroup: this.formbuilder.group({ "id" : [''] })
        });  

        this.businessVerticalForm = this.formbuilder.group({
            'businessVertical' : ['', Validators.required]
        })

        this.businessVerticalGroupForm = this.formbuilder.group({
            "businessVerticalGroup" : ['', Validators.required]
        })

        this.getBusinessVerticals();
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    onEnterKey(event: any) 
    {
        if (event.key === 'Enter') 
        {
            if (this.names.length >= 11) 
            {
                this.names.splice(-1, 1); 
                this.showNotification("warning","Select Only 10 Names");
                this.addBusinessVerticalTypeForm.setValue(this.names);
            }
        }
    }    

    // get business vertical
    async getBusinessVerticals() 
    {  
        try
        {
            let response = await this.businessService.getBusinessVerticals('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.businessVerticals = response.businessVerticals;
                this.businessVerticals.unshift({ id : '', name : "Select Business Vertical"});
                this.getBusinessVerticalGroups();
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

    //get business vertical group
    async getBusinessVerticalGroups() 
    {  
        try
        {
            let businessVerticalId = this.businessVerticalForm.get("businessVertical").value;
            if(businessVerticalId != undefined && businessVerticalId != "")
            {
                this.searchClicked = true;  
                let response = await this.businessService.getBusinessVerticalGroups(businessVerticalId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.businessVerticalGroups = response.businessVerticalGroups;
                    this.businessVerticalGroups.unshift({ id : '', name : "Select Business Vertical Group"});
                    this.searchClicked = false;
                }
                else
                {
                    this.businessVerticalGroups = [];
                    this.businessVerticalGroups.unshift({ id : '', name : "Select Business Vertical Group"});
                    this.searchClicked = false;
                }
            }
            else
            {
                this.businessVerticalGroups = [];
                this.businessVerticalGroups.unshift({ id : '', name : "Select Business Vertical Group"});
                this.searchClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    async saveBusinessVerticalType()
    {
        if(!this.saveClicked)
        {
            if(this.addBusinessVerticalTypeForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let allNames = [];
                    for(let i = 0; i < this.names.length; i++)
                    {
                        allNames.push({ "name" : this.names[i] });
                    }
                    let tempJSON = {
                        "businessVertical" : {"id" : this.businessVerticalForm.get("businessVertical").value},
                        "businessVerticalGroup" : {"id" : this.businessVerticalGroupForm.get("businessVerticalGroup").value},
                        "names" :  allNames
                    }
                    let response = await this.businessService.saveBusinessVerticalType(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Business Vertical Type Saved");
                        this.commonSharedService.businessVerticalTypeListObject.next({result : "success"});
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
