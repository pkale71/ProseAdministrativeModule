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
  gradeWisesyllabus: any;
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
    this.gradeWisesyllabus = this.modalParams;
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
    this.editGradeWiseSyllabusForm.patchValue(this.gradeWisesyllabus);
    this.getAcademicSessions();
    this.getGradeCategories(this.gradeWisesyllabus.gradeCategory.id);
    this.academicSessionForm.get("academicSession").setValue(this.gradeWisesyllabus.academicSession.id);
    this.getSchoolingPrograms(this.gradeWisesyllabus.schoolingProgram.id);
    
    this.schoolingProgramForm.get("schoolingProgram").setValue(this.gradeWisesyllabus.schoolingProgram.id);
    this.gradeCategoryForm.get("gradeCategory").setValue(this.gradeWisesyllabus.gradeCategory.id);
    this.getGrades(this.gradeWisesyllabus.grade.id);
    this.gradeForm.get("grade").setValue(this.gradeWisesyllabus.grade.id);
    this.syllabusForm.get("syllabus").setValue(this.gradeWisesyllabus.syllabus.id);
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
        this.getSyllabuses();
      }
      else
      {
        this.academicSessions = [];
        this.academicSessionClicked = false;
        this.getSyllabuses();
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.academicSessionClicked = false;
      this.getSyllabuses();
    }
  }

  //gradeCategory
  async getGradeCategories(gradeCategoryId : any) 
  {
   try
   {
      this.gradeCategoryClicked = true;
      let response = await this.commonService.getGradeCategories('All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.gradeCategories = response.gradeCategories;
        this.gradeCategories.unshift({ id : "", name : "Select Grade category"});
        this.gradeCategoryClicked = false;

        if(gradeCategoryId != "")
        {
          let filterGradeCategory = this.gradeCategories.filter(gradeCategory => {gradeCategory.id == gradeCategoryId}); 
          if(filterGradeCategory.length == 0)
          {
            this.gradeCategories.push({ id: this.gradeWisesyllabus.gradeCategory.id, name: this.gradeWisesyllabus.gradeCategory.name});
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
          let response = await this.commonService.getGrades(gradeCategoryId, 'All').toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.grades = response.grades;
            this.gradeClicked = false;
            this.grades.unshift({ id : "", name : "Select Grade"});

            if(gradeId != "")
            {
              let filterGrade = this.grades.filter(grade => {grade.id == gradeId}); 
              if(filterGrade.length == 0)
              {
                this.grades.push({ id: this.gradeWisesyllabus.grade.id, name: this.gradeWisesyllabus.grade.name});
              }
            }
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

  // schooling program
  async getSchoolingPrograms(schoolingProgramId : any) 
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
          this.schoolingProgramClicked = false;
          
          if(schoolingProgramId != "")
          {
            let filterSchoolingProgram = this.schoolingPrograms.filter(schoolingProgram => {schoolingProgram.id == schoolingProgramId}); 
            if(filterSchoolingProgram.length == 0)
            {
              this.schoolingPrograms.push({ id: this.gradeWisesyllabus.schoolingProgram.id, name: this.gradeWisesyllabus.schoolingProgram.name});
            }
          }
          this.getSyllabuses();
        }
        else
        {
          this.schoolingProgramClicked = false;
          this.getSyllabuses();
        }
      }
      else
      {
        this.schoolingProgramClicked = false;
        this.getSyllabuses();
      }
    }
    catch(e)
    {
      this.schoolingProgramClicked = false;
      this.showNotification("error",e);
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
            this.syllabusClicked = false;
          }
          else
          {
            this.syllabuses = [];
            this.syllabusClicked = false;
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


  async saveGradeWiseSyllabus() 
  {
    if (!this.saveClicked) 
      {
        if (this.editGradeWiseSyllabusForm.valid && this.academicSessionForm.valid && this.gradeForm.valid && this.syllabusForm.valid )
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
                        this.commonSharedService.gradeWiseSyllabusListObject.next({ result: "success" });
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
