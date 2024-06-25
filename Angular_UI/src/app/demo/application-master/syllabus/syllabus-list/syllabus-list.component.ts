import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SyllabusAddComponent } from '../syllabus-add/syllabus-add.component';
declare var $;

// third party
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-syllabus-list',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule],
  templateUrl: './syllabus-list.component.html',
  styleUrls: ['./syllabus-list.component.scss']
})
export class SyllabusListComponent
{
  syllabuses : any[];
  searchClicked : boolean;
  academicSessionForm : FormGroup;
  schoolingProgramForm : FormGroup;
  academicSessions : any[];
  schoolingPrograms : any[];
  masterSyllabus : any[];
  masterSchoolingProgram : any[];

  constructor(private notifier: NotifierService, 
  private activatedRoute: ActivatedRoute,
  private modalService: NgbModal,
  private commonService: CommonService, 
  private formbuilder :FormBuilder,
  public commonSharedService : CommonSharedService,
  private router : Router)
  {
  //  this.syllabuses = this.activatedRoute.snapshot.data['syllabuses'].data.syllabuses;
  }

  ngOnInit() 
  {
    this.searchClicked = false;
    this.syllabuses = [];
    this.getSyllabuses(0, 0);
    this.getAcademicSessions();
    this.academicSessions = [];
    this.schoolingPrograms = [];

    this.academicSessionForm = this.formbuilder.group({
      "academicSession" : ['0']
    })

    this.schoolingProgramForm = this.formbuilder.group({
      "schoolingProgram" : ['0']
    })
  }

  public syllabusAddResult:any = this.commonSharedService.syllabusListObject.subscribe(res =>{
    if(res.result == "success")
    {
      this.academicSessionForm.get("academicSession").setValue(res.responseData.academicSessionId);
      this.schoolingProgramForm.get("schoolingProgram").setValue(res.responseData.schoolingProgramId);
      this.getSyllabuses(res.responseData.academicSessionId, res.responseData.schoolingProgramId);
    }
  })

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  //academic session
  async getAcademicSessions() 
  {
   try
      {
        let response = await this.commonService.getAcademicSessions().toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.academicSessions = response.academicSessions;
          this.academicSessions.unshift({ id: "0", name : "All"});
          this.schoolingPrograms.unshift({ id: "0", name : "All"});
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

  async getSchoolingPrograms() 
  {
    try
      {
        let academicSessionId = this.academicSessionForm.get("academicSession").value;
        if(academicSessionId != undefined && academicSessionId != "")
        {
          let response = await this.commonService.getSchoolingPrograms(academicSessionId).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.schoolingPrograms = response.schoolingPrograms;
            if(academicSessionId == 0 )
              {
                this.schoolingPrograms = [];
                this.schoolingPrograms.unshift({ id: "0", name: "All" });
              }
              this.schoolingProgramForm.get("schoolingProgram").setValue(this.schoolingPrograms[0].id); 
          }
          else
          {
            this.schoolingPrograms = [];
            this.schoolingPrograms.unshift({ id: "0", name: "All" });
          }
        }
        else
        {
          this.schoolingPrograms = [];
          this.schoolingPrograms.unshift({ id: "0", name: "All" });
        }
      }
      catch(e)
        {
          this.showNotification("error",e);
        }
  }

  filterData()
  {
    let academicSessionId : number = this.academicSessionForm.get("academicSession").value;
    let schoolingProgramId : number = this.schoolingProgramForm.get("schoolingProgram").value;
    if(!isNaN(schoolingProgramId) && schoolingProgramId > 0 && academicSessionId >0)
    {
      this.getSyllabuses(academicSessionId, schoolingProgramId);
    }
    else
    {
      this.getSyllabuses(academicSessionId, schoolingProgramId);
    }
  }


  async getSyllabuses(academicSessionId : number, schoolingProgramId : number) 
  {
    try
    {
      this.searchClicked = true;
      let response = await this.commonService.getSyllabuses(academicSessionId, schoolingProgramId).toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        $('#tblSyllabus').DataTable().destroy();
        this.masterSyllabus = response.syllabuses;
        this.syllabuses = this.masterSyllabus;
        setTimeout(function(){
          $('#tblSyllabus').DataTable();
        },1000);
        this.searchClicked = false;
        this.modalService.dismissAll();
      }
      else
      {
        this.syllabuses = [];
        this.modalService.dismissAll();
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
    }
  }

  addSyllabus()
  {
    const dialogRef = this.modalService.open(SyllabusAddComponent, 
    { 
      size: 'md', backdrop: 'static' 
    });
    dialogRef.componentInstance.modalParams = {};
  }

  
  updateStatus(syllabus : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to ' + (syllabus.isActive == 1 ? 'de-active' : 'active') + ' the syllabus?',
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
            id : syllabus.id,
            tableName : syllabus.tableName
          }
          this.showNotification("info", "Please wait...");
          let response = await this.commonService.updateStatus(tempJson).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
              this.showNotification("success", "Syllabus Updated");
              this.commonSharedService.syllabusListObject.next({
                result : "success", 
                responseData : {
                  academicSessionId : syllabus.academicSession.id,
                  schoolingProgramId : syllabus.schoolingProgram.id
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

  deleteSyllabus(syllabus : any)
  {
    Swal.fire({
      customClass: {
        container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to delete syllabus?',
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
        let tempJSON = { "id" : syllabus.id };
        try
        {
          let response = await this.commonService.deleteSyllabus(tempJSON).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.showNotification("success", "Syllabus Deleted.");
            this.commonSharedService.syllabusListObject.next({
              result : "success",
              responseData : {
                academicSessionId : syllabus.academicSession.id,
                schoolingProgramId : syllabus.schoolingProgram.id
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
