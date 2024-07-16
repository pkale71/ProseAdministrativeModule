// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-auth-reset-password-v2',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './auth-reset-password-v2.component.html',
  styleUrls: ['./auth-reset-password-v2.component.scss']
})
export default class AuthResetPasswordV2Component {
  // public method
  resetForm!: FormGroup;
  resetClicked : boolean = false;
  isValidForm : boolean = true;
  resetUrl : string;

  constructor(
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService : CommonService,
    private userService: UserService,
    public commonSharedService : CommonSharedService
  ) 
  {  
    this.resetUrl = commonSharedService.baseUrl + "/#/reset-link/";
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.required],
      resetUrl: [this.resetUrl, Validators.required]
    });
  }
  
  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async onSubmit()
  {
    if(!this.resetClicked)
    {
      if(this.resetForm.valid)
      {
        this.resetClicked = true;
        this.isValidForm = true;
        try
        {
          let response = await this.userService.sendResetLink(this.resetForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.resetClicked = false;
            this.showNotification("success", "Reset Link Sent To Registerd E-Mail");
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
          this.isValidForm = false;
          this.resetClicked = false;
        }
      }
      else
      {
        this.isValidForm = false;
        this.resetClicked = false;
      }
    }
  }
}
