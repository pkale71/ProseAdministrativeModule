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
  roleForm : FormGroup;
  userTypeForm : FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  userUUID : string;
  modules: any[];
  userRoles : any[];
  masterUserRoles : any[];
  userTypes : any[];
  masterUserTypes : any[];
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
    this.userRoles = []
    this.userTypes = []
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
      module: this.formbuilder.group({ 'id': [''] }),
      userRole: this.formbuilder.group({ 'id': [''] }),
      userType: this.formbuilder.group({ 'id': [''] }),
    });

    this.moduleForm = this.formbuilder.group({
      'module': ['', [Validators.required]]
    });

    this.roleForm = this.formbuilder.group({
      'userRole': ['', [Validators.required]]
    });

    this.userTypeForm = this.formbuilder.group({
      'userType': ['', [Validators.required]]
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

  //get user Role
  async getUserRoles() 
  {
    try
    {
      let moduleId = this.moduleForm.get("module").value;
      if(moduleId != undefined && moduleId != "")
      {
        this.searchClicked = true;
        let response = await this.commonService.getUserRoles(moduleId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterUserRoles = response.userRoles;
          this.userRoles = this.masterUserRoles
          this.searchClicked = false;
          this.userRoles.unshift({id:"", name : "Select User Role"});
          // this.roleForm.controls["userRole"].setValue("");
        }
        else
        {
          this.userRoles = [];
          this.searchClicked = false;
        } 
      }
      else
      {
        this.userRoles = [];
        this.searchClicked = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }


  // get user type
  async getUserTypes() 
  {   
    try
    {
      let moduleId = this.moduleForm.get("module").value;
      let userRoleId = this.roleForm.get("userRole").value;
      if(moduleId != undefined && moduleId != '' && userRoleId != undefined && userRoleId != '')
      {
        this.searchClicked = true;
        let response = await this.commonService.getUserTypes(moduleId, userRoleId).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterUserTypes = response.userTypes;
          this.userTypes = this.masterUserTypes;
          this.searchClicked = false;
          this.userTypes.unshift({ id : "", name : "Select User Type"});
          this.searchClicked = false;
        }
        else
        {
          this.userTypes = [];
          this.searchClicked = false;
        }
      }
      else
      {
        this.userTypes = [];
        this.searchClicked = false;
      }  
    }
    catch(e)
    {
      this.showNotification("error",e);
    }
  }

  async saveUserModule()
  {
    if(!this.saveClicked)
    {
      if(this.addUserModuleForm.valid && this.moduleForm.valid && this.roleForm.valid && this.userTypeForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.addUserModuleForm.controls['module'].get("id").setValue(this.moduleForm.get("module").value);
        this.addUserModuleForm.controls['userRole'].get('id').setValue(this.roleForm.get('userRole').value);
        this.addUserModuleForm.controls['userType'].get('id').setValue(this.userTypeForm.get('userType').value);

        try
        {
          let response = await this.userService.saveUserModule(this.addUserModuleForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Module Saved Successfully");
            this.saveClicked = false;
            this.closeModal();
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
