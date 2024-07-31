import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { TieUpSchoolEditComponent } from '../tie-up-school-edit/tie-up-school-edit.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { TieUpSchoolDetailComponent } from '../tie-up-school-detail/tie-up-school-detail.component';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { TieUpSchoolAddComponent } from '../tie-up-school-add/tie-up-school-add.component';

@Component({
  selector: 'app-tie-up-school-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './tie-up-school-list.component.html',
  styleUrls: ['./tie-up-school-list.component.scss']
})
export class TieUpSchoolListComponent 
{
    tieUpSchools : any[];
    masterTieUpSchools : any[];
    searchClicked : boolean;
    tieUpSchool : any;
    
  constructor(private router : Router,
        private formbuilder : FormBuilder,
        private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal, 
        private commonService : CommonService,
        private businessService : BusinessService,
        private route: ActivatedRoute,
        public commonSharedService : CommonSharedService)
    {
    }
    
    ngOnInit() 
    {
        this.searchClicked = false;
        this.tieUpSchools = [];
        this.masterTieUpSchools = [];        
        this.getTieUpSchools();
    }

    public tieUpSchoolAddResult:any = this.commonSharedService.tieUpSchoolListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getTieUpSchools();
        }
    }) 

    // get tie-up schools
    async getTieUpSchools() 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.businessService.getTieUpSchools().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblTieUpSchool').DataTable().destroy();
                this.masterTieUpSchools = response.tieUpSchools;
                this.tieUpSchools = this.masterTieUpSchools;
                setTimeout(function(){
                $('#tblTieUpSchool').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.tieUpSchools = [];
                this.searchClicked = false;
            } 
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    async getTieUpSchool(uuid : string) 
    {
        try
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
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }


    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    updateStatus(tieUpSchool : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (tieUpSchool.isActive == 1 ? 'de-active' : 'active') + ' the tie-up school?',
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
                    id : tieUpSchool.uuid,
                    tableName : tieUpSchool.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "TieUp School " + (tieUpSchool.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.tieUpSchoolListObject.next({result : "success"});
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });   
    }

    addTieUpSchool()
    {
        const dialogRef = this.modalService.open(TieUpSchoolAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editTieUpSchool(uuid : string)
    {
        let params = {
            "uuid" : uuid
        }
        const dialogRef = this.modalService.open(TieUpSchoolEditComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }

    detailTieUpSchool(uuid : string)
    {
        this.router.navigateByUrl("/business/tieUpSchool/detail/" + uuid);
    }

    deleteTieUpSchool(tieUpSchool : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete tie-up school?',
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
                uuid : tieUpSchool.uuid,
            }
            try
            {
                let response = await this.businessService.deleteTieUpSchool(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Tie-Up School Deleted.");
                    this.commonSharedService.tieUpSchoolListObject.next({result : "success"});
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
