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
export class GradeCategoryAddComponent 
{
  @Input() public modalParams;
  gradeCategories : any[];
  addGradeCategoryForm: FormGroup;
  gradeCategoryForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;

  constructor(private commonService: CommonService, 
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
    this.gradeCategories = [];

    this.addGradeCategoryForm = this.formbuilder.group({
      id:[''],
      name: ['',Validators.required],
      gradeCategory: this.formbuilder.group({ 'id': [''] }),
    });

    this.gradeCategoryForm = this.formbuilder.group({
      'gradeCategory': ['', [Validators.required]]
    });

    this.getGradeCategories();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getGradeCategories() 
  {
    /////////get Grade Categories
    let response = await this.commonService.getGradeCategories().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
    //   this.gradeCategories = response.data.gradeCategories;
    }
  }

  async saveGrade()
  {
    if(!this.saveClicked)
    {
      if(this.addGradeCategoryForm.valid && this.gradeCategoryForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;        
        this.addGradeCategoryForm.controls["gradeCategory"].get("id").setValue(this.gradeCategoryForm.get("gradeCategory").value);
       
        try
        {
          let response = await this.commonService.saveGrade(this.addGradeCategoryForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Grade Saved");
              this.commonSharedService.gradeListObject.next({result : "success"});
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
