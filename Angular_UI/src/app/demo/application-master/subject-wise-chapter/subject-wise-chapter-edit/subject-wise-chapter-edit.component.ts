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
  subjectWiseChapters: any;
  gradeWiseSyllabuses : any[];
  gradeCategories : any[];
  grades : any[];
  academicSessions : any[];
  masterGrades :  any[];
  masterGradeWiseSyllabuses : any[];
  syllabusWiseSubjects : any[];
  masterSyllabusWiseSubjects : any[];

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
    this.getAcademicSessions();
    this.getGradeCategories();

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
    this.academicSessionForm.get("academicSession").setValue(this.subjectWiseChapters.academicSession.id);
    this.gradeCategoryForm.get("gradeCategory").setValue(this.subjectWiseChapters.gradeCategory.id);
    this.gradeForm.get("grade").setValue(this.subjectWiseChapters.grade.id);
    this.syllabusForm.get("syllabus").setValue(this.subjectWiseChapters.syllabus.id);
    this.subjectForm.get('syllabusWiseSubject').setValue(this.subjectWiseChapters.subject.id);
    this.getGrades();
    this.getGradeWiseSyllabuses();
    this.getSyllabusWiseSubjects();
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
      let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
      if(gradeCategoryId != undefined && gradeCategoryId != "")
      {
        this.saveClicked = true;
        let response = await this.commonService.getGrades(gradeCategoryId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterGrades = response.grades;
          this.grades = this.masterGrades;
          this.saveClicked = false;
          this.grades.unshift({ id: "", name: "Select Grade" });
        }
        else
        {
          this.grades = [];
          this.saveClicked = false;
        }
      }
      else
      {
        this.grades = [];
        this.saveClicked = false;
      }    
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  // grade wise syllabus
  async getGradeWiseSyllabuses() 
  {
    try
    {
      let academicSessionId = this.academicSessionForm.get("academicSession").value;
      let gradeId = this.gradeForm.get("grade").value;
      if(academicSessionId != undefined && academicSessionId != "" && gradeId != undefined && gradeId != "")
      {
        this.saveClicked = true;
        let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterGradeWiseSyllabuses = response.gradeWiseSyllabuses;
          this.gradeWiseSyllabuses = this.masterGradeWiseSyllabuses;
          this.saveClicked = false;
          this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
            id : "0",
            name : "Select Syllabus"
            }
          });
          this.syllabusForm.get("syllabus").setValue(this.subjectWiseChapters.syllabus.id);
        }
        else
        {
          this.gradeWiseSyllabuses = [];
          this.saveClicked = false;
        }
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  //get subject using syllabus wise subject
  async getSyllabusWiseSubjects() 
  {
    try
    {
      let academicSessionId = this.academicSessionForm.get("academicSession").value;
      let gradeId = this.gradeForm.get("grade").value;
      let syllabusId = this.syllabusForm.get("syllabus").value;
      if(academicSessionId != undefined && academicSessionId != "" && gradeId != undefined && gradeId != "" && syllabusId != undefined && syllabusId != "")
        {
          this.saveClicked = true;
          let response = await this.commonService.getSyllabusWiseSubjects(academicSessionId, syllabusId, gradeId, 'All').toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.masterSyllabusWiseSubjects = response.syllabusWiseSubjects;
            this.syllabusWiseSubjects = this.masterSyllabusWiseSubjects;
            this.saveClicked = false;
            this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
          }
          else
          {
            this.syllabusWiseSubjects = [];
            this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
            this.saveClicked = false;
          }  
        }
        else
        {
          this.syllabusWiseSubjects = [];
          this.syllabusWiseSubjects.unshift({ id : "", name : "Select Subject"});
          this.saveClicked = false;
        } 
    }
    catch(e)
    {
      this.showNotification("error", e);
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
