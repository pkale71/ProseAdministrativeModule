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
    selector: 'app-tie-up-school-document-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './tie-up-school-document-add.component.html',
    styleUrls: ['./tie-up-school-document-add.component.scss']
})
export class TieUpSchoolDocumentAddComponent {
    @Input() public modalParams;
    uuid : string;  
    addTieUpSchoolDocumentForm : FormGroup;
    academyEnclosureDocumentForm : FormGroup;
    searchClicked : boolean;
    isValidForm: boolean;
    saveClicked : boolean;
    tieUpSchool : any;
    academyEnclosureDocuments : any[];  

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
        this.academyEnclosureDocuments = [];

        this.addTieUpSchoolDocumentForm = this.formbuilder.group({
        tieUpSchool: {"uuid" : this.uuid },
        academyEnclosureDocument: this.formbuilder.group({ "id" : ['']}),
        docFile : ['', Validators.required]
        });

        this.academyEnclosureDocumentForm = this.formbuilder.group({
        'academyEnclosureDocument' : ['', Validators.required],
        'docFile' : ['', Validators.required]
        })

        this.getTieUpSchool(this.uuid); 
        this.getAcademyEnclosureDocuments('Active');
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
            this.tieUpSchool = response.tieUpSchool;
            this.searchClicked = false;
        }
        else
        {
            this.tieUpSchool = [];
            this.searchClicked = false;
        }
    }

    async getAcademyEnclosureDocuments(action : string) 
    {  
        try
        {
            let response = await this.businessService.getAcademyEnclosureDocuments('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {  
                this.academyEnclosureDocuments = response.academyEnclosureDocuments;
                this.academyEnclosureDocuments.unshift({ id : '', name : 'Select Document'}); 
            }
            else
            {
                this.academyEnclosureDocuments = [];
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    fileChange(event : any)
    {
        // console.log(event.target.files[0])
        const file = event.target.files[0];
        let fSize : number = parseFloat((file.size / 1024).toFixed(2));
        if(file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'application/pdf')
        {
            if(fSize > 0)
            {       
                this.academyEnclosureDocumentForm.get('docFile').setValue(file); 
            }
        } 
    }

    async uploadTieUpSchoolDocument()
    {
        if(!this.saveClicked)
        {
            if(this.addTieUpSchoolDocumentForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let businessDocument = new FormData();
                    businessDocument.append('tieUpSchool',JSON.stringify({'uuid' : this.uuid})),
                    businessDocument.append('academyEnclosureDocument', JSON.stringify({ 'id' : this.academyEnclosureDocumentForm.get('academyEnclosureDocument').value}))
                    businessDocument.append('docFile', this.academyEnclosureDocumentForm.get('docFile').value)
                    let response = await this.businessService.uploadTieUpSchoolDocument(businessDocument).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Tie-Up School Document Saved");            
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
