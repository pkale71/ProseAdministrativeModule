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
import { BusinessVerticalEditComponent } from '../business-vertical-edit/business-vertical-edit.component';
import { BusinessVerticalAddComponent } from '../business-vertical-add/business-vertical-add.component';

@Component({
  selector: 'app-business-vertical-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './business-vertical-list.component.html',
  styleUrls: ['./business-vertical-list.component.scss']
})
export class BusinessVerticalListComponent {
  searchClicked : boolean;
  businessVerticals : any[];
  masterBusinessVerticals : any[];
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private businessService: BusinessService, 
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
      this.businessVerticals = [];
      this.masterBusinessVerticals = [];
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getBusinessVerticals('All');
  }

  public academyEnclosureDocumentAddResult:any = this.commonSharedService.businessVerticalListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getBusinessVerticals('All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getBusinessVerticals(action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.businessService.getBusinessVerticals('All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
        {
          $('#tblBusinessVertical').DataTable().destroy();
          this.masterBusinessVerticals = response.businessVerticals;
          this.businessVerticals = this.masterBusinessVerticals;
          setTimeout(function(){
            $('#tblBusinessVertical').DataTable();
          },1000);
          this.searchClicked = false;
          this.modalService.dismissAll();
        }
        else
        {
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
    const dialogRef = this.modalService.open(BusinessVerticalAddComponent, 
    { 
      size: 'sm', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editBusinessVertical(businessVertical : any)
  {
    const dialogRef = this.modalService.open(BusinessVerticalEditComponent, 
    { 
      size: 'sm', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = businessVertical;
  }

  updateStatus(businessVertical : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (businessVertical.isActive == 1 ? 'de-active' : 'active') + ' the business vertical?',
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
            id : businessVertical.id,
            tableName : businessVertical.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Business Vertical Status Updated");
              this.commonSharedService.businessVerticalListObject.next({
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

  deleteBusinessVertical(businessVertical : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete business vertical?',
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
        let tempJSON = { "id" : businessVertical.id };
        try
        {
          let response = await this.businessService.deleteBusinessVertical(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Business Vertical Deleted.");
            this.commonSharedService.businessVerticalListObject.next({result : "success"});
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
