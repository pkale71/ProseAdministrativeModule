import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { ChapterWiseTopicAppComponent } from '../chapter-wise-topic-add/chapter-wise-topic-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';


// third party
import Swal from 'sweetalert2';
import { ChapterWiseTopicEditComponent } from '../chapter-wise-topic-edit/chapter-wise-topic-edit.component';

@Component({
  selector: 'app-chapter-wise-topic-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './chapter-wise-topic-list.component.html',
  styleUrls: ['./chapter-wise-topic-list.component.scss']
})
export class ChapterWiseTopicListComponent {
  
  searchClicked : boolean;
  chapterWiseTopics : any [];
  masterChapterWiseTopics : any[];
  academicSessionForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  syllabusForm : FormGroup;
  subjectForm : FormGroup;
  chapterForm : FormGroup;
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
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {   
      this.chapterWiseTopics = [];
      this.academicSessions = [];
      this.gradeCategories = [];
      this.grades = [];
      this.gradeWiseSyllabuses = [];
      this.syllabusWiseSubjects = [];
      this.subjectWiseChapters = [];
    }

  ngOnInit() 
  {
    this.searchClicked = false; 
    this.getChapterWiseTopics(0,0,0,0,0);

    this.academicSessionForm = this.formbuilder.group({
      "academicSession" : ['0']
    })
    this.gradeCategoryForm = this.formbuilder.group({
      "gradeCategory" : ['0']
    })
    this.gradeForm = this.formbuilder.group({
      "grade" : ['0']
    })
    this.syllabusForm = this.formbuilder.group({
      "syllabus" : ['0']
    })
    this.subjectForm = this.formbuilder.group({
      "subject" : ['0']
    })
    this.chapterForm = this.formbuilder.group({
      'chapter' : ['0']
    })

    this.getAcademicSessions();
    this.getGradeCategories();
  }

