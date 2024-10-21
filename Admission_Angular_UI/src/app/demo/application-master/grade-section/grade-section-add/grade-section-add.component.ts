import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-grade-section-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './grade-section-add.component.html',
  styleUrls: ['./grade-section-add.component.scss']
})
export class GradeSectionAddComponent 
{
  addGradeSectionForm: FormGroup;
  schoolForm : FormGroup;
  academicSessionForm : FormGroup;
  syllabusForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  batchTypeForm : FormGroup;
  saveClicked : boolean;
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
  batchTypes : any[];

  constructor(
    private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
  }

  ngOnInit() 
  {
    this.saveClicked = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedSchool = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedSyllabus = false;
    this.searchClickedGradeCategory = false;
    this.searchClickedGrade = false;
    this.isValidForm = true;

    this.addGradeSectionForm = this.formbuilder.group({
      id:[''],
      school: this.formbuilder.group({ 'uuid': [''] }),
      academicSession: this.formbuilder.group({ 'id': [''] }),
      syllabus: this.formbuilder.group({ 'id': [''] }),
      gradeCategory: this.formbuilder.group({ 'id': [''] }),
      grade: this.formbuilder.group({ 'id': [''] }),
      batchType: this.formbuilder.group({ 'id': [''] }),
      totalSection: ['',[Validators.required, Validators.pattern('^[0-9]{1,5}$')]]
    });

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
      batchType :['']
    });

    this.getAcademicSessions();
    this.getSchools('Active');
    this.getSyllabuses(0, 'Active');
  }

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
            this.batchTypes.unshift({ id : "", name : "Select Batch Type" });
            this.searchClickedBatchType = false;
        }
        else
        {
            this.batchTypes.unshift({ id : "", name : "Select Batch Type" });
            this.searchClickedBatchType = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedBatchType = false;
    }
  }

  async saveGradeSection()
  {
    if(!this.saveClicked)
    {
      if(this.addGradeSectionForm.valid && this.academicSessionForm.valid && this.schoolForm.valid && this.syllabusForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.batchTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.addGradeSectionForm.controls['academicSession'].get("id").setValue(this.academicSessionForm.get("academicSession").value);
        this.addGradeSectionForm.controls['school'].get("uuid").setValue(this.schoolForm.get("school").value);
        this.addGradeSectionForm.controls['syllabus'].get("id").setValue(this.syllabusForm.get("syllabus").value);
        this.addGradeSectionForm.controls['gradeCategory'].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
        this.addGradeSectionForm.controls['grade'].get("id").setValue(this.gradeForm.get("grade").value);
        this.addGradeSectionForm.controls['batchType'].get("id").setValue(this.batchTypeForm.get("batchType").value);

        try
        {
          let response = await this.commonService.saveGradeSection(this.addGradeSectionForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grade Sections Saved");
              this.commonSharedService.gradeSectionListObject.next({
                result : "success",
                school : this.schoolForm.get("school").value,
                academicSession : this.academicSessionForm.get("academicSession").value,
                syllabus : this.syllabusForm.get("syllabus").value,
                gradeCategory : this.gradeCategoryForm.get("gradeCategory").value,
                grade : this.gradeForm.get("grade").value,
                batchType : this.batchTypeForm.get("batchType").value
              });
              this.closeModal();
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
