import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusWiseSubjectAddComponent } from '../syllabus-wise-subject-add/syllabus-wise-subject-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';


// third party
import Swal from 'sweetalert2';
import { SyllabusWiseSubjectEditComponent } from '../syllabus-wise-subject-edit/syllabus-wise-subject-edit.component';

@Component({
  selector: 'app-syllabus-wise-subject-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './syllabus-wise-subject-list.component.html',
  styleUrls: ['./syllabus-wise-subject-list.component.scss']
})
export class SyllabusWiseSubjectListComponent {
  
  syllabusWiseSubjects : any [];
  searchClicked : boolean;
  academicSessionForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  syllabusForm : FormGroup;
  academicSessions : any[];
  gradeCategories : any[];
  grades : any[];
  gradeWiseSyllabuses : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
      // this.grades = this.activatedRoute.snapshot.data['grades'].data.grades;
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.syllabusWiseSubjects = [];
    this.academicSessions = [];
    this.gradeCategories = [];
    this.grades = [];
    this.gradeWiseSyllabuses = [];
    this.getSyllabusWiseSubjects(0,0, 0, 0, 'All');

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
    
    this.getAcademicSessions();
    this.getGradeCategories('All');
  }

  public gradeAddResult:any = this.commonSharedService.syllabusWiseSubjectListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getSyllabusWiseSubjects(0,0,0,0,'All');
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
  async getGradeCategories(action : string) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getGradeCategories('All').toPromise();
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
          let response = await this.commonService.getGrades(gradeCategoryId, 'All').toPromise();
          if (response.status_code == 200 && response.message == 'success') 
            {
              this.grades = response.grades;
              this.searchClicked = false;
              this.grades.unshift({ id : "0", name : "All"});
              this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
                id : "0",
                name : "All"
                }
              });
              this.getGradeWiseSyllabuses();
            }
            else
            {
              this.searchClicked = false;
              this.grades = [];
              this.grades.unshift({ id : "0", name : "All"});
            }
        }
        else
        {
          this.searchClicked = true;
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
      let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
      if(academicSessionId != undefined && academicSessionId != "" && gradeCategoryId != undefined && gradeCategoryId != "" && gradeId != undefined && gradeId != "")
      {
        let response = await this.commonService.getGradeWiseSyllabuses(academicSessionId, gradeCategoryId, gradeId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.gradeWiseSyllabuses = response.gradeWiseSyllabuses;
          this.searchClicked = false;
          this.gradeWiseSyllabuses.unshift({ id : "0", syllabus : {
          id : "0",
          name : "All"
          }
          });
          this.syllabusForm.get("syllabus").setValue(this.gradeWiseSyllabuses[0].id);
        }
        else
        {
          this.searchClicked = false;
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
        this.searchClicked = false;
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

  filterData()
  {
    let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
    let syllabusId : number = this.syllabusForm.get("syllabus").value;
    let gradeId : number = this.gradeForm.get("grade").value;
    let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;

    this.getSyllabusWiseSubjects(academicSessionId, syllabusId, gradeCategoryId, gradeId, 'All');
  }


  async getSyllabusWiseSubjects(academicSessionId : number, syllabusId : number, gradeCategoryId : number, gradeId : number, action : string) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getSyllabusWiseSubjects(academicSessionId, syllabusId, gradeCategoryId, gradeId, 'All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $("#tblSyllabusWiseSubject").DataTable().destroy();
        this.syllabusWiseSubjects = response.syllabusWiseSubjects;
        setTimeout(function(){
          $('#tblSyllabusWiseSubject').DataTable();
        },800);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.syllabusWiseSubjects = [];
      }  
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }
        
  addSyllabusWiseSubject()
  {
    const dialogRef = this.modalService.open(SyllabusWiseSubjectAddComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editSyllabusWiseSubject(syllabusWiseSubject : any)
  {
    const dialogRef = this.modalService.open(SyllabusWiseSubjectEditComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = syllabusWiseSubject;
  }

  updateStatus(syllabusWiseSubject : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (syllabusWiseSubject.isActive == 1 ? 'de-active' : 'active') + ' the syllabus wise subject?',
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
            id : syllabusWiseSubject.id,
            tableName : syllabusWiseSubject.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Syllabus Wise Subject " + (syllabusWiseSubject.isActive == 1 ? 'de-activated' : 'activated'));
              this.commonSharedService.syllabusWiseSubjectListObject.next({
                result : "success", 
                responseData : {
                  academicSessionId : syllabusWiseSubject.academicSession.id,
                  gradeId : syllabusWiseSubject.grade.id,
                  syllabusId : syllabusWiseSubject.syllabus.id
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
  
  deleteSyllabusWiseSubject(syllabusWiseSubject:any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete syllabus wise subject?',
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
        let tempJSON = { "id" : syllabusWiseSubject.id };
        try
        {
          let response = await this.commonService.deleteSyllabusWiseSubject(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Syllabus Wise Subject Deleted.");
            this.commonSharedService.syllabusWiseSubjectListObject.next({
              result : "success"
            });
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
