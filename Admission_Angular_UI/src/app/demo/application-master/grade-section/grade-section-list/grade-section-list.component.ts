import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { GradeSectionAddComponent } from '../grade-section-add/grade-section-add.component';

@Component({
  selector: 'app-grade-section-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './grade-section-list.component.html',
  styleUrls: ['./grade-section-list.component.scss']
})
export class GradeSectionListComponent 
{
  schoolForm : FormGroup;
  academicSessionForm : FormGroup;
  syllabusForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  batchTypeForm : FormGroup;
  searchClicked : boolean;
  searchClickedSchool : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedSyllabus : boolean;
  searchClickedGradeCategory : boolean;
  searchClickedGrade : boolean;
  searchClickedBatchType : boolean;
  isValidForm : boolean;
  schools : any[];
  academicSessions : any[];
  syllabuses : any[];
  gradeCategories : any[];
  grades : any[];
  gradeSections : any[];
  batchTypes : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.schools = [];
    this.academicSessions = [];
    this.syllabuses = [];
    this.gradeCategories = [];
    this.grades = [];
    this.gradeSections = [];
    this.batchTypes = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedSchool = false;
    this.searchClickedBatchType = false;
    this.searchClickedSyllabus = false;
    this.searchClickedGradeCategory = false;
    this.searchClickedGrade = false;
    this.isValidForm = true;

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['']
    });

    this.schoolForm = this.formbuilder.group({
      school:['']
    });

    this.syllabusForm = this.formbuilder.group({
      syllabus:['']
    });

    this.gradeCategoryForm = this.formbuilder.group({
      gradeCategory:['']
    });

    this.gradeForm = this.formbuilder.group({
      grade:['']
    });

    this.batchTypeForm = this.formbuilder.group({
      batchType :['0']
    });

    this.getAcademicSessions();
    this.getSchools('All');
    this.getSyllabuses(0, 'All');
  }

  public gradeSectionAddResult:any = this.commonSharedService.gradeSectionListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.schoolForm.get("school").setValue(res.school);
      this.academicSessionForm.get("academicSession").setValue(res.academicSession);
      this.getBatchTypes(res.academicSession, 'Active');
      this.syllabusForm.get("syllabus").setValue(res.syllabus);
      this.getGradeCategories(res.syllabus);
      this.gradeCategoryForm.get("gradeCategory").setValue(res.gradeCategory);
      this.getGrades(res.gradeCategory, 'Active');
      this.gradeForm.get("grade").setValue(res.grade);
      this.batchTypeForm.get("batchType").setValue(res.batchType);
      this.filterData();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicSessions() 
  {  
    try
    {
      this.searchClickedAcademicSession = true;  
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = response.academicSessions;
        this.searchClickedAcademicSession = false;
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
      }
      else
      {
        this.academicSessions = [];
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        this.searchClickedAcademicSession = false;
      }
    }
    catch(e)
    {
      this.academicSessions = [];
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
    }
  }

  async getSyllabuses(gradeCategoryId : number, action : string) 
  {
    try
    {
        this.searchClickedSyllabus = true;
        let response = await this.commonService.getSyllabuses(gradeCategoryId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.syllabuses = response.syllabuses;
            this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
            this.searchClickedSyllabus = false;
        }
        else
        {
            this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
            this.searchClickedSyllabus = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSyllabus = false;
    }
  }

  async getGradeCategories(syllabusId : number) 
  {
    this.searchClickedGradeCategory = true;
    let filterGradeCategories = this.syllabuses.filter(syllabus => syllabus.id == syllabusId);
    if(filterGradeCategories.length > 0)
    {
      this.gradeCategories = [];
      this.gradeCategories = filterGradeCategories[0].gradeCategories;
      if (!this.gradeCategories.some(gradeCategory => gradeCategory.id === "")) 
      {
        this.gradeCategories.unshift({ id: "", name: "Select Grade Category" });
      }
      this.searchClickedGradeCategory = false;
      
    }
    else
    {
      this.gradeCategories = [];
      if (!this.gradeCategories.some(gradeCategory => gradeCategory.id === "")) 
      {
        this.gradeCategories.unshift({ id: "", name: "Select Grade Category" });
      }
      this.searchClickedGradeCategory = false;
    }
  }

  async getGrades(gradeCategoryId : number, action : string) 
  {
    try
    {
        this.searchClickedGrade = true;
        let response = await this.commonService.getGrades(gradeCategoryId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.grades = response.grades;
            this.grades.unshift({ id : "", name : "Select Grade" });
            this.searchClickedGrade = false;
        }
        else
        {
            this.grades.unshift({ id : "", name : "Select Grade" });
            this.searchClickedGrade = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedGrade = false;
    }
  }

  async getSchools(action : string) 
  {
    try
    {
        this.searchClickedSchool = true;
        let response = await this.commonService.getSchools(action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schools = response.schools;
            this.schools.unshift({ uuid : "", name : "Select School" });
            this.searchClickedSchool = false;
        }
        else
        {
            this.schools.unshift({ uuid : "", name : "Select School" });
            this.searchClickedSchool = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSchool = false;
    }
  }

  async getBatchTypes(academicSessionId : number, action : string) 
  {
    try
    {
        this.searchClickedBatchType = true;
        let response = await this.commonService.getBatchTypes(academicSessionId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.batchTypes = response.batchTypes;
            this.batchTypes.unshift({ id : "0", name : "All" });
            this.searchClickedBatchType = false;
        }
        else
        {
            this.batchTypes.unshift({ id : "0", name : "All" });
            this.searchClickedBatchType = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedBatchType = false;
    }
  }

  async getGradeSections(schoolUUID : string, academicSessionId : number, syllabusId : number, gradeCategoryId : number, gradeId : number, batchTypeId : number, action : string) 
  {
    try
    {
        this.searchClicked = true;
        let response = await this.commonService.getGradeSections(schoolUUID, academicSessionId, syllabusId, gradeCategoryId, gradeId, batchTypeId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblGradeSection').DataTable().destroy();
          this.gradeSections = response.gradeSections;
          setTimeout(function(){
            $('#tblGradeSection').DataTable();
          },1000);
            this.searchClicked = false;
        }
        else
        {
            this.searchClicked = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClicked = false;
    }
  }

  filterData()
  {
    if(this.academicSessionForm.valid && this.schoolForm.valid && this.syllabusForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid)
    {
      this.isValidForm = true;
      let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
      let schoolUUID : string = this.schoolForm.get("school").value;
      let syllabusId : number = this.syllabusForm.get("syllabus").value;
      let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
      let gradeId : number = this.gradeForm.get("grade").value;
      let batchTypeId : number = this.batchTypeForm.get("batchType").value;
      this.getGradeSections(schoolUUID, academicSessionId, syllabusId, gradeCategoryId, gradeId, batchTypeId, 'All');
    }
    else
    {
      this.isValidForm = false;
    }
  }

  addGradeSection()
  {
    const dialogRef = this.modalService.open(GradeSectionAddComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = {};
  }

  deleteSection(sections : any[], section : any)
  {
    if(sections.length > 1)
    {
      Swal.fire({
        customClass: {
          container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are You Sure To Delete Section?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true
      }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
          
        } 
        else 
        {
          this.showNotification("info", "Please Wait...");
          let tempJSON = { "id" : section.id };
          try
          {
            let response = await this.commonService.deleteGradeSection(tempJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
              this.showNotification("success", "Section Deleted.");
              this.commonSharedService.gradeSectionListObject.next({
                result : "success",
                school : this.schoolForm.get("school").value,
                academicSession : this.academicSessionForm.get("academicSession").value,
                syllabus : this.syllabusForm.get("syllabus").value,
                gradeCategory : this.gradeCategoryForm.get("gradeCategory").value,
                grade : this.gradeForm.get("grade").value,
                batchType : this.batchTypeForm.get("batchType").value
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
    else
    {
      this.showNotification("info", "Batch Have Atleast One Section.");
    }
  }
}