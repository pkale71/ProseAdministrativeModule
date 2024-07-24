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
  selector: 'app-subject-wise-chapter-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './subject-wise-chapter-edit.component.html',
  styleUrls: ['./subject-wise-chapter-edit.component.scss']
})
export class SubjectwiseChapterEditComponent {
  @Input() public modalParams;
  editSubjectWiseChapterForm: FormGroup;
  academicSessionForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  syllabusForm : FormGroup;
  subjectForm : FormGroup;
  isValidForm: boolean;
  saveClicked: boolean;
  gradeClicked : boolean;
  syllabusClicked : boolean;
  subjectClicked : boolean;
  subjectWiseChapters: any;
  gradeWiseSyllabuses : any[];
  gradeCategories : any[];
  grades : any[];
  academicSessions : any[];
  syllabusWiseSubjects : any[];

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
    this.gradeWiseSyllabuses = [],
    this.syllabusWiseSubjects = []
  }

  ngOnInit() 
  {
    //get modal params
    this.subjectWiseChapters = this.modalParams;
    this.isValidForm = true;
    this.saveClicked = false;
    this.gradeClicked = false;
    this.syllabusClicked = false;
    this.subjectClicked = false;
    
    this.editSubjectWiseChapterForm = this.formbuilder.group({
      id: [''],
      name: ['', Validators.required],
      academicSession: this.formbuilder.group({ 'id' : ['']}),
      gradeCategory: this.formbuilder.group({ 'id' : ['']}),
      grade: this.formbuilder.group({ 'id' : ['']}),
      syllabus: this.formbuilder.group({ 'id' : ['']}),
      syllabusWiseSubject: this.formbuilder.group({ 'id' : ['']})
    });

    this.academicSessionForm = this.formbuilder.group({
      "academicSession" : ['', [Validators.required]]
    })

    this.gradeCategoryForm = this.formbuilder.group({
      "gradeCategory" : ['', Validators.required]
    })

    this.gradeForm = this.formbuilder.group({
      "grade" : ['', Validators.required]
    })

    this.syllabusForm = this.formbuilder.group({
      "syllabus" : ['', Validators.required]
    })

    this.subjectForm = this.formbuilder.group({
      'syllabusWiseSubject' : ['', Validators.required]
    })

    //Assign Form Data
    this.editSubjectWiseChapterForm.patchValue(this.subjectWiseChapters);
    this.getAcademicSessions();
    this.academicSessionForm.get("academicSession").setValue(this.subjectWiseChapters.academicSession.id);
    this.getGradeCategories();
    this.gradeCategoryForm.get("gradeCategory").setValue(this.subjectWiseChapters.gradeCategory.id);
    this.getGrades();
    this.gradeForm.get("grade").setValue(this.subjectWiseChapters.grade.id);
    this.getGradeWiseSyllabuses();
    this.syllabusForm.get("syllabus").setValue(this.subjectWiseChapters.syllabus.id);
    this.getSyllabusWiseSubjects();
    this.subjectForm.get('syllabusWiseSubject').setValue(this.subjectWiseChapters.subject.id);
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
      this.subjectForm.get("syllabusWiseSubject").setValue("");
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
      this.subjectForm.get("syllabusWiseSubject").setValue("");
      this.gradeWiseSyllabuses = [];
      this.syllabusWiseSubjects = [];
      
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

  //get subject using syllabus wise subject
  async getSyllabusWiseSubjects() 
  {
    try
    {
      this.subjectForm.get("syllabusWiseSubject").setValue("");
      let academicSessionId = this.academicSessionForm.get("academicSession").value;
      let gradeId = this.gradeForm.get("grade").value;
      let syllabusId = this.syllabusForm.get("syllabus").value;
      let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
      if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "" && syllabusId != undefined && syllabusId != "")
        {
          this.subjectClicked = true;
          let response = await this.commonService.getSyllabusWiseSubjects(academicSessionId, syllabusId, gradeCategoryId, gradeId, 'All').toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.syllabusWiseSubjects = response.syllabusWiseSubjects;
            this.subjectClicked = false;
            this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
          }
          else
          {
            this.syllabusWiseSubjects = [];
            this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
            this.subjectClicked = false;
          }  
        }
        else
        {
          this.syllabusWiseSubjects = [];
          this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
          this.subjectClicked = false;
        } 
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.subjectClicked = false;
    }
  }

  async saveSubjectWiseChapter() 
  {
    if (!this.saveClicked) 
      {
        if (this.editSubjectWiseChapterForm.valid && this.academicSessionForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.syllabusForm.valid && this.subjectForm.valid)
          { 
            this.isValidForm = true;
            this.saveClicked = true;
            this.editSubjectWiseChapterForm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
            this.editSubjectWiseChapterForm.controls['syllabusWiseSubject'].get('id').setValue(this.subjectForm.get('syllabusWiseSubject').value);
            try 
            {
              let response = await this.commonService.updateSubjectWiseChapter(this.editSubjectWiseChapterForm.value).toPromise();
              if (response.status_code == 200 && response.message == 'success') 
              {
                this.showNotification("success", "Subject Wise Chapter Updated");
                this.commonSharedService.subjectWiseChapterListObject.next({ result: "success" });
                this.closeModal();
              }
              else
              {
                this.showNotification("success", "Subject Wise Chapter Not Updated");
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
