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
import { BusinessPartnerCoachAddComponent } from '../business-partner-coach-add/business-partner-coach-add.component';
import { id } from 'date-fns/locale';

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
    businessPartnerCoaches : any[];
    // businessPartnerCoach : any[];

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
            this.getBusinessPartnerCoaches(this.uuid);
        }

    ngOnInit() 
    {
    }

    public businessPartnerContractHistoryAddResult:any = this.commonSharedService.businessPartnerCoachContractHistoryDocumentListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getBusinessPartnerContractHistories(this.uuid);
            this.getBusinessPartnerDocuments(this.uuid);
            this.getBusinessPartnerCoaches(this.uuid);
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

    //get business partner coaches
    async getBusinessPartnerCoaches(uuid : string)
    {  
        try
        {
            this.searchClicked = true;  
            let response = await this.businessService.getBusinessPartnerCoaches(uuid).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblBusinessPartnerCoach').DataTable().destroy();
                this.businessPartnerCoaches = response.businessPartnerCoaches;
                setTimeout(function(){
                $('#tblBusinessPartnerCoach').DataTable();
                },800);
                this.searchClicked = false;
            }
            else
            {
                this.businessPartnerCoaches = [];
                this.searchClicked = false;
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    //get business partner coache
    // async getBusinessPartnerCoach(id : number)
    // {  
    //   try
    //   {
    //     this.searchClicked = true;  
    //     let response = await this.businessService.getBusinessPartnerCoach(id).toPromise();
    //     if (response.status_code == 200 && response.message == 'success') 
    //     {
    //       $('#tblBusinessPartnerCoach').DataTable().destroy();
    //       this.businessPartnerCoach = response.businessPartnerCoach;
    //       console.log(this.businessPartnerCoach)
    //       setTimeout(function(){
    //         $('#tblBusinessPartnerCoach').DataTable();
    //       },800);
    //       this.searchClicked = false;
    //     }
    //     else
    //     {
    //       this.businessPartnerCoaches = [];
    //       this.searchClicked = false;
    //     }
    //   }
    //   catch(e)
    //   {
    //     this.showNotification("error", e);
    //     this.searchClicked = false;
    //   }
    // }

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
        const dialogRef = this.modalService.open(BusinessPartnerContractAddComponent, 
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
        const dialogRef = this.modalService.open(BusinessPartnerDocumentAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }

    // for coaches
    addCoach(uuid : string)
    {
        let params = {
            "uuid" : uuid
        }
        const dialogRef = this.modalService.open(BusinessPartnerCoachAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }

    // business partner contract history
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
                    this.showNotification("success"," Business Partner Contract " + (businessPartnerContractHistory.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.businessPartnerCoachContractHistoryDocumentListObject.next({result : "success"});
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
                    this.commonSharedService.businessPartnerCoachContractHistoryDocumentListObject.next({result : "success"});
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
                    this.commonSharedService.businessPartnerCoachContractHistoryDocumentListObject.next({result : "success"});
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });
    }

    // business partner coach
    updateStatusCoach(businessPartnerCoach : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (businessPartnerCoach.isActive == 1 ? 'de-active' : 'active') + ' the business partner coach?',
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
                    id : businessPartnerCoach.id,
                    tableName : businessPartnerCoach.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success"," Business Partner Coach " + (businessPartnerCoach.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.businessPartnerCoachContractHistoryDocumentListObject.next({result : "success"});
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });   
    }

    // delete business partner coach
    deleteBusinessPartnerCoach(businessPartnerCoach : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete business partner coach?',
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
                id : businessPartnerCoach.id,
                businessPartner : {"uuid" : this.uuid}
            }
            try
            {
                let response = await this.businessService.deleteBusinessPartnerCoach(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Business Partner Coach Deleted.");
                    this.commonSharedService.businessPartnerCoachContractHistoryDocumentListObject.next({result : "success"});
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
