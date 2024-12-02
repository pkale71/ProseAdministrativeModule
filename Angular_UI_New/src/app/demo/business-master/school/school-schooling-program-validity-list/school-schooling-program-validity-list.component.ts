import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';
import { NotifierService } from 'angular-notifier';
import { SchoolSchoolingProgramDetailComponent } from '../school-schooling-program-detail/school-schooling-program-detail.component';
import { SchoolSchoolingProgramEditComponent } from '../school-schooling-program-edit/school-schooling-program-edit.component';

@Component({
  selector: 'app-school-schooling-program-validity-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './school-schooling-program-validity-list.component.html',
  styleUrls: ['./school-schooling-program-validity-list.component.scss']
})
export class SchoolSchoolingProgramValidityListComponent {
  @Input() public modalParams;
  schoolUUID : string;
  schoolSchoolingProgram : any;
  schoolingProgramDetails : any[];
  searchClicked : boolean;

  constructor(private notifier: NotifierService, 
  private activatedRoute: ActivatedRoute,
  private modalService: NgbModal,
  private activeModal: NgbActiveModal,
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
      this.schoolingProgramDetails = [];
      this.schoolUUID = this.modalParams.schoolUUID;
      this.schoolSchoolingProgram = this.modalParams.schoolSchoolingProgram;
      this.getSchoolingProgramDetails(this.schoolUUID, this.schoolSchoolingProgram?.id);
  }

  public schoolSchoolingProgramDetailListAddResult:any = this.commonSharedService.schoolSchoolingProgramDetailListObject.subscribe(res =>{
    if(res.result == "success")
    {
        this.getSchoolingProgramDetails(this.schoolUUID, this.schoolSchoolingProgram?.id);
    }
  })

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  async getSchoolingProgramDetails(schoolUUID : string, schoolSchoolingProgramId : number) 
  {
      try 
      {
        if(schoolUUID != "" && schoolSchoolingProgramId > 0)
        {
          this.searchClicked = true;
          let response = await this.businessService.getSchoolSchoolingProgramValidities(schoolUUID, schoolSchoolingProgramId, 'All').toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              $('#tblSchoolingProgramDetail').DataTable().destroy();
              this.schoolingProgramDetails = response.schoolSchoolingProgramValidities;
              setTimeout(function(){
                  $('#tblSchoolingProgramDetail').DataTable();
              },800);
              this.searchClicked = false;
          }
          else
          {
              this.schoolingProgramDetails = [];
              this.searchClicked = false;
          }
        }
        else
        {
          this.schoolingProgramDetails = [];
        }
      } 
      catch (error) 
      {
          this.showNotification("error", error);
          this.searchClicked = false;
          this.modalService.dismissAll();
      }
  }

  deleteSchoolingProgramDetail(schoolingProgramDetail : any)
  {
    Swal.fire({
    customClass: {
        container: 'my-swal'
    },
    title: 'Confirmation',
    text: 'Are you sure to schooling program validity?',
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
        let tempJSON = { "id" : schoolingProgramDetail.id };
        try
        {
            let response = await this.businessService.deleteSchoolSchoolingProgramValidity(tempJSON).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.showNotification("success", "Schooling Program Validity Deleted.");
                this.commonSharedService.schoolSchoolingProgramDetailListObject.next({result : "success"});
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }
    });
  }

  editSchoolingProgramDetail(schoolingProgramDetail : any)
  {
    const dialogRef = this.modalService.open(SchoolSchoolingProgramEditComponent, 
      { 
          size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = {
        "schoolUUID" : this.schoolUUID,
        "schoolSchoolingProgram" : this.schoolSchoolingProgram,
        "schoolingProgramDetail" : schoolingProgramDetail
      };
  }

  detailSchoolingProgramBatches(schoolingProgramDetail : any)
  {
    const dialogRef = this.modalService.open(SchoolSchoolingProgramDetailComponent, 
    { 
        size: 'lg', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "schoolingProgramDetail" : schoolingProgramDetail
    };
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
