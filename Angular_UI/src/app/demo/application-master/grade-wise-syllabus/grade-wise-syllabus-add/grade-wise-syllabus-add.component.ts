import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-grade-wise-syllabus-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './grade-wise-syllabus-add.component.html',
    styleUrls: ['./grade-wise-syllabus-add.component.scss']
})
export class GradeWiseSyllabusAddComponent 
{
    @Input() public modalParams;
    addGradeWiseFrm : FormGroup;
    gradeCategoryForm : FormGroup;
    schoolingProgramForm : FormGroup;
    gradeForm : FormGroup;
    academicSessionForm : FormGroup;
    syllabusForm : FormGroup;
    isValidForm : boolean;
    academicSessionClicked : boolean;
    gradeCategoryClicked : boolean;
    gradeClicked : boolean;
    schoolingProgramClicked : boolean;
    syllabusClicked : boolean;
    saveClicked : boolean;
    gradeCategories : any[];
    grades : any[];
    academicSessions : any[];
    syllabuses : any[];
    schoolingPrograms : any[];

    constructor(private commonService: CommonService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService,
        )
    {
        this.academicSessions = [];
        this.schoolingPrograms = [];
        this.gradeCategories = [];
        this.grades = [];
        this.syllabuses = []
    }

    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;
        this.gradeClicked = false;
        this.academicSessionClicked = false;
        this.gradeCategoryClicked = false;
        this.schoolingProgramClicked = false;
        this.syllabusClicked = false;

        this.addGradeWiseFrm = this.formbuilder.group({
            id:[''],
            gradeCategory: this.formbuilder.group({ 'id': ['']}),
            grade: this.formbuilder.group({ 'id': [''] }),
            academicSession : this.formbuilder.group({ 'id': [''] }),
            syllabus : this.formbuilder.group({ 'id' : [''] })
        });

        this.gradeCategoryForm = this.formbuilder.group({
            'gradeCategory': ['', Validators.required]
        });
        this.gradeForm = this.formbuilder.group({
            'grade': ['', [Validators.required]]
        });
        this.academicSessionForm = this.formbuilder.group({
            'academicSession' : ['', Validators.required]
        });
        this.schoolingProgramForm = this.formbuilder.group({
            'schoolingProgram': ['', Validators.required]
        });
        this.syllabusForm = this.formbuilder.group({
            'syllabus' : ['', Validators.required]
        })

        this.getGradeCategories();
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
            this.academicSessionClicked = true;
            let response = await this.commonService.getAcademicSessions().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.academicSessions = response.academicSessions;
                this.academicSessions.unshift({ id: "", name: "Select Academin Session" });
                this.academicSessionClicked = false;
            }
            else
            {
                this.academicSessions = [];
                this.academicSessions.unshift({ id: "", name: "Select Academin Session" });
                this.academicSessionClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.academicSessionClicked = false;
        }
    }

    //gradeCategory
    async getGradeCategories() 
    {
        try
        {
            this.gradeCategoryClicked = true;
            let response = await this.commonService.getGradeCategories('Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.gradeCategories = response.gradeCategories;
                this.gradeCategories.unshift({ id : "", name : "Select Grade Category"});
                this.gradeCategoryClicked = false;
            }
            else
            {
                this.gradeCategories = [];
                this.gradeCategories.unshift({ id : "", name : "Select Grade Category"});
                this.gradeCategoryClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
            this.gradeCategoryClicked = false;
        }
    }

    // schooling program
    async getSchoolingPrograms() 
    {
        try
        {
            let academicSessionId = this.academicSessionForm.get("academicSession").value;
            if(academicSessionId != undefined && academicSessionId != "")
            {
                this.schoolingProgramClicked = true;
                this.schoolingPrograms = [];
                this.schoolingProgramForm.get("schoolingProgram").setValue("");
                let response = await this.commonService.getSchoolingPrograms(academicSessionId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.schoolingPrograms = response.schoolingPrograms;
                    this.schoolingPrograms.unshift({ id: "", name: "Select School Program" });
                    this.getSyllabuses();
                    this.schoolingProgramClicked = false;
                }
                else
                {
                    this.schoolingPrograms = [];
                    this.schoolingPrograms.unshift({ id: "", name: "Select School Program" });
                    this.getSyllabuses();
                    this.schoolingProgramClicked = false;
                }
            }
            else
            {
                this.schoolingPrograms = [];
                this.schoolingPrograms.unshift({ id: "", name: "Select School Program" });
                this.getSyllabuses();
                this.schoolingProgramClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
            this.schoolingProgramClicked = false;
        }
    }

    // get grades
    async getGrades() 
    {  
        try 
        {
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
                    this.grades.unshift({ id : "", name : "Select Grade" });
                    this.gradeClicked = false;
                }
            }
            else
            {
                this.grades = [];
                this.grades.unshift({ id : "", name : "Select Grade" });
                this.gradeClicked = false;
            }    
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.gradeClicked = false;
        }
    }

    //get syllabuses
    async getSyllabuses() 
    {
        try
        {
            let academicSessionId : string = this.academicSessionForm.get("academicSession").value; 
            let schoolingProgramId : string = this.schoolingProgramForm.get("schoolingProgram").value;
            if(academicSessionId != "" && schoolingProgramId != "") 
            {
                this.syllabusClicked = true;
                let response = await this.commonService.getSyllabuses(parseInt(academicSessionId), parseInt(schoolingProgramId), 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.syllabuses = response.syllabuses;
                    this.syllabuses.unshift({ id: "", name: "Select Syllabus" });
                    this.syllabusClicked = false;
                }
                else
                {
                    this.syllabuses = [];
                    this.syllabuses.unshift({ id: "", name: "Select Syllabus" });
                    this.syllabusClicked = false;
                }
            }
            else
            {
                this.syllabuses = [];
                this.syllabuses.unshift({ id: "", name: "Select Syllabus" });
                this.syllabusClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.syllabusClicked = false;
        }
    }

    async saveGradeWiseSyllabus()
    {
        if(!this.saveClicked)
        {
            if( this.addGradeWiseFrm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.academicSessionForm.valid && this.syllabusForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;  
                this.addGradeWiseFrm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
                this.addGradeWiseFrm.controls['gradeCategory'].get('id').setValue(this.gradeCategoryForm.get('gradeCategory').value);
                this.addGradeWiseFrm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
                this.addGradeWiseFrm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
                
                try
                {
                    let response = await this.commonService.saveGradeWiseSyllabus(this.addGradeWiseFrm.value).toPromise(); 
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Grade Wise Syllabus Saved");
                        this.commonSharedService.gradeWiseSyllabusListObject.next({
                            result : "success",
                            responseData : {
                                academicSessionId : this.academicSessionForm.get("academicSession").value,
                                gradeCategoryId : this.gradeCategoryForm.get("gradeCategory").value,
                                gradeId : this.gradeForm.get("grade").value
                            }
                        });
                        this.closeModal();
                    }
                    else
                    {
                        this.showNotification("warning", "Grade Wise Syllabus Not Saved")
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
