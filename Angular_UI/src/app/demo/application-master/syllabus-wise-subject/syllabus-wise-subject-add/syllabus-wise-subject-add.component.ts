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
    selector: 'app-syllabus-wise-subject-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './syllabus-wise-subject-add.component.html',
    styleUrls: ['./syllabus-wise-subject-add.component.scss']
})
export class SyllabusWiseSubjectAddComponent 
{
    @Input() public modalParams;
    addSyllabusWiseSubject: FormGroup;
    academicForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm: FormGroup;
    academicSessions : any[];
    gradeCategories : any[];
    grades: any[];
    gradeWiseSyllabuses : any[];
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
        this.gradeWiseSyllabuses = [];
    }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;
        this.gradeClicked = false;
        this.syllabusClicked = false;

        this.addSyllabusWiseSubject = this.formbuilder.group({
            id:[''],
            name: ['', [Validators.required]],
            academicSession : this.formbuilder.group({ 'id': [''] }),
            gradeCategory : this.formbuilder.group({ 'id': [''] }),
            grade : this.formbuilder.group({ 'id' : [''] }),
            syllabus : this.formbuilder.group({ 'id' : [''] })
        });

        this.academicForm = this.formbuilder.group({
            'academicSession' : ['', Validators.required]
        });
        this.gradeCategoryForm = this.formbuilder.group({
            "gradeCategory" : ['', Validators.required]
        });
        this.gradeForm = this.formbuilder.group({
            "grade" : ['', Validators.required]
        });
        this.syllabusForm = this.formbuilder.group({
            'syllabus' : ['', Validators.required]
        });

        this.getAcademicSessions();
        this.getGradeCategories();  
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
            this.academicSessions.unshift({ id: "", name: "Select Academin Session" });
        }
        else
        {
            this.academicSessions = [];
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
            this.gradeForm.get("grade").setValue("");
            this.syllabusForm.get("syllabus").setValue("");
            this.gradeWiseSyllabuses = [];
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

    //get syllabus using grade wise syllabus
    async getGradeWiseSyllabuses() 
    {
        try
        {
            this.syllabusForm.get("syllabus").setValue("");
            let academicSessionId = this.academicForm.get("academicSession").value;
            let gradeId = this.gradeForm.get("grade").value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
            {
                this.syllabusClicked = true;
                let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeCategoryId, gradeId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.gradeWiseSyllabuses = response.gradeWiseSyllabuses;
                    this.gradeWiseSyllabuses.unshift({ id : "", syllabus : {
                        id : "",
                        name : "Select Syllabus"
                        }
                    });
                    this.syllabusClicked = false;
                }
                else
                {
                    this.gradeWiseSyllabuses = [];
                    this.syllabusClicked = false;
                }
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.syllabusClicked = false;
        }
    }

    async saveSyllabusWiseSubject()
    {
        if(!this.saveClicked)
        {
            if(this.addSyllabusWiseSubject.valid && this.academicForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.syllabusForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;        
                this.addSyllabusWiseSubject.controls["academicSession"].get("id").setValue(this.academicForm.get("academicSession").value);
                this.addSyllabusWiseSubject.controls['gradeCategory'].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
                this.addSyllabusWiseSubject.controls['grade'].get("id").setValue(this.gradeForm.get("grade").value);
                this.addSyllabusWiseSubject.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
                try
                {
                    let response = await this.commonService.saveSyllabusWiseSubject(this.addSyllabusWiseSubject.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Syllabus Wise Subject Saved");
                        this.commonSharedService.syllabusWiseSubjectListObject.next({result : "success"});
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
