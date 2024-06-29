import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/theme/shared/service/business.service';



@Component({
  selector: 'app-business-vertical-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './business-vertical-add.component.html',
  styleUrls: ['./business-vertical-add.component.scss']
})
export class BusinessVerticalAddComponent 
{
  @Input() public modalParams;
  addBusinessVerticalForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  isCompulsories : any[];

  constructor(private businessService: BusinessService, 
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

    this.addBusinessVerticalForm = this.formbuilder.group({
      id:[''],
      name: ['',[Validators.required]],
    });  
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveBusinessVertical()
  {
    if(!this.saveClicked)
    {
      if(this.addBusinessVerticalForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.businessService.saveBusinessVertical(this.addBusinessVerticalForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Business Vertical Saved");
              this.commonSharedService.businessVerticalListObject.next({result : "success"});
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
