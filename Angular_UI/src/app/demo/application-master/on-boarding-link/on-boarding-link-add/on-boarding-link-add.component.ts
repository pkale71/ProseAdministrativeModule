import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/theme/shared/service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
  selector: 'app-on-boarding-link-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './on-boarding-link-add.component.html',
  styleUrls: ['./on-boarding-link-add.component.scss']
})
export class OnBoardingLinkAddComponent {
  @Input() public modalParams;
  onBoardingLinkForm: FormGroup;
  isValidForm: boolean;
  saveClicked: boolean;

  constructor(private userService: UserService,
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService: CommonSharedService,
    private commonService: CommonService,
    private router: Router) {
  }

  ngOnInit() {
    this.isValidForm = true;
    this.saveClicked = false;

    this.onBoardingLinkForm = this.formbuilder.group({
      id: [''], email : ['',[Validators.required, Validators.email]],
      mobile: ['',[Validators.required, Validators.pattern('^[0-9]{10,10}'), Validators.maxLength(10), Validators.minLength(10)]]
    });
  }

  showNotification(type: string, message: string): void {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async checkDuplicateEmailMobile(checkFor : string, value : string) 
  {
    if(value != "")
    {
      let data = {
            "checkFor" : checkFor,
            "value" : value,
            "uuid"  :  ""
      }
      try
      {
        let response = await this.commonService.duplicateEmailMobile(data).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
        }
      }
      catch(e)
      {
        this.showNotification("error", e);
        
        if(checkFor == "Email")
        {
          this.onBoardingLinkForm.get("email").setValue("");
        }
        else if(checkFor == "Mobile")
        {
          this.onBoardingLinkForm.get("mobile").setValue("");
        }
      }
    }
  }


  async saveOnBoardingLink() 
  {
    if (!this.saveClicked) 
      {
      if (this.onBoardingLinkForm.valid) 
      {
        this.isValidForm = true;
        this.saveClicked = true;

        try 
        {
          let response = await this.userService.saveOnBoardingLink(this.onBoardingLinkForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User OnBoarding successfully Saved");
            this.commonSharedService.onBoardingLinkListObject.next({ result: "success" });
            this.closeModal();
          }
        }
        catch (e)
        {
          this.showNotification("error", e);
          this.isValidForm = false;
          this.saveClicked = false;
        }
      }
      else {
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
