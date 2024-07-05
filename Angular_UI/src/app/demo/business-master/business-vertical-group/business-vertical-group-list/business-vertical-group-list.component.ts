import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';

// third party
import Swal from 'sweetalert2';
import { id } from 'date-fns/locale';
import { BusinessService } from 'src/app/theme/shared/service/business.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { BusinessVerticalGroupEditComponent } from '../business-vertical-group-edit/business-vertical-group-edit.component';
import { BusinessVerticalGroupAddComponent } from '../business-vertical-group-add/business-vertical-group-add.component';

@Component({
  selector: 'app-business-vertical-group-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './business-vertical-group-list.component.html',
  styleUrls: ['./business-vertical-group-list.component.scss']
})
export class BusinessVerticalGroupListComponent {
  searchClicked : boolean;
  businessVerticalGroups : any[];
  masterBusinessVerticalGroups : any[];
  businessVerticals : any[];
  businessVerticalForm : FormGroup;
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private businessService: BusinessService, 
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.businessVerticalGroups = [];
    
    this.businessVerticalForm = this.formbuilder.group({
      "businessVertical" : ['0']
    })

    this.getBusinessVerticals();
    this.getBusinessVerticalGroups(0,'All');
  }

  public businessVerticalGroupAddResult:any = this.commonSharedService.businessVerticalGroupListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getBusinessVerticalGroups(0,'All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  // get business vertical
  async getBusinessVerticals() 
  {  
    try
    {
      let response = await this.businessService.getBusinessVerticals('All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.businessVerticals = response.businessVerticals;
        this.businessVerticals.unshift({ id : '0', name : "All" });
      }
      else
      {
        this.businessVerticals = [];
        this.businessVerticals.unshift({ id : '0', name : "All" });
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  filterData()
  {
    let businessVerticalId : number = this.businessVerticalForm.get("businessVertical").value;
    if(!isNaN(businessVerticalId) && businessVerticalId > 0)
    {
      this.getBusinessVerticalGroups(businessVerticalId, 'All');
    }
    else
    {
      this.getBusinessVerticalGroups(businessVerticalId, 'All');
    }
  }

  async getBusinessVerticalGroups(businessVerticalId : number, action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.businessService.getBusinessVerticalGroups(businessVerticalId, 'All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblBusinessVerticalGroup').DataTable().destroy();
        this.masterBusinessVerticalGroups = response.businessVerticalGroups;
        this.businessVerticalGroups = this.masterBusinessVerticalGroups;
        setTimeout(function(){
          $('#tblBusinessVerticalGroup').DataTable();
        },800);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.businessVerticalGroups = [];
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

  addBusinessVertical()
  {
    const dialogRef = this.modalService.open(BusinessVerticalGroupAddComponent, 
    { 
      size: 'xl', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editBusinessVerticalGroup(businessVertical : any)
  {
    const dialogRef = this.modalService.open(BusinessVerticalGroupEditComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = businessVertical;
  }

  updateStatus(businessVerticalGroup : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (businessVerticalGroup.isActive == 1 ? 'de-active' : 'active') + ' the business vertical Group?',
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
            id : businessVerticalGroup.id,
            tableName : businessVerticalGroup.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Business Vertical Group Status Updated");
              this.commonSharedService.businessVerticalGroupListObject.next({
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

  deleteBusinessVerticalGroup(businessVerticalGroup : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete business vertical group?',
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
        let tempJSON = { "id" : businessVerticalGroup.id };
        try
        {
          let response = await this.businessService.deleteBusinessVerticalGroup(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Business Vertical Group Deleted.");
            this.commonSharedService.businessVerticalGroupListObject.next({result : "success"});
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
