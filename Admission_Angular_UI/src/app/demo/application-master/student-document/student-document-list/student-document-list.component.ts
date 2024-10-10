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
import { StudentDocumentAddComponent } from '../student-document-add/student-document-add.component';

@Component({
  selector: 'app-student-document-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './student-document-list.component.html',
  styleUrls: ['./student-document-list.component.scss']
})
export class StudentDocumentListComponent 
{
  searchClicked : boolean;
  studentDocuments : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.studentDocuments = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getStudentDocuments('All');
  }

  public studentDocumentAddResult:any = this.commonSharedService.studentDocumentListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.getStudentDocuments('All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getStudentDocuments(action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.commonService.getStudentDocuments(action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblStudentDocument').DataTable().destroy();
        this.studentDocuments = response.studentDocuments;
        setTimeout(function(){
          $('#tblStudentDocument').DataTable();
        },1000);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.searchClicked = false;
        this.modalService.dismissAll(); 
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  addStudentDocument()
  {
    const dialogRef = this.modalService.open(StudentDocumentAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  updateStatus(studentDocument : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (studentDocument.isActive == 1 ? 'De-Active' : 'Active') + ' The Student Document?',
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
            id : studentDocument.id,
            tableName : studentDocument.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Student Document " + (studentDocument.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.studentDocumentListObject.next({
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

  deleteStudentDocument(studentDocument : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Student Document?',
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
        let tempJSON = { "id" : studentDocument.id };
        try
        {
          let response = await this.commonService.deleteStudentDocument(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Student Document Deleted.");
            this.commonSharedService.studentDocumentListObject.next({result : "success"});
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
