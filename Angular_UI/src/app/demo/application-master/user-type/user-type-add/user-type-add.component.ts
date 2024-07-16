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
  selector: 'app-user-type-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-type-add.component.html',
  styleUrls: ['./user-type-add.component.scss']
})
export class UserTypeAddComponent {
  @Input() public modalParams;
  modules : any[];
  userRoles : any[];
  masterUserRoles : any[];
  addUserTypeForm: FormGroup;
  moduleForm: FormGroup;
  roleForm: FormGroup;
  isValidForm: boolean;
  searchClicked: boolean;
  saveClicked : boolean;

  constructor(
    private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService) 
  {
    this.modules = []
    this.masterUserRoles = []
    this.userRoles = this.masterUserRoles
  }
  
  ngOnInit() 
  {
    this.isValidForm = true;
    this.saveClicked = false;
    this.searchClicked = false;
    this.modules = [];
    this.addUserTypeForm = this.formbuilder.group({
      id:[''],
      name: ['',[Validators.required]],
      module: this.formbuilder.group({ 'id': [''] }),
      userRole: this.formbuilder.group({ 'id': [''] })
    });

    this.moduleForm = this.formbuilder.group({
      'module': ['', [Validators.required]]
    });

    this.roleForm = this.formbuilder.group({
        'role': ['', [Validators.required]]
      });

    this.getModules();
    this.getUserRoles();
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
        this.modules.unshift({id:"", name : "Select Module"})
        this.moduleForm.controls["module"].setValue("");
      }
    }
    catch(e)
      {
        this.showNotification("error", e);
      }
  }

  async getUserRoles() 
  {
    try
    {
      let moduleId = this.moduleForm.get("module").value;
      if(moduleId != null && moduleId != undefined)
      {
        this.searchClicked = true;
        let response = await this.commonService.getUserRoles(moduleId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.masterUserRoles = response.userRoles;
          this.userRoles = this.masterUserRoles
          this.userRoles.unshift({id:"", name : "Select User Role"})
          this.roleForm.controls["role"].setValue("");
          this.searchClicked = false;
        }
        else
        {
          this.userRoles = [];
          this.searchClicked = false;
        }
      }
    }  
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClicked = false;
    }
  }

  filterUserRoles(moduleId : any)
  {
    if(moduleId > 0 && moduleId?.length > 0)
    {
      this.userRoles = this.masterUserRoles.filter(role => role.module?.id == moduleId);
    }
    else  
    {
      this.userRoles = [];
    }
    this.userRoles.unshift({id:"", name : "Select User Role"})    
    this.roleForm.controls["role"].setValue("");
  }

  async saveUserType()
  {
    if(!this.saveClicked)
    {
      if(this.addUserTypeForm.valid && this.moduleForm.valid && this.roleForm.valid)
      {
        this.isValidForm = true;
        this.saveClicked = true;
        this.addUserTypeForm.controls["module"].get("id").setValue(this.moduleForm.get("module").value);
        this.addUserTypeForm.controls["userRole"].get("id").setValue(this.roleForm.get("role").value);
        try
        {
          let response = await this.commonService.saveUserType(this.addUserTypeForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.commonSharedService.userTypeListObject.next({
                moduleId : this.moduleForm.get("module").value,
                userRoleId : this.roleForm.get("role").value,
                result : "success"
              })
              this.showNotification("success", "User Type Created");
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
