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
    selector: 'app-schooling-category-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './schooling-category-edit.component.html',
    styleUrls: ['./schooling-category-edit.component.scss']
})
export class SchoolingCategoryEditComponent {
    @Input() public modalParams;
    editSchoolingCategoryForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    schoolingGroup: any;

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router) {
    }

    ngOnInit() 
    {
        this.schoolingGroup = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;

        this.editSchoolingCategoryForm = this.formbuilder.group({
            id: [''],
            name: ['', [Validators.required]],
        });

        this.editSchoolingCategoryForm.patchValue(this.schoolingGroup);
    }

    showNotification(type: string, message: string): void {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async saveSchoolingCategory() 
    {
        if (!this.saveClicked) 
        {
            if (this.editSchoolingCategoryForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try 
                {
                    let response = await this.commonService.saveSchoolingCategory(this.editSchoolingCategoryForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Schooling Category Saved.");
                        this.commonSharedService.schoolingCategoryListObject.next({ result: "success" });
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
