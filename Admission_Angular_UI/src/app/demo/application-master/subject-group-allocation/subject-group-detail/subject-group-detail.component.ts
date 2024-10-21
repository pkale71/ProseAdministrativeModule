import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

import Swal from 'sweetalert2';
import { SubjectGroupAllocationAddComponent } from '../subject-group-allocation-add/subject-group-allocation-add.component';

@Component({
  selector: 'app-subject-group-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './subject-group-detail.component.html',
  styleUrls: ['./subject-group-detail.component.scss']
})
export class SubjectGroupDetailComponent 
{
  subjectGroupId : number;
  searchClicked : boolean;
  searchClickedSubjectGroupAllocation : boolean;
  subjectGroup : any;
  subjectGroupAllocations : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private location : Location, 
    private router : Router,
    private route: ActivatedRoute)
  {
    this.subjectGroupId = this.route.params['value'].id;
    this.searchClicked = false;
    this.searchClickedSubjectGroupAllocation = false;
  }

  ngOnInit() 
  {
    this.subjectGroupAllocations = [];
    this.getSubjectGroup(this.subjectGroupId);
    this.getSubjectGroupAllocations(this.subjectGroupId, 'All');
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  public subjectGroupAllocationResult:any = this.commonSharedService.subjectGroupAllocationListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.getSubjectGroupAllocations(this.subjectGroupId, 'All');
    }
  })

  async getSubjectGroup(id : number) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getSubjectGroup(id).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.subjectGroup = response.subjectGroup;
        this.searchClicked = false;
      }
      else
      {
        this.searchClicked = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  async getSubjectGroupAllocations(subjectGroupId : number, action : string) 
  {
    try
    {
      this.searchClickedSubjectGroupAllocation = true;
      let response = await this.commonService.getSubjectGroupAllocations(subjectGroupId, action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.subjectGroupAllocations = response.subjectGroupAllocations;
        this.searchClickedSubjectGroupAllocation = false;
      }
      else
      {
        this.subjectGroupAllocations = [];
        this.searchClickedSubjectGroupAllocation = false;
      }
    }
    catch(e)
    {
      this.subjectGroupAllocations = [];
      this.showNotification("error", e);
      this.searchClickedSubjectGroupAllocation = false;
    }
  }

  updateStatus(subjectGroup : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (subjectGroup.isActive == 1 ? 'De-Active' : 'Active') + ' The Subject Allocation?',
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
            id : subjectGroup.id,
            tableName : subjectGroup.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Subject Allocation " + (subjectGroup.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.subjectGroupAllocationListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }

  deleteSubjectGroupAllocation(subjectGroupAllocation : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Subject Allocation?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
        
      } 
      else 
      {
        this.showNotification("info", "Please Wait...");
        let tempJSON = { "subjectGroup" : {"id" : this.subjectGroupId},
          "id" : subjectGroupAllocation.id 
        };
        try
        {
          let response = await this.commonService.deleteSubjectGroupAllocation(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Subject Allocation Deleted.");
            this.commonSharedService.subjectGroupAllocationListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });
  }

  allocateSubjects()
  {
    const dialogRef = this.modalService.open(SubjectGroupAllocationAddComponent, 
      { 
        size: 'xl', backdrop: 'static' 
      });
      dialogRef.componentInstance.modalParams = {
        "subjectGroup" : this.subjectGroup,
        "allocatedSubjects" : this.subjectGroupAllocations
      };
  }

  back()
  {
    this.location.back();
  }
}
