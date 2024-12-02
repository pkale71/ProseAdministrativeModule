import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { CommonService } from 'src/app/theme/shared/service/common.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-subject-group-allocation-add',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './subject-group-allocation-add.component.html',
  styleUrls: ['./subject-group-allocation-add.component.scss']
})
export class SubjectGroupAllocationAddComponent 
{
  @Input() public modalParams;
  searchClickedSubject : boolean;
  subjectGroup : any;
  subjects : any[];
  saveClicked : boolean;
  isValidForm : boolean;
  addSubjectGroupAllocationForm : FormGroup;
  selectedSubjects : string;
  prevAllocatedSubjects : any[];

  constructor(
    private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    public commonSharedService : CommonSharedService,
    )
  {
  }

  ngOnInit() 
  {
    this.selectedSubjects = "";
    this.subjects = [];
    this.isValidForm = true;
    this.saveClicked = false;
    this.subjectGroup = this.modalParams?.subjectGroup;

    this.addSubjectGroupAllocationForm = this.formbuilder.group({
      subjectGroup: this.formbuilder.group({ 'id': [this.subjectGroup?.id, Validators.required] }),
      subjects: ['']
    });

    this.prevAllocatedSubjects = this.modalParams?.allocatedSubjects;
    this.getSubjects();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getSubjects() 
  {
    try
    {
      this.subjects = [];
      let syllabusId = this.subjectGroup.syllabus?.id;
      let gradeCategoryId = this.subjectGroup.gradeCategory?.id;
      let gradeId = this.subjectGroup.grade?.id;
      if(syllabusId != "" && gradeCategoryId != "" && gradeId != "")
      {
        this.searchClickedSubject = true;
        let response = await this.commonService.getSubjects(gradeCategoryId, gradeId, syllabusId, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.subjects = response.subjects;
          this.filterPrevAllocatedSubject();
          this.searchClickedSubject = false;
        }
        else
        {
          this.searchClickedSubject = false;
        }
      }
    }
    catch(e)
    {
      this.showNotification("error", e);
      this.searchClickedSubject = false;
    }
  }

  filterPrevAllocatedSubject()
  {
    let unallocatedSubjects : any[] = [];
    for(let i=0;i<this.subjects.length;i++)
    {
      let tempSubjects = this.prevAllocatedSubjects.filter(allocatedSubject => allocatedSubject.subject.id === this.subjects[i].id);
      if(tempSubjects.length == 0)
      {
        unallocatedSubjects.push(this.subjects[i]);
      }
    }
    this.subjects = unallocatedSubjects;
  }

  selSubjects(event : any)
  {
    if(!event.target.checked)
    {
      this.selectedSubjects = this.commonSharedService.removeCommaSeperatedString(this.selectedSubjects, event.target.value);
    }
    else if(event.target.checked)
    {
      if(this.selectedSubjects == "")
      {
        this.selectedSubjects = event.target.value;
      }
      else
      {
        this.selectedSubjects = this.selectedSubjects + "," + event.target.value;
      }
    }
  }

  async saveSubjectGroupAllocation()
  {
    if(!this.saveClicked)
    {
      if(this.selectedSubjects == "")
      {
        this.showNotification("warning", "Select The Subjects");
      }
      else
      {
        if(this.addSubjectGroupAllocationForm.valid && this.selectedSubjects != "")
        {
          this.isValidForm = true;
          this.saveClicked = true;
          this.addSubjectGroupAllocationForm.get("subjects").setValue(this.selectedSubjects);

          try
          {
            let response = await this.commonService.updateSubjectGroupAllocation(this.addSubjectGroupAllocationForm.value).toPromise();
            if (response.status_code == 200 && response.message == 'success') 
            {
                this.showNotification("success", "Subject Allocation Saved");
                this.commonSharedService.subjectGroupAllocationListObject.next({ result : "success" });
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
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
