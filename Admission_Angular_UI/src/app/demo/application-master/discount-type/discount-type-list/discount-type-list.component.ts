import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { DiscountTypeAddComponent } from '../discount-type-add/discount-type-add.component';
import { DiscountTypeEditComponent } from '../discount-type-edit/discount-type-edit.component';

@Component({
  selector: 'app-discount-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './discount-type-list.component.html',
  styleUrls: ['./discount-type-list.component.scss']
})
export class DiscountTypeListComponent 
{
  searchClicked : boolean;
  discountTypes : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.discountTypes = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getDiscountTypes('All');
  }

  public discountTypeAddResult:any = this.commonSharedService.discountTypeListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.getDiscountTypes('All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getDiscountTypes(action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.commonService.getDiscountTypes(action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblDiscountType').DataTable().destroy();
        this.discountTypes = response.discountTypes;
        setTimeout(function(){
          $('#tblDiscountType').DataTable();
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

  addDiscountType()
  {
    const dialogRef = this.modalService.open(DiscountTypeAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editDiscountType(discountType : any)
  {
    const dialogRef = this.modalService.open(DiscountTypeEditComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "discountType" : discountType
    };
  }

  updateStatus(discountType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (discountType.isActive == 1 ? 'De-Active' : 'Active') + ' The Discount Type?',
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
            id : discountType.id,
            tableName : discountType.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Discount Type " + (discountType.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.discountTypeListObject.next({
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

  deleteDiscountType(discountType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Discount Type?',
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
        let tempJSON = { "id" : discountType.id };
        try
        {
          let response = await this.commonService.deleteDiscountType(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Discount Type Deleted.");
            this.commonSharedService.discountTypeListObject.next({result : "success"});
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
