import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from 'src/app/theme/shared/service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { DataTablesModule } from 'angular-datatables';

// third party
import Swal from 'sweetalert2';
import { IOption, SelectModule } from 'ng-select';

@Component({
  selector: 'app-user-module-accessibility',
  standalone: true,
  imports: [CommonModule, SharedModule, DataTablesModule, SelectModule],
  templateUrl: './user-module-accessibility.component.html',
  styleUrls: ['./user-module-accessibility.component.scss']
})
export class UserModuleAccessibilityComponent 
{
  schoolForm : FormGroup;
  schoolingProgramForm : FormGroup;
  studyCenterForm : FormGroup;
  user : any;
  searchClicked : boolean;
  schoolClicked : boolean;
  schoolingProgramClicked : boolean;
  studyCenterClicked : boolean; 
  isValidForm : boolean;
  isValidForm1 : boolean;
  schoolAssignClicked : boolean;
  studyCenterAssignClicked : boolean;
  userSchoolSchoolingProgramClicked : boolean;
  userStudyCenterClicked : boolean;
  uuid : string;
  moduleId : number;
  userModule : any;
  schools : any[];
  masterSchoolingPrograms : any[];
  masterStudyCenters : any[];
  userSchoolSchoolingPrograms : any[];
  userStudyCenters : any[];
  schoolingPrograms : Array<IOption>;
  studyCenters : any[];

  constructor(private router : Router,
  private notifier: NotifierService, 
  private commonService : CommonService,
  private userService : UserService,
  private formbuilder: FormBuilder,
  private activatedRoute: ActivatedRoute,
  public commonSharedService : CommonSharedService,
  private location : Location, 
  private route: ActivatedRoute
  )
  {
    this.uuid = this.route.params['value'].uuid;
    this.moduleId = this.route.params['value'].moduleId;

    this.isValidForm = true;
    this.isValidForm1 = true;
    this.searchClicked = false;
    this.schoolAssignClicked = false;
    this.studyCenterAssignClicked = false;
    this.schoolClicked = false;
    this.schoolingProgramClicked = false;
    this.studyCenterClicked = false;
    this.userSchoolSchoolingProgramClicked = false;
    this.userStudyCenterClicked = false;
    this.schools = [];
    this.masterSchoolingPrograms = [];
    this.schoolingPrograms = [];
    this.masterStudyCenters = [];
    this.studyCenters = [];
    this.userSchoolSchoolingPrograms = [];
    this.userStudyCenters = [];
  }
  
  ngOnInit() 
  {
    this.schoolForm = this.formbuilder.group({
      school:['', Validators.required]
    });

    this.schoolingProgramForm = this.formbuilder.group({
      schoolingProgram:['', Validators.required]
    });

    this.studyCenterForm = this.formbuilder.group({
      studyCenter:['', Validators.required]
    });

    this.getUser(this.uuid);
    this.getUserSchoolSchoolingPrograms(this.uuid, this.moduleId);
    this.getUserStudyCenters(this.uuid, this.moduleId);
    this.getUserModules(this.uuid, 'All', this.moduleId);
    this.getSchools('');
    this.getStudyCenters();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  } 
  
  // get user
  async getUser(uuid : string) 
  {
    this.searchClicked = true;
    let response = await this.userService.getUser(uuid).toPromise(); 
    if (response.status_code == 200 && response.message == 'success') 
    {
      this.user = response.user;
      this.searchClicked = false;
    }
    else
    {
      this.user = [];
      this.searchClicked = false;
    }
  }

