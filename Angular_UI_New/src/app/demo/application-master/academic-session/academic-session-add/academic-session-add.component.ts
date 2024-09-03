import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
//third party
import { TextMaskModule } from 'angular2-text-mask';

@Component({
    selector: 'app-grade-category-add',
    standalone: true,
    imports: [CommonModule, SharedModule, TextMaskModule],
    templateUrl: './academic-session-add.component.html',
    styleUrls: ['./academic-session-add.component.scss'],
    providers: [DatePipe]
})
export class AcademicSessionAddComponent {
    @Input() public modalParams;
    addAcademicSessionForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    isCurrentSessions: any[];
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

    ngOnInit() {
        this.isValidForm = true;
        this.saveClicked = false;
        this.amount = 1000;

        this.addAcademicSessionForm = this.formbuilder.group({
            id: [''],
            year: ['', [Validators.required]],
            isCurrentSession: ['', Validators.required],
        });
        this.addAcademicSessionForm.get('isCurrentSession').setValue('0');
    }

    showNotification(type: string, message: string): void {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async saveAcademisSession() 
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

    closeModal() {
        this.activeModal.close();
    }
}
