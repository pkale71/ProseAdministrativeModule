import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';
import { SchoolAddComponent } from '../school-add/school-add.component';
import { SchoolEditComponent } from '../school-edit/school-edit.component';

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent {
  schools : any[];
  searchClicked : boolean;

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private businessService: BusinessService, 
    private commonService : CommonService,
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
    }

    ngOnInit() 
    {
        this.searchClicked = false;
        this.schools = [];
        this.getSchools();
    }

    public schoolAddResult:any = this.commonSharedService.schoolListObject.subscribe(res =>{
      if(res.result == "success")
      {
          this.getSchools();
      }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getSchools() 
    {
        try 
        {
            this.searchClicked = true;
            let response = await this.businessService.getSchools('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblSchool').DataTable().destroy();
                this.schools = response.schools;
                setTimeout(function(){
                    $('#tblSchool').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.schools = [];
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
            this.searchClicked = false;
            this.modalService.dismissAll();
        }
    }

    addSchool()
    {
        const dialogRef = this.modalService.open(SchoolAddComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    editSchool(uuid : string, isExistDetail : number)
    {
        const dialogRef = this.modalService.open(SchoolEditComponent, 
        { 
            size: 'xl', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {
            "uuid" : uuid,
            "isExistDetail" : isExistDetail
        };
    }

    detailSchool(uuid : string)
    {
        this.router.navigateByUrl("/business/school/detail/" + uuid);
    }

    updateStatus(school : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (school.isActive == 1 ? 'de-active' : 'active') + ' the school?',
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
                    id : school.uuid,
                    tableName : school.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "School " + (school.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.schoolListObject.next({
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
    
    deleteSchool(school : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete school?',
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
            let tempJSON = { "uuid" : school.uuid };
            try
            {
                let response = await this.businessService.deleteSchool(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "School Deleted.");
                    this.commonSharedService.schoolListObject.next({result : "success"});
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
