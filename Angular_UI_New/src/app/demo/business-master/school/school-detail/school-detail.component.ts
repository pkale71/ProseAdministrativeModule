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
import { SchoolSchoolingProgramDetailComponent } from '../school-schooling-program-detail/school-schooling-program-detail.component';
import { SchoolSchoolingProgramAddComponent } from '../school-schooling-program-add/school-schooling-program-add.component';
import { SchoolSchoolingProgramEditComponent } from '../school-schooling-program-edit/school-schooling-program-edit.component';

@Component({
  selector: 'app-school-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './school-detail.component.html',
  styleUrls: ['./school-detail.component.scss']
})
export class SchoolDetailComponent {
  searchClicked : boolean;
  uuid : string;
  school : any;
  schoolSchoolingPrograms : any = [];
  logoBase64 : any;

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
      this.getSchool(this.uuid);
      this.getSchoolSchoolingPrograms(this.uuid);
      this.getSchoolLogo(this.uuid);
  }

  ngOnInit() 
  {
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  public SchoolSchoolingProgramAddResult:any = this.commonSharedService.schoolSchoolingProgramListObject.subscribe(res =>{
      if(res.result == "success")
      {
          this.getSchoolSchoolingPrograms(this.uuid);
      }
  })

  async getSchool(uuid : string) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.businessService.getSchool(uuid).toPromise(); 
      if (response.status_code == 200 && response.message == 'success') 
      {
          this.school = response.school;
          this.searchClicked = false;
      }
      else
      {
          this.school = [];
          this.searchClicked = false;
      }
    }
    catch(e)
    {
      this.searchClicked = false;
    } 
  }

  // get tie-up school contract history
  async getSchoolLogo(uuid : string) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.businessService.getSchoolLogo(uuid).toPromise(); 
      if (response.status_code == 200 && response.message == 'success') 
      {
          this.logoBase64 = response.fileData;
          this.searchClicked = false;
      }
      else
      {
          this.logoBase64 = "";
          this.searchClicked = false;
      }
    }
    catch(e)
    {
      this.logoBase64 = "";
      this.searchClicked = false;
    }    
  }

  // get tie-up school documents
  async getSchoolSchoolingPrograms(uuid : string) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.businessService.getSchoolSchoolingPrograms(uuid, 'All').toPromise(); 
      if (response.status_code == 200 && response.message == 'success') 
      {
          this.schoolSchoolingPrograms = response.schoolSchoolingPrograms;
          this.searchClicked = false;
      }
      else
      {
          this.schoolSchoolingPrograms = [];
          this.searchClicked = false;
      }
    }
    catch(e)
    {
      this.searchClicked = false;
    }     
  }

  // school schooling program
  updateStatus(schoolSchoolingProgram : any)
  {
    Swal.fire({
    customClass: {
        container: 'my-swal'
    },
    title: 'Confirmation',
    text: 'Are you sure to ' + (schoolSchoolingProgram.isActive == 1 ? 'de-active' : 'active') + ' the schooling program?',
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
                id : schoolSchoolingProgram.uuid,
                tableName : schoolSchoolingProgram.tableName
            }
            this.showNotification("info", "Please wait...");
            let response = await this.commonService.updateStatus(tempJson).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.showNotification("success", "Schooling Program " + (schoolSchoolingProgram.isActive == 1 ? 'De-activated' : 'Activated'));
                this.commonSharedService.schoolSchoolingProgramListObject.next({result : "success"});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
      }
    });   
  }

  addSchollingProgram(schoolUUID : string, schoolingCategoryId : number)
  {
    const dialogRef = this.modalService.open(SchoolSchoolingProgramAddComponent, 
    { 
        size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "schoolUUID" : schoolUUID,
      "schoolingCategoryId" : schoolingCategoryId
    };
  }

  editSchoolSchoolingProgram(schoolSchoolingProgram : any, schoolingCategoryId : number)
  {
    const dialogRef = this.modalService.open(SchoolSchoolingProgramEditComponent, 
    { 
        size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "schoolSchoolingProgram" : schoolSchoolingProgram,
      "schoolingCategoryId" : schoolingCategoryId
    };
  }

  detailSchoolSchoolingProgram(schoolSchoolingProgram : any)
  {
    const dialogRef = this.modalService.open(SchoolSchoolingProgramDetailComponent, 
    { 
        size: 'lg', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "schoolSchoolingProgram" : schoolSchoolingProgram
    };
  }

  deleteSchoolingProgram(uuid : string)
  {
    Swal.fire({
    customClass: {
        container: 'my-swal'
    },
    title: 'Confirmation',
    text: 'Are you sure to delete schooling program?',
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
          let tempJSON = { "uuid" : uuid };
          try
          {
              let response = await this.businessService.deleteSchoolSchoolingProgram(tempJSON).toPromise();
              if (response.status_code == 200 && response.message == 'success') 
              {
                  this.showNotification("success", "Schooling Program Deleted.");
                  this.commonSharedService.schoolSchoolingProgramListObject.next({result : "success"});
              }
          }
          catch(e)
          {
              this.showNotification("error", e);
          }
      }
    });
  }

  back()
  {
    this.location.back();
  }
}
