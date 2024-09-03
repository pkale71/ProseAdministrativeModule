import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-schooling-program-add',
    standalone: true,
    imports: [CommonModule, SharedModule, TagInputModule],
    templateUrl: './schooling-program-add.component.html',
    styleUrls: ['./schooling-program-add.component.scss']
})
export class SchoolingProgramAddComponent {
    @Input() public modalParams;
    addProgramForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    schoolingCategoryForm : FormGroup;
    schoolingCategories : any[];
    names : string[] = [];

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router) 
        {
            this.schoolingCategories = [];
        }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;

        this.addProgramForm = this.formbuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            schoolingCategory : this.formbuilder.group({ 'id' : ['']})
        });
        this.schoolingCategoryForm = this.formbuilder.group({
            schoolingCategory : ['', [Validators.required]]
        });

        this.getSchoolingCategories();
    }

    showNotification(type: string, message: string): void 
    {
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

    onEnterKey(event: any) 
    {
        if (event.key === 'Enter') 
        {
            if (this.names.length >= 11) 
            {
                this.names.splice(-1, 1); 
                this.showNotification("warning","Select Only 10 Names");
                this.addProgramForm.setValue(this.names);
            }
        }
    }    

    async saveSchoolingProgram() 
    {
        if (!this.saveClicked) 
        {
            if (this.addProgramForm.valid && this.schoolingCategoryForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                let schoolingCategoryId = this.schoolingCategoryForm.get("schoolingCategory").value;
                this.addProgramForm.controls['schoolingCategory'].get("id").setValue(schoolingCategoryId);
                try 
                {
                    let tempJSON = {
                        "schoolingCategory" : { "id" : this.schoolingCategoryForm.get('schoolingCategory').value },
                        "names" : this.addProgramForm.get('name').value
                    }
                    let response = await this.commonService.saveSchoolingPrograms(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "School Program Saved");
                        this.commonSharedService.schoolingProgramListObject.next({ 
                            result: "success", 
                            responseData : {
                                schoolingCategoryId : schoolingCategoryId,
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
