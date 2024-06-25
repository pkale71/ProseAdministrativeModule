import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-syllabus-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './syllabus-add.component.html',
  styleUrls: ['./syllabus-add.component.scss']
})
export class SyllabusAddComponent {
  @Input() public modalParams;
  schoolingPrograms : any[];
  syllabuses : any[];
  academicSessions : any[];
  addSyllabusForm: FormGroup;
  academicSessionForm : FormGroup;
  schoolingProgramForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

  constructor(private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
  {
    this.schoolingPrograms = [];
    this.syllabuses = [];
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;
    this.schoolingPrograms = [];
    this.syllabuses = [];

    this.addSyllabusForm = this.formbuilder.group({
      id:[''],
      name: ['',Validators.required],
      academicsession : this.formbuilder.group({ 'id' : [''] }),
      schoolingProgram: this.formbuilder.group({ 'id': [''] }),
    });

    this.academicSessionForm = this.formbuilder.group({
      'academicSession' : ['', Validators.required]
    })

    this.schoolingProgramForm = this.formbuilder.group({
      'schoolingProgram': ['', [Validators.required]]
    });

    this.getAcademicSessions();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }
 
  // academic session
  async getAcademicSessions() 
  {
    try 
      {
        let response = await this.commonService.getAcademicSessions().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.academicSessions = response.academicSessions;
          this.academicSessions.unshift({ id : "", name : "Select Academic Session"});
        }
        else
        {
          this.academicSessions = [];
        }
      }
      catch(error)
        {
          this.showNotification("error", error);
        }
  }

  // schooling program
  async getSchoolingPrograms() 
  {
    try
      {
        let academicSessionId = this.academicSessionForm.get("academicSession").value;
        if(academicSessionId != undefined && academicSessionId != "")
        {
          let response = await this.commonService.getSchoolingPrograms(academicSessionId).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.schoolingPrograms = response.schoolingPrograms;
            this.schoolingPrograms.unshift({ id: "", name: "Select School Program" });
          }
          else
          {
            this.schoolingPrograms = [];
          }
        }
        else
        {
          this.schoolingPrograms = [];
        }
      }
      catch(e)
        {
          this.showNotification("error",e);
        }
  }

  async saveSyllabus()
  {
    if(!this.saveClicked)
    {
      if(this.addSyllabusForm.valid && this.academicSessionForm.valid && this.schoolingProgramForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        let schoolingProgramId = this.schoolingProgramForm.get("schoolingProgram").value;
        this.addSyllabusForm.controls["schoolingProgram"].get("id").setValue(schoolingProgramId);

        try
        {
          let response = await this.commonService.saveSyllabus(this.addSyllabusForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Syllabus Saved");
              this.commonSharedService.syllabusListObject.next({
                result : "success",
                responseData : {
                  schoolingProgramId : schoolingProgramId,
                }
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

