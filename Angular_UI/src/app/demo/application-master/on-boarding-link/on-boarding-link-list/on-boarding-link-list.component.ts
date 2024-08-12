import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';
import { OnBoardingLinkAddComponent } from '../on-boarding-link-add/on-boarding-link-add.component';
import { UserService } from 'src/app/theme/shared/service';

@Component({
<<<<<<< HEAD
    selector: 'app-on-boarding-link-list',
    standalone: true,
    imports: [CommonModule, SharedModule, DataTablesModule],
    templateUrl: './on-boarding-link-list.component.html',
    styleUrls: ['./on-boarding-link-list.component.scss']
})
export class OnBoardingLinkListComponent {
    userOnBoardingLinks : any[];
    searchClicked : boolean;
    linkClicked : boolean[];
    statusForm : FormGroup;
    
    constructor(private notifier: NotifierService, 
        private activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private userService: UserService, 
        public commonSharedService : CommonSharedService,
        private formbuilder: FormBuilder,
        private router : Router)
        {
        }

    ngOnInit() 
    {
        this.searchClicked = false;
        this.linkClicked = [];
        this.userOnBoardingLinks = [];

        this.statusForm = this.formbuilder.group({
            'status' : ['Pending']
        });
        this.getOnBoardingLinks();
    }

    public onBoardingLinkAddResult:any = this.commonSharedService.onBoardingLinkListObject.subscribe(res =>{
        if(res.result == "success")
        {
            this.getOnBoardingLinks();
        }
    })

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async sendOnBoardingLink(code : string, i : number)
    {
        let linkUrl = window.origin + '/#/userProfile/' + code;
        if(linkUrl != "" && linkUrl != undefined && code != "" && code != undefined && !this.linkClicked[i])
        {
            this.linkClicked[i] = true;
            let tempJSON = {
                "linkUrl" : linkUrl,
                "code" : code
            };
            try
            {
                let response = await this.userService.sendOnBoardingLink(tempJSON).toPromise();
                if(response.status_code == 200 && response.message == 'success')
                {
                    this.showNotification("success", "OnBoarding Link Sent Successfully");
                    this.linkClicked[i] = false;
                    this.commonSharedService.onBoardingLinkListObject.next({ result: "success" });
                }
            }
            catch (e)
            {
                this.showNotification("error", e);
                this.linkClicked[i] = false;
            }
        }
    }    

    async getOnBoardingLinks() 
    {
        try 
        {
            let status = this.statusForm.get("status").value;
            this.searchClicked = true;
            let response = await this.userService.getOnBoardingLinks(status).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                $('#tblOnBoardingLink').DataTable().destroy();
                this.userOnBoardingLinks = response.userOnBoardingLinks;
                setTimeout(function(){
                $('#tblOnBoardingLink').DataTable();
                },800);
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
            else
            {
                this.userOnBoardingLinks = [];
                this.searchClicked = false;
                this.modalService.dismissAll();
            }
        } 
        catch (error) 
        {
            this.showNotification("error", error);
            this.searchClicked = false;
            this.modalService.dismissAll();
        }
    }

    addOnBoardingLink()
    {
        const dialogRef = this.modalService.open(OnBoardingLinkAddComponent, 
        { 
            size: 'md', backdrop: 'static' 
        });
        dialogRef.componentInstance.modalParams = {};
    }

    deleteOnBoardingLink(userOnBoardingLink : any)
    {
        Swal.fire({
        customClass: {
            container: 'my-swal'
        },
        title: 'Confirmation',
        text: 'Are you sure to delete on user on-boarding link?',
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
            let tempJSON = { "id" : userOnBoardingLink.id };
            try
            {
                let response = await this.userService.deleteOnBoardingLink(tempJSON).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "User On-Boarding Link Deleted.");
                    this.commonSharedService.onBoardingLinkListObject.next({result : "success"});
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
  selector: 'app-on-boarding-link-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './on-boarding-link-list.component.html',
  styleUrls: ['./on-boarding-link-list.component.scss']
})
export class OnBoardingLinkListComponent {
  userOnBoardingLinks : any[];
  searchClicked : boolean;
  linkClicked : boolean[];
  statusForm : FormGroup;
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private userService: UserService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.linkClicked = [];
    this.userOnBoardingLinks = [];
    this.statusForm = this.formbuilder.group({
      'status' : ['Pending']
    })
    this.getOnBoardingLinks();

  }

  public onBoardingLinkAddResult:any = this.commonSharedService.onBoardingLinkListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.getOnBoardingLinks();
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async sendOnBoardingLink(code : string, i : number)
  {
    let linkUrl = window.origin + '/#/userProfile/' + code;
    if(linkUrl != "" && linkUrl != undefined && code != "" && code != undefined && !this.linkClicked[i])
    {
      this.linkClicked[i] = true;
      let tempJSON = {
        "linkUrl" : linkUrl,
        "code" : code
      };
      try
      {
        let response = await this.userService.sendOnBoardingLink(tempJSON).toPromise();
        if(response.status_code == 200 && response.message == 'success')
        {
          this.showNotification("success", "OnBoarding Link Sent Successfully");
          this.linkClicked[i] = false;
          this.commonSharedService.onBoardingLinkListObject.next({ result: "success" });
        }
      }
      catch (e)
      {
        this.showNotification("error", e);
        this.linkClicked[i] = false;
      }
    }
  }
 

  async getOnBoardingLinks() 
  {
    try 
    {
      let status = this.statusForm.get("status").value;
      this.searchClicked = true;
      let response = await this.userService.getOnBoardingLinks(status).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblOnBoardingLink').DataTable().destroy();
        this.userOnBoardingLinks = response.userOnBoardingLinks;
        setTimeout(function(){
          $('#tblOnBoardingLink').DataTable();
        },800);
        this.searchClicked = false;
      }
      else
      {
        this.userOnBoardingLinks = [];
        this.searchClicked = false;
      }
    } 
    catch (error) 
    {
      this.showNotification("error", error);
      this.searchClicked = false;
      this.modalService.dismissAll();
    }
  }

  addOnBoardingLink()
  {
    const dialogRef = this.modalService.open(OnBoardingLinkAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  deleteOnBoardingLink(userOnBoardingLink : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete on user boarding link?',
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
        let tempJSON = { "id" : userOnBoardingLink.id };
        try
        {
          let response = await this.userService.deleteOnBoardingLink(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "User On-Boarding Link Deleted.");
            this.commonSharedService.onBoardingLinkListObject.next({result : "success"});
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
