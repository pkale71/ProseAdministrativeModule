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
import { FeeCategoryAddComponent } from '../fee-category-add/fee-category-add.component';
import { FeeCategoryEditComponent } from '../fee-category-edit/fee-category-edit.component';

@Component({
  selector: 'app-fee-category-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './fee-category-list.component.html',
  styleUrls: ['./fee-category-list.component.scss']
})
export class FeeCategoryListComponent 
{
  searchClicked : boolean;
  feeCategories : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.feeCategories = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getFeeCategories('All');
  }

  public feeCategoryAddResult:any = this.commonSharedService.feeCategoryListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.getFeeCategories('All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getFeeCategories(action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.commonService.getFeeCategories(action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblFeeCategory').DataTable().destroy();
        this.feeCategories = response.feeCategories;
        setTimeout(function(){
          $('#tblFeeCategory').DataTable();
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

  addFeeCategory()
  {
    const dialogRef = this.modalService.open(FeeCategoryAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editFeeCategory(feeCategory : any)
  {
    const dialogRef = this.modalService.open(FeeCategoryEditComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "feeCategory" : feeCategory
    };
  }

  updateStatus(feeCategory : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (feeCategory.isActive == 1 ? 'De-Active' : 'Active') + ' The Fee Category?',
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
            id : feeCategory.id,
            tableName : feeCategory.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Fee Category " + (feeCategory.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.feeCategoryListObject.next({
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

  deleteFeeCategory(feeCategory : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Fee Category?',
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
        let tempJSON = { "id" : feeCategory.id };
        try
        {
          let response = await this.commonService.deleteFeeCategory(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Fee Category Deleted.");
            this.commonSharedService.feeCategoryListObject.next({result : "success"});
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
