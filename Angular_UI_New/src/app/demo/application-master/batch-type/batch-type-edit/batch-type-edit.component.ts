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

@Component({
    selector: 'app-batch-type-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './batch-type-edit.component.html',
    styleUrls: ['./batch-type-edit.component.scss']
})
export class BatchTypeEditComponent {
    @Input() public modalParams;
    editBatchTypeForm: FormGroup;
    academicSessionForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    academicSessions: any[];
    batchType: any;

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router
    )
    {
    }

    ngOnInit() 
    {
        //get modal params
        this.batchType = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.academicSessions = [];

        this.editBatchTypeForm = this.formbuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            academicSession: this.formbuilder.group({ 'id' : ['']}),
            startTime: ['', Validators.required],
            endTime: ['', Validators.required]
        });
        this.academicSessionForm = this.formbuilder.group({
            'academicSession' : ['', Validators.required]
        });
        this.getAcademicSessions();
        //Assign Form Data
        this.editBatchTypeForm.patchValue(this.batchType);
        this.academicSessionForm.get('academicSession').setValue(this.batchType.academicSession.id);
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    //get academic session 
    async getAcademicSessions() 
    {
        try
        {
            let response = await this.commonService.getAcademicSessions().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.academicSessions = response.academicSessions;
                this.academicSessions.unshift({ id : "", batchYear : "Select Year" });
            }
            else
            {
                this.academicSessions = [];
                this.academicSessions.unshift({ id : "", batchYear : "Select Year" });
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    async saveBatchType() 
    {
        if(!this.saveClicked) 
        {
            if(this.editBatchTypeForm.valid && this.academicSessionForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.editBatchTypeForm.controls['academicSession'].get("id").setValue(this.academicSessionForm.get('academicSession').value);
                try 
                {
                    let response = await this.commonService.updateBatchType(this.editBatchTypeForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Batch-Type Updated");
                        this.commonSharedService.batchTypeListObject.next({ result: "success",
                            responseData: {
                                academicSessionId : this.academicSessionForm.get('academicSession').value
                            }
                         });
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
