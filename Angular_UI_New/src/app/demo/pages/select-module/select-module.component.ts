import { Component, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonModule, Location } from '@angular/common';
import { FileUploadValidators, FileUploadModule } from '@iplab/ngx-file-upload';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-select-module',
    standalone : true,
    imports: [CommonModule, SharedModule, FileUploadModule],
    templateUrl: './select-module.component.html',
    styleUrls: ['./select-module.component.scss'],
 })
export class SelectModuleComponent {
    @Input() public modalParams;
    loginUser !: any;
    selectedModule : any;
    modules : any[];

    constructor(private notifier: NotifierService,
        private commonSharedService: CommonSharedService,
        private commonService: CommonService,
        private userService : UserService,
        private router: Router,
        private formBuilder : FormBuilder,
        private route: ActivatedRoute,
        private location : Location
    ) 
    {
        this.modules = [];
        this.getModules();
    }

    ngOnInit()
    {
        
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async getModules() 
    {  
        try
        {
            let response = await this.commonService.getModules().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.modules = response.modules;
                this.loginUser = this.commonSharedService.loginUser;
                console.log(this.loginUser)
                for(let i=0;i<this.modules.length;i++)
                {
                    let tempModule = this.loginUser.userModules.filter(userModule=>userModule.module.id == this.modules[i].id);
                    if(tempModule.length == 0)
                    {
                        this.loginUser.userModules.push({
                        id : 0,
                        isActive : 0,
                        isModuleAdminApproved : 0,
                        module : {id: this.modules[i].id, name: this.modules[i].name, redirectUrl: this.modules[i].redirectUrl},
                        tableName : "user_module",
                        userRole : {id: null, name: null},
                        userType : {id: null, name: null, code: null}
                        })
                    }
                }
            }
        }
        catch(e)
        {
            this.showNotification("error", e);
        }
    }

    getUserModulesData(index : number)
    {
        this.selectedModule = this.loginUser;    
        this.selectedModule['userModule'] = this.loginUser?.userModules[index];
        if(this.selectedModule['userModule'].userRole?.id != null && this.selectedModule['userModule'].userType?.id != null)
        {
            let redirectPath = this.selectedModule['userModule'].module.redirectUrl + "#/auth/signin/" + this.loginUser.uuid + "/" + this.selectedModule['userModule'].module.id;
            window.open(redirectPath, "_self");
        }
    }

    async logout()
    {
        try
        {
        let response = await this.userService.logout().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            localStorage.clear();
            this.showNotification("info", "Logout Successful");
            this.router.navigate(['/auth/signin']);
        }
        }
        catch(e)
        {
            this.showNotification("info", "Logout Unsuccessful");
        }
    }

    back()
    {
        this.location.back();
    }
}
