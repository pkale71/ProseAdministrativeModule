import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { AcademyEnclosureDocumentAddComponent } from '../academy-enclosure-document-add/academy-enclosure-document-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { id } from 'date-fns/locale';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-academy-enclosure-document-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './academy-enclosure-document-list.component.html',
  styleUrls: ['./academy-enclosure-document-list.component.scss']
})
export class AcademyEnclosureDocumentListComponent {
  searchClicked : boolean;
  academyEnclosureDocuments : any[];
  masterAcademyEnclosureDocuments : any[];
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private businessService: BusinessService, 
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
      this.academyEnclosureDocuments = [];
      this.masterAcademyEnclosureDocuments = [];
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getAcademyEnclosureDocuments('All');
  }

  public academyEnclosureDocumentAddResult:any = this.commonSharedService.academyEnclosureDocumentListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getAcademyEnclosureDocuments('All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademyEnclosureDocuments(action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.businessService.getAcademyEnclosureDocuments('All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblAcademyEnclosureDocument').DataTable().destroy();
        this.masterAcademyEnclosureDocuments = response.academyEnclosureDocuments;
        this.academyEnclosureDocuments = this.masterAcademyEnclosureDocuments;
        setTimeout(function(){
          $('#tblAcademyEnclosureDocument').DataTable();
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

  addAcademyEnclosureDocumentForm()
  {
    const dialogRef = this.modalService.open(AcademyEnclosureDocumentAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  updateStatus(academyEnclosureDocument : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (academyEnclosureDocument.isActive == 1 ? 'de-active' : 'active') + ' the academy enclosure document?',
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
            id : academyEnclosureDocument.id,
            tableName : academyEnclosureDocument.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Academy Enclosure Document Status Updated");
              this.commonSharedService.academyEnclosureDocumentListObject.next({
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

  deleteAcademyEnclosureDocument(academyEnclosureDocument : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete academy enclosure document?',
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
        let tempJSON = { "id" : academyEnclosureDocument.id };
        try
        {
          let response = await this.businessService.deleteAcademyEnclosureDocument(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Academy Enclosure Document Deleted.");
            this.commonSharedService.academyEnclosureDocumentListObject.next({result : "success"});
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
