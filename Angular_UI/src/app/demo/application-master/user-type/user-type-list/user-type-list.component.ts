import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserTypeAddComponent } from '../user-type-add/user-type-add.component';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

// third party
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
<<<<<<< HEAD
    selector: 'app-user-type-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './user-type-list.component.html',
    styleUrls: ['./user-type-list.component.scss']
})
export class UserTypeListComponent 
{
    userTypes : any[];
    searchClicked : boolean;
    userRoleClicked: boolean;
    userRoles : any[];
    modules : any[];
    moduleForm : FormGroup;
    userRoleForm : FormGroup;
    
    constructor(private router : Router,
        private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private commonService : CommonService,
        public commonSharedService : CommonSharedService)
    {
        this.modules = [];
        this.userRoles = [];
    }
    
    ngOnInit() 
    {
        this.searchClicked = false;
        this.userTypes = [];
        this.userRoleClicked = false;

        this.moduleForm = this.formBuilder.group({
            'module' : ['0']
        });
        this.userRoleForm = this.formBuilder.group({
            'userRole' : ['0']
        });
        this.getModules();
        this.getUserTypes(0, 0, 'All');
    }

    public userTypeAddResult:any = this.commonSharedService.userTypeListObject.subscribe(res =>{
        if(res.result == "success")
        {
            let moduleId = res.moduleId;
            let userRoleId = res.userRoleId;
            this.getUserTypes(moduleId, userRoleId, 'All');
        }
    })

    //get module
    async getModules() 
    {
        try 
        {
            let response = await this.commonService.getModules().toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.modules = response.modules;
                this.modules.unshift({id : "0", name : "All"});
                this.getUserRoles();
            }
            else
            {
                this.modules = [];
                this.modules.unshift({id : "0", name : "All"});
            }
        }
        catch(e)  
        {
            this.showNotification("error", e);
        }
    }

    //get user Role
    async getUserRoles() 
    {
        try
        {
            let moduleId = this.moduleForm.get("module").value;
            if(moduleId != null && moduleId != undefined)
            {
                this.userRoleClicked = true;
                let response = await this.commonService.getUserRoles(moduleId, 'All').toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.userRoles = response.userRoles;
                    this.userRoles.unshift({id : "0", name : "All"});
                    this.userRoleClicked = false;
                }
                else
                {
                    this.userRoles = [];
                    this.userRoles.unshift({id : "0", name : "All"});
                    this.userRoleClicked = false;
                }
            }
            else
            {
                this.userRoles = [];
                this.userRoles.unshift({id : "0", name : "All"});
                this.userRoleClicked = false;
            }
        }  
        catch(e)
        {
            this.showNotification("error", e);
            this.userRoleClicked = false;
        }
    }

    filterData()
    {
        let moduleId : number = this.moduleForm.get("module").value;
        let userRoleId : number = this.userRoleForm.get("userRole").value;
        this.getUserTypes(moduleId, userRoleId, 'All');
    }

    async getUserTypes(moduleId : number, userRoleId : number, action : string) 
    {  
        try
        {
            this.searchClicked = true;
            let response = await this.commonService.getUserTypes(moduleId, userRoleId, 'All').toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblUserType').DataTable().destroy();
                this.userTypes = response.userTypes;
                setTimeout(function(){
                $('#tblUserType').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.userTypes = [];
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
        }
        catch(e)
        {
            this.showNotification("error",e);
            this.searchClicked = false;
        }
    }

    showNotification(type: string, message: string): void 
    {
        this.notifier.notify(type, message);
    }

    addUserType()
    {
        const dialogRef = this.modalService.open(UserTypeAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    updateStatus(userType : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to ' + (userType.isActive == 1 ? 'de-active' : 'active') + ' the user type?',
        icon: 'warning',
        allowOutsideClick: false,
        showCloseButton: true,
        showCancelButton: true 
        }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
        } 
        else 
        {        
            try
            {
                let tempJson = {
                    id : userType.id,
                    tableName : userType.tableName
                }
                this.showNotification("info", "Please wait...");
                let response = await this.commonService.updateStatus(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "User Type " + (userType.isActive == 1 ? 'De-activated' : 'Activated'));
                    this.commonSharedService.userTypeListObject.next({
                        moduleId : this.moduleForm.get("module").value,
                        userRoleId : this.userRoleForm.get("userRole").value,
                        result : "success"
                    });
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });   
    }

    deleteUserType(userType : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete user type?',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true
        }).then(async (willDelete) => {
        if (willDelete.dismiss) 
        {
            
        } 
        else 
        {
            this.showNotification("info", "Please wait...");
            let tempJSON = { "id" : userType.id };
            try
            {
                let response = await this.commonService.deleteUserType(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "UserType Deleted.");
                    this.commonSharedService.userTypeListObject.next({result : "success"});
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
        });
    }
=======
  selector: 'app-user-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './user-type-list.component.html',
  styleUrls: ['./user-type-list.component.scss']
})
export class UserTypeListComponent 
{
  userTypes : any[];
  searchClicked : boolean;
  userRoleClicked: boolean;
  userRoles : any[];
  modules : any[];
  moduleForm : FormGroup;
  userRoleForm : FormGroup;
  
