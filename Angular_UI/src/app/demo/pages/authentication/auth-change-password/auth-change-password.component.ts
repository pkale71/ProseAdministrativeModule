// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/theme/shared/service';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

@Component({
  selector: 'app-auth-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './auth-change-password.component.html',
  styleUrls: ['./auth-change-password.component.scss']
})
export default class AuthChangePasswordComponent {
  resetLinkForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  codeValidated : boolean;
  showSpinner : string;
  classSetting : string;
  message : string;
  code : string;

  constructor(
    private userService: UserService, 
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    public commonSharedService : CommonSharedService) 
  {
    this.code = "";
    this.codeValidated = false;
    this.code = this.activatedRoute.snapshot.paramMap.get("code");
    this.showSpinner = "fa fa-spin fa-spinner";
    this.classSetting = "text-info";
    this.message = 'Verifying Link....';
    this.getResetLinkData();
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.resetLinkForm = this.formbuilder.group({
      email:['', [Validators.required]],
      newPassword: ['',[Validators.required,Validators.minLength(6)]],
      reTypeNewPassword: ['', [Validators.required,Validators.minLength(6)]],
    },{ 
      validator: this.commonSharedService.confirmPasswordValidator('newPassword', 'reTypeNewPassword')
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getResetLinkData()
  {
    if(this.code != "")
    {
      try
      {
        let response = await this.userService.getResetLinkData(this.code).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.resetLinkForm.get("email").setValue(response.data.email);
          this.codeValidated = true;
          this.message = "";
          this.showSpinner = "";
          this.classSetting = "";
        }
      }
      catch(e)
      {
        this.message = e;
        this.codeValidated = false;
        this.showSpinner = "fa fa-link";
        this.classSetting = "text-danger";
      }
    }
    else
    {
      this.message = "Link Expired";
      this.classSetting = "text-danger";
      this.codeValidated = false;
      this.showSpinner = "fa fa-link";
    }
  }

  async resetPassword()
  {
    if(!this.saveClicked)
    {
      if(this.resetLinkForm.valid)
      {
        this.saveClicked = true;
        this.isValidForm = true;
        try
        {
          let response = await this.userService.resetPassword(this.resetLinkForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.saveClicked = false;
            this.codeValidated = false;
            this.showSpinner = "fa fa-check";
            this.message = "Password Reset Successfully";
            this.classSetting = "text-success";
          }
        }
        catch(e)
        {
          this.message = e;
          this.codeValidated = false;
          this.showSpinner = "fa fa-link";
          this.classSetting = "text-danger";
          this.isValidForm = false;
          this.saveClicked = false;
        }
      }
      else
      {
        this.isValidForm = false;
      }
    }
  }
}
