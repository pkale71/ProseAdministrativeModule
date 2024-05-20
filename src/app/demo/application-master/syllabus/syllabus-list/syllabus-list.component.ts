import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Syllabus } from 'src/app/theme/shared/model/syllabus';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusAddComponent } from '../syllabus-add/syllabus-add.component';
declare var $;

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-syllabus-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './syllabus-list.component.html',
  styleUrls: ['./syllabus-list.component.scss']
})
export class SyllabusListComponent
{
  syllabuses : Syllabus[];

  constructor(private notifier: NotifierService, 
  private activatedRoute: ActivatedRoute,
  private modalService: NgbModal,
  private commonService: CommonService, 
  public commonSharedService : CommonSharedService,
  private router : Router)
  {
    this.syllabuses = this.activatedRoute.snapshot.data['syllabuses'].data.syllabuses;
  }

  ngOnInit() 
  {
    
  }

  public syllabusAddResult:any = this.commonSharedService.syllabusListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getSyllabuses();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSyllabuses() 
  {
    let response = await this.commonService.getSyllabuses().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblSyllabus').DataTable().clear().destroy();
      this.syllabuses = response.data.syllabuses;
      setTimeout(function(){
        $('#tblSyllabus').DataTable();
      },1000);
      this.modalService.dismissAll();
    }
    else
    {
      this.syllabuses = [];
      this.modalService.dismissAll();
    }
  }

  addSyllabus()
  {
    const dialogRef = this.modalService.open(SyllabusAddComponent, 
    { 
      size: 'sm', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  deleteSyllabus(id)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete syllabus?',
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
        let tempJSON = { "id" : id };
        try
        {
          let response = await this.commonService.deleteSyllabus(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Syllabus Deleted.");
            this.commonSharedService.syllabusListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", "Syllabus Not Deleted.");
        }
      }
    });
  }
}
