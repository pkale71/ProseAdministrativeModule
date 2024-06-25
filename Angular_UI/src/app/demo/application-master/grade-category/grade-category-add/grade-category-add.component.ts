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
  selector: 'app-grade-category-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './grade-category-add.component.html',
  styleUrls: ['./grade-category-add.component.scss']
})
export class GradeCategoryAddComponent {
  @Input() public modalParams;
  addGradeCategoryForm: FormGroup;
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

    this.addGradeCategoryForm = this.formbuilder.group({
      id: [''],
      name: ['', [Validators.required]],
    });
  }

  showNotification(type: string, message: string): void {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async saveCategory() 
  {
    if (!this.saveClicked) 
      {
      if (this.addGradeCategoryForm.valid) 
        {
        this.isValidForm = true;
        this.saveClicked = true;

        try 
        {
          let response = await this.commonService.savegradeCategory(this.addGradeCategoryForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') {
            this.showNotification("success", "Grade Category Saved");
            this.commonSharedService.gradeCategoryListObject.next({ result: "success" });
            this.closeModal();
          }
        }
        catch (e) {
          this.showNotification("error", e);
          this.isValidForm = false;
          this.saveClicked = false;
        }
      }
      else {
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
