import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { environment } from 'src/environments/environment';
import { CurriculumUpload } from 'src/app/theme/shared/model/curriculum-upload';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CurriculumService } from 'src/app/theme/shared/service/curriculum.service';
import { User } from 'src/app/theme/shared/model/user';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { LessonPlanService } from 'src/app/theme/shared/service/lesson-plan.service';
import { LessonPlanMaster } from 'src/app/theme/shared/model/lessonPlanMaster';
import { LessonPlanDescription } from 'src/app/theme/shared/model/lessonPlanDescription'; 
declare var $;

@Component({
  selector: 'app-lesson-plan-resource-player',
  standalone: true,
  imports: [CommonModule, SharedModule, NgxDocViewerModule],
  templateUrl: './lesson-plan-resource-player.component.html',
  styleUrls: ['./lesson-plan-resource-player.component.scss']
})
export class LessonPlanResourcePlayerComponent {
  curriculumUpload : CurriculumUpload;
  allCurriculumUploads : CurriculumUpload[];
  loginUser : User;
  videoCurriculumFile : SafeUrl;
  audioCurriculumFile : SafeUrl;
  imageCurriculumFile : SafeUrl;
  urlCurriculumFile : SafeUrl;
  otherCurriculumFile : SafeUrl;
  lessonPlanMaster : LessonPlanMaster;
  lessonPlanDescriptions : any[];
  curFile : number;
  totalFile : number;

  constructor(private notifier: NotifierService, 
  private activatedRoute: ActivatedRoute,
  private curriculumService: CurriculumService, 
  public commonSharedService : CommonSharedService,
  private router : Router, private location : Location, 
  private domSanitizer : DomSanitizer, 
  private lessonPlanService : LessonPlanService)
  {
    this.allCurriculumUploads = [];
    this.loginUser = this.commonSharedService.loginUser;
    this.lessonPlanMaster = this.activatedRoute.snapshot.data['lessonPlan'].data.lessonPlan;
    if(this.lessonPlanMaster)
    {
      if(this.lessonPlanMaster.lessonPlanDescriptions[0].uuid != null)
      {
        this.lessonPlanDescriptions = this.lessonPlanMaster.lessonPlanDescriptions;
        this.totalFile = 0;
        this.curFile = 1;
      ////////////// Prepare All Curriculum Uploads
        for(let k=0;k<this.lessonPlanDescriptions.length;k++)
        {
          this.prepareAllCurriculumUploads(this.lessonPlanDescriptions[k].curriculumUploads);
        }
      /////////
        this.getResourceData(this.allCurriculumUploads[0]);
      }
    }
  }

  ngOnInit()
  {
  }

  prepareAllCurriculumUploads(curriculumUploads : CurriculumUpload[])
  {
    for(let l=0;l<curriculumUploads.length;l++)
    {
      this.allCurriculumUploads.push(curriculumUploads[l]);
      this.totalFile++;
    }
  }

  nextResource()
  {
    if(this.curFile > 0 && this.curFile != this.totalFile)
    {
      this.curFile++;
      this.getResourceData(this.allCurriculumUploads[this.curFile-1]);
    }
  }

  prevResource()
  {
    if(this.curFile > 1)
    {
      this.curFile--;
      this.getResourceData(this.allCurriculumUploads[this.curFile-1]);
    }
  }

  getResourceData(curriculumUpload : CurriculumUpload)
  {
    this.curriculumUpload = curriculumUpload;
    this.videoCurriculumFile = "";
    this.audioCurriculumFile = "";
    this.imageCurriculumFile = "";
    this.urlCurriculumFile = "";
    this.otherCurriculumFile = "";
    let tempPath = environment.apiUrl + "/curriculum/getCurriculumUploadFile/" + curriculumUpload.uuid;
    if(this.curriculumUpload?.uuid != "" && this.curriculumUpload?.fileName != "")
    {
      let fileExt = this.curriculumUpload.fileExtension;
      if(fileExt == "https://")
      {
        tempPath = this.curriculumUpload?.fileName;
      }
      if(fileExt.toLowerCase() == "mp4")
      {
        this.videoCurriculumFile = this.domSanitizer.bypassSecurityTrustResourceUrl(tempPath);
      }
      else if(fileExt.toLowerCase() == "mp3")
      {
        this.audioCurriculumFile = this.domSanitizer.bypassSecurityTrustResourceUrl(tempPath);
      }
      else if(fileExt.toLowerCase() == "jpg" || fileExt.toLowerCase() == "jpeg" || fileExt.toLowerCase() == "png")
      {
        this.imageCurriculumFile = this.domSanitizer.bypassSecurityTrustResourceUrl(tempPath);
      }
      else if(fileExt.toLowerCase() == "https://")
      {
        this.urlCurriculumFile = tempPath;
      }
      else
      {
        this.otherCurriculumFile = this.domSanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url="+tempPath+"&embedded=true");
      }
    }
  }

  back()
  {
    this.router.navigateByUrl("/teachingSchedule")
  }
}
