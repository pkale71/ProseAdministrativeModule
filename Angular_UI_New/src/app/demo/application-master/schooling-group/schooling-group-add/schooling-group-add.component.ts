import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-schooling-group-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './schooling-group-add.component.html',
    styleUrls: ['./schooling-group-add.component.scss']
})
export class SchoolingGroupAddComponent {
    @Input() public modalParams;
    addSchoolingGroupForm: FormGroup;
    isValidForm: boolean;
    saveClicked: boolean;

    constructor(private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private notifier: NotifierService,
        private formbuilder: FormBuilder,
        public commonSharedService: CommonSharedService,
        private router: Router) {
    }

    ngOnInit() {
        this.isValidForm = true;
        this.saveClicked = false;

        this.addSchoolingGroupForm = this.formbuilder.group({
            id: [''],
            name: ['', [Validators.required]],
        });
    }

    showNotification(type: string, message: string): void {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async saveSchoolingGroup() 
    {
        if (!this.saveClicked) 
        {
            if (this.addSchoolingGroupForm.valid) 
            {
                this.isValidForm = true;
                this.saveClicked = true;
                try 
                {
                    let response = await this.commonService.saveSchoolingGroup(this.addSchoolingGroupForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Schooling Group Saved.");
                        this.commonSharedService.schoolingGroupListObject.next({ result: "success" });
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
