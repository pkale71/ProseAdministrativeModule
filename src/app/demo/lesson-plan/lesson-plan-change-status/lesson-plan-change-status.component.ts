import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { LessonPlanService } from 'src/app/theme/shared/service/lesson-plan.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-lesson-plan-change-status',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './lesson-plan-change-status.component.html',
  styleUrls: ['./lesson-plan-change-status.component.scss']
})
export class LessonPlanChangeStatusComponent {
  @Input() public modalParams;
  uuid : string;
  status : string;
  fileName : string;
  changedStatus : string;
  changeStatusClicked : boolean;
  changeLessonPlanStatusForm : FormGroup;

  constructor(
    private lessopnPlanService: LessonPlanService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService) 
  {
  }

  ngOnInit() 
  {
    //get Modal params
    this.uuid = this.modalParams.uuid;
    this.changeStatusClicked = false;
    /////

    this.changeLessonPlanStatusForm = this.formbuilder.group({
      'uuid': [this.uuid, [Validators.required]],
      'isApproved' : ['1', Validators.required],
      'rejectReason' : ['']
    });
    this.changeLessonPlanStatusForm.get("rejectReason").disable();
  }
  
  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  checkIsApproved()
  {
    let isApproved : number = this.changeLessonPlanStatusForm.get("isApproved").value;
    if(isApproved == 1)
    {
      this.changeLessonPlanStatusForm.get("rejectReason").setValue("");
      this.changeLessonPlanStatusForm.get("rejectReason").disable();
    }
    else
    {
      this.changeLessonPlanStatusForm.get("rejectReason").enable();
    }
  }

  async changeLessonPlanStatus()
  {
    if(!this.changeStatusClicked)
    {
      let isApproved : number = this.changeLessonPlanStatusForm.get("isApproved").value;
      if(isApproved == 1)
      {
        this.changeLessonPlanStatusForm.get("rejectReason").enable();
      }
  
      if(this.changeLessonPlanStatusForm.valid)
      {
        this.changeStatusClicked = true;
        if(isApproved == 1)
        {
          this.changeLessonPlanStatusForm.get("rejectReason").disable();
        }
        try
        {
          let response = await this.lessopnPlanService.approveRejectLessonPlan(this.changeLessonPlanStatusForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              let isApproved : number = this.changeLessonPlanStatusForm.get("isApproved").value;
              this.showNotification("success", "Lesson Plan " + (isApproved == 1 ? "Approved" : "Rejected"));
              this.commonSharedService.lessonPlanListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.changeStatusClicked = false;
        }
      }
      else
      {
        this.changeStatusClicked = false;
        if(parseInt(this.changeLessonPlanStatusForm.get("isApproved").value) == 0)
        {
          this.showNotification("warning", "Fill Reject Reason");
        }
        else
        {
          this.showNotification("warning", "Fill All Details");
        }
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