  public gradeAddResult:any = this.commonSharedService.chapterWiseTopicListObject.subscribe(res =>{
    if(res.result == "success")
    {
        this.getChapterWiseTopics(0,0,0,0,0);
    }
  })

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
           this.academicSessions.unshift({ id: "0", name : "All"});
         }
         else
         {
           this.academicSessions = [];
           this.academicSessions.unshift({ id: "0", name : "All"});
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
       let response = await this.commonService.getGradeCategories().toPromise();
       if (response.status_code == 200 && response.message == 'success') 
       {
         this.gradeCategories = response.gradeCategories;
         this.gradeCategories.unshift({ id : "0", name : "All"});
         this.grades.unshift({ id : "0", name : "All"}); 
         this.getGrades();
       }
       else
       {
         this.gradeCategories = [];
         this.gradeCategories.unshift({ id : "0", name : "All"});
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
        this.searchClicked = true;
        let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
        if(gradeCategoryId != undefined && gradeCategoryId != "")
        {
          let response = await this.commonService.getGrades(gradeCategoryId).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.masterGrades = response.grades;
            this.grades = this.masterGrades;
            this.searchClicked = false;
            this.grades.unshift({ id : "0", name : "All"});
            this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
              id : "0",
              name : "All"
              }
            });
            this.gradeForm.get("grade").setValue(this.grades[0].id);
            this.getGradeWiseSyllabuses();
          }
          else
          {
            this.grades = [];
            this.grades.unshift({ id : "0", name : "All"});
          }
        }
        else
        {
          this.grades = [];
          this.grades.unshift({ id : "0", name : "All"});
        }    
      }
      catch(e)
      {
        this.showNotification("error", e);
      }
   }
 
   // get syllabus using grade wise syllabus
   async getGradeWiseSyllabuses() 
   {
     try
     {
      this.searchClicked = true;
      let academicSessionId = this.academicSessionForm.get("academicSession").value;
      let gradeId = this.gradeForm.get("grade").value;
      if(academicSessionId != undefined && academicSessionId != "" && gradeId != undefined && gradeId != "")
       {
         let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeId).toPromise();
         if (response.status_code == 200 && response.message == 'success') 
         {
           this.masterGradeWiseSyllabuses = response.gradeWiseSyllabuses;
           this.gradeWiseSyllabuses = this.masterGradeWiseSyllabuses;
           this.searchClicked = false;
           this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
           id : "0",
           name : "All"
           }
           });
           this.syllabusForm.get("syllabus").setValue(this.gradeWiseSyllabuses[0].id);
           this.getSyllabusWiseSubjects();
         }
         else
         {
           this.gradeWiseSyllabuses = [];
           this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : 
             {
             id : "0",
             name : "All"
             }  
           });
         }
       } 
       else
       {
         this.gradeWiseSyllabuses = [];
         this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : 
           {
           id : "0",
           name : "All"
           }  
         });
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
      this.searchClicked = true;
      let academicSessionId = this.academicSessionForm.get('academicSession').value;
      let syllabusId = this.syllabusForm.get('syllabus').value;
      let gradeId = this.gradeForm.get('grade').value;
      if(academicSessionId != undefined && academicSessionId != "" && syllabusId != undefined && syllabusId != "" && gradeId != undefined && gradeId != "")
      {
        let response = await this.commonService.getSyllabusWiseSubjects(academicSessionId, syllabusId, gradeId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterSyllabusWiseSubjects = response.syllabusWiseSubjects;
          this.syllabusWiseSubjects = this.masterSyllabusWiseSubjects;
          this.searchClicked = false;
          this.syllabusWiseSubjects.unshift({ id : "0", name : "All"});
          this.subjectWiseChapters.unshift({ id : "0", name : "All"});
          this.getSubjectWiseChapters();
        }
        else
        {
          this.searchClicked = false;
          this.syllabusWiseSubjects = [];
          this.syllabusWiseSubjects.unshift({ id : "0", name : "All"});
        }  
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
      this.searchClicked = true;
      let academicSessionId = this.academicSessionForm.get('academicSession').value;
      let syllabusId = this.syllabusForm.get('syllabus').value;
      let gradeId = this.gradeForm.get('grade').value;
      let subjectId = this.subjectForm.get('subject').value;
      if(academicSessionId != undefined && academicSessionId != "" && syllabusId != undefined && syllabusId != "" && gradeId != undefined && gradeId != "" && subjectId != undefined && subjectId != "")
      {
        let response = await this.commonService.getSubjectWiseChapters(academicSessionId, syllabusId, gradeId, subjectId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterSubjectWiseChapters = response.subjectWiseChapters;
          this.subjectWiseChapters = this.masterSubjectWiseChapters;
          this.searchClicked = false;
          this.subjectWiseChapters.unshift({ id : "0", name : "All"});
        }
        else
        {
          this.searchClicked = false;
          this.subjectWiseChapters = [];
          this.subjectWiseChapters.unshift({ id : "0", name : "All"});
        }
      }
      else
      {
        this.searchClicked = false;
        this.subjectWiseChapters = [];
        this.subjectWiseChapters.unshift({ id : "0", name : "All"});
      }  
    }  
    catch(e)
    {
      this.showNotification("error", e);
    }  
  } 
 
  filterData()
  {
    let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
    let syllabusId : number = this.syllabusForm.get("syllabus").value;
    let gradeId : number = this.gradeForm.get("grade").value;
    let subjectId : number = this.subjectForm.get('subject').value;
    let chapterId : number = this.chapterForm.get('chapter').value;
    this.getChapterWiseTopics(academicSessionId, syllabusId, gradeId, subjectId, chapterId);
  }

  async getChapterWiseTopics(academicSessionId : number, syllabusId : number, gradeId : number, subjectId : number, chapterId : number) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getChapterWiseTopics(academicSessionId, syllabusId, gradeId, subjectId, chapterId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblChapterWiseTopic').DataTable().destroy();
        this.masterChapterWiseTopics = response.chapterWiseTopics;
        this.chapterWiseTopics = this.masterChapterWiseTopics;
        setTimeout(function(){
          $('#tblChapterWiseTopic').DataTable();
         }, 1000);
         this.searchClicked = false;
         this.modalService.dismissAll();
      }
      else
      {
        this.searchClicked = false;
        this.chapterWiseTopics = [];
      }
    }  
    catch(e)
    {
      this.showNotification("error", e);
    }  
  }

  addChapterWiseTopic()
  {
    const dialogRef = this.modalService.open(ChapterWiseTopicAppComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editChapterWiseTopic(chapterWiseTopics : any)
  {
    const dialogRef = this.modalService.open(ChapterWiseTopicEditComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = chapterWiseTopics;
  }

  updateStatus(chapterWiseTopic : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (chapterWiseTopic.isActive == 1 ? 'de-active' : 'active') + ' the chapter wise topic?',
      icon: 'warning',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          let tempJson = {
            id : chapterWiseTopic.id,
            tableName : chapterWiseTopic.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Chapter Wise Topic Status Updated");
            this.commonSharedService.chapterWiseTopicListObject.next({
              result : "success", 
              responseData : {
                academicSessionId : chapterWiseTopic.academicSession.id,
                chapterId : chapterWiseTopic.id
              }
            });
            this.modalService.dismissAll();
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }
  
  deleteChapterWiseTopic(chapterWiseTopic : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete chapter wise topic?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
        
      } 
      else 
      {
        this.showNotification("info", "Please wait...");
        let tempJSON = { "id" : chapterWiseTopic.id };
        try
        {
          let response = await this.commonService.deleteChapterWiseTopic(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Chapter Wise Topic Deleted.");
            this.commonSharedService.chapterWiseTopicListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });
  }
  
}
