import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserService } from 'src/app/theme/shared/service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { IOption, SelectModule } from 'ng-select';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-module',
    standalone: true,
    imports: [CommonModule, SharedModule, SelectModule],
    templateUrl: './user-module.component.html',
    styleUrls: ['./user-module.component.scss']
})
export class UserModuleComponent {
    @Input() public modalParams;
    addUserModuleForm: FormGroup;
    moduleForm : FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;
    userUUID : string;
    modules: any[];
    searchClicked : boolean;

    constructor(private commonService: CommonService, 
        private userService: UserService, 
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService,
        private router : Router)
    {
        this.modules= []
    }

    ngOnInit() 
    {
        //get Modal params
        this.userUUID = this.modalParams.userUUID;
        this.isValidForm = true;
        this.saveClicked = false;
        this.searchClicked = false;
        this.getModules();    

        this.addUserModuleForm = this.formbuilder.group({
            uuid: this.userUUID,
            user: this.formbuilder.group({ 'uuid': [this.userUUID, Validators.required] }),
            module: this.formbuilder.group({ 'id': [''] })
        });

        this.moduleForm = this.formbuilder.group({
            'module': ['', [Validators.required]]
        });
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }
    
    
    //get module
    async getModules() 
    {
        let response = await this.commonService.getModules().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.modules = response.modules;
            this.modules.unshift({id:"", name : "Select Module"})
            this.moduleForm.controls["module"].setValue("");
        }
    }

    async saveUserModule()
    {
        if(!this.saveClicked)
        {
            if(this.addUserModuleForm.valid && this.moduleForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.addUserModuleForm.controls['module'].get("id").setValue(this.moduleForm.get("module").value);

                try
                {
                    let response = await this.userService.saveUserModule(this.addUserModuleForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "User Module Saved Successfully");
                        this.saveClicked = false;
                        // this.closeModal();
                        this.commonSharedService.userModulesListObject.next({
                            userUUID : this.userUUID,
                            result : "success"
                        });
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
