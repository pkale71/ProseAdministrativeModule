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

@Component({
  selector: 'app-user-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './user-type-list.component.html',
  styleUrls: ['./user-type-list.component.scss']
})
export class UserTypeListComponent 
{
  masterUserTypes : any[];
  userTypes : any[];
  searchClicked : boolean;
  loginUser : any;
  userRole : any;
  
  constructor(private router : Router,
    private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService : CommonService,
    public commonSharedService : CommonSharedService)
  {
    this.loginUser = this.commonSharedService.loginUser;
    this.userRole = this.loginUser.type;
  }
  
  ngOnInit() 
  {
    this.searchClicked = false;
    this.userTypes = [];
    this.getUserTypes();
  }

  public userRoleAddResult:any = this.commonSharedService.userTypeListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getUserTypes();
    }
  })

  async getUserTypes() 
  {   
    this.searchClicked = true;
    let response = await this.commonService.getUserTypes().toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblUserType').DataTable().destroy();
      this.masterUserTypes = response.data.userTypes;
      this.userTypes = this.masterUserTypes;
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
}
