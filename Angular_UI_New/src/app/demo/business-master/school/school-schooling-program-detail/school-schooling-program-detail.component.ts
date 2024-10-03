import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { Router } from '@angular/router';
// my Shared Service
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';

// third party
import Swal from 'sweetalert2';

@Component({
  selector: 'app-school-schooling-program-detail',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './school-schooling-program-detail.component.html',
  styleUrls: ['./school-schooling-program-detail.component.scss']
})
export class SchoolSchoolingProgramDetailComponent {
  @Input() public modalParams;
  schoolSchoolingProgram : any;

  constructor(
    private commonService: CommonService, 
    private activeModal: NgbActiveModal,
    private notifier: NotifierService,
    private formbuilder: FormBuilder,
    private router : Router,
    public commonSharedService : CommonSharedService,
  ) 
  {
  }
  ngOnInit() 
  {
    //get Modal params
    this.schoolSchoolingProgram = this.modalParams.schoolSchoolingProgram;
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  closeModal()
  {
    this.activeModal.close(); 
  }
}
