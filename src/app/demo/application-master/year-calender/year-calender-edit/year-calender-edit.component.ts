import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YearCalenderService } from 'src/app/theme/shared/service/year-calender.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-year-calender-edit',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './year-calender-edit.component.html',
  styleUrls: ['./year-calender-edit.component.scss']
})
export class YearCalenderEditComponent {
  @Input() public modalParams;
  editYearCalenderForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

  constructor(private yearCalenderService: YearCalenderService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    private router : Router)
  {
    
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.editYearCalenderForm = this.formbuilder.group({
      id:[this.modalParams.id, Validators.required],
      remark: [this.modalParams.remark,Validators.required],
      isTeaching: [0, Validators.required]
    });
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveYearCalender()
  {
    if(!this.saveClicked)
    {
      if(this.editYearCalenderForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.yearCalenderService.updateYearCalender(this.editYearCalenderForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Event Updated");
              this.commonSharedService.yearCalenderListObject.next({result : "success", oper : "Add"});
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
