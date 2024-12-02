// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

@Component({
    selector: 'app-auth-signin-v2',
    standalone: true,
    imports: [CommonModule, RouterModule, SharedModule],
    templateUrl: './auth-signin-v2.component.html',
    styleUrls: ['./auth-signin-v2.component.scss']
})
export default class AuthSigninV2Component implements OnInit {
     // public method
    loginForm!: FormGroup;
    uuid : string;
    moduleId : number;
    error = '';
    signinClicked : boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private commonService : CommonService,
        private userService: UserService,
        public commonSharedService : CommonSharedService
    ) 
    {  
        localStorage.clear();
        this.uuid = this.route.params['value'].uuid;
        this.moduleId = this.route.params['value'].moduleId;
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            uuid: [this.uuid, Validators.required],
            moduleId: [this.moduleId, Validators.required]
        });
        this.onSubmit();
    }

    async onSubmit() 
    {
        if (this.loginForm.invalid) 
        {
            return;
        }
        this.error = '';
        try
        {
            this.signinClicked = true;
            let response1 = await this.commonService.getAppBase(this.moduleId).toPromise();
            if (response1.status_code == 200 && response1.message == 'success') 
            {
                this.commonSharedService.adminBaseUrl = response1.appBase.uiUrl;
                
                if(this.commonSharedService.adminBaseUrl != "")
                {
                    let response = await this.userService.authenticateUser(this.loginForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        if(response.authData)
                        {
                            localStorage.setItem("user", JSON.stringify(response.authData));                    
                            this.commonSharedService.loginUser = response.authData;
                            this.signinClicked = false;
                        
                            if(this.commonSharedService.loginUser?.userModule?.userType?.code == "ADMGN" || this.commonSharedService.loginUser?.userModule?.userType?.code == "ADMTM")
                            {
                                this.router.navigate(['/dashboard/default']);
                            }
                            else
                            {
                                this.commonSharedService.loginUser = "";
                                this.commonSharedService.adminBaseUrl = "";
                                this.error = "Unauthorised User For This Module";
                                this.signinClicked = false;
                            }
                        }
                        else
                        {
                            this.commonSharedService.loginUser = "";
                            this.commonSharedService.adminBaseUrl = "";
                            this.error = "User Not Verified";
                            this.signinClicked = false;
                        }
                    }
                    else
                    {
                        this.commonSharedService.loginUser = "";
                        this.commonSharedService.adminBaseUrl = "";
                        this.error = "User Not Verified";
                        this.signinClicked = false;
                    }
                }
                else
                {
                    this.commonSharedService.loginUser = "";
                    this.commonSharedService.adminBaseUrl = "";
                    this.error = "Login Credentials Are Missing";
                    this.signinClicked = false;
                }
            }
            else
            {
                this.commonSharedService.loginUser = "";
                this.commonSharedService.adminBaseUrl = "";
                this.error = "User Not Verified";
                this.signinClicked = false;
            }
        }
        catch(e)
        {
            this.commonSharedService.loginUser = "";
            this.commonSharedService.adminBaseUrl = "";
            this.error = "Login Failed";
            this.signinClicked = false;
        }
    }
}
