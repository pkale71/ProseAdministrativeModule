import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/theme/shared/service/business.service';

// third party
import Swal from 'sweetalert2';

@Component({
    selector: 'app-tie-up-school-syllabus-add',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './tie-up-school-syllabus-add.component.html',
    styleUrls: ['./tie-up-school-syllabus-add.component.scss']
})
export class TieUpSchoolSyllabusAddComponent 
{
    @Input() public modalParams;
    addTieUpSchoolSyllabusForm: FormGroup;
    isValidForm: boolean;
    saveClicked : boolean;

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

        this.addTieUpSchoolSyllabusForm = this.formbuilder.group({
            id:[''],
            name: [''],
            });  
    }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async saveTieUpSchoolSyllabus()
    {  
        if(!this.saveClicked)
        {      
            if(this.addTieUpSchoolSyllabusForm.valid)
            { 
                try
                {
                    this.isValidForm = true;
                    this.saveClicked = true;
                    let response = await this.businessService.saveTieUpSchoolSyllabus(this.addTieUpSchoolSyllabusForm.value).toPromise();
                    if (response.status_code == 200 && response.message == 'success') 
                    {
                        this.showNotification("success", "Tie-Up School Syllabus Saved");
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
