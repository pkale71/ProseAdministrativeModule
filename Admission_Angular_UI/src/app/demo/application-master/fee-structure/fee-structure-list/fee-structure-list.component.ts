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

@Component({
  selector: 'app-fee-structure-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './fee-structure-list.component.html',
  styleUrls: ['./fee-structure-list.component.scss']
})
export class FeeStructureListComponent 
{
  schoolForm : FormGroup;
  schoolingProgramForm : FormGroup;
  academicSessionForm : FormGroup;
  batchYearForm : FormGroup;
  syllabusForm : FormGroup;
  gradeCategoryForm : FormGroup;
  searchClicked : boolean;
  searchClickedSchool : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedSyllabus : boolean;
  searchClickedGradeCategory : boolean;
  searchClickedBatchYear : boolean;
  searchClickedSchoolingProgram : boolean;
  isValidForm : boolean;
  schools : any[];
  academicSessions : any[];
  batchYears : any[];
  syllabuses : any[];
  gradeCategories : any[];
  schoolingPrograms : any[];
  feeStructures : any[];

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
    this.batchYears = [];
    this.schoolingPrograms = [];
    this.feeStructures = [];
  }
  
  ngOnInit() 
  {
    this.searchClicked = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedSchool = false;
    this.searchClickedBatchYear = false;
    this.searchClickedSyllabus = false;
    this.searchClickedGradeCategory = false;
    this.searchClickedSchoolingProgram = false;
    this.isValidForm = true;

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['']
    });

    this.batchYearForm = this.formbuilder.group({
      batchYear:['']
    });

    this.schoolForm = this.formbuilder.group({
      school:['']
    });

    this.syllabusForm = this.formbuilder.group({
      syllabus:['']
    });

    this.schoolingProgramForm = this.formbuilder.group({
      schoolingProgram:['']
    });

    this.gradeCategoryForm = this.formbuilder.group({
      gradeCategory:['']
    });

    this.getAcademicSessions();
    this.getSchools('All');
    this.getSyllabuses(0, 'All');
  }

  public feeStructureAddResult:any = this.commonSharedService.feeStructureListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.filterData();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSchools(action : string) 
  {
    try
    {
        this.searchClickedSchool = true;
        let response = await this.commonService.getSchools(action, "").toPromise();
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

  async getSchoolSchoolingPrograms(schoolUUID : string, action : string) 
  {
    try
    {
        this.searchClickedSchoolingProgram = true;
        this.schoolingProgramForm.get("schoolingProgram").setValue("");
        let response = await this.commonService.getSchoolSchoolingPrograms(schoolUUID, action, "").toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolingPrograms = response.schoolSchoolingPrograms;
            this.schoolingPrograms.unshift({schoolingProgram : { id : "", name : "Select Schooling Program" }});
            this.searchClickedSchoolingProgram = false;
        }
        else
        {
            this.schoolingPrograms.unshift({ uuid : "", name : "Select Schooling Program" });
            this.searchClickedSchoolingProgram = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSchoolingProgram = false;
    }
  }

  async getAcademicSessions() 
  {  
    try
    {
      this.searchClickedAcademicSession = true;
      this.searchClickedBatchYear = true;  
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = JSON.parse(JSON.stringify(response.academicSessions));
        this.batchYears = JSON.parse(JSON.stringify(response.academicSessions));
        this.searchClickedAcademicSession = false;
        this.searchClickedBatchYear = false;
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        this.batchYears.unshift({"id" : "", "batchYear" : "Select Batch Year"});
      }
      else
      {
        this.academicSessions = [];
        this.batchYears = [];
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        this.batchYears.unshift({"id" : "", "batchYear" : "Select Batch Year"});
        this.searchClickedAcademicSession = false;
        this.searchClickedBatchYear = false;
      }
    }
    catch(e)
    {
      this.academicSessions = [];
      this.batchYears = [];
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
      this.searchClickedBatchYear = false;
    }
  }

  async getSyllabuses(gradeCategoryId : number, action : string) 
  {
    try
    {
      this.syllabusForm.get("syllabus").setValue("");
      this.gradeCategoryForm.get("gradeCategory").setValue("");
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
    this.gradeCategoryForm.get("gradeCategory").setValue("");
    let filterGradeCategories = this.syllabuses.filter(syllabus => syllabus.id == syllabusId);
    if(filterGradeCategories.length > 0)
    {
      this.gradeCategories = [];
      this.gradeCategories = filterGradeCategories[0].gradeCategories;
      if(this.gradeCategories.length > 0)
      {
        if (!this.gradeCategories.some(gradeCategory => gradeCategory.id === "")) 
        {
          this.gradeCategories.unshift({ id: "", name: "Select Grade Category" });
        }
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

  async getFeeStructures(schoolUUID : string, schoolingProgramId : number, academicSessionId : number, batchYearId : number, syllabusId : number, gradeCategoryId : number, action : string) 
  {
    try
    {
        this.searchClicked = true;
        let response = await this.commonService.getFeeStructures(schoolUUID, schoolingProgramId, academicSessionId, batchYearId, syllabusId, gradeCategoryId, action, "").toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblFeeStructure').DataTable().destroy();
          this.feeStructures = response.feeStructures;
          setTimeout(function(){
            $('#tblFeeStructure').DataTable();
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
    if(this.schoolForm.valid && this.schoolingProgramForm.valid && this.academicSessionForm.valid && this.batchYearForm.valid  && this.syllabusForm.valid && this.gradeCategoryForm.valid)
    {
      this.isValidForm = true;
      let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
      let schoolUUID : string = this.schoolForm.get("school").value;
      let syllabusId : number = this.syllabusForm.get("syllabus").value;
      let gradeCategoryId : number = this.gradeCategoryForm.get("gradeCategory").value;
      let batchYearId : number = this.batchYearForm.get("batchYear").value;
      let schoolingProgramId : number = this.schoolingProgramForm.get("schoolingProgram").value;
      this.getFeeStructures(schoolUUID, schoolingProgramId, academicSessionId, batchYearId, syllabusId, gradeCategoryId, 'All');
    }
    else
    {
      this.isValidForm = false;
    }
  }

  addFeeStructure()
  {
    this.router.navigateByUrl("/admissionMaster/feeStructure/add");
  }

  detailFeeStructure(uuid : string)
  {
    this.router.navigateByUrl("/admissionMaster/feeStructure/detail/" + uuid);
  }

  updateStatus(feeStructure : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (feeStructure.isActive == 1 ? 'De-Active' : 'Active') + ' The Fee Structure?',
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
            id : feeStructure.uuid,
            tableName : feeStructure.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Fee Structure " + (feeStructure.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.feeStructureListObject.next({
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

  deleteFeeStructure(uuid : string)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Fee Structure?',
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
        let tempJSON = { "uuid" : uuid };
        try
        {
          let response = await this.commonService.deleteFeeStructure(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Fee Structure Deleted.");
            this.commonSharedService.feeStructureListObject.next({result : "success"});
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
