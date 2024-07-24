import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SchoolingProgramAddComponent } from '../schooling-program-add/schooling-program-add.component';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schooling-program-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './schooling-program-list.component.html',
  styleUrls: ['./schooling-program-list.component.scss']
})
export class SchoolingProgramListComponent {
  schoolingPrograms : any[];
  academicSessions : any[];
  academicSessionForm : FormGroup;
  searchClicked : boolean;
  
  constructor(private notifier: NotifierService, 
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private commonService: CommonService, 
    public commonSharedService : CommonSharedService,
    private formbuilder: FormBuilder,
    private router : Router)
    {
    }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.schoolingPrograms = [];

    this.academicSessionForm = this.formbuilder.group({
      "academicSession" : ['0']
   })

   this.getAcademicSessions();
   this.getSchoolingPrograms(0, 'All');
  }

  public gradeAddResult:any = this.commonSharedService.schoolingProgramListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.academicSessionForm.get("academicSession").setValue(res.responseData.academicSessionId);
      this.getSchoolingPrograms(res.responseData.academicSessionId, 'All');
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  filterData()
  {
    let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
    if(!isNaN(academicSessionId) && academicSessionId > 0)
    {
      this.getSchoolingPrograms(academicSessionId, 'All');
    }
    else
    {
      this.getSchoolingPrograms(academicSessionId, 'All');
    }
  }

  //academic session
  async getAcademicSessions() 
  {
   try
    {
      this.searchClicked = true;
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = response.academicSessions;
        this.academicSessions.unshift({ id: "0", name : "All"});
      }
      else
      {
        this.academicSessions = [];
        this.academicSessions.unshift({ id: "0", name : "All"});
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }  

  async getSchoolingPrograms(academicSessionId : number, action : string) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getSchoolingPrograms(academicSessionId, 'All').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblSchoolProgram').DataTable().destroy();
        this.schoolingPrograms = response.schoolingPrograms;
        setTimeout(function(){
          $('#tblSchoolProgram').DataTable();
        },1000);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.schoolingPrograms = [];
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  addSchoolProgram()
  {
    const dialogRef = this.modalService.open(SchoolingProgramAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  updateStatus(schoolingProgram : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (schoolingProgram.isActive == 1 ? 'de-active' : 'active') + ' the schooling program?',
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
            id : schoolingProgram.id,
            tableName : schoolingProgram.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Schooling Program " + (schoolingProgram.isActive == 1 ? 'de-activated' : 'activated'));
              this.commonSharedService.schoolingProgramListObject.next({
                result : "success", 
                responseData : {
                  academicSessionId : schoolingProgram.academicSession.id
                }
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
  
  deleteSchoolingProgram(schoolingProgram : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete school program?',
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
        let tempJSON = { "id" : schoolingProgram.id };
        try
        {
          let response = await this.commonService.deleteSchoolingProgram(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "School Program Deleted.");
            this.commonSharedService.schoolingProgramListObject.next({
              result : "success",
              responseData : {
                academicSessionId : schoolingProgram.academicSession.id
              } 
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
}
