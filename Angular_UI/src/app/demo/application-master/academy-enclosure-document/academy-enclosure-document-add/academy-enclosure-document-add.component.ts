import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/theme/shared/service/business.service';



@Component({
  selector: 'app-academy-enclosure-document-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './academy-enclosure-document-add.component.html',
  styleUrls: ['./academy-enclosure-document-add.component.scss']
})
export class AcademyEnclosureDocumentAddComponent 
{
  @Input() public modalParams;
  addAcademyForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  isCompulsories : any[];

  constructor(private businessService: BusinessService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
    this.isCompulsories = [{
      "id": 1,
      "name": "Yes"
    },
    {
      "id": 0,
      "name": "No"
    }]
  }

  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;

    this.addAcademyForm = this.formbuilder.group({
      id:[''],
      name: ['',[Validators.required]],
      isCompulsory : ['', Validators.required]
    });

    this.addAcademyForm.get('isCompulsory').setValue('0');
  
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveAcademyEnclosureDocument()
  {
    if(!this.saveClicked)
    {
      if(this.addAcademyForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try
        {
          let response = await this.businessService.saveAcademyEnclosureDocument(this.addAcademyForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Academy Enclosure Document Saved");
              this.commonSharedService.academyEnclosureDocumentListObject.next({result : "success"});
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
