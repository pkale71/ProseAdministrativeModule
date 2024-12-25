import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject-group-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './subject-group-add.component.html',
  styleUrls: ['./subject-group-add.component.scss']
})
export class SubjectGroupAddComponent 
{
  addSubjectGroupForm: FormGroup;
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
  selectedSubjects : string;

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
    this.saveClicked = false;
    this.searchClickedSyllabus = false;
    this.searchClickedGradeCategory = false;
    this.searchClickedGrade = false;
    this.searchClickedSubject = false;
    this.subjects = [];
    this.isValidForm = true;
    this.selectedSubjects = "";

    this.addSubjectGroupForm = this.formbuilder.group({
      id:[''],
      syllabus: this.formbuilder.group({ 'id': [''] }),
      gradeCategory: this.formbuilder.group({ 'id': [''] }),
      grade: this.formbuilder.group({ 'id': [''] }),
      groupName: ['', Validators.required],
      minSubject: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
      maxSubject: ['',[Validators.required, Validators.pattern('^[0-9]{1,2}$')]],
      subjects : ['']
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

    this.getSyllabuses(0, 'Active');
  }

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

  async getGradeCategories(syllabusId : number) 
  {
    this.searchClickedGradeCategory = true;
    this.subjects = [];
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
        this.subjects = [];
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

  selSubjects(event : any)
  {
    if(!event.target.checked)
    {
      this.selectedSubjects = this.commonSharedService.removeCommaSeperatedString(this.selectedSubjects, event.target.value);
    }
    else if(event.target.checked)
    {
      if(this.selectedSubjects == "")
      {
        this.selectedSubjects = event.target.value;
      }
      else
      {
        this.selectedSubjects = this.selectedSubjects + "," + event.target.value;
      }
    }
  }

  async saveSubjectGroup()
  {
    if(!this.saveClicked)
    {
      if(this.selectedSubjects == "")
      {
        this.showNotification("warning", "Select The Subjects");
      }
      else if(parseInt(this.addSubjectGroupForm.get("minSubject").value) > this.subjects.length)
      {
        this.showNotification("warning", "Min Subjects Not More Than Total Subjects");
      }
      else if(parseInt(this.addSubjectGroupForm.get("maxSubject").value) > this.subjects.length)
      {
        this.showNotification("warning", "Max Subjects Not More Than Total Subjects");
      }
      else
      {
        if(this.addSubjectGroupForm.valid && this.syllabusForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid)
        {
          this.isValidForm = true;
          this.saveClicked = true;
          this.addSubjectGroupForm.controls['syllabus'].get("id").setValue(this.syllabusForm.get("syllabus").value);
          this.addSubjectGroupForm.controls['gradeCategory'].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
          this.addSubjectGroupForm.controls['grade'].get("id").setValue(this.gradeForm.get("grade").value);
          this.addSubjectGroupForm.get("subjects").setValue(this.selectedSubjects);

          try
          {
            let response = await this.commonService.saveSubjectGroup(this.addSubjectGroupForm.value).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.showNotification("success", "Subject Group Combination Saved");
                this.activeModal.close(); 
                this.router.navigateByUrl("/admissionMaster/subjectGroup/detail/" + response.id);
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
