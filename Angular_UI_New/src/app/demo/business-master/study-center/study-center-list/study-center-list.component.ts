import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { StudyCenterEditComponent } from '../study-center-edit/study-center-edit.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { StudyCenterDetailComponent } from '../study-center-detail/study-center-detail.component';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { StudyCenterAddComponent } from '../study-center-add/study-center-add.component';

@Component({
    selector: 'app-study-center-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './study-center-list.component.html',
    styleUrls: ['./study-center-list.component.scss']
})
export class StudyCenterListComponent 
{
    studyCenters : any[];
    masterStudyCenters : any[];
    searchClicked : boolean;
    studyCenterTypes : any[];
    studyCenterType : any;
    id : number;
    studyCenterTypeForm : FormGroup;
    studyCenter : any;
    uuid : string;
        
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
        this.studyCenterTypes = [];
        this.studyCenters = [];
        this.masterStudyCenters = [];

        this.studyCenterTypeForm = this.formbuilder.group({
            'studyCenterType' : ['0']
        });
        this.getStudyCenterTypes();
        this.getStudyCenters("");
    }

    public studyCenterAddResult:any = this.commonSharedService.studyCenterListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getStudyCenters('');
        }
    }) 

    //get study center types 
    async getStudyCenterTypes()
    {
        try 
        {
            let response = await this.businessService.getStudyCenterTypes().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.studyCenterTypes = response.studyCenterTypes;
                this.studyCenterTypes.unshift({ id : "0", name : "All"});
            }
            else
            {
                this.studyCenterTypes = [];
                this.studyCenterTypes.unshift({ id : "0", name : "All"});
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
        }
    }

    //get study center types 
    //  async getStudyCenterType(id : number)
    //  {
    //    try 
    //    {
    //      let response = await this.businessService.getStudyCenterType(id).toPromise();
    //      if (response.status_code == 200 && response.message == 'success') 
    //      {
    //        this.studyCenterType = response.studyCenterType;
    //        this.studyCenterType.unshift({ id : "0", name : "All"});
    //      }
    //      else
    //      {
    //        this.studyCenterTypes = [];
    //        this.studyCenterType.unshift({ id : "0", name : "All"});
    //      }
    //    } 
    //    catch (error) 
    //    {
    //      this.showNotification("error", error);
    //    }
    //  }


    // get study center with study center type id
    async getStudyCenters(studyCenterTypeId : any) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.businessService.getStudyCenters(studyCenterTypeId, "All").toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblStudyCenter').DataTable().destroy();
                this.masterStudyCenters = response.studyCenters;
                this.studyCenters = this.masterStudyCenters;
                setTimeout(function(){
                $('#tblStudyCenter').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.studyCenters = [];
                this.searchClicked = false;
            } 
        }
        catch(e)
        {
            this.showNotification("error", e);
            this.searchClicked = false;
        }
    }

    // get study center with uuid
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

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    updateStatus(studyCenter : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (studyCenter.isActive == 1 ? 'de-active' : 'active') + ' the study center?',
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
                    id : studyCenter.uuid,
                    tableName : studyCenter.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    let studyCenterType = studyCenter?.studyCenterType?.name;
                    this.showNotification("success", studyCenterType  + " " + (studyCenter.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.studyCenterListObject.next({result : "success"});
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });   
    }

    addStudyCenterType(id : number)
    {
        this.router.navigateByUrl("/business/studyCenter/add/" + id);
    }

    editStudyCenter(uuid : string)
    {
        let params = {
            "uuid" : uuid
        }
        const dialogRef = this.modalService.open(StudyCenterEditComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }

    detailStudyCenter(uuid : string)
    {
        this.router.navigateByUrl("/business/studyCenter/detail/" + uuid);
    }

    deleteStudyCenter(studyCenter : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete study center?',
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
                uuid : studyCenter.uuid,
            }
            try
            {
                let response = await this.businessService.deleteStudyCenter(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    let studyCenterType = studyCenter?.studyCenterType?.name;
                    this.showNotification("success", studyCenterType + " " + "Deleted.");
                    this.commonSharedService.studyCenterListObject.next({result : "success"});
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
