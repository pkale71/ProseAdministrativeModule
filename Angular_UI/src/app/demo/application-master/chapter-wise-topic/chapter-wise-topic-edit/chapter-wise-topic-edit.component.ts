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
  selector: 'app-chapter-wise-topic-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './chapter-wise-topic-edit.component.html',
  styleUrls: ['./chapter-wise-topic-edit.component.scss']
})
export class ChapterWiseTopicEditComponent {
  @Input() public modalParams;
  editChapterWiseSubjectForm: FormGroup;
  academicSessionForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  syllabusForm : FormGroup;
  subjectForm : FormGroup;
  chapterForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  academicSessions : any[];
  gradeCategories : any[];
  grades : any[];
  masterGrades : any[];
  gradeWiseSyllabuses : any[];
  masterGradeWiseSyllabuses : any[];
  syllabusWiseSubjects : any[];
  masterSyllabusWiseSubjects : any[];
  subjectWiseChapters : any[];
  masterSubjectWiseChapters : any[];
  chapterWiseTopics : any;

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
    this.academicSessions = [];
    this.gradeCategories = [];
    this.grades = [];
    this.gradeWiseSyllabuses = [];
    this.syllabusWiseSubjects = [];
    this.subjectWiseChapters = [];
  }

  ngOnInit() 
  {
    //get modal params
    this.chapterWiseTopics = this.modalParams;
    this.isValidForm = true;
    this.saveClicked = false;
    this.getAcademicSessions();
    this.getGradeCategories();

    this.editChapterWiseSubjectForm = this.formbuilder.group({
      id:[''],
      name: ['', [Validators.required]],
      academicSession : this.formbuilder.group({ 'id': [''] }),
      gradeCategory : this.formbuilder.group({ 'id': [''] }),
      grade : this.formbuilder.group({ 'id': [''] }),
      syllabus : this.formbuilder.group({ 'id': [''] }),      
      syllabusWiseSubject : this.formbuilder.group({ 'id': [''] }),      
      subjectWiseChapter : this.formbuilder.group({ 'id': [''] })
    });

    this.academicSessionForm = this.formbuilder.group({
      'academicSession' : ['', Validators.required]
    });
    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory' : ['', Validators.required]
    })
    this.gradeForm = this.formbuilder.group({
      'grade' : ['', Validators.required]
    })
    this.syllabusForm = this.formbuilder.group({
      'syllabus' : ['', Validators.required]
    })
    this.subjectForm = this.formbuilder.group({
      'syllabusWiseSubject' : ['', Validators.required]
    })
    this.chapterForm = this.formbuilder.group({
      'subjectWiseChapter' : ['', Validators.required]
    })
    // assign form data
    this.editChapterWiseSubjectForm.patchValue(this.chapterWiseTopics);
    this.academicSessionForm.get("academicSession").setValue(this.chapterWiseTopics.academicSession.id);
    this.gradeCategoryForm.get("gradeCategory").setValue(this.chapterWiseTopics.gradeCategory.id);
    this.gradeForm.get("grade").setValue(this.chapterWiseTopics.grade.id);
    this.syllabusForm.get("syllabus").setValue(this.chapterWiseTopics.syllabus.id);
    this.subjectForm.get('syllabusWiseSubject').setValue(this.chapterWiseTopics.subject.id);
    this.chapterForm.get('subjectWiseChapter').setValue(this.chapterWiseTopics.chapter.id);
    this.getGrades();
    this.getGradeWiseSyllabuses();
    this.getSyllabusWiseSubjects();
    this.getSubjectWiseChapters();
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
          this.grades.unshift({ id: "", name: "Select Grade" });
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

  //get syllabus using grade wise syllabus
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
              this.gradeWiseSyllabuses.unshift({ id : "", syllabus : {
                id : "0",
                name : "Select Syllabus"
                }
              });
              this.syllabusForm.get("syllabus").setValue(this.chapterWiseTopics.syllabus.id);
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
      let syllabusId = this.syllabusForm.get("syllabus").value;
      let gradeId = this.gradeForm.get("grade").value;
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
            this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
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

  //get chapter using subject wise chapter
  async getSubjectWiseChapters() 
  {
    try
    { 
      let academicSessionId = this.academicSessionForm.get("academicSession").value;
      let syllabusId = this.syllabusForm.get("syllabus").value
      let gradeId = this.gradeForm.get("grade").value;
      let subjectId = this.subjectForm.get("syllabusWiseSubject").value
      if(academicSessionId != undefined && academicSessionId != "" && syllabusId != undefined && syllabusId != "" && gradeId != undefined && gradeId != "" && subjectId != undefined && subjectId != "" )
      {
        let response = await this.commonService.getSubjectWiseChapters(academicSessionId, syllabusId, gradeId, subjectId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterSubjectWiseChapters = response.subjectWiseChapters;
          this.subjectWiseChapters = this.masterSubjectWiseChapters;
          this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
        }
        else
        {
          this.subjectWiseChapters = [];
          this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
        }
      }
    }  
    catch(e)
    {
      this.showNotification("error", e);
    }  
  }

  async saveChapterWiseTopic()
  {
    if(!this.saveClicked)
    {
      if(this.editChapterWiseSubjectForm.valid && this.academicSessionForm.valid && this.chapterForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true; 
        this.editChapterWiseSubjectForm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
        this.editChapterWiseSubjectForm.controls["subjectWiseChapter"].get("id").setValue(this.chapterForm.get("subjectWiseChapter").value);
        
        try
        {
          let response = await this.commonService.updateChapterWiseTopic(this.editChapterWiseSubjectForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Chapter Wise Topic Updated");
            this.commonSharedService.chapterWiseTopicListObject.next({result : "success"});
            this.closeModal();
          }
          else
          {
            this.showNotification("error", "Chapter Wise Topic Not Updated");
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
