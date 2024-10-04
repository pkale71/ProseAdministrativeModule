import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// third party
import Swal from 'sweetalert2';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { DataTablesModule } from 'angular-datatables';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SyllabusGradeCategoryAddComponent } from '../syllabus-grade-category-add/syllabus-grade-category-add.component';
import { id } from 'date-fns/locale';

@Component({
    selector: 'app-syllabus-detail',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './syllabus-detail.component.html',
    styleUrls: ['./syllabus-detail.component.scss']
})
export class SyllabusDetailComponent {
    searchClicked : boolean;
    id : number;
    syllabus : any;

    constructor(private notifier: NotifierService, 
        public commonSharedService : CommonSharedService,
        private commonService : CommonService,
        private modalService: NgbModal, 
        private location : Location, 
        private route: ActivatedRoute)
        {
            this.searchClicked = false;
            this.id = this.route.params['value'].id;
            this.getSyllabus(this.id);
        }

    ngOnInit() 
    {
    }

    public syllabusGradeCategoryAddResult:any = this.commonSharedService.syllabusGradeCategoryListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getSyllabus(this.id);
        }
    }) 

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getSyllabus(id : number) 
    {
        try
        {
            this.searchClicked = true;
            let response = await this.commonService.getSyllabus(id).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblSyllabusGradeCategory').DataTable().destroy();
                this.syllabus = response.syllabus;
                setTimeout(function(){
                $('#tblSyllabusGradeCategory').DataTable();
                },1000);        
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.syllabus = [];
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

    back()
    {
        this.location.back();
    }

    // syllabus grade category
    addSyllabusGradeCategory(id : number)
    {
        let params = {
            "id" : id,
            "gradeCategories" : this.syllabus.gradeCategories
        }
        const dialogRef = this.modalService.open(SyllabusGradeCategoryAddComponent, 
        { 
            size: 'lg', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = params;
    }

    // delete syllabus grade category
    deleteSyllabusGradeCategory(gradeCategory : any)
    {
        if(this.syllabus.gradeCategories.length > 1)
        {
            Swal.fire({
            customClass: {
                container: 'my-swal'
            },
            title: 'Confirmation',
            text: 'Are you sure to delete grade category?',
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
                        id : this.id,
                        gradeCategory : { "id" : gradeCategory.id }
                    }
                    try
                    {
                        let response = await this.commonService.deleteSyllabusGradeCategory(tempJson).toPromise();
                        if (response.status_code == 200 && response.message == 'success') 
                        {
                            this.showNotification("success", "Grade Category Deleted.");
                            this.commonSharedService.syllabusGradeCategoryListObject.next({result : "success"});
                        }
                    }
                    catch(e)
                    {
                        this.showNotification("error", e);
                    }
                }
            });
        }
        else
        {
            this.showNotification("info", "The Syllabus Must Specify Atleast One Grade Category");
        }
    }
}
