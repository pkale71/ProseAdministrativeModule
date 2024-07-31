import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Router } from '@angular/router';
// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-syllabus-wise-subject-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './syllabus-wise-subject-edit.component.html',
    styleUrls: ['./syllabus-wise-subject-edit.component.scss']
})
export class SyllabusWiseSubjectEditComponent {
    @Input() public modalParams;
    editSyllabusWiseSubjectForm: FormGroup;
    academicSessionForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    isValidForm: boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;
    saveClicked: boolean;
    syllabusWiseSubject: any;
    gradeWiseSyllabuses : any[];
    gradeCategories : any[];
    grades : any[];
    academicSessions : any[];

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router
    ) {
        this.academicSessions = [],
        this.gradeCategories = [],
        this.grades = [],
        this.gradeWiseSyllabuses =[]
    }

    ngOnInit() 
    {
        //get modal params
        this.syllabusWiseSubject = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.syllabusClicked = false;
        
        this.editSyllabusWiseSubjectForm = this.formbuilder.group({
            id: [''],
            name: ['', Validators.required],
            academicSession: this.formbuilder.group({ 'id' : ['']}),
            gradeCategory: this.formbuilder.group({ 'id' : ['']}),
            grade: this.formbuilder.group({ 'id' : ['']}),
            syllabus: this.formbuilder.group({ 'id' : ['']}),
        });

        this.academicSessionForm = this.formbuilder.group({
            "academicSession" : ['', [Validators.required]]
        });
        this.gradeCategoryForm = this.formbuilder.group({
            "gradeCategory" : ['', Validators.required]
        });
        this.gradeForm = this.formbuilder.group({
            "grade" : ['', Validators.required]
        });
        this.syllabusForm = this.formbuilder.group({
            "syllabus" : ['', Validators.required]
        });
        
        this.getGradeCategories();
        ///Assign Form Data
        this.editSyllabusWiseSubjectForm.patchValue(this.syllabusWiseSubject);
        this.getAcademicSessions();
        this.academicSessionForm.get("academicSession").setValue(this.syllabusWiseSubject.academicSession.id);
        this.gradeCategoryForm.get("gradeCategory").setValue(this.syllabusWiseSubject.gradeCategory.id);
        this.getGrades();
        this.gradeForm.get("grade").setValue(this.syllabusWiseSubject.grade.id);
        this.getGradeWiseSyllabuses();
        this.syllabusForm.get("syllabus").setValue(this.syllabusWiseSubject.syllabus.id);
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
            }
            else
            {
                this.academicSessions = [];
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    //gradeCategory
    async getGradeCategories() 
    {
        try
        {
            let response = await this.commonService.getGradeCategories('All').toPromise();
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
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(gradeCategoryId != undefined && gradeCategoryId != "")
            {
                this.gradeClicked = true;
                let response = await this.commonService.getGrades(gradeCategoryId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.grades = response.grades;
                    this.gradeClicked = false;
                    this.grades.unshift({ id: "", name: "Select Grade" });
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

    // grade wise syllabus
    async getGradeWiseSyllabuses() 
    {
        try
        {
            this.syllabusForm.get("syllabus").setValue("");
            let academicSessionId = this.academicSessionForm.get("academicSession").value;
            let gradeId = this.gradeForm.get("grade").value;
            let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
            {
                this.syllabusClicked = true;
                let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeCategoryId, gradeId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.gradeWiseSyllabuses = response.gradeWiseSyllabuses;
                    this.syllabusClicked = false;
                    this.gradeWiseSyllabuses.unshift({ id : "", syllabus : {
                        id : "",
                        name : "Select Syllabus"
                        }
                    });
                    this.syllabusForm.get("syllabus").setValue(this.syllabusWiseSubject.syllabus.id);
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
        if (!this.saveClicked) 
        {
            if (this.editSyllabusWiseSubjectForm.valid && this.academicSessionForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.syllabusForm.valid )
            { 
                this.isValidForm = true;
                this.saveClicked = true;
                this.editSyllabusWiseSubjectForm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
                this.editSyllabusWiseSubjectForm.controls["gradeCategory"].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
                this.editSyllabusWiseSubjectForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
                this.editSyllabusWiseSubjectForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);            
                try 
                {
                    let response = await this.commonService.updateSyllabusWiseSubject(this.editSyllabusWiseSubjectForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Syllabus Wise Subject Updated");
                        this.commonSharedService.syllabusWiseSubjectListObject.next({ result: "success" });
                        this.closeModal();
                    }
                    else
                    {
                        this.showNotification("success", "Syllabus Wise Subject Not Updated");
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
