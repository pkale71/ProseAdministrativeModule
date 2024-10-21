import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { CourseExitReasonAddComponent } from '../course-exit-reason-add/course-exit-reason-add.component';
import { CourseExitReasonEditComponent } from '../course-exit-reason-edit/course-exit-reason-edit.component';

@Component({
  selector: 'app-course-exit-reason-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './course-exit-reason-list.component.html',
  styleUrls: ['./course-exit-reason-list.component.scss']
})
export class CourseExitReasonListComponent 
{
  exitReasonTypeForm : FormGroup;
  searchClicked : boolean;
  searchClickedExitReasonType : boolean;
  courseExitReasons : any[];
  exitReasonTypes : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.exitReasonTypes = [];
    this.courseExitReasons = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.searchClickedExitReasonType = false;

    this.exitReasonTypeForm = this.formbuilder.group({
      exitReasonType:['0']
    });

    this.getExitReasonTypes();
    this.getCourseExitReasons(0, 'All');
  }

  public courseExitReasonAddResult:any = this.commonSharedService.courseExitReasonListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.filterData();
    }
  })

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
        this.exitReasonTypes = response.exitReasonTypes;
        this.searchClickedExitReasonType = false;
        this.exitReasonTypes.unshift({"id" : "0", "name" : "All"});
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

  async getCourseExitReasons(exitReasonTypeId : number, action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.commonService.getCourseExitReasons(exitReasonTypeId, action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblCourseExitReason').DataTable().destroy();
        this.courseExitReasons = response.courseExitReasons;
        setTimeout(function(){
          $('#tblCourseExitReason').DataTable();
        },1000);
        this.searchClicked = false;
      }
      else
      {
        this.courseExitReasons = [];
        this.searchClicked = false;
      }
    }
    catch(e)
    {
      this.courseExitReasons = [];
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  filterData()
  {
    let exitReasonTypeId : number = this.exitReasonTypeForm.get("exitReasonType").value;
    this.getCourseExitReasons(exitReasonTypeId, 'All');
  }

  addCourseExitReason()
  {
    const dialogRef = this.modalService.open(CourseExitReasonAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editCourseExitReason(courseExitReason : any)
  {
    const dialogRef = this.modalService.open(CourseExitReasonEditComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "courseExitReason" : courseExitReason
    };
  }

  updateStatus(courseExitReason : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (courseExitReason.isActive == 1 ? 'De-Active' : 'Active') + ' The Course Exit Reason?',
      icon: 'warning',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          let tempJson = {
            id : courseExitReason.id,
            tableName : courseExitReason.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Course Exit Reason " + (courseExitReason.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.courseExitReasonListObject.next({
                result : "success"
              });
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }

  deleteCourseExitReason(courseExitReason : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Course Exit Reason?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
        
      } 
      else 
      {
        this.showNotification("info", "Please Wait...");
        let tempJSON = { "id" : courseExitReason.id };
        try
        {
          let response = await this.commonService.deleteCourseExitReason(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Course Exit Reason Deleted.");
            this.commonSharedService.courseExitReasonListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });
  }
}
