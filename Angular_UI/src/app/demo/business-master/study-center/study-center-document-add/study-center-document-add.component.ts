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
    selector: 'app-study-center-document-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './study-center-document-add.component.html',
    styleUrls: ['./study-center-document-add.component.scss']
})
export class StudyCenterDocumentAddComponent {
    @Input() public modalParams;
    uuid : string;  
    addStudyCenterDocumentForm : FormGroup;
    academyEnclosureDocumentForm : FormGroup;
    searchClicked : boolean;
    isValidForm: boolean;
    saveClicked : boolean;
    studyCenter : any;
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

        this.addStudyCenterDocumentForm = this.formbuilder.group({
            studyCenter: {"uuid" : this.uuid },

        academyEnclosureDocument: this.formbuilder.group({ "id" : ['']}),
            'docFile' : ['', Validators.required]
        });
        this.academyEnclosureDocumentForm = this.formbuilder.group({
            'academyEnclosureDocument' : ['', Validators.required],
            'docFile' : ['', Validators.required]
        })

        this.getStudyCenter(this.uuid); 
        this.getAcademyEnclosureDocuments('Active');
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

    async uploadStudyCenterDocument()
    {
        if(!this.saveClicked)
        {
            if(this.addStudyCenterDocumentForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let businessDocument = new FormData();
                    businessDocument.append('studyCenter',JSON.stringify({'uuid' : this.uuid})),
                    businessDocument.append('academyEnclosureDocument', JSON.stringify({ 'id' : this.academyEnclosureDocumentForm.get('academyEnclosureDocument').value}))
                    businessDocument.append('docFile', this.academyEnclosureDocumentForm.get('docFile').value)
                    let response = await this.businessService.uploadStudyCenterDocument(businessDocument).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Study Center Document Saved");            
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
