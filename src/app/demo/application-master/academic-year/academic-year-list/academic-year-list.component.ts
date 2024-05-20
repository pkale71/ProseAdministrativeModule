import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AcademicYear } from 'src/app/theme/shared/model/academic-year';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { AcademicYearAddComponent } from '../academic-year-add/academic-year-add.component';
declare var $;

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-academic-year-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './academic-year-list.component.html',
  styleUrls: ['./academic-year-list.component.scss']
})
export class AcademicYearListComponent 
{
  academicYears : AcademicYear[];

  constructor(private notifier: NotifierService, 
  private activatedRoute: ActivatedRoute,
  private modalService: NgbModal,
  private commonService: CommonService, 
  public commonSharedService : CommonSharedService)
  {
    this.academicYears = this.activatedRoute.snapshot.data['academicYears'].data.academicYears;
  }

  ngOnInit() 
  {
    
  }

  checkIsCurrent()
  {
    let result : boolean = false;
    for(let i=0;i<this.academicYears.length;i++)
    {
      if(this.academicYears[i].isCurrent == 1)
      {
        result = true;
        break;
      }
    }
    return result;
  }

  public academicYearAddResult:any = this.commonSharedService.academicYearListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getAcademicYears();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicYears() 
  {
    let response = await this.commonService.getAcademicYears().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblAcademicYear').DataTable().clear().destroy();
      this.academicYears = response.data.academicYears;
      setTimeout(function(){
        $('#tblAcademicYear').DataTable();
      },1000);
      this.modalService.dismissAll();
    }
    else
    {
      this.academicYears = [];
      this.modalService.dismissAll();
    }
  }

  addAcademicYear()
  {
    const dialogRef = this.modalService.open(AcademicYearAddComponent, 
    { 
      size: 'lg', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  deleteAcademicYear(uuid)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete academic year?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
        
      } 
      else 
      {
        this.showNotification("info", "Please wait...");
        let tempJSON = { "uuid" : uuid };
        try
        {
          let response = await this.commonService.deleteAcademicYear(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Academic Year Deleted.");
            this.commonSharedService.currentAcademicYear = null;
            this.commonSharedService.academicYearListObject.next({result : "success"});
            this.commonSharedService.currentAcademicYearListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", "Academic Year Not Deleted.");
        }
      }
    });
  }
}
