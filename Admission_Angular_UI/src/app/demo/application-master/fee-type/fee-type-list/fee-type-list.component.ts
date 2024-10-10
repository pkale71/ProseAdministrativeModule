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
import { FeeTypeAddComponent } from '../fee-type-add/fee-type-add.component';
import { FeeTypeEditComponent } from '../fee-type-edit/fee-type-edit.component';

@Component({
  selector: 'app-fee-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './fee-type-list.component.html',
  styleUrls: ['./fee-type-list.component.scss']
})
export class FeeTypeListComponent 
{
  searchClicked : boolean;
  feeTypes : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.feeTypes = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getFeeTypes('All');
  }

  public feeTypeAddResult:any = this.commonSharedService.feeTypeListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.getFeeTypes('All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getFeeTypes(action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.commonService.getFeeTypes(action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblFeeType').DataTable().destroy();
        this.feeTypes = response.feeTypes;
        setTimeout(function(){
          $('#tblFeeType').DataTable();
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

  addFeeType()
  {
    const dialogRef = this.modalService.open(FeeTypeAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editFeeType(feeType : any)
  {
    const dialogRef = this.modalService.open(FeeTypeEditComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "feeType" : feeType
    };
  }

  updateStatus(feeType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (feeType.isActive == 1 ? 'De-Active' : 'Active') + ' The Fee Type?',
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
            id : feeType.id,
            tableName : feeType.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Fee Type " + (feeType.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.feeTypeListObject.next({
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

  deleteFeeType(feeType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Fee Type?',
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
        let tempJSON = { "id" : feeType.id };
        try
        {
          let response = await this.commonService.deleteFeeType(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Fee Type Deleted.");
            this.commonSharedService.feeTypeListObject.next({result : "success"});
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
