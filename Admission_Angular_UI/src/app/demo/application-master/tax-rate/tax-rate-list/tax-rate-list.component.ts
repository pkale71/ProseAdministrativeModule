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
import { TaxRateAddComponent } from '../tax-rate-add/tax-rate-add.component';
import { TaxRateEditComponent } from '../tax-rate-edit/tax-rate-edit.component';

@Component({
  selector: 'app-tax-rate-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './tax-rate-list.component.html',
  styleUrls: ['./tax-rate-list.component.scss']
})
export class TaxRateListComponent 
{
  taxTypeForm : FormGroup;
  academicSessionForm : FormGroup;
  searchClicked : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedTaxType : boolean;
  taxTypes : any[];
  academicSessions : any[];
  taxRates : any[];

  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
  {
    this.academicSessions = [];
    this.taxTypes = [];
    this.taxRates = [];
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.searchClickedAcademicSession = false;
    this.searchClickedTaxType = false;

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['0']
    });

    this.taxTypeForm = this.formbuilder.group({
      taxType:['0']
    });

    this.getAcademicSessions();
    this.getTaxTypes('All');
    this.getTaxRates(0, 0, 'All');
  }

  public taxRateAddResult:any = this.commonSharedService.taxRateListObject.subscribe(res =>
  {
    if(res.result == "success")
    {
      this.filterData();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicSessions() 
  {  
    try
    {
      this.searchClickedAcademicSession = true;  
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = response.academicSessions;
        this.searchClickedAcademicSession = false;
        this.academicSessions.unshift({"id" : "0", "year" : "All"});
      }
      else
      {
        this.academicSessions = [];
        this.searchClickedAcademicSession = false;
      }
    }
    catch(e)
    {
      this.academicSessions = [];
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
    }
  }

  async getTaxTypes(action : string) 
  {  
    try
    {
      this.searchClickedTaxType = true;  
      let response = await this.commonService.getTaxTypes(action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.taxTypes = response.taxTypes;
        this.searchClickedTaxType = false;
        this.taxTypes.unshift({"id" : "0", "name" : "All"});
      }
      else
      {
        this.taxTypes = [];
        this.searchClickedTaxType = false;
      }
    }
    catch(e)
    {
      this.taxTypes = [];
      this.showNotification("error", e);
      this.searchClickedTaxType = false;
    }
  }

  async getTaxRates(academicSessionId : number, taxTypeId : number, action : string) 
  {  
    try
    {
      this.searchClicked = true;  
      let response = await this.commonService.getTaxRates(academicSessionId, taxTypeId, action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblTaxRate').DataTable().destroy();
        this.taxRates = response.taxRates;
        setTimeout(function(){
          $('#tblTaxRate').DataTable();
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

  filterData()
  {
    let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
    let taxTypeId : number = this.taxTypeForm.get("taxType").value;
    this.getTaxRates(academicSessionId, taxTypeId, 'All');
  }

  addTaxRate()
  {
    const dialogRef = this.modalService.open(TaxRateAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  editTaxRate(taxRate : any)
  {
    const dialogRef = this.modalService.open(TaxRateEditComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {
      "taxRate" : taxRate
    };
  }

  updateStatus(taxRate : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To ' + (taxRate.isActive == 1 ? 'De-Active' : 'Active') + ' The Tax Rate?',
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
            id : taxRate.id,
            tableName : taxRate.tableName
          }
          this.showNotification("info", "Please Wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Tax Rate " + (taxRate.isActive == 1 ? 'De-Activated' : 'Activated'));
              this.commonSharedService.taxRateListObject.next({
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

  deleteTaxRate(taxRate : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are You Sure To Delete Tax Rate?',
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
        let tempJSON = { "id" : taxRate.id };
        try
        {
          let response = await this.commonService.deleteTaxRate(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Tax Rate Deleted.");
            this.commonSharedService.taxRateListObject.next({result : "success"});
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
