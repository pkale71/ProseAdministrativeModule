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
    isValidForm: boolean;
    gradeClicked : boolean;
    syllabusClicked : boolean;
    saveClicked: boolean;
    subject: any;
    syllabuses : any[];
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
            applicableFromYear: this.formbuilder.group({ 'id' : ['']}),
            gradeCategory: this.formbuilder.group({ 'id' : ['']}),
            grade: this.formbuilder.group({ 'id' : ['']}),
            syllabus: this.formbuilder.group({ 'id' : ['']}),
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
        
        ///Assign Form Data
        this.editSubjectForm.patchValue(this.subject);
        this.getAcademicSessions();
        this.academicSessionForm.get("applicableFromYear").setValue(this.subject.applicableFromYear.id);
        this.gradeCategoryForm.get("gradeCategory").setValue(this.subject.gradeCategory.id);
        this.getGradeCategories(this.subject.gradeCategory);
        this.gradeForm.get("grade").setValue(this.subject.grade.id);
        this.getGrades(this.subject.grade);
        this.syllabusForm.get("syllabus").setValue(this.subject.syllabus.id);
        this.getSyllabuses(this.subject.syllabus);
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
    async getSyllabuses(syllabus : any) 
    {
        try
        {
            // this.syllabusForm.get("syllabus").setValue("");
            // let academicSessionId = this.academicSessionForm.get("academicSession").value;
            // let gradeId = this.gradeForm.get("grade").value;
            // let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
            // if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
            // {
                this.syllabusClicked = true;
                let response = await this.commonService.getSyllabuses('Active').toPromise();
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
        if (!this.saveClicked) 
        {
            if (this.editSubjectForm.valid && this.academicSessionForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.syllabusForm.valid )
            { 
                this.isValidForm = true;
                this.saveClicked = true;
                this.editSubjectForm.controls["applicableFromYear"].get("id").setValue(this.academicSessionForm.get("applicableFromYear").value);
                this.editSubjectForm.controls["gradeCategory"].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
                this.editSubjectForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
                this.editSubjectForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);            
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
                                gradeId : this.gradeForm.get('grade').value,
                                syllabusId : this.syllabusForm.get('syllabus').value,
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
