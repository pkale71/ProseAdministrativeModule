import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { id } from 'date-fns/locale';



@Component({
  selector: 'app-grade-wise-syllabus-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './grade-wise-syllabus-add.component.html',
  styleUrls: ['./grade-wise-syllabus-add.component.scss']
})
export class GradeWiseSyllabusAddComponent 
{
  @Input() public modalParams;
  addGradeWiseFrm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  academicSessionForm : FormGroup;
  syllabusForm : FormGroup;
  isValidForm : boolean;
  saveClicked : boolean;
  gradeCategories : any[];
  grades : any[];
  masterGrades : any[];
  academicSessions : any[];
  syllabuses : any[];

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
    this.academicSessions = [],
    this.gradeCategories = [],
    this.grades = [],
    this.syllabuses = []
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.addGradeWiseFrm = this.formbuilder.group({
      id:[''],
      gradeCategory: this.formbuilder.group({ 'id': ['']}),
      grade: this.formbuilder.group({ 'id': [''] }),
      academicSession : this.formbuilder.group({ 'id': [''] }),
      syllabus : this.formbuilder.group({ 'id' : [''] })
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', Validators.required]
    })
    this.gradeForm = this.formbuilder.group({
      'grade': ['', [Validators.required]]
    });
    this.academicSessionForm = this.formbuilder.group({
      'academicSession' : ['', Validators.required]
    });
    this.syllabusForm = this.formbuilder.group({
      'syllabus' : ['', Validators.required]
    })

    this.getGradeCategories();
    // this.getGrades(0);
    this.getAcademicSessions();
    this.getSyllabuses(0,0,'All');
  
  }

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
          this.academicSessions.unshift({ id: "", name: "Select Academin Session" });
        }
        else
        {
          this.academicSessions = [];
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
          this.saveClicked = true;
          let response = await this.commonService.getGrades(gradeCategoryId, 'All').toPromise();
          if (response.status_code == 200 && response.message == 'success') 
            {
              this.masterGrades = response.grades;
              this.grades = this.masterGrades;
              this.saveClicked = false;
              this.grades.unshift({ id: "", name: "Select Grade" });
            }
            else
            {
              this.grades = [];
              this.saveClicked = false;
            }
        }
        else
        {
          this.grades = [];
          this.saveClicked = false;
        }    
      }
      catch(e)
      {
        this.showNotification("error", e);
      }
  }

   //get syllabuses
  async getSyllabuses(academicSessionId : number, schoolingProgramId : number, action : string) 
  {
    try
      {
        let response = await this.commonService.getSyllabuses(academicSessionId, schoolingProgramId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.syllabuses = response.syllabuses;
          this.syllabuses.unshift({ id: "", name: "Select Syllabus" });
        }
        else
        {
          this.syllabuses = [];
        }
      }
      catch(e)
        {
          this.showNotification("error", e);
        }
  }

  async saveGradeWiseSyllabus()
  {
    if(!this.saveClicked)
    {
      if( this.addGradeWiseFrm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.academicSessionForm.valid && this.syllabusForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;  
        this.addGradeWiseFrm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
        this.addGradeWiseFrm.controls['gradeCategory'].get('id').setValue(this.gradeCategoryForm.get('gradeCategory').value);
        this.addGradeWiseFrm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
        this.addGradeWiseFrm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
        
        try
        {
          let response = await this.commonService.saveGradeWiseSyllabus(this.addGradeWiseFrm.value).toPromise(); 
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Grade Wise Syllabus Saved");
            this.commonSharedService.gradeWiseSyllabusListObject.next({result : "success"});
            this.closeModal();
          }
          else
          {
            this.showNotification("warning", "Grade Wise Syllabus Not Saved")
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
