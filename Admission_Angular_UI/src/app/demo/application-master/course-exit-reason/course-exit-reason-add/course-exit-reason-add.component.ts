import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-course-exit-reason-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './course-exit-reason-add.component.html',
  styleUrls: ['./course-exit-reason-add.component.scss']
})
export class CourseExitReasonAddComponent 
{
  addCourseExitReasonForm: FormGroup;
  exitReasonTypeForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  searchClickedExitReasonType : boolean;
  exitReasonTypes : any[];

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
    this.isValidForm = true;
    this.saveClicked = false;

    this.addCourseExitReasonForm = this.formbuilder.group({
      id:[''],
      exitReasonType: this.formbuilder.group({ 'id': [''] }),
      name: ['',[Validators.required]]
    });  

    this.exitReasonTypeForm = this.formbuilder.group({
      exitReasonType:['', Validators.required]
    });

    this.getExitReasonTypes();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getExitReasonTypes() 
  {  
    try
    {
      this.searchClickedExitReasonType = true;  
      let response = await this.commonService.getExitReasonTypes().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.exitReasonTypes = (response.exitReasonTypes).filter(exitReasonType => exitReasonType.name == 'Opted For Exit' || exitReasonType.name == 'Mid-Year Exit');
        this.searchClickedExitReasonType = false;
        this.exitReasonTypes.unshift({"id" : "", "name" : "Select Exit Reason Type"});
      }
      else
      {
        this.exitReasonTypes = [];
        this.searchClickedExitReasonType = false;
      }
    }
    catch(e)
    {
      this.exitReasonTypes = [];
      this.showNotification("error", e);
      this.searchClickedExitReasonType = false;
    }
  }

  async saveCourseExitReason()
  {
    if(!this.saveClicked)
    {
      if(this.addCourseExitReasonForm.valid && this.exitReasonTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.addCourseExitReasonForm.controls['exitReasonType'].get("id").setValue(this.exitReasonTypeForm.get("exitReasonType").value);
        try
        {
          let response = await this.commonService.saveCourseExitReason(this.addCourseExitReasonForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Course Exit Reason Saved");
              this.commonSharedService.courseExitReasonListObject.next({result : "success"});
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
