import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LessonPlanMaster } from 'src/app/theme/shared/model/lessonPlanMaster';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { User } from 'src/app/theme/shared/model/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LessonPlanDescription } from 'src/app/theme/shared/model/lessonPlanDescription';
import { Grade } from 'src/app/theme/shared/model/grade';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { NotifierService } from 'angular-notifier';
import { SafeHtmlPipe } from 'src/app/theme/shared/custom-pipe/safe-html-pipe.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonPlanChangeStatusComponent } from '../lesson-plan-change-status/lesson-plan-change-status.component';
import { LessonPlanService } from 'src/app/theme/shared/service/lesson-plan.service';

@Component({
  selector: 'app-lesson-plan-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, SafeHtmlPipe],
  templateUrl: './lesson-plan-detail.component.html',
  styleUrls: ['./lesson-plan-detail.component.scss']
})
export class LessonPlanDetailComponent {
  lessonPlan : LessonPlanMaster;
  loginUser : User;
  userTypeCode : string;
  lessonPlanMasterForm : FormGroup;
  lessonPlanDescriptions : LessonPlanDescription[];
  grades : Grade[];
  searchLessonPlan : boolean = false;
  isCurrent : number = 0;
    
  constructor(private location : Location, private commonSharedService : CommonSharedService,
    private notifier: NotifierService, private activatedRoute: ActivatedRoute, 
    private modalService: NgbModal, private formbuilder: FormBuilder, 
    private router : Router, private lessonPlanService : LessonPlanService)
  {
    this.loginUser = this.commonSharedService.loginUser;
    this.userTypeCode = this.loginUser.userType.code;
    this.lessonPlan = this.activatedRoute.snapshot.data['lessonPlan'].data.lessonPlan;
    this.isCurrent = this.lessonPlan.academicYear.isCurrent;
  }

  ngOnInit()
  {
    this.lessonPlanDescriptions = [];
    this.lessonPlanMasterForm = this.formbuilder.group({
      "uuid" : [''],
      "academicYear" : this.formbuilder.group({"uuid" : [''], "year" : ['']}),
      "school" : this.formbuilder.group({"uuid" : [''], "name" : ['']}),
      "grade" : this.formbuilder.group({"id" : [''], "name" : ['']}),
      "subject" : this.formbuilder.group({"uuid" : [''], "name" : ['']}),
      "chapter" : this.formbuilder.group({"uuid" : [''], "name" : ['']}),
      "topic" : this.formbuilder.group({"uuid" : [''], "name" : ['']}),
      "methodology" : [''],
      "duration" : [''],
      "numberOfPeriods" : [''],
      "prerequisite" : [''],
      "skills" : [''],
      "learningOutcome" : [''],
      "rejectedOn" : [''],
      "rejectedBy" : this.formbuilder.group({"uuid" : [''], "name" : ['']}),
      "rejectReason" : ['']
    });

    this.lessonPlanMasterForm.patchValue(this.lessonPlan);
    this.lessonPlanMasterForm.get("learningOutcome").setValue(this.lessonPlan.learningOutcome.split("<br />").join("\n"));
    this.lessonPlanDescriptions = this.lessonPlan.lessonPlanDescriptions;
  }

  public lessonPlanDetailResult:any = this.commonSharedService.lessonPlanListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getLessonPlan();
    }
  })

  async getLessonPlan() 
  {
    if(this.lessonPlan)
    {
      try
      {
        this.searchLessonPlan = true;
        let response = await this.lessonPlanService.getLessonPlan(this.lessonPlan.uuid).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.lessonPlan = response.data.lessonPlan;
          this.isCurrent = this.lessonPlan.academicYear.isCurrent;
          this.searchLessonPlan = false;
          this.modalService.dismissAll();
        }
      }
      catch(e)
      {
        this.lessonPlan = null;
        this.searchLessonPlan = false;
      }
    }
  }

  changeStatus(lessonPlan : LessonPlanMaster)
  {
    let params = {
      "uuid" : lessonPlan.uuid
    }
    const dialogRef = this.modalService.open(LessonPlanChangeStatusComponent, 
    { 
      size: 'sm', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  addAsNewLessonPlan(uuid : string)
  {
    this.router.navigateByUrl("/lessonPlan/add/" + uuid);
  }

  back()
  {
    this.location.back();
  }
}
