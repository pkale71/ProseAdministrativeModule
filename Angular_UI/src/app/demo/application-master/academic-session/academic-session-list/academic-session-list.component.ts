import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { AcademicSessionAddComponent } from '../academic-session-add/academic-session-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';
import { AcademicSessionEditComponent } from '../academic-session-edit/academic-session-edit.component';

@Component({
  selector: 'app-academic-sessionForm-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './academic-session-list.component.html',
  styleUrls: ['./academic-session-list.component.scss']
})
export class AcademicSessionListComponent {
  academicSessions : any[];
  searchClicked : boolean;
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getAcademicSessions();
    this.academicSessions = [];
  }

  public AcademicSessionAddResult:any = this.commonSharedService.academicSessionListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getAcademicSessions();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicSessions() 
  {
   try
      {
        this.searchClicked = true;
        let response = await this.commonService.getAcademicSessions().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblAcademicSession').DataTable().destroy();
          this.academicSessions = response.academicSessions;
          setTimeout(function(){
            $('#tblAcademicSession').DataTable();
          },800);
          this.searchClicked = false;
          this.modalService.dismissAll();
        }
        else
        {
          this.academicSessions = [];
          this.searchClicked = false;
          this.modalService.dismissAll();
        }
      }
    catch(e)
      {
         this.showNotification("error", e);
      }
  }
  
  addAcademiSession()
  {
    const dialogRef = this.modalService.open(AcademicSessionAddComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editAcademicSession(academicSession : any)
  {
    const dialogRef = this.modalService.open(AcademicSessionEditComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = academicSession;
  }

  updateStatus(academicSession : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (academicSession.isActive == 0 ? 'de-active' : 'active') + ' the academic session?',
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
          console.log(academicSession.id)
          let tempJson = {
            id : academicSession.id,
            tableName : academicSession.tableName
          }
          this.showNotification("info", "Please wait...");
          console.log(tempJson)
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Academic Session Status Updated");
              this.commonSharedService.academicSessionListObject.next({
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
 
  deleteAcademicSession(academicSession:any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete academic session?',
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
        let tempJSON = { "id" : academicSession.id };
        try
        {
          let response = await this.commonService.deleteAcademicSession(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Academic Session Deleted.");
            this.commonSharedService.academicSessionListObject.next({
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
}
