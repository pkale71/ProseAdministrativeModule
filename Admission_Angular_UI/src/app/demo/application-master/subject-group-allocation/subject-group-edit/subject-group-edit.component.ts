import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject-group-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './subject-group-edit.component.html',
  styleUrls: ['./subject-group-edit.component.scss']
})
export class SubjectGroupEditComponent 
{
  @Input() public modalParams;
  editSubjectGroupForm: FormGroup;
  syllabusForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  saveClicked : boolean;
  searchClickedSyllabus : boolean;
  searchClickedGradeCategory : boolean;
  searchClickedGrade : boolean;
  searchClickedSubject : boolean;
  isValidForm : boolean;
  syllabuses : any[];
  gradeCategories : any[];
  grades : any[];
  subjects : any[];
  subjectGroup : any;

  constructor(
    private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
  {
  }

  ngOnInit() 
  {
    this.subjects = [];
    this.saveClicked = false;
    this.searchClickedSyllabus = false;
    this.searchClickedGradeCategory = false;
    this.searchClickedGrade = false;
    this.isValidForm = true;

    this.editSubjectGroupForm = this.formbuilder.group({
      id:[''],
      syllabus: this.formbuilder.group({ 'id': [''] }),
      gradeCategory: this.formbuilder.group({ 'id': [''] }),
      grade: this.formbuilder.group({ 'id': [''] }),
      groupName: ['', Validators.required],
      minSubject: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
      maxSubject: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}$')]]
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

    this.syllabusForm.controls['syllabus'].disable();
    this.gradeCategoryForm.controls['gradeCategory'].disable();
    this.gradeForm.controls['grade'].disable();

    this.patchFormValue(this.modalParams?.subjectGroup);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  patchFormValue(subjectGroup : any)
  {
    this.subjectGroup = subjectGroup;
    this.editSubjectGroupForm.patchValue(subjectGroup);
    this.getSyllabuses(0, 'Active', subjectGroup.syllabus);
    this.syllabusForm.get("syllabus").setValue(subjectGroup.syllabus?.id);
    this.gradeCategoryForm.get("gradeCategory").setValue(subjectGroup.gradeCategory?.id);
    this.getGrades(subjectGroup?.gradeCategory?.id, 'Active', subjectGroup.grade);
    this.gradeForm.get("grade").setValue(subjectGroup.grade?.id);
    this.getSubjects();
  }

  async getSyllabuses(gradeCategoryId : number, action : string, selSyllabus : any) 
  {
    try
    {
        this.searchClickedSyllabus = true;
        let response = await this.commonService.getSyllabuses(gradeCategoryId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.syllabuses = response.syllabuses;
            this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
            if(selSyllabus)
            {
              this.getGradeCategories(selSyllabus?.id, this.subjectGroup.gradeCategory);
              let tempSyllabus = this.syllabuses.filter(syllabus => syllabus.id == selSyllabus.id);
              if(tempSyllabus.length == 0)
              {
                this.syllabuses.push(selSyllabus);
              }
            }
            this.searchClickedSyllabus = false;
        }
        else
        {
            this.syllabuses.unshift({ id : "", name : "Select Syllabus" });
            if(selSyllabus)
            {
              let tempSyllabus = this.syllabuses.filter(syllabus => syllabus.id == selSyllabus.id);
              if(tempSyllabus.length == 0)
              {
                this.syllabuses.push(selSyllabus);
              }
            }
            this.searchClickedSyllabus = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        if(selSyllabus)
        {
          let tempSyllabus = this.syllabuses.filter(syllabus => syllabus.id == selSyllabus.id);
          if(tempSyllabus.length == 0)
          {
            this.syllabuses.push(selSyllabus);
          }
        }
        this.searchClickedSyllabus = false;
    }
  }

  async getGradeCategories(syllabusId : number, selGradeCategory : any) 
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
      if(selGradeCategory)
      {
        let tempGradeCategory = this.gradeCategories.filter(gradeCategory => gradeCategory.id == selGradeCategory.id);
        if(tempGradeCategory.length == 0)
        {
          this.gradeCategories.push(selGradeCategory);
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
      if(selGradeCategory)
      {
        let tempGradeCategory = this.gradeCategories.filter(gradeCategory => gradeCategory.id == selGradeCategory.id);
        if(tempGradeCategory.length == 0)
        {
          this.gradeCategories.push(selGradeCategory);
        }
      }
      this.searchClickedGradeCategory = false;
    }
  }

  async getGrades(gradeCategoryId : number, action : string, selGrade : any) 
  {
    try
    {
        this.searchClickedGrade = true;
        let response = await this.commonService.getGrades(gradeCategoryId, action).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.grades = response.grades;
            this.grades.unshift({ id : "", name : "Select Grade" });
            if(selGrade)
            {
              let tempGrade = this.grades.filter(grade => grade.id == selGrade.id);
              if(tempGrade.length == 0)
              {
                this.grades.push(selGrade);
              }
            }
            this.searchClickedGrade = false;
        }
        else
        {
            this.grades.unshift({ id : "", name : "Select Grade" });
            if(selGrade)
            {
              let tempGrade = this.grades.filter(grade => grade.id == selGrade.id);
              if(tempGrade.length == 0)
              {
                this.grades.push(selGrade);
              }
            }
            this.searchClickedGrade = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        if(selGrade)
        {
          let tempGrade = this.grades.filter(grade => grade.id == selGrade.id);
          if(tempGrade.length == 0)
          {
            this.grades.push(selGrade);
          }
        }
        this.searchClickedGrade = false;
    }
  }

  async getSubjects() 
  {
    try
    {
      this.subjects = [];
      let syllabusId = this.syllabusForm.get("syllabus").value;
      let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
      let gradeId = this.gradeForm.get("grade").value;
      if(syllabusId != "" && gradeCategoryId != "" && gradeId != "")
      {
        this.searchClickedSubject = true;
        let response = await this.commonService.getSubjects(gradeCategoryId, gradeId, syllabusId, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.subjects = response.subjects;
          this.searchClickedSubject = false;
        }
        else
        {
          this.searchClickedSubject = false;
        }
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClickedSubject = false;
    }
  }

  async saveSubjectGroup()
  {
    if(!this.saveClicked)
    {
      if(parseInt(this.editSubjectGroupForm.get("minSubject").value) > this.subjects.length)
      {
        this.showNotification("warning", "Min Subjects Not More Than Total Subjects");
      }
      else if(parseInt(this.editSubjectGroupForm.get("maxSubject").value) > this.subjects.length)
      {
        this.showNotification("warning", "Max Subjects Not More Than Total Subjects");
      }
      else
      {
        this.syllabusForm.controls['syllabus'].enable();
        this.gradeCategoryForm.controls['gradeCategory'].enable();
        this.gradeForm.controls['grade'].enable();
        if(this.editSubjectGroupForm.valid && this.syllabusForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid)
        {
          this.syllabusForm.controls['syllabus'].disable();
          this.gradeCategoryForm.controls['gradeCategory'].disable();
          this.gradeForm.controls['grade'].disable();
          this.isValidForm = true;
          this.saveClicked = true;
          this.editSubjectGroupForm.controls['syllabus'].get("id").setValue(this.syllabusForm.get("syllabus").value);
          this.editSubjectGroupForm.controls['gradeCategory'].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
          this.editSubjectGroupForm.controls['grade'].get("id").setValue(this.gradeForm.get("grade").value);

          try
          {
            let response = await this.commonService.updateSubjectGroup(this.editSubjectGroupForm.value).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.showNotification("success", "Subject Group Combination Saved");
                this.router.navigateByUrl("/admissionMaster/subjectGroup/detail/" + this.subjectGroup.id);
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
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
