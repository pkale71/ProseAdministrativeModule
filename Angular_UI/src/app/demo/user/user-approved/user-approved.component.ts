import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { UserService } from 'src/app/theme/shared/service/user.service';
import { Router } from '@angular/router';

// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-approved',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './user-approved.component.html',
  styleUrls: ['./user-approved.component.scss']
})
export class UserApprovedComponent {
  @Input() public modalParams;
  approvedUserForm: FormGroup;
  isValidForm: boolean;
  saveClicked : boolean;
  searchClicked : boolean;
  uuid : string;
  user : any[];
  masterUser : any[];

  constructor(
    private router : Router,
    private commonService: CommonService, 
    private userService: UserService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    private modalService: NgbModal,
    public commonSharedService : CommonSharedService,
    ) 
  {
    this.user = [];
  }
  
  ngOnInit() 
  {
    this.uuid = this.modalParams.uuid;
    this.isValidForm = true;
    this.saveClicked = false;
    this.searchClicked = false;
    this.approvedUserForm = this.formbuilder.group({
      uuid: this.uuid,
      action: ['',Validators.required],
    });

  }

  public userAddResult:any = this.commonSharedService.userListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getUser(this.uuid);
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getUser(uuid : string) 
  {
    let response = await this.userService.getUser(uuid).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.user = response.user;
      this.approvedUserForm.patchValue(this.user);
    }
    else
    {
      this.user = [];
    }
  }

  async approvedUser()
  {
    if(!this.saveClicked)
    {
      if(this.approvedUserForm.valid )
      {
        this.isValidForm = true;
        this.saveClicked = true;
        try 
        {
          let response = await this.userService.approvedUser(this.approvedUserForm.value).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User Approved");
            this.closeModal();
            this.commonSharedService.userListObject.next({result : "success"});
            // this.router.navigateByUrl("/user/detail/" + response.data.uuid);
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
