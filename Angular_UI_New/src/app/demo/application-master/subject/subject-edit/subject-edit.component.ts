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
    selector: 'app-subject-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './subject-edit.component.html',
    styleUrls: ['./subject-edit.component.scss']
})
export class SubjectEditComponent {
    @Input() public modalParams;
    editSubjectForm: FormGroup;
    academicSessionForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    subjectTypeForm : FormGroup;
    isValidForm: boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;
    saveClicked: boolean;
    subject: any;
    syllabuses : any[];
    subjectTypes : any[];
    gradeCategories : any[];
    grades : any[];
    academicSessions : any[];

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router
    ) 
    {
        this.subjectTypes =[];
        this.academicSessions = [],
        this.gradeCategories = [],
        this.grades = [],
        this.syllabuses = []
    }

    ngOnInit() 
    {
        //get modal params
        this.subject = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.syllabusClicked = false;
        
        this.editSubjectForm = this.formbuilder.group({
            id: [''],
            name: ['', Validators.required],
            subjectType : this.formbuilder.group({ 'id': [''] }),
            applicableFromYear: this.formbuilder.group({ 'id' : ['']}),
            gradeCategory: this.formbuilder.group({ 'id' : ['']}),
            grade: this.formbuilder.group({ 'id' : ['']}),
            syllabus: this.formbuilder.group({ 'id' : ['']}),
            totalSession: ['', [Validators.required, Validators.pattern('^[0-9]{1,3}')]],
            sessionDuration: ['', [Validators.required, Validators.pattern('^[0-9]{1,3}')]],
            hasPractical: ['', [Validators.required]],
            isMandatory: ['', [Validators.required]]
        });

        this.academicSessionForm = this.formbuilder.group({
            "applicableFromYear" : ['', [Validators.required]]
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
        this.subjectTypeForm = this.formbuilder.group({
            'subjectType' : ['', Validators.required]
        });
        
        ///Assign Form Data
        this.editSubjectForm.patchValue(this.subject);
        this.getSubjectTypes();
        this.subjectTypeForm.get("subjectType").setValue(this.subject.subjectType.id);
        this.getAcademicSessions();
        this.academicSessionForm.get("applicableFromYear").setValue(this.subject.applicableFromYear.id);
        this.gradeCategoryForm.get("gradeCategory").setValue(this.subject.gradeCategory.id);
        this.getGradeCategories(this.subject.gradeCategory);
        this.gradeForm.get("grade").setValue(this.subject.grade.id);
        this.getGrades(this.subject.grade);
        this.syllabusForm.get("syllabus").setValue(this.subject.syllabus.id);
        this.getSyllabuses(this.subject.gradeCategory.id, this.subject.syllabus);
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    //get subject type
    async getSubjectTypes() 
    {
        let response = await this.commonService.getSubjectTypes().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.subjectTypes = response.subjectTypes;
            this.subjectTypes.unshift({ id: "", name: "Select Subject Type" });
        }
        else
        {
            this.subjectTypes = [];
            this.subjectTypes.unshift({ id: "", name: "Select Subject Type" });
        }
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
                this.academicSessions.unshift({ id : "", year : "Select Applicable From Year"});
            }
            else
            {
                this.academicSessions = [];
                this.academicSessions.unshift({ id : "", year : "Select Applicable From Year"});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    //gradeCategory
    async getGradeCategories(gradeCategory : any) 
    {
        try
        {
            let response = await this.commonService.getGradeCategories('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.gradeCategories = response.gradeCategories;
                this.gradeCategories.unshift({ id : "", name : "Select Grade Category"});
                // here access deactivate data 
                if(gradeCategory != '')
                {
                    let filterGradeCategory = this.gradeCategories.filter( tempGradeCategory => parseInt(tempGradeCategory.id) == parseInt(gradeCategory.id));
                    if(filterGradeCategory.length == 0)
                    {
                        this.gradeCategories.push({ id : gradeCategory.id, name : gradeCategory.name });
                    }
                }
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
    async getGrades(grade : any) 
    {  
        try 
        {
            // this.gradeForm.get("grade").setValue("");
            // this.syllabusForm.get("syllabus").setValue("");
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
                    // here access deactivate data
                    if(grade != '')
                    {
                        let filterGrade = this.grades.filter(tempGrade => parseInt(tempGrade.id) == parseInt(grade.id));
                        if(filterGrade.length == 0)
                        {
                            this.grades.push({ id : grade.id, name : grade.name });
                        }
                    }

                }
                else
                {
                    this.grades = [];
                    this.grades.unshift({ id: "", name: "Select Grade" });
                    this.gradeClicked = false;
                }
            }
            else
            {
                this.grades = [];
                this.grades.unshift({ id: "", name: "Select Grade" });
                this.gradeClicked = false;
            }    
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.gradeClicked = false;
        }
    }

    // get syllabus
    async getSyllabuses(gradeCategoryid : number, syllabus : any) 
    {
        try
        {
            this.syllabusClicked = true;
            let response = await this.commonService.getSyllabuses(gradeCategoryid, 'Active').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.syllabuses = response.syllabuses;
                this.syllabuses.unshift({ id : "",  name : "Select Syllabus" });
                this.syllabusForm.get("syllabus").setValue(this.subject.syllabus.id);
                this.syllabusClicked = false;
                // here access deactivate data
                if(syllabus != '')
                {
                    let filterSyllabus = this.syllabuses.filter(tempSyllabus => parseInt(tempSyllabus.id) == parseInt(syllabus.id));
                    if(filterSyllabus.length == 0)
                    {
                        this.syllabuses.push({ id : syllabus.id, name : syllabus.name });
                    }
                }
            }
            else
            {
                this.syllabuses = [];
                this.syllabusClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.syllabusClicked = false;
        }
    }

    async saveSubject() 
    {
        if (!this.saveClicked) 
        {
            if (this.editSubjectForm.valid && this.academicSessionForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.syllabusForm.valid && this.subjectTypeForm.valid)
            { 
                this.isValidForm = true;
                this.saveClicked = true;
                this.editSubjectForm.controls["applicableFromYear"].get("id").setValue(this.academicSessionForm.get("applicableFromYear").value);
                this.editSubjectForm.controls["gradeCategory"].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
                this.editSubjectForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
                this.editSubjectForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
                this.editSubjectForm.controls["subjectType"].get("id").setValue(this.subjectTypeForm.get('subjectType').value);     
                try 
                {
                    let response = await this.commonService.updateSubject(this.editSubjectForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Subject Updated");
                        this.commonSharedService.subjectListObject.next({ 
                            result: "success",
                            response : {
                                gradeCategoryId : this.gradeCategoryForm.get('gradeCategory').value,
                                gradeId : 0,
                                syllabusId : 0,
                            }
                         });
                        this.closeModal();
                    }
                    else
                    {
                        this.showNotification("success", "Subject Not Updated");
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
