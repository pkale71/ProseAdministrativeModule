import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-user-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './user-role-add.component.html',
    styleUrls: ['./user-role-add.component.scss']
})
export class UserRoleAddComponent {
    @Input() public modalParams;
    modules : any[];
    addUserRoleForm: FormGroup;
    moduleForm: FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;

    constructor(
        private commonService: CommonService, 
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService : CommonSharedService) 
    {
        this.modules = [];
    }
    
    ngOnInit() 
    {
        this.isValidForm = true;
        this.saveClicked = false;
        this.modules = [];
        this.addUserRoleForm = this.formbuilder.group({
            id:[''],
            name: ['',[Validators.required]],
            module: this.formbuilder.group({ 'id': [''] })
        });

        this.moduleForm = this.formbuilder.group({
            'module': ['', [Validators.required]]
        });

        this.getModules();
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
                this.modules.unshift({id:"", name : "Select Module"});
                this.moduleForm.controls["module"].setValue("");
            }
            else
            {
                this.modules = [];
                this.modules.unshift({id:"", name : "Select Module"});
            }
        }
        catch(e)  
        {
            this.showNotification("error", e);
        }
    }

    async saveUserRole()
    {
        if(!this.saveClicked)
        {
            if(this.addUserRoleForm.valid && this.moduleForm.valid)
            {
                this.isValidForm = true;
                this.saveClicked = true;
                this.addUserRoleForm.controls["module"].get("id").setValue(this.moduleForm.get("module").value);
                try
                {
                    let response = await this.commonService.saveUserRole(this.addUserRoleForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.commonSharedService.userRoleListObject.next({result : "success"})
                        this.showNotification("success", "User Role Saved.");
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
