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
import { TieUpSchoolContractAddComponent } from '../tie-up-school-contract-add/tie-up-school-contract-add.component';
import { TieUpSchoolDocumentAddComponent } from '../tie-up-school-document-add/tie-up-school-document-add.component';
import { id } from 'date-fns/locale';

@Component({
    selector: 'app-tie-up-school-detail',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './tie-up-school-detail.component.html',
    styleUrls: ['./tie-up-school-detail.component.scss']
})
export class TieUpSchoolDetailComponent {
    searchClicked : boolean;
    uuid : string;
    tieUpSchool : any;
    tieUpSchoolContractHistories : any = [];
    tieUpSchoolDocuments : any = [];

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
        this.getTieUpSchool(this.uuid);
        this.getTieUpSchoolDocuments(this.uuid);
        this.getTieUpSchoolContractHistories(this.uuid);
        }

    ngOnInit() 
    {
    }

    public TieUpSchoolContractHistoryAddResult:any = this.commonSharedService.tieUpSchoolContractHistoryDocumentListObject.subscribe(res =>{
        if(res.result == "success")
        {
        this.getTieUpSchoolDocuments(this.uuid);
        this.getTieUpSchoolContractHistories(this.uuid);
        }
    }) 

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getTieUpSchool(uuid : string) 
    {
        this.searchClicked = true;
        let response = await this.businessService.getTieUpSchool(uuid).toPromise(); 
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.tieUpSchool = response.tieUpSchool;
            this.searchClicked = false;
        }
        else
        {
            this.tieUpSchool = [];
            this.searchClicked = false;
        }
    }

    // get tie-up school contract history
    async getTieUpSchoolContractHistories(uuid : string) 
    {
        this.searchClicked = true;
        let response = await this.businessService.getTieUpSchoolContractHistories(uuid).toPromise(); 
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.tieUpSchoolContractHistories = response.tieUpSchoolContractHistories;
            this.searchClicked = false;
        }
        else
        {
            this.tieUpSchoolContractHistories = [];
            this.searchClicked = false;
        }    
    }

    // get tie-up school documents
    async getTieUpSchoolDocuments(uuid : string) 
    {
        this.searchClicked = true;
        let response = await this.businessService.getTieUpSchoolDocuments(uuid).toPromise(); 
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.tieUpSchoolDocuments = response.tieUpSchoolDocuments;
            this.searchClicked = false;
        }
        else
        {
            this.tieUpSchoolContractHistories = [];
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
        const dialogRef = this.modalService.open(TieUpSchoolContractAddComponent, 
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
        const dialogRef = this.modalService.open(TieUpSchoolDocumentAddComponent, 
        { 
        size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }
    
    // tie-up school contract history
    updateStatus(tieUpSchoolContractHistory : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (tieUpSchoolContractHistory.isActive == 1 ? 'de-active' : 'active') + ' the tie-up school contract?',
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
                    id : tieUpSchoolContractHistory.id,
                    tableName : tieUpSchoolContractHistory.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Tie-Up School Contract " + (tieUpSchoolContractHistory.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.tieUpSchoolContractHistoryDocumentListObject.next({result : "success"});
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });   
    }

    // delete tie-up school contract
    deleteTieUpSchoolContract(tieUpSchoolContractHistory : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete tie-up school contract?',
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
            id : tieUpSchoolContractHistory.id,
            tieUpSchool : {"uuid" : this.uuid}
            }
            try
            {
                let response = await this.businessService.deleteTieUpSchoolContract(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Tie-Up School Contract Deleted.");
                    this.commonSharedService.tieUpSchoolContractHistoryDocumentListObject.next({result : "success"});
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });
    }

    // delete tie-up school document
    deleteTieUpSchoolDocument(tieUpSchoolDocument : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete tie-up school document?',
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
            id : tieUpSchoolDocument.id,
            tieUpSchool : {"uuid" : this.uuid}
            }
            try
            {
                let response = await this.businessService.deleteTieUpSchoolDocument(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Tie-Up School Document Deleted.");
                    this.commonSharedService.tieUpSchoolContractHistoryDocumentListObject.next({result : "success"});
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
