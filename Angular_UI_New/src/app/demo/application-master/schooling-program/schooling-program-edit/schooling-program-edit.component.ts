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
    selector: 'app-schooling-program-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './schooling-program-edit.component.html',
    styleUrls: ['./schooling-program-edit.component.scss']
})
export class SchoolingProgramEditComponent {
    @Input() public modalParams;
    editSchoolingProgramForm: FormGroup;
    schoolingCategoryForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    schoolingCategories: any[];
    schoolingProgram: any;

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router) {
    }

    ngOnInit() 
    {
        this.schoolingProgram = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.schoolingCategories = [];

        this.editSchoolingProgramForm = this.formbuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            schoolingCategory: this.formbuilder.group({ 'id' : ['']})
        });
        this.schoolingCategoryForm = this.formbuilder.group({
            'schoolingCategory': ['', Validators.required]
        });
        this.getSchoolingCategories();
        this.editSchoolingProgramForm.patchValue(this.schoolingProgram);
        this.schoolingCategoryForm.get('schoolingCategory').setValue(this.schoolingProgram.schoolingCategory.id);
    }

    showNotification(type: string, message: string): void {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    //get schooling category
    async getSchoolingCategories() 
    {
        try
        {
            let response = await this.commonService.getSchoolingCategories('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.schoolingCategories = response.schoolingCategories;
                this.schoolingCategories.unshift({ id : "", name : "Select Schooling Category"});
            }
            else
            {
                this.schoolingCategories = [];
                this.schoolingCategories.unshift({ id : "", name : "Select Schooling Category"});
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
            if (this.editSchoolingProgramForm.valid && this.schoolingCategoryForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                let schoolingCategoryId = this.schoolingCategoryForm.get('schoolingCategory').value;
                this.editSchoolingProgramForm.controls['schoolingCategory'].get('id').setValue(schoolingCategoryId);
                try 
                {
                    let response = await this.commonService.updateSchoolingProgram(this.editSchoolingProgramForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Schooling Program Saved.");
                        this.commonSharedService.schoolingProgramListObject.next({ 
                            result: "success",
                            responseData: {
                                schoolingCategoryId : schoolingCategoryId
                            } });
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
