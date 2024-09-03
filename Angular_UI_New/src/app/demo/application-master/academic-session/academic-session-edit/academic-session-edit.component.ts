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
import { TextMaskModule } from 'angular2-text-mask';

@Component({
    selector: 'app-academic-session-edit',
    standalone: true,
    imports: [CommonModule, SharedModule, TextMaskModule],
    templateUrl: './academic-session-edit.component.html',
    styleUrls: ['./academic-session-edit.component.scss'],
    providers: [DatePipe]
})
export class AcademicSessionEditComponent {
    @Input() public modalParams;
    editAcademicSessionForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    isCurrentSessions: any[];
    academicSession: any;
    maskDateDash = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    amount: number;

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router,
        public datePipe: DatePipe
    )
    {
        this.isCurrentSessions = [{
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
        this.amount = 1000;

        this.editAcademicSessionForm = this.formbuilder.group({
            id: [''],
            year: ['', [Validators.required]],
            isCurrentSession: ['', Validators.required]
        });
        //Assign Form Data
        this.editAcademicSessionForm.patchValue(this.academicSession);
        this.editAcademicSessionForm.get('isCurrentSession').setValue(this.academicSession.isCurrentSession);
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async saveAcademicSession() 
    {
        if(!this.saveClicked) 
        {
            if(this.editAcademicSessionForm.valid)
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
            
    closeModal()
    {
        this.activeModal.close();
    }     
}
