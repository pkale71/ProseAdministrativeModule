import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-fee-type-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './fee-type-edit.component.html',
  styleUrls: ['./fee-type-edit.component.scss']
})
export class FeeTypeEditComponent 
{
  @Input() public modalParams;
  editFeeTypeForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

  constructor(
    private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.editFeeTypeForm = this.formbuilder.group({
      id:[''],
      name: ['',[Validators.required]]
    });  

    this.editFeeTypeForm.patchValue(this.modalParams.feeType);
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveFeeType()
  {
    if(!this.saveClicked)
    {
      if(this.editFeeTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.commonService.updateFeeType(this.editFeeTypeForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Fee Type Saved");
              this.commonSharedService.feeTypeListObject.next({result : "success"});
              this.closeModal();
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.isValidForm = false;
          this.saveClicked = false;
        }
      }
      else
      {
        this.isValidForm = false;
        this.saveClicked = false;
      }
    }
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
