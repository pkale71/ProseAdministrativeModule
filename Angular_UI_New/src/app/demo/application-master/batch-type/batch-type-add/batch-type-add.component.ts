import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { min, minTime } from 'date-fns';

@Component({
    selector: 'app-batch-type-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './batch-type-add.component.html',
    styleUrls: ['./batch-type-add.component.scss']
})
export class BatchTypeAddComponent {
    @Input() public modalParams;
    addBatchTypeForm: FormGroup;
    academicSessionForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    academicSessions: any[];

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router
    )
    {
    }

    ngOnInit() {
        this.isValidForm = true;
        this.saveClicked = false;
        this.academicSessions = [];

        this.addBatchTypeForm = this.formbuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            academicSession: this.formbuilder.group({ 'id' : ['']}),
            startTime: ['', Validators.required],
            endTime: ['', Validators.required]
            // }, {
            //     Validators: this.timeRangeValidator('startTime', 'endTime')            
        });
        this.addBatchTypeForm.get('endTime')?.setValidators(
            this.timeRangeValidator(this.addBatchTypeForm.get('startTime').value, this.addBatchTypeForm.get('endTime').value)
          );
        this.academicSessionForm = this.formbuilder.group({
            'academicSession' : ['', Validators.required]
        });
        this.getAcademicSessions();
    }

    showNotification(type: string, message: string): void {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    timeRangeValidator(startTimeKey: string, endTimeKey: string): ValidatorFn 
    {
        return (formGroup: AbstractControl): ValidationErrors | null => 
        {
            const startTime = formGroup.get(startTimeKey)?.value;
            const endTime = formGroup.get(endTimeKey)?.value;
        
            if (startTime && endTime && startTime >= endTime) 
            {
                return { timeRangeInvalid: true };
            }
            return null;
        };
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
        if (!this.saveClicked) 
        {
            if (this.addBatchTypeForm.valid && this.academicSessionForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.addBatchTypeForm.controls['academicSession'].get('id').setValue(this.academicSessionForm.get('academicSession').value);
                try 
                {
                    let response = await this.commonService.saveBatchType(this.addBatchTypeForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Batch-Type Saved");
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

    closeModal() {
        this.activeModal.close();
    }
}
