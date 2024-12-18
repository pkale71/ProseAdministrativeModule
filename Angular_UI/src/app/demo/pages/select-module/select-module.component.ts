import { Component, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/theme/shared/service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FileUploadValidators, FileUploadModule } from '@iplab/ngx-file-upload';
import { ActivatedRoute } from '@angular/router';

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

    constructor(private notifier: NotifierService,
        private commonSharedService: CommonSharedService,
        private commonService: CommonService,
        private userService : UserService,
        private formBuilder : FormBuilder,
        private route: ActivatedRoute
    ) 
    {
        this.loginUser = this.commonSharedService.loginUser;
    }

    ngOnInit()
    {
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    getUserModulesData(index : number)
    {
        this.loginUser = this.commonSharedService.loginUser;
        this.selectedModule = this.loginUser;    
        this.selectedModule['userModule'] = this.loginUser?.userModules[index];
        //delete this.selectedModule.userModules;     
        alert(JSON.stringify(this.selectedModule))  
    }
}
