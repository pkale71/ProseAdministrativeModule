import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { SubjectGroupAddComponent } from '../subject-group-add/subject-group-add.component';
import { SubjectGroupEditComponent } from '../subject-group-edit/subject-group-edit.component';

@Component({
  selector: 'app-subject-group-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './subject-group-list.component.html',
  styleUrls: ['./subject-group-list.component.scss']
})
export class SubjectGroupListComponent 
{
  syllabusForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  searchClicked : boolean;
  searchClickedSyllabus : boolean;
  searchClickedGradeCategory : boolean;
  searchClickedGrade : boolean;
  isValidForm : boolean;
  syllabuses : any[];
  gradeCategories : any[];
  grades : any[];
  subjectGroups : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.syllabuses = [];
    this.gradeCategories = [];
    this.grades = [];
    this.subjectGroups = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.searchClickedSyllabus = false;
    this.searchClickedGradeCategory = false;
    this.searchClickedGrade = false;
    this.isValidForm = true;

    this.syllabusForm = this.formbuilder.group({
      syllabus:['']
    });

    this.gradeCategoryForm = this.formbuilder.group({
      gradeCategory:['']
    });

    this.gradeForm = this.formbuilder.group({
      grade:['']
    });

    this.getSyllabuses(0, 'All');
  }
  public subjectGroupAddResult:any = this.commonSharedService.subjectGroupListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.syllabusForm.get("syllabus").setValue(res.syllabus);
      this.getGradeCategories(res.syllabus, res.gradeCategory);
      this.gradeCategoryForm.get("gradeCategory").setValue(res.gradeCategory);
      this.getGrades(res.gradeCategory, 'Active', res.grade);
      this.gradeForm.get("grade").setValue(res.grade);
      this.filterData();
    }
  })
  
  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
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

  async getGradeCategories(syllabusId : number, selGradeCategoryId : string) 
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
      this.gradeCategoryForm.get("gradeCategory").setValue(selGradeCategoryId);
      this.searchClickedGradeCategory = false;
      
    }
    else
    {
      this.gradeCategories = [];
      if (!this.gradeCategories.some(gradeCategory => gradeCategory.id === "")) 
      {
        this.gradeCategories.unshift({ id: "", name: "Select Grade Category" });
      }
      this.gradeCategoryForm.get("gradeCategory").setValue(selGradeCategoryId);
      this.searchClickedGradeCategory = false;
    }
  }

  async getGrades(gradeCategoryId : number, action : string, selGradeId : string) 
  {
    try
    {
      this.searchClickedGrade = true;
      let response = await this.commonService.getGrades(gradeCategoryId, action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.grades = response.grades;
        this.grades.unshift({ id : "0", name : "All" });
        this.gradeForm.get("grade").setValue(selGradeId);
        this.searchClickedGrade = false;
      }
      else
      {
        this.grades.unshift({ id : "0", name : "All" });
        this.gradeForm.get("grade").setValue(selGradeId);
        this.searchClickedGrade = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClickedGrade = false;
    }
  }

  async getSubjectGroups(syllabusId : number, gradeCategoryId : number, gradeId : number, action : string) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getSubjectGroups(syllabusId, gradeCategoryId, gradeId, action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblSubjectGroup').DataTable().destroy();
        this.subjectGroups = response.subjectGroups;
        setTimeout(function(){
          $('#tblSubjectGroup').DataTable();
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
    if(this.syllabusForm.valid && this.gradeCategoryForm.valid)
    {
      this.isValidForm = true;
      let syllabusId : number = this.syllabusForm.get("syllabus").value;
      let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
      let gradeId : number = this.gradeForm.get("grade").value;
      this.getSubjectGroups(syllabusId, gradeCategoryId, gradeId, 'All');
    }
    else
    {
      this.isValidForm = false;
    }
  }

  addSubjectGroup()
  {
    const dialogRef = this.modalService.open(SubjectGroupAddComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = {};
  }

  editSubjectGroup(subjectGroup : any)
  {
    const dialogRef = this.modalService.open(SubjectGroupEditComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = {
        "subjectGroup" : subjectGroup
      };
  }

  updateStatus(subjectGroup : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (subjectGroup.isActive == 1 ? 'De-Active' : 'Active') + ' The Subject Group Combination?',
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
            id : subjectGroup.id,
            tableName : subjectGroup.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Subject Group Combination " + (subjectGroup.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.subjectGroupListObject.next({
                result : "success",
                syllabus : this.syllabusForm.get("syllabus").value,
                gradeCategory : this.gradeCategoryForm.get("gradeCategory").value,
                grade : this.gradeForm.get("grade").value
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

  deleteSubjectGroup(subjectGroup : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Subject Group Combination?',
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
        let tempJSON = { "id" : subjectGroup.id };
        try
        {
          let response = await this.commonService.deleteSubjectGroup(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Subject Group Combination Deleted.");
            this.commonSharedService.subjectGroupListObject.next({
              result : "success",
              syllabus : this.syllabusForm.get("syllabus").value,
              gradeCategory : this.gradeCategoryForm.get("gradeCategory").value,
              grade : this.gradeForm.get("grade").value
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

  detailSubjectGroup(id : string)
  {
      this.router.navigateByUrl("/admissionMaster/subjectGroup/detail/" + id);
  }
}
