import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

// third party
import Swal from 'sweetalert2';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fee-structure-detail',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './fee-structure-detail.component.html',
  styleUrls: ['./fee-structure-detail.component.scss']
})
export class FeeStructureDetailComponent 
{
  uuid : string;
  feeStructure : any;
  feeInstallments : any[];
  feeStructureFeeTypes : any[];
  feeStructureDiscountTypes : any[];
  feeStructureTotals : any[];
  searchClicked : boolean;

  constructor(private notifier: NotifierService, 
  public commonSharedService : CommonSharedService,
  private commonService : CommonService,
  private modalService: NgbModal, 
  private location : Location, 
  private route: ActivatedRoute)
  {
      this.uuid = this.route.params['value'].uuid;
      this.searchClicked = false;
      this.feeInstallments = [];
      this.feeStructureFeeTypes = [];
      this.feeStructureDiscountTypes = [];
      this.feeStructureTotals = [];
      this.getFeeStructure(this.uuid);
  }

  ngOnInit() 
  {
  }

  showNotification(type: string, message: string): void 
  {
      //type : default, info, success, warning, error
      this.notifier.notify(type, message);
  }

  async getFeeStructure(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.commonService.getFeeStructure(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.feeStructure = response.feeStructure;
        this.feeInstallments = this.feeStructure?.feeInstallments;
        this.feeStructureFeeTypes = this.feeStructure?.feeTypes;
        this.feeStructureDiscountTypes = this.feeStructure?.discountTypes;
        this.feeStructureTotals = this.feeStructure?.totals;
        this.searchClicked = false;
    }
    else
    {
        this.feeStructure = [];
        this.searchClicked = false;
    }
  }

  back()
  {
      this.location.back();
  }
}
