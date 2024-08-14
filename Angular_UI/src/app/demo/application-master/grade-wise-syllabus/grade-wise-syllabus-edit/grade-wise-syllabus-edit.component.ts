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
import { SchoolingProgramListComponent } from '../../schooling-program/schooling-program-list/schooling-program-list.component';

@Component({
    selector: 'app-grade-wise-syllabus-edit',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './grade-wise-syllabus-edit.component.html',
    styleUrls: ['./grade-wise-syllabus-edit.component.scss']
})
export class GradeWiseSyllabusEditComponent {
    @Input() public modalParams;
    editGradeWiseSyllabusForm: FormGroup;
    academicSessionForm : FormGroup;
    schoolingProgramForm : FormGroup;
    gradeCategoryForm : FormGroup;
    gradeForm : FormGroup;
    syllabusForm : FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;
    academicSessionClicked : boolean;
    gradeCategoryClicked : boolean;
    gradeClicked : boolean;
    schoolingProgramClicked : boolean;
    syllabusClicked : boolean;
    gradeWiseSyllabus: any;
    syllabuses : any[];
    gradeCategories : any[];
    grades : any[];
    academicSessions : any[];
    schoolingPrograms : any[];

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
        this.syllabuses =[]
        this.schoolingPrograms = [];
    }

    ngOnInit() 
    {
        //get modal params
        this.gradeWiseSyllabus = this.modalParams;
        this.isValidForm = true;
        this.saveClicked = false;
        this.gradeClicked = false;
        this.academicSessionClicked = false;
        this.gradeCategoryClicked = false;
        this.schoolingProgramClicked = false;
        this.syllabusClicked = false;

        this.editGradeWiseSyllabusForm = this.formbuilder.group({
            id: [''],
            academicSession: this.formbuilder.group({ 'id' : ['']}),
            gradeCategory: this.formbuilder.group({ 'id' : ['']}),
            grade: this.formbuilder.group({ 'id' : ['']}),
            syllabus: this.formbuilder.group({ 'id' : ['']}),
        });

        this.academicSessionForm = this.formbuilder.group({
            "academicSession" : ['', [Validators.required]]
        });
        this.schoolingProgramForm = this.formbuilder.group({
            'schoolingProgram': ['', Validators.required]
        });
        this.gradeCategoryForm = this.formbuilder.group({
            'gradeCategory' : ['', Validators.required]
        });
        this.gradeForm = this.formbuilder.group({
            "grade" : ['', Validators.required]
        });
        this.syllabusForm = this.formbuilder.group({
            "syllabus" : ['', Validators.required]
        });

        ///Assign Form Data
        this.editGradeWiseSyllabusForm.patchValue(this.gradeWiseSyllabus);
        this.academicSessionForm.get("academicSession").setValue(this.gradeWiseSyllabus.academicSession.id);
        this.getAcademicSessions();
        this.schoolingProgramForm.get("schoolingProgram").setValue(this.gradeWiseSyllabus.schoolingProgram.id);
        this.getSchoolingPrograms(this.gradeWiseSyllabus.schoolingProgram);  
        this.gradeCategoryForm.get('gradeCategory').setValue(this.gradeWiseSyllabus.gradeCategory.id);
        this.getGradeCategories(this.gradeWiseSyllabus.gradeCategory);
        this.gradeForm.get("grade").setValue(this.gradeWiseSyllabus.grade.id);
        this.getGrades(this.gradeWiseSyllabus.grade.id);    
        this.syllabusForm.get("syllabus").setValue(this.gradeWiseSyllabus.syllabus.id);
        this.getSyllabuses(this.gradeWiseSyllabus.syllabus);      
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
                this.academicSessionClicked = false;
                // this.getSyllabuses(this.gradeWiseSyllabus.syllabus);
            }
            else
            {
                this.academicSessions = [];
                this.academicSessionClicked = false;
                // this.getSyllabuses(this.gradeWiseSyllabus.syllabus);
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.academicSessionClicked = false;
            // this.getSyllabuses(this.gradeWiseSyllabus.syllabus);
        }
    }

    //gradeCategory
    async getGradeCategories(gradeCategoryId : any) 
    {
        try
        {
            let gradeCategoryId = this.gradeCategoryForm.get('gradeCategory').value;
            if(gradeCategoryId != undefined && gradeCategoryId != '')
            {
                this.gradeCategoryClicked = true;
                let response = await this.commonService.getGradeCategories('Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.gradeCategories = response.gradeCategories;
                    this.gradeCategories.unshift({ id : "", name : "Select Grade category"});
                    this.gradeCategoryClicked = false;
                    // here access deactive data
                    if(gradeCategoryId != "")
                    {
                        let filterGradeCategory = this.gradeCategories.filter(gradeCategory => { return gradeCategory.id == gradeCategoryId}); 
                        if(filterGradeCategory.length == 0)
                        {
                            this.gradeCategories.push({ id: this.gradeWiseSyllabus.gradeCategory.id, name: this.gradeWiseSyllabus.gradeCategory.name});
                        }
                    }
                }
                else
                {
                    this.gradeCategories = [];
                    this.gradeCategories.unshift({ id : "", name : "Select Grade category"});
                    this.gradeCategoryClicked = false;
                }
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
            this.gradeCategoryClicked = false;
        }
    }

    //get grades
    async getGrades(gradeId : any) 
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
                    this.grades.unshift({ id : "", name : "Select Grade"});
                    this.gradeClicked = false;
                    //here access deactivate data
                    if(gradeId != "")
                    {
                        let filterGrade = this.grades.filter(grade => { return grade.id == gradeId }); 
                        if(filterGrade.length == 0)
                        {
                            this.grades.push({ id: this.gradeWiseSyllabus.grade.id, name: this.gradeWiseSyllabus.grade.name});
                        }
                    }
                }
                else
                {
                    this.grades = [];
                    this.grades.unshift({ id : "", name : "Select Grade"});
                    this.gradeClicked = false;
                }
            }
            else
            {
                this.grades = [];
                this.grades.unshift({ id : "", name : "Select Grade"});
                this.gradeClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.gradeClicked = false;
        }
    }

    // schooling program
    async getSchoolingPrograms(schoolingProgram : any) 
    {
        try
        {
            let academicSessionId = this.academicSessionForm.get("academicSession").value;
            if(academicSessionId != undefined && academicSessionId != "")
            {
                this.schoolingProgramClicked = true;
                // this.schoolingPrograms = [];
                // this.schoolingProgramForm.get("schoolingProgram").setValue("");
                let response = await this.commonService.getSchoolingPrograms(academicSessionId, 'Active').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.schoolingPrograms = response.schoolingPrograms;
                    this.schoolingPrograms.unshift({ id: "", name: "Select School Program" });
                    this.schoolingProgramClicked = false;
                    // here access deactivate data
                    if(schoolingProgram != "")
                    {
                        let filterSchoolingProgram = this.schoolingPrograms.filter(tempSchoolingProgram => parseInt(tempSchoolingProgram.id) == parseInt(schoolingProgram.id)); 
                        if(filterSchoolingProgram.length == 0)
                        {
                            this.schoolingPrograms.push({ id : schoolingProgram.id, name : schoolingProgram.name });
                        }
                    }
                    // this.getSyllabuses(this.gradeWiseSyllabus.syllabus);
                }
                else
                {
                    this.schoolingPrograms = [];
                    this.schoolingPrograms.unshift({ id: "", name: "Select School Program" });
                    this.schoolingProgramClicked = false;
                    // this.getSyllabuses(this.gradeWiseSyllabus.syllabus);
                }
            }
            else
            {
                this.schoolingPrograms = [];
                this.schoolingPrograms.unshift({ id: "", name: "Select School Program" });
                this.schoolingProgramClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
            this.schoolingProgramClicked = false;
        }
    }

    //get syllabuses
    async getSyllabuses(syllabus : any) 
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
                    this.syllabuses.unshift({ id : '', name : 'Select Syllabus'});
                    this.syllabusClicked = false;
                    // here access deactive data
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
                    this.syllabuses.unshift({ id : '', name : 'Select Syllabus'});
                    this.syllabusClicked = false;
                }
            }
            else
            {
                this.syllabuses = [];
                this.syllabuses.unshift({ id : '', name : 'Select Syllabus'});
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
        if (!this.saveClicked) 
        {
            if (this.editGradeWiseSyllabusForm.valid && this.academicSessionForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.syllabusForm.valid )
            { 
                this.isValidForm = true;
                this.saveClicked = true;
                this.editGradeWiseSyllabusForm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
                this.editGradeWiseSyllabusForm.controls['gradeCategory'].get('id').setValue(this.gradeCategoryForm.get('gradeCategory').value);
                this.editGradeWiseSyllabusForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
                this.editGradeWiseSyllabusForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
                try 
                {
                    let response = await this.commonService.updateGradeWiseSyllabus(this.editGradeWiseSyllabusForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Grade Wise Syllabus Updated");
                        this.commonSharedService.gradeWiseSyllabusListObject.next({ 
                            result: "success",
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
                        this.showNotification("success", "Grade Wise Syllabus Not Updated");
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
