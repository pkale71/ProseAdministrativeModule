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
import { TaxTypeAddComponent } from '../tax-type-add/tax-type-add.component';
import { TaxTypeEditComponent } from '../tax-type-edit/tax-type-edit.component';

@Component({
  selector: 'app-tax-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './tax-type-list.component.html',
  styleUrls: ['./tax-type-list.component.scss']
})
export class TaxTypeListComponent 
{
  searchClicked : boolean;
  taxTypes : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.taxTypes = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.getTaxTypes('All');
  }

  public taxTypeAddResult:any = this.commonSharedService.taxTypeListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.getTaxTypes('All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getTaxTypes(action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.commonService.getTaxTypes(action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblTaxType').DataTable().destroy();
        this.taxTypes = response.taxTypes;
        setTimeout(function(){
          $('#tblTaxType').DataTable();
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

  addTaxType()
  {
    const dialogRef = this.modalService.open(TaxTypeAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editTaxType(taxType : any)
  {
    const dialogRef = this.modalService.open(TaxTypeEditComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "taxType" : taxType
    };
  }

  updateStatus(taxType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (taxType.isActive == 1 ? 'De-Active' : 'Active') + ' The Tax Type?',
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
            id : taxType.id,
            tableName : taxType.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Tax Type " + (taxType.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.taxTypeListObject.next({
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

  deleteTaxType(taxType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Tax Type?',
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
        let tempJSON = { "id" : taxType.id };
        try
        {
          let response = await this.commonService.deleteTaxType(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Tax Type Deleted.");
            this.commonSharedService.taxTypeListObject.next({result : "success"});
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
