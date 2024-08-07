import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-schooling-program-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './schooling-program-add.component.html',
    styleUrls: ['./schooling-program-add.component.scss']
})
export class SchoolingProgramAddComponent {
    @Input() public modalParams;
    addProgram: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    academicSessionForm : FormGroup;
    academicSessions : any[];

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router) 
        {
        this.academicSessions = []
        }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;

        this.addProgram = this.formbuilder.group({
        id: [''],
        name: ['', [Validators.required]],
        academicSession : this.formbuilder.group({ 'id' : ['']}),
        });

        this.academicSessionForm = this.formbuilder.group({
        academicSession : ['', [Validators.required]]
        })

        this.getAcademicSessions();
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
            this.academicSessions.unshift({ id : "", name : "Select Academic Session"});
            }
            else
            {
            this.academicSessions = [];
            }
        }
        catch(e)
            {
            this.showNotification("error",e);
            }
    }      

    async saveSchoolingProgram() 
    {
        if (!this.saveClicked) 
        {
            if (this.addProgram.valid && this.academicSessionForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                let academicSessionId = this.academicSessionForm.get("academicSession").value;
                this.addProgram.controls['academicSession'].get("id").setValue(academicSessionId);
                try 
                {
                    let response = await this.commonService.saveSchoolingPrograms(this.addProgram.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "School Program Saved");
                        this.commonSharedService.schoolingProgramListObject.next({ 
                            result: "success", 
                            responseData : {
                                academicSessionId : academicSessionId,
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
