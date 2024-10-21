import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-fee-category-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './fee-category-add.component.html',
  styleUrls: ['./fee-category-add.component.scss']
})
export class FeeCategoryAddComponent 
{
  addFeeCategoryForm: FormGroup;
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

    this.addFeeCategoryForm = this.formbuilder.group({
      id:[''],
      availingInstallment:['', [Validators.required]],
      name: ['', [Validators.required]]
    });  
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveFeeCategory()
  {
    if(!this.saveClicked)
    {
      if(this.addFeeCategoryForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.commonService.saveFeeCategory(this.addFeeCategoryForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Fee Category Saved");
              this.commonSharedService.feeCategoryListObject.next({result : "success"});
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
