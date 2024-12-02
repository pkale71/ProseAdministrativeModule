import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserService } from 'src/app/theme/shared/service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-module-role-type-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-module-role-type-add.component.html',
  styleUrls: ['./user-module-role-type-add.component.scss']
})
export class UserModuleRoleTypeAddComponent 
{
  @Input() public modalParams;
  assignModuleRoleTypeForm: FormGroup;
  userRoleForm : FormGroup;
  userTypeForm : FormGroup;
  saveClicked : boolean;
  searchClickedUserRole : boolean;
  searchClickedUserType : boolean;
  isValidForm : boolean;
  userRoles : any[];
  userTypes : any[];

  constructor(
    private commonService: CommonService, 
    private userService : UserService,
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
  }

  ngOnInit() 
  {
    this.saveClicked = false;
    this.searchClickedUserRole = false;
    this.searchClickedUserType = false;
    this.isValidForm = true;

    this.assignModuleRoleTypeForm = this.formbuilder.group({
      id:[this.modalParams?.id, Validators.required],
      user: this.formbuilder.group({ 'uuid': [this.modalParams?.uuid, Validators.required] }),
      module: this.formbuilder.group({ 'id': [this.modalParams?.moduleId, Validators.required] }),
      userRole: this.formbuilder.group({ 'id': [''] }),
      userType: this.formbuilder.group({ 'id': [''] })
    });

    this.userRoleForm = this.formbuilder.group({
      userRole:['']
    });

    this.userTypeForm = this.formbuilder.group({
      userType:['']
    });

    this.getUserRoles(this.modalParams.moduleId, 'Active');
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getUserRoles(moduleId : number, action : string) 
  {  
    try
    {
      this.searchClickedUserRole = true;  
      let response = await this.commonService.getUserRoles(moduleId, action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.userRoles = response.userRoles;
        this.searchClickedUserRole = false;
        this.userRoles.unshift({"id" : "", "name" : "Select Role"});
      }
      else
      {
        this.userRoles = [];
        this.userRoles.unshift({"id" : "", "name" : "Select Role"});
        this.searchClickedUserRole = false;
      }
    }
    catch(e)
    {
      this.userRoles = [];
      this.showNotification("error", e);
      this.searchClickedUserRole = false;
    }
  }

  async getUserTypes(userRoleId : number, action : string) 
  {  
    let moduleId = this.modalParams.moduleId;
    try
    {
      this.searchClickedUserRole = true;  
      let response = await this.commonService.getUserTypes(moduleId, userRoleId, action).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.userTypes = response.userTypes;
        this.searchClickedUserType = false;
        this.userTypes.unshift({"id" : "", "name" : "Select Type"});
      }
      else
      {
        this.userTypes = [];
        this.userTypes.unshift({"id" : "", "name" : "Select Type"});
        this.searchClickedUserType = false;
      }
    }
    catch(e)
    {
      this.userTypes = [];
      this.showNotification("error", e);
      this.searchClickedUserType = false;
    }
  }

  async assignModuleRoleType()
  {
    if(!this.saveClicked)
    {
      if(this.assignModuleRoleTypeForm.valid && this.userRoleForm.valid && this.userTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.assignModuleRoleTypeForm.controls['userRole'].get("id").setValue(this.userRoleForm.get("userRole").value);
        this.assignModuleRoleTypeForm.controls['userType'].get("id").setValue(this.userTypeForm.get("userType").value);
        try
        {
          let response = await this.userService.assignUserRoleTypeModule(this.assignModuleRoleTypeForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "User Role/Type Assigned");
              this.commonSharedService.userModulesListObject.next({
                result : "success"
              });
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
