import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// third party
import Swal from 'sweetalert2';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { DataTablesModule } from 'angular-datatables';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudyCenterAgreeMentAddComponent } from '../study-center-agreement-add/study-center-agreement-add.component';
import { StudyCenterDocumentAddComponent } from '../study-center-document-add/study-center-document-add.component';
import { id } from 'date-fns/locale';

@Component({
  selector: 'app-study-center-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './study-center-detail.component.html',
  styleUrls: ['./study-center-detail.component.scss']
})
export class StudyCenterDetailComponent {
  searchClicked : boolean;
  uuid : string;
  studyCenter : any;
  studyCenterAgreementHistories : any = [];
  studyCenterDocuments : any = [];

  constructor(private notifier: NotifierService, 
    private businessService: BusinessService, 
    public commonSharedService : CommonSharedService,
    private commonService : CommonService,
    private modalService: NgbModal, 
    private location : Location, 
    private route: ActivatedRoute)
    {
      this.uuid = this.route.params['value'].uuid;
      this.searchClicked = false;
      this.getStudyCenter(this.uuid);
      this.getStudyCenterAgreementHistories(this.uuid);
      this.getStudyCenterDocuments(this.uuid);
    }

  ngOnInit() 
  {
  }

  public studyCenterHistoryAddResult:any = this.commonSharedService.studyCenterAgreementHistoryDocumentListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getStudyCenterAgreementHistories(this.uuid);
      this.getStudyCenterDocuments(this.uuid);
    }
  }) 

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getStudyCenter(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getStudyCenter(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.studyCenter = response.studyCenter;
      this.searchClicked = false;
    }
    else
    {
      this.studyCenter = [];
      this.searchClicked = false;
    }
  }

  // get study center agreement history
  async getStudyCenterAgreementHistories(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getStudyCenterAgreementHistories(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.studyCenterAgreementHistories = response.studyCenterAgreementHistories;
      this.searchClicked = false;
    }
    else
    {
      this.studyCenterAgreementHistories = [];
      this.searchClicked = false;
    }    
  }

  // get study center documents
  async getStudyCenterDocuments(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getStudyCenterDocuments(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.studyCenterDocuments = response.studyCenterDocuments;
      this.searchClicked = false;
    }
    else
    {
      this.studyCenterDocuments = [];
      this.searchClicked = false;
    }    
  }

  
  back()
  {
    this.location.back();
  }

  // for contracts
  addRenew(uuid : string)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(StudyCenterAgreeMentAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  // for documents
  addDocument(uuid : string)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(StudyCenterDocumentAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  //study center agreement history
  updateStatus(studyCenterAgreementHistory : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (studyCenterAgreementHistory.isActive == 1 ? 'de-active' : 'active') + ' the study center agreement?',
      icon: 'warning',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willUpdate) => {
      if (willUpdate.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          let tempJson = {
            id : studyCenterAgreementHistory.id,
            tableName : studyCenterAgreementHistory.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success","Study Center Agreement " + (studyCenterAgreementHistory.isActive == 1 ? 'De-activated' : 'Activated'));
            this.commonSharedService.studyCenterAgreementHistoryDocumentListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }

   // delete study center agreement
  deleteStudyCenterAgreement(studyCenterAgreement : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete study center agreement?',
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
        let tempJson = {
          id : studyCenterAgreement.id,
          studyCenter : {"uuid" : this.uuid}
        }
        try
        {
          let response = await this.businessService.deleteStudyCenterAgreement(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Study Center Agreement Deleted.");
            this.commonSharedService.studyCenterAgreementHistoryDocumentListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });
  }

  // delete study center document
  deleteStudyCenterDocument(studyCenterDocument : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete study center document?',
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
        let tempJson = {
          id : studyCenterDocument.id,
          studyCenter : {"uuid" : this.uuid}
        }
        try
        {
          let response = await this.businessService.deleteStudyCenterDocument(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Study Center Document Deleted.");
            this.commonSharedService.studyCenterAgreementHistoryDocumentListObject.next({result : "success"});
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
