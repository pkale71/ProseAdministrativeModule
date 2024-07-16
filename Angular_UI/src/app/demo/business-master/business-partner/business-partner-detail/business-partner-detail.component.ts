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
import { BusinessPartnerContractAddComponent } from '../business-partner-contract-add/business-partner-contract-add.component';
import { BusinessPartnerDocumentAddComponent } from '../business-partner-document-add/business-partner-document-add.component';

@Component({
  selector: 'app-business-partner-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './business-partner-detail.component.html',
  styleUrls: ['./business-partner-detail.component.scss']
})
export class BusinessPartnerDetailComponent {
  searchClicked : boolean;
  uuid : string;
  businessPartner : any;
  businessPartnerContractHistories : any = [];
  businessPartnerDocuments : any[];

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
      this.getBusinessPartner(this.uuid);
      this.getBusinessPartnerContractHistories(this.uuid);
      this.getBusinessPartnerDocuments(this.uuid);
    }

  ngOnInit() 
  {
  }

  public businessPartnerContractHistoryAddResult:any = this.commonSharedService.businessPartnerContractHistoryDocumentListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getBusinessPartnerContractHistories(this.uuid);
      this.getBusinessPartnerDocuments(this.uuid);
    }
  }) 

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getBusinessPartner(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getBusinessPartner(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.businessPartner = response.businessPartner;
      this.searchClicked = false;
    }
    else
    {
      this.businessPartner = [];
      this.searchClicked = false;
    }
  }

  // get busines partner contract history
  async getBusinessPartnerContractHistories(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getBusinessPartnerContractHistories(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.businessPartnerContractHistories = response.businessPartnerContractHistories;
      this.searchClicked = false;
    }
    else
    {
      this.businessPartnerContractHistories = [];
      this.searchClicked = false;
    }    
  }

  // get business partner documents
  async getBusinessPartnerDocuments(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.businessService.getBusinessPartnerDocuments(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.businessPartnerDocuments = response.businessPartnerDocuments;
      this.searchClicked = false;
    }
    else
    {
      this.businessPartnerContractHistories = [];
      this.searchClicked = false;
    }    
  }

  back()
  {
    this.location.back();
  }

  addRenew(uuid : string)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(BusinessPartnerContractAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  addDocument(uuid : string)
  {
    let params = {
      "uuid" : uuid
    }
    const dialogRef = this.modalService.open(BusinessPartnerDocumentAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = params;
  }

  updateStatus(businessPartnerContractHistory : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (businessPartnerContractHistory.isActive == 1 ? 'de-active' : 'active') + ' the business partner contract?',
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
            id : businessPartnerContractHistory.id,
            tableName : businessPartnerContractHistory.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success"," Business Partner Contract Status Updated");
            this.commonSharedService.businessPartnerContractHistoryDocumentListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }

   // delete business partner contract
  deleteBusinessPartnerContract(businessPartnerContractHistory : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete business partner contract?',
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
          id : businessPartnerContractHistory.id,
          businessPartner : {"uuid" : this.uuid}
        }
        try
        {
          let response = await this.businessService.deleteBusinessPartnerContract(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Business Partner Contract Deleted.");
            this.commonSharedService.businessPartnerContractHistoryDocumentListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });
  }

  // delete business partner document
  deleteBusinessPartnerDocument(businessPartnerDocument : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete business partner document?',
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
          id : businessPartnerDocument.id,
          businessPartner : {"uuid" : this.uuid}
        }
        try
        {
          let response = await this.businessService.deleteBusinessPartnerDocument(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Business Partner Document Deleted.");
            this.commonSharedService.businessPartnerContractHistoryDocumentListObject.next({result : "success"});
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
