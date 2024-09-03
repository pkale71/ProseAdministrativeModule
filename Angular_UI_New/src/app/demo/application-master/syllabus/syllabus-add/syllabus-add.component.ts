import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { IOption, SelectModule } from 'ng-select';
import { Router } from '@angular/router';

@Component({
    selector: 'app-syllabus-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './syllabus-add.component.html',
    styleUrls: ['./syllabus-add.component.scss']
})
export class SyllabusAddComponent {
    @Input() public modalParams;
    schoolingPrograms : any[];
    syllabuses : any[];
    addSyllabusForm: FormGroup;
    gradeCategoryForm : FormGroup;
    schoolingProgramForm : FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;
    gradeCategoryIds : Array<IOption>;

    constructor(private commonService: CommonService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService,
        private router : Router)
    {
        // this.gradeCategories = [];
    }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;

        this.addSyllabusForm = this.formbuilder.group({
            id:[''],
            name: ['',Validators.required],
            gradeCategoryIds : this.formbuilder.group({ 'id' : [''] }),
        });

        this.gradeCategoryForm = this.formbuilder.group({
            'gradeCategoryIds' : ['', Validators.required]
        });

        this.getGradeCategories();
    }

    showNotification(type: string, message: string): void 
    {
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
                this.gradeCategoryForm.setValue(this.gradeCategoryIds);
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
                let gradeCategories : any[] = response.gradeCategories;
                for(let i = 0; i < gradeCategories.length; i++)
                {
                    tempGradeCategoryIds.push({
                        'value' : gradeCategories[i].id.toString(),
                        'label' : gradeCategories[i].name
                    })
                }
                this.gradeCategoryIds = this.commonSharedService.prepareSelectOptions(tempGradeCategoryIds);
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
        }
    }

    async saveSyllabus()
    {
        if(!this.saveClicked)
        {
            if(this.addSyllabusForm.valid && this.gradeCategoryForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try
                {
                    let tempJSON = {
                        "name" : this.addSyllabusForm.get('name').value,
                        "gradeCategoryIds" : this.gradeCategoryForm.get('gradeCategoryIds').value.toString()
                    }
                    let response = await this.commonService.saveSyllabus(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Syllabus Saved.");
                        this.closeModal();
                        this.isValidForm = false;
                        this.saveClicked = false;
                        this.router.navigateByUrl("/applicationMaster/syllabus/detail/" +  response.id);
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

