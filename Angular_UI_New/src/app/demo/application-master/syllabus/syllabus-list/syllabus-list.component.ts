import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusAddComponent } from '../syllabus-add/syllabus-add.component';
declare var $;

// third party
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { id } from 'date-fns/locale';

@Component({
    selector: 'app-syllabus-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './syllabus-list.component.html',
    styleUrls: ['./syllabus-list.component.scss']
})
export class SyllabusListComponent
{
    syllabuses : any[];
    searchClicked : boolean;
    syllabus : any;
    id : number;

    constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    private formbuilder :FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
    {
    }

    ngOnInit() 
    {
        this.searchClicked = false;
        this.syllabuses = [];
        this.getSyllabuses('All');
    }

    public syllabusAddResult:any = this.commonSharedService.syllabusListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getSyllabuses('All');
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getSyllabuses(action : string) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.commonService.getSyllabuses('All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblSyllabus').DataTable().destroy();
                this.syllabuses = response.syllabuses;
                setTimeout(function(){
                $('#tblSyllabus').DataTable();
                },1000);        
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.syllabuses = [];  
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

    async getSyllabus(id : number) 
    {
        try
        {
            let response = await this.commonService.getSyllabus(id).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.syllabus = response.syllabus;
            }
            else
            {
                this.syllabus = [];  
            }
        }
        catch(e)
        {
            this.showNotification("error", e);  
        }
    }

    addSyllabus()
    {
        const dialogRef = this.modalService.open(SyllabusAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    detailSyllabus(id : number)
    {
        this.router.navigateByUrl("/academicMaster/syllabus/detail/" + id);
    }
        
    updateStatus(syllabus : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (syllabus.isActive == 1 ? 'de-active' : 'active') + ' the syllabus?',
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
                    id : syllabus.id,
                    tableName : syllabus.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Syllabus " + (syllabus.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.syllabusListObject.next({
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

    deleteSyllabus(syllabus : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete syllabus?',
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
            let tempJSON = { "id" : syllabus.id };
            try
            {
                let response = await this.commonService.deleteSyllabus(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Syllabus Deleted.");
                    this.commonSharedService.syllabusListObject.next({
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
