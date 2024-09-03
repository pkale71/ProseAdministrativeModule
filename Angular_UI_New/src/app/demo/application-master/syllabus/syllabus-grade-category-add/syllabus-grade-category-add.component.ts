import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { id } from 'date-fns/locale';
import { IOption, SelectModule } from 'ng-select';
import { closestIndexTo } from 'date-fns';
import { filter } from 'rxjs';

@Component({
    selector: 'app-syllabus-grade-category-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './syllabus-grade-category-add.component.html',
    styleUrls: ['./syllabus-grade-category-add.component.scss']
})
export class SyllabusGradeCategoryAddComponent {
    @Input() public modalParams;
    addGradeCategoryForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    gradeCategoryIds : Array<IOption>;
    id : number;
    syllabusGradeCategories : any[];
    syllabus : any;
    selectedCategory : any;

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router) {
    }

    ngOnInit() 
    {
        // get modal params
        this.id = this.modalParams.id;
        this.syllabusGradeCategories = this.modalParams.gradeCategories;
        this.isValidForm = true;
        this.saveClicked = false;

        this.addGradeCategoryForm = this.formbuilder.group({
            id: [''], 
            gradeCategoryIds: [[this.syllabusGradeCategories], [Validators.required]],
        });
        this.getSyllabus(this.id);
        this.getGradeCategories();
    }

    showNotification(type: string, message: string): void {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    onEnterKey(event: any) 
    {
        if (event.key === 'Enter') 
        {
            if (this.gradeCategoryIds.length >= 11) 
            {
                this.gradeCategoryIds.splice(-1, 1); 
                this.showNotification("warning","Select Only 10 Names");
                this.addGradeCategoryForm.setValue(this.gradeCategoryIds);
            }
        }
    }  

    async getGradeCategories() 
    {
        try 
        {
            let tempGradeCategoryIds : Array<IOption> = [];
            let response = await this.commonService.getGradeCategories('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                let masterGradeCategories : any[] = response.gradeCategories;
                for(let j = 0; j < this.syllabusGradeCategories.length; j++)
                {
                    for(let k = 0; k < masterGradeCategories.length; k++)
                    {
                        if(parseInt(this.syllabusGradeCategories[j].id) == parseInt(masterGradeCategories[k].id))
                        {
                            masterGradeCategories.splice(k, 1);
                            break;
                        }
                    }
                }
                for(let i = 0; i < masterGradeCategories.length; i++)
                {
                    tempGradeCategoryIds.push({
                        'value' : masterGradeCategories[i].id.toString(),
                        'label' : masterGradeCategories[i].name
                    });
                }
                this.gradeCategoryIds = this.commonSharedService.prepareSelectOptions(tempGradeCategoryIds); 
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
        }
    }
    
    async getSyllabus(id : number) 
    {
        try
        {
            let response = await this.commonService.getSyllabus(id).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.syllabus = response.syllabus;
            }
            else
            {
                this.syllabus = [];
            }
        }
        catch(e)
        {
            this.showNotification("error", e);  
        }
    }

    async saveCategory() 
    {
        if (!this.saveClicked) 
        {
            if (this.addGradeCategoryForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try 
                {
                    let tempJSON = {
                        "id" : this.id,
                        "gradeCategoryIds" : this.addGradeCategoryForm.get('gradeCategoryIds').value.toString()
                    }
                    let response = await this.commonService.addSyllabusGradeCategories(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Grade Category Saved.");
                        this.commonSharedService.gradeCategoryListObject.next({ result: "success" });
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
