import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Grade } from 'src/app/theme/shared/model/grade';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { GradeAddComponent } from '../grade-add/grade-add.component';
import { GradeEditComponent } from '../grade-edit/grade-edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GradeCategory } from 'src/app/theme/shared/model/grade-category';
declare var $;

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grade-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss']
})
export class GradeListComponent {
  grades : Grade[];
  gradeCategories : any[];
  gradeCategoryForm : FormGroup;
  searchClicked : boolean;
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
      this.grades = this.activatedRoute.snapshot.data['grades'].data.grades;
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.gradeCategories = [];
    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['']
    });

    this.getGradeCategories();
    if(localStorage.getItem("GRADECATEGORYID"))
    {
      this.gradeCategoryForm.get("gradeCategory").setValue(localStorage.getItem("GRADECATEGORYID"));
      this.getGrades();
    }
  }

  public gradeAddResult:any = this.commonSharedService.gradeListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getGrades();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }


  async getGradeCategories() 
  {
    /////////get Grade Categories
    let response = await this.commonService.getGradeCategories().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.gradeCategories = response.data.gradeCategories;
      let gradeCategory : any = {};
      gradeCategory.id = 0;
      gradeCategory.name = "All";
      this.gradeCategories.unshift(gradeCategory);
      this.gradeCategoryForm.get("gradeCategory").setValue("0");
    }
  }

  async getGrades() 
  {
    let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
    localStorage.setItem("GRADECATEGORYID", gradeCategoryId.toString());
    this.searchClicked = true;
    let response = await this.commonService.getGrades(gradeCategoryId).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblSubject').DataTable().clear().destroy();
      this.grades = response.data.grades;
      setTimeout(function(){
        $('#tblSubject').DataTable();
      },800);
      this.searchClicked = false;
      this.modalService.dismissAll();
    }
    else
    {
      this.grades = [];
      this.searchClicked = false;
      this.modalService.dismissAll();
    }
  }

  addGrade()
  {
    const dialogRef = this.modalService.open(GradeAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editGrade(id)
  {
    let params = {
      "id" : id
    }
    const dialogRef = this.modalService.open(GradeEditComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }
  
  deleteGrade(id)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete grade?',
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
        let tempJSON = { "id" : id };
        try
        {
          let response = await this.commonService.deleteGrade(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Grade Deleted.");
            this.commonSharedService.gradeListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", "Grade Not Deleted.");
        }
      }
    });
  }

  detailGrade(id : number)
  {
    this.router.navigateByUrl("/applicationMaster/grade/detail/" + id);
  }
}
