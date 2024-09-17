import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { IOption, SelectModule } from 'ng-select';

@Component({
    selector: 'app-subject-add',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './subject-add.component.html',
    styleUrls: ['./subject-add.component.scss']
})
export class SubjectAddComponent 
{
    @Input() public modalParams;
    addSubjectForm: FormGroup;
    academicSessionForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm: FormGroup;
    academicSessions : any[];
    gradeCategories : any[];
    grades: any[];
    syllabuses : Array<IOption>;
    isValidForm: boolean;
    saveClicked : boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;

    constructor(private commonService: CommonService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService,
        )
    {
        this.academicSessions =[];
        this.gradeCategories = [];
        this.grades = [];
        this.syllabuses = [];
    }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;
        this.gradeClicked = false;
        this.syllabusClicked = false;

        this.addSubjectForm = this.formbuilder.group({
            id:[''],
            name: ['', [Validators.required]],
            applicableFromYear : this.formbuilder.group({ 'id': [''] }),
            gradeCategory : this.formbuilder.group({ 'id': [''] }),
            grade : this.formbuilder.group({ 'id' : [''] }),
            syllabusIds : this.formbuilder.group({ 'id' : [''] })
        });

        this.academicSessionForm = this.formbuilder.group({
            'applicableFromYear' : ['', Validators.required]
        });
        this.gradeCategoryForm = this.formbuilder.group({
            "gradeCategory" : ['', Validators.required]
        });
        this.gradeForm = this.formbuilder.group({
            "grade" : ['', Validators.required]
        });
        this.syllabusForm = this.formbuilder.group({
            'syllabusIds' : ['', Validators.required]
        });

        this.getAcademicSessions();
        this.getGradeCategories(); 
        this.getSyllabuses(); 
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }
    
    //get academic session
    async getAcademicSessions() 
    {
        let response = await this.commonService.getAcademicSessions().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.academicSessions = response.academicSessions;
            this.academicSessions.unshift({ id: "", year: "Select Applicable From Year" });
        }
        else
        {
            this.academicSessions = [];
            this.academicSessions.unshift({ id: "", year: "Select Applicable From Year" });
        }
    }

    //gradeCategory
    async getGradeCategories() 
    {
        try
        {
            let response = await this.commonService.getGradeCategories('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.gradeCategories = response.gradeCategories;
                this.gradeCategories.unshift({ id : "", name : "Select Grade Category"});
            }
            else
            {
                this.gradeCategories = [];
                this.gradeCategories.unshift({ id : "", name : "Select Grade Category"});
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
        }
    }
    
    // get grades
    async getGrades() 
    {  
        try 
        {
            // this.gradeForm.get("grade").setValue("");
            // this.syllabusForm.get("syllabusIds").setValue("");
            // this.syllabuses = [];
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(gradeCategoryId != undefined && gradeCategoryId != "")
            {
                this.gradeClicked = true;
                let response = await this.commonService.getGrades(gradeCategoryId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.grades = response.grades;
                    this.grades.unshift({ id: "", name: "Select Grade" });
                    this.gradeClicked = false;
                }
                else
                {       
                    this.grades = [];
                    this.gradeClicked = false;
                }
            }
            else
            {
                this.grades = [];
                this.gradeClicked = false;
            }    
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.gradeClicked = false;
        }
    }

    //get syllabus
    async getSyllabuses() 
    {
        try
        {
            // this.syllabusForm.get("syllabusIds").setValue("");
            // let academicSessionId = this.academicSessionForm.get("academicSession").value;
            // let gradeId = this.gradeForm.get("grade").value;
            // let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            // if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
            // {
                this.syllabusClicked = true;
                let tempSyllabuses : Array<IOption> = [];
                let response = await this.commonService.getSyllabuses('Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    let syllabuses : any[] = response.syllabuses;
                    for(let i = 0; i < syllabuses.length; i++)
                    {
                        tempSyllabuses.push({
                            'value' : syllabuses[i].id.toString(),
                            'label' : syllabuses[i].name
                        });
                    }
                    this.syllabuses = this.commonSharedService.prepareSelectOptions(tempSyllabuses);
                    this.syllabusClicked = false;
                }
                else
                {
                    this.syllabuses = [];
                    this.syllabusClicked = false;
                }
            // }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.syllabusClicked = false;
        }
    }

    async saveSubject()
    {
        if(!this.saveClicked)
        {
            if(this.addSubjectForm.valid && this.academicSessionForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.syllabusForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;        
                // this.addSubjectForm.controls["applicableFromYear"].get("id").setValue(this.academicSessionForm.get("applicableFromYear").value);
                // this.addSubjectForm.controls['gradeCategory'].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
                // this.addSubjectForm.controls['grade'].get("id").setValue(this.gradeForm.get("grade").value);
                try
                {
                    let tempJSON = {
                        "name" : this.addSubjectForm.get("name").value,
                        "gradeCategory" : { "id" : this.gradeCategoryForm.get('gradeCategory').value },
                        "grade" : { "id" : this.gradeForm.get('grade').value },
                        "applicableFromYear" : { "id" : this.academicSessionForm.get('applicableFromYear').value },
                        "syllabusIds" : this.syllabusForm.get('syllabusIds').value.toString()
                    }
                    let response = await this.commonService.saveSubject(tempJSON).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Subject Saved");
                        this.commonSharedService.subjectListObject.next({
                            result : "success",
                            response : {
                                gradeCategoryId : this.gradeCategoryForm.get('gradeCategory').value,
                                gradeId : this.gradeForm.get('grade').value,
                                syllabusId : this.syllabusForm.get('syllabusIds').value,
                            }
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