  constructor(private router : Router,
    private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private commonService : CommonService,
    public commonSharedService : CommonSharedService)
  {
    this.modules = [];
    this.userRoles = [];
  }
  
  ngOnInit() 
  {
    this.searchClicked = false;
    this.userTypes = [];
    this.userRoleClicked = false;

    this.moduleForm = this.formBuilder.group({
      'module' : ['0']
    })
    this.userRoleForm = this.formBuilder.group({
      'userRole' : ['0']
    })
    this.getModules();
    this.getUserTypes(0, 0, 'All');
  }

  public userTypeAddResult:any = this.commonSharedService.userTypeListObject.subscribe(res =>{
    if(res.result == "success")
    {
      let moduleId = res.moduleId;
      let userRoleId = res.userRoleId;
      this.getUserTypes(moduleId,userRoleId,'All');
    }
  })

  //get module
  async getModules() 
  {
    try 
    {
      let response = await this.commonService.getModules().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.modules = response.modules;
        this.modules.unshift({id : "0", name : "All"});
        this.userRoles.unshift({id : "0", name : "All"})
      }
      else
      {
        this.modules = [];
      }
    }
    catch(e)  
    {
      this.showNotification("error", e);
    }
  }

  //get user Role
  async getUserRoles() 
  {
    try
    {
      let moduleId = this.moduleForm.get("module").value;
      if(moduleId != null && moduleId != undefined)
      {
        this.userRoleClicked = true;
        let response = await this.commonService.getUserRoles(moduleId, 'All').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.userRoles = response.userRoles;
          this.userRoles.unshift({id : "", name : "All"});
          this.userRoleClicked = false;
        }
        else
        {
          this.userRoles = [];
          this.userRoleClicked = false;
        }
      }
    }  
    catch(e)
    {
      this.showNotification("error", e);
      this.userRoleClicked = false;
    }
  }

  filterData()
  {
    let moduleId : number = this.moduleForm.get("module").value;
    let userRoleId : number = this.userRoleForm.get("userRole").value;
    this.getUserTypes(moduleId, userRoleId, 'All');
  }

  async getUserTypes(moduleId : number, userRoleId : number, action : string) 
  {  
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getUserTypes(moduleId, userRoleId, 'All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblUserType').DataTable().destroy();
        this.userTypes = response.userTypes;
        setTimeout(function(){
          $('#tblUserType').DataTable();
        },800);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.userTypes = [];
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
    }
    catch(e)
    {
      this.showNotification("error",e);
    }
  }

  showNotification(type: string, message: string): void 
  {
    this.notifier.notify(type, message);
  }

  addUserType()
  {
    const dialogRef = this.modalService.open(UserTypeAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  updateStatus(userType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (userType.isActive == 1 ? 'de-active' : 'active') + ' the user type?',
      icon: 'warning',
      allowOutsideClick: false,
      showCloseButton: true,
      showCancelButton: true 
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
      } 
      else 
      {        
        try
        {
          let tempJson = {
            id : userType.id,
            tableName : userType.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "User Type " + (userType.isActive == 1 ? 'De-activated' : 'Activated'));
              this.commonSharedService.userTypeListObject.next({
                moduleId : this.moduleForm.get("module").value,
                userRoleId : this.userRoleForm.get("userRole").value,
                result : "success"
              });
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });   
  }

  deleteUserType(userType : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete user type?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then(async (willDelete) => {
      if (willDelete.dismiss) 
      {
        
      } 
      else 
      {
        this.showNotification("info", "Please wait...");
        let tempJSON = { "id" : userType.id };
        try
        {
          let response = await this.commonService.deleteUserType(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "UserType Deleted.");
            this.commonSharedService.userTypeListObject.next({result : "success"});
          }
        }
        catch(e)
        {
          this.showNotification("error", e);
        }
      }
    });
  }
>>>>>>> parent of c617e70 (ss)
}
