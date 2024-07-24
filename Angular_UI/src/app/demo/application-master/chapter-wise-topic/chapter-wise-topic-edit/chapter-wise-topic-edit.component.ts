import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
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
  gradeClicked : boolean;
  syllabusClicked : boolean;
  subjectClicked : boolean;
  chapterClicked : boolean;
  academicSessions : any[];
  gradeCategories : any[];
  grades : any[];
  gradeWiseSyllabuses : any[];
  syllabusWiseSubjects : any[];
  subjectWiseChapters : any[];
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
    this.gradeClicked = false;
    this.syllabusClicked = false;
    this.subjectClicked = false;
    this.chapterClicked = false;
    
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
    this.getAcademicSessions();
    this.academicSessionForm.get("academicSession").setValue(this.chapterWiseTopics.academicSession.id);
    this.getGradeCategories();
    this.gradeCategoryForm.get("gradeCategory").setValue(this.chapterWiseTopics.gradeCategory.id);
    this.getGrades();
    this.gradeForm.get("grade").setValue(this.chapterWiseTopics.grade.id);
    this.getGradeWiseSyllabuses();
    this.syllabusForm.get("syllabus").setValue(this.chapterWiseTopics.syllabus.id);
    this.getSyllabusWiseSubjects();
    this.subjectForm.get('syllabusWiseSubject').setValue(this.chapterWiseTopics.subject.id);
    this.getSubjectWiseChapters();
    this.chapterForm.get('subjectWiseChapter').setValue(this.chapterWiseTopics.chapter.id);
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
          this.grades.unshift({ id: "", name: "Select Grade" });
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
      this.subjectForm.get("syllabusWiseSubject").setValue("");
      this.chapterForm.get("subjectWiseChapter").setValue("");
      this.gradeWiseSyllabuses = [];
      this.syllabusWiseSubjects = [];
      this.subjectWiseChapters = [];

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
            id : "0",
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
      this.chapterForm.get("subjectWiseChapter").setValue("");
      this.syllabusWiseSubjects = [];
      this.subjectWiseChapters = [];

      let academicSessionId = this.academicSessionForm.get("academicSession").value;
      let syllabusId = this.syllabusForm.get("syllabus").value;
      let gradeId = this.gradeForm.get("grade").value;
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
          this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
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

  //get chapter using subject wise chapter
  async getSubjectWiseChapters() 
  {
    try
    { 
      this.chapterForm.get("subjectWiseChapter").setValue("");
      this.subjectWiseChapters = [];

      this.chapterClicked = true;
      let academicSessionId = this.academicSessionForm.get("academicSession").value;
      let syllabusId = this.syllabusForm.get("syllabus").value
      let gradeId = this.gradeForm.get("grade").value;
      let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
      let subjectId = this.subjectForm.get("syllabusWiseSubject").value
      if(academicSessionId != undefined && academicSessionId != "" && syllabusId != undefined && syllabusId != "" && gradeId != undefined && gradeId != "" && subjectId != undefined && subjectId != "" )
      {
        let response = await this.commonService.getSubjectWiseChapters(academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.subjectWiseChapters = response.subjectWiseChapters;
          this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
          this.chapterClicked = false;
        }
        else
        {
          this.subjectWiseChapters = [];
          this.subjectWiseChapters.unshift({ id : "", name : "Select Chapter"});
          this.chapterClicked = false;
        }
      }
      else
      {
        this.chapterClicked = false;
      }
    }  
    catch(e)
    {
      this.showNotification("error", e);
      this.chapterClicked = false;
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
