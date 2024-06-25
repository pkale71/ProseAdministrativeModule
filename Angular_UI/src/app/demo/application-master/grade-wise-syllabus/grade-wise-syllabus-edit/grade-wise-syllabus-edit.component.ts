import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Router } from '@angular/router';
// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grade-wise-syllabus-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './grade-wise-syllabus-edit.component.html',
  styleUrls: ['./grade-wise-syllabus-edit.component.scss']
})
export class GradeWiseSyllabusEditComponent {
  @Input() public modalParams;
  editGradeWiseSyllabusForm: FormGroup;
  academicSessionForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  syllabusForm : FormGroup;
  isValidForm: boolean;
  saveClicked: boolean;
  gradeWisesyllabus: any;
  syllabuses : any[];
  gradeCategories : any[];
  grades : any[];
  masterGrades : any[];
  academicSessions : any[];

  constructor(private commonService: CommonService,
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService: CommonSharedService,
    private router: Router
  ) {
    this.academicSessions = [],
    this.gradeCategories = [],
    this.grades = [],
    this.syllabuses =[]
  }

  ngOnInit() 
  {
    //get modal params
    this.gradeWisesyllabus = this.modalParams;
    this.isValidForm = true;
    this.saveClicked = false;
    this.getAcademicSessions();
    this.getGradeCategories();
    this.getSyllabuses(0,0);

    this.editGradeWiseSyllabusForm = this.formbuilder.group({
      id: [''],
      academicSession: this.formbuilder.group({ 'id' : ['']}),
      gradeCategory: this.formbuilder.group({ 'id' : ['']}),
      grade: this.formbuilder.group({ 'id' : ['']}),
      syllabus: this.formbuilder.group({ 'id' : ['']}),
    });

    this.academicSessionForm = this.formbuilder.group({
      "academicSession" : ['', [Validators.required]]
    })

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory' : ['', Validators.required]
    })

    this.gradeForm = this.formbuilder.group({
      "grade" : ['', Validators.required]
    })

    this.syllabusForm = this.formbuilder.group({
      "syllabus" : ['', Validators.required]
    })
    ///Assign Form Data
    this.editGradeWiseSyllabusForm.patchValue(this.gradeWisesyllabus);
    this.academicSessionForm.get("academicSession").setValue(this.gradeWisesyllabus.academicSession.id);
    this.gradeCategoryForm.get("gradeCategory").setValue(this.gradeWisesyllabus.gradeCategory.id);
    this.gradeForm.get("grade").setValue(this.gradeWisesyllabus.grade.id);
    this.syllabusForm.get("syllabus").setValue(this.gradeWisesyllabus.syllabus.id);
    this.getGrades();
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
     this.saveClicked = false;
     let response = await this.commonService.getGradeCategories().toPromise();
     if (response.status_code == 200 && response.message == 'success') 
     {
       this.gradeCategories = response.gradeCategories;
       this.gradeCategories.unshift({ id : "", name : "Select Grade category"});
     }
     else
     {
       this.gradeCategories = [];
       this.gradeCategories.unshift({ id : "", name : "Select Grade category"});
     }
   }
   catch(e)
   {
     this.showNotification("error",e);
   }
  }

  //get grades
  async getGrades() 
  {
    try 
      {
        let gradeCategoryId = this.gradeCategoryForm.get("gradeCategory").value;
        if(gradeCategoryId != undefined && gradeCategoryId != "")
        {  
          this.saveClicked = true;
          let response = await this.commonService.getGrades(gradeCategoryId).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.masterGrades = response.grades;
            this.grades = this.masterGrades;
            this.saveClicked = false;
            this.grades.unshift({ id : "", name : "Select Grade"});
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
   async getSyllabuses(academicSessionId : number, schoolingProgramId : number) 
  {
    try
      {
        let response = await this.commonService.getSyllabuses(academicSessionId, schoolingProgramId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.syllabuses = response.syllabuses;
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
    if (!this.saveClicked) 
      {
        if (this.editGradeWiseSyllabusForm.valid && this.academicSessionForm.valid && this.gradeForm.valid && this.syllabusForm.valid )
          { 
            this.isValidForm = true;
            this.saveClicked = true;
            this.editGradeWiseSyllabusForm.controls["academicSession"].get("id").setValue(this.academicSessionForm.get("academicSession").value);
            this.editGradeWiseSyllabusForm.controls['gradeCategory'].get('id').setValue(this.gradeCategoryForm.get('gradeCategory').value);
            this.editGradeWiseSyllabusForm.controls["grade"].get("id").setValue(this.gradeForm.get("grade").value);
            this.editGradeWiseSyllabusForm.controls["syllabus"].get("id").setValue(this.syllabusForm.get("syllabus").value);
        
              try 
                {
                  let response = await this.commonService.updateGradeWiseSyllabus(this.editGradeWiseSyllabusForm.value).toPromise();
                  if (response.status_code == 200 && response.message == 'success') 
                      {
                        this.showNotification("success", "Grade Wise Syllabus Updated");
                        this.commonSharedService.gradeWiseSyllabusListObject.next({ result: "success" });
                        this.closeModal();
                      }
                      else
                      {
                        this.showNotification("success", "Grade Wise Syllabus Not Updated");
                      }
                  }
                  catch (e) 
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
