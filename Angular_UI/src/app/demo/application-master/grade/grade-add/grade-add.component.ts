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
    selector: 'app-grade-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './grade-add.component.html',
    styleUrls: ['./grade-add.component.scss']
})
export class GradeAddComponent 
{
    @Input() public modalParams;
    gradeCategories : any[];
    grades : any[];
    addGradeFrm: FormGroup;
    gradeCategoryForm : FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;

    constructor(private commonService: CommonService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService,
        )
        {
            this.grades =[]
            this.gradeCategories = [] 
        }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;

        this.addGradeFrm = this.formbuilder.group({
            id:[''],
            name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\-\_ ]*$')]],
            gradeCategory: this.formbuilder.group({ 'id': [''] }),
        });

        this.gradeCategoryForm = this.formbuilder.group({
            'gradeCategory': ['', [Validators.required]]
        });

        this.getGradeCategories();    
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getGradeCategories() 
    {
        let response = await this.commonService.getGradeCategories('Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.gradeCategories = response.gradeCategories;
            this.gradeCategories.unshift({ id: "", name: "Select Grade Category" });
        }
        else
        {
            this.gradeCategories = [];
            this.gradeCategories.unshift({ id: "", name: "Select Grade Category" });
        }
    }

    async saveGrade()
    {
        if(!this.saveClicked)
        {
            if(this.addGradeFrm.valid && this.gradeCategoryForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;        
                this.addGradeFrm.controls["gradeCategory"].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
            
                try
                {
                    let response = await this.commonService.saveGrade(this.addGradeFrm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Grade Name Saved.");
                        this.commonSharedService.gradeListObject.next({
                            gradeCategoryId : this.gradeCategoryForm.get("gradeCategory").value,
                            result : "success"
                        });
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