  // get user school schooling programs
  async getUserSchoolSchoolingPrograms(userUUID : string, moduleId : number) 
  {
    this.userSchoolSchoolingProgramClicked = true;
    let response = await this.userService.getUserSchoolSchoolingPrograms(userUUID, moduleId).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblUserSchool').DataTable().destroy();
      this.userSchoolSchoolingPrograms = response.userSchoolSchoolingPrograms;
      this.userSchoolSchoolingProgramClicked = false;
      setTimeout(function(){
        $('#tblUserSchool').DataTable();
      },800);
    }
    else
    {
        this.userSchoolSchoolingPrograms = [];
        this.userSchoolSchoolingProgramClicked = false;
    }
  }

  // get user school schooling programs
  async getUserStudyCenters(userUUID : string, moduleId : number) 
  {
    this.userStudyCenterClicked = true;
    let response = await this.userService.getUserStudyCenters(userUUID, moduleId).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
      $('#tblUserStudyCenter').DataTable().destroy();
      this.userStudyCenters = response.userStudyCenters;
      this.userStudyCenterClicked = false;
      setTimeout(function(){
        $('#tblUserStudyCenter').DataTable();
      },800);
    }
    else
    {
        this.userStudyCenters = [];
        this.userStudyCenterClicked = false;
    }
  }

  // get user module
  async getUserModules(userUUID : string, action : string, moduleId : number) 
  {
    this.searchClicked = true;
    let response = await this.userService.getUserModules(userUUID, action, moduleId).toPromise();
    if (response.status_code == 200 && response.message == 'success') 
    {
        this.userModule = response.userModules[0];
        this.searchClicked = false;
    }
    else
    {
        this.userModule = "";
        this.searchClicked = false;
    }
  }

  async getSchools(date : string) 
  {
    try
    {
        this.schoolClicked = true;
        let response = await this.commonService.getSchools("Active", date).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schools = response.schools;
            this.schools.unshift({ uuid : "", name : "Select School" });
            this.schoolClicked = false;
        }
        else
        {
            this.schools.unshift({ uuid : "", name : "Select School" });
            this.schoolClicked = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.schoolClicked = false;
    }
  }

  async getSchoolSchoolingPrograms(schoolUUID : string, date : string) 
  {
    try
    {
        this.schoolingProgramClicked = true;
        let tempSchoolingPrograms : Array<IOption> = [];
        this.schoolingProgramForm.get("schoolingProgram").setValue("");
        let response = await this.commonService.getSchoolSchoolingPrograms(schoolUUID, 'Active', date).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.masterSchoolingPrograms = response.schoolSchoolingPrograms;
            let allotedSchoolingPrograms : any[] = this.userSchoolSchoolingPrograms.filter((item) => item.school.uuid == schoolUUID);
            let findIndex : number = -1;
            for(let i = 0; i < this.masterSchoolingPrograms.length; i++)
            {
        ///Check Schooling Program Already Alloted
              if(allotedSchoolingPrograms.length > 0)
              {
                let schoolingPrograms : any[] = allotedSchoolingPrograms[0].schoolingPrograms;
                findIndex = schoolingPrograms.findIndex((item) => item.id == this.masterSchoolingPrograms[i]?.schoolingProgram.id);
              }
              if(findIndex == -1)
              {
                tempSchoolingPrograms.push({
                    'value' : this.masterSchoolingPrograms[i]?.schoolingProgram.id.toString(),
                    'label' : this.masterSchoolingPrograms[i]?.schoolingProgram.name
                })
              }
            }
        ////////
            if(tempSchoolingPrograms.length > 0)
            {
              tempSchoolingPrograms.unshift({
                'value' : '0',
                'label' : 'All'
              })
            }
            this.schoolingPrograms = this.commonSharedService.prepareSelectOptions(tempSchoolingPrograms);
            this.schoolingProgramClicked = false;
        }
        else
        {
          this.schoolingPrograms = [];
          this.schoolingProgramClicked = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.schoolingProgramClicked = false;
    }
  }

  async getStudyCenters() 
  {
    try
    {
        this.studyCenterClicked = true;
        let tempStudyCenter : Array<IOption> = [];
        this.studyCenterForm.get("studyCenter").setValue("");
        let response = await this.commonService.getStudyCenters(0, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.masterStudyCenters = response.studyCenters;
            for(let i = 0; i < this.masterStudyCenters.length; i++)
            {
              ///Check Study Center Already Alloted
              let findIndex : number = this.userStudyCenters.findIndex((item) => item.studyCenter.uuid == this.masterStudyCenters[i]?.uuid);
              if(findIndex == -1)
              {
                tempStudyCenter.push({
                  'value' : this.masterStudyCenters[i]?.uuid,
                  'label' : this.masterStudyCenters[i]?.name
                })
              }
          ////////              
            }
            if(tempStudyCenter.length > 0)
            {
              tempStudyCenter.unshift({
                'value' : '0',
                'label' : 'All'
              })
            }
            this.studyCenters = this.commonSharedService.prepareSelectOptions(tempStudyCenter);
            this.studyCenterClicked = false;
        }
        else
        {
          this.studyCenters = [];
          this.studyCenterClicked = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.studyCenterClicked = false;
    }
  }

  checkAllSchoolingProgram()
  {
    let schoolingProgramArray : string[] = this.schoolingProgramForm.get("schoolingProgram").value;
    let index = schoolingProgramArray.indexOf("0");
    if (index !== -1) 
    {
      this.schoolingProgramForm.get("schoolingProgram").setValue("0");
    }
  }

  checkAllStudyCenter()
  {
    let studyCenterArray : string[] = this.studyCenterForm.get("studyCenter").value;
    let index = studyCenterArray.indexOf("0");
    if (index !== -1) 
    {
      this.studyCenterForm.get("studyCenter").setValue("0");
    }
  }

  deleteUserSchool(userUUID : string, moduleId : number,  schoolUUID : string)
  {
      Swal.fire({
      customClass: {
          container: 'my-swal'
      },
      title: 'Confirmation',
      text: 'Are you sure to remove school and related schooling programs alloted for the module?',
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
                    user : {"uuid" : userUUID},
                    module : {"id" : moduleId},
                    school : {"uuid" : schoolUUID}
                 }
                  this.showNotification("info", "Please wait...");
                  let response = await this.userService.deleteUserSchool(tempJson).toPromise();
                  if (response.status_code == 200 && response.message == 'success') 
                  {
                      this.showNotification("success", "Assigned school and related schooling programs removed successfully");
                      this.getUserSchoolSchoolingPrograms(userUUID, moduleId);
                      this.getSchoolSchoolingPrograms(schoolUUID, '');
                  }
              }
              catch(e)
              {
                  this.showNotification("error", e);
              }
          }
      });   
  }

  deleteUserSchoolingProgram(userUUID : string, moduleId : number,  schoolUUID : string, schoolingProgramId : number)
  {
    Swal.fire({
    customClass: {
        container: 'my-swal'
    },
    title: 'Confirmation',
    text: 'Are you sure to remove schooling program alloted in this module for the school?',
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
                  user : {"uuid" : userUUID},
                  module : {"id" : moduleId},
                  school : {"uuid" : schoolUUID},
                  schoolingProgram : {"id" : schoolingProgramId}
                }
                this.showNotification("info", "Please wait...");
                let response = await this.userService.deleteUserSchoolSchoolingProgram(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Schooling program removed successfully");
                    this.getUserSchoolSchoolingPrograms(userUUID, moduleId);
                    this.getSchoolSchoolingPrograms(schoolUUID, '');
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
    });   
  }

  deleteUserStudyCenter(userUUID : string, moduleId : number,  studyCenterUUID : string)
  {
    Swal.fire({
    customClass: {
        container: 'my-swal'
    },
    title: 'Confirmation',
    text: 'Are you sure to remove assigned study center in this module?',
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
                  user : {"uuid" : userUUID},
                  module : {"id" : moduleId},
                  studyCenter : {"uuid" : studyCenterUUID}
                }
                this.showNotification("info", "Please wait...");
                let response = await this.userService.deleteUserStudyCenter(tempJson).toPromise();
                if (response.status_code == 200 && response.message == 'success') 
                {
                    this.showNotification("success", "Study Center removed successfully");
                    this.getUserStudyCenters(userUUID, moduleId);
                    this.getStudyCenters();
                }
            }
            catch(e)
            {
                this.showNotification("error", e);
            }
        }
    });   
  }

  async saveUserSchoolSchoolingPrograms()
  {
    try
    {
      if(this.schoolForm.valid && this.schoolingProgramForm.valid && !this.schoolAssignClicked)
      {
        this.isValidForm = true;
        this.schoolAssignClicked = true;
        let tempJSON = {
          user : {"uuid" : this.uuid},
          module : {"id" : this.moduleId},
          school : {"uuid" : this.schoolForm.get("school").value},
          schoolingProgramIds : this.schoolingProgramForm.get("schoolingProgram").value.toString()
        }
        let response = await this.userService.saveUserSchoolSchoolingPrograms(tempJSON).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification("success", "School And Schooling Programs Saved Successfully");
          this.getUserSchoolSchoolingPrograms(this.uuid, this.moduleId);
          this.getSchoolSchoolingPrograms(this.schoolForm.get("school").value, '');
          this.schoolAssignClicked = false;
        }
      }
      else
      {
        this.isValidForm = false;
        this.schoolAssignClicked = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.schoolAssignClicked = false;
    }
  }

  async saveUserStudyCenters()
  {
    try
    {
      if(this.studyCenterForm.valid && !this.studyCenterAssignClicked)
      {
        this.isValidForm1 = true;
        this.studyCenterAssignClicked = true;
        let tempJSON = {
          user : {"uuid" : this.uuid},
          module : {"id" : this.moduleId},
          studyCenterUUIDs : this.studyCenterForm.get("studyCenter").value.toString()
        }
        let response = await this.userService.saveUserStudyCenters(tempJSON).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.showNotification("success", "Study Centers Saved Successfully");
          this.getUserStudyCenters(this.uuid, this.moduleId);
          this.getStudyCenters();
          this.studyCenterAssignClicked = false;
        }
      }
      else
      {
        this.isValidForm1 = false;
        this.studyCenterAssignClicked = false;
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.studyCenterAssignClicked = false;
    }
  }

  back()
  {
    this.location.back();
  }
}
