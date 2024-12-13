import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/theme/shared/service/common.service';
import { AdmissionService } from 'src/app/theme/shared/service/admission.service';
import { CommonSharedService } from 'src/app/theme/shared/service/common-shared.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-blank-admission-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './blank-admission-form.component.html',
  styleUrls: ['./blank-admission-form.component.scss']
})
export class BlankAdmissionFormComponent 
{
  schoolForm : FormGroup;
  schoolingProgramForm : FormGroup;
  academicSessionForm : FormGroup;
  gradeCategoryForm : FormGroup;
  gradeForm : FormGroup;
  syllabusForm : FormGroup;
  subjectGroupForm : FormGroup;
  blankAdmissionForm : FormGroup;
  selectedSubjects : any[];
  minSubject : number;
  maxSubject : number;
  schools : any[];
  schoolingPrograms : any[];
  academicSessions : any[];
  gradeCategories : any[];
  grades : any[];
  syllabuses : any[];
  subjectGroups : any[];
  subjectGroupAllocations : any[];
  isValidForm : boolean;
  generateClicked : boolean;
  searchClickedSchool : boolean;
  searchClickedSchoolingProgram : boolean;
  searchClickedAcademicSession : boolean;
  searchClickedGrade : boolean;
  searchClickedSyllabus : boolean;
  searchClickedSubjectGroup : boolean;
  searchClickedSubject : boolean;
  curDate : string;
  logoBase64 : string;

  constructor(private notifier: NotifierService, 
  private activatedRoute: ActivatedRoute,
  private commonService: CommonService, 
  private admissionService : AdmissionService,
  public commonSharedService : CommonSharedService,
  private formbuilder: FormBuilder,
  private router : Router, 
  private location : Location)
  {
    this.schools = [];
    this.schoolingPrograms = [];
    this.academicSessions = [];
    this.gradeCategories = [];
    this.grades = [];
    this.syllabuses = [];
    this.subjectGroups = [];
    this.subjectGroupAllocations = [];
    this.searchClickedAcademicSession = false;
    this.searchClickedSchool = false;
    this.searchClickedSchoolingProgram = false;
    this.isValidForm = true;
    this.searchClickedGrade = false;
    this.searchClickedSyllabus = false;
    this.searchClickedSubjectGroup = false;
    this.searchClickedSubject = false;
    this.generateClicked = false;
    this.curDate = moment(new Date()).format('YYYY-MM-DD');
  }

  ngOnInit() 
  {
    this.schoolForm = this.formbuilder.group({
      school:['', Validators.required]
    });

    this.schoolingProgramForm = this.formbuilder.group({
      schoolingProgram:['', Validators.required]
    });

    this.academicSessionForm = this.formbuilder.group({
      academicSession:['', Validators.required]
    });

    this.gradeCategoryForm = this.formbuilder.group({
      gradeCategory:['', Validators.required]
    });
    
    this.gradeForm = this.formbuilder.group({
      grade:['', Validators.required]
    });

    this.syllabusForm = this.formbuilder.group({
      syllabus:['', Validators.required]
    });

    this.subjectGroupForm = this.formbuilder.group({
      subjectGroup:['', Validators.required]
    });

    this.blankAdmissionForm = this.formbuilder.group({
      "issuerName" : ['', Validators.required],
    });

    this.getSchools(this.curDate);
    this.getAcademicSessions();
    this.getGradeCategories();
  }

  showNotification(type: string, message: string): void 
  {
    //type : default, info, success, warning, error
    this.notifier.notify(type, message);
  }

  async getAcademicSessions() 
  {  
    try
    {
      this.searchClickedAcademicSession = true;
      let response = await this.commonService.getAcademicSessions().toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.academicSessions = response.academicSessions.filter(academicSession => academicSession.isCurrent = 1);
        this.searchClickedAcademicSession = false;
        if(this.academicSessions.length > 0)
        {
          this.academicSessionForm.get("academicSession").setValue(this.academicSessions[0].id);
        }
      }
      else
      {
        this.academicSessions = [];
        this.academicSessions.unshift({"id" : "", "year" : "Select Academic Session"});
        this.searchClickedAcademicSession = false;
      }
    }
    catch(e)
    {
      this.academicSessions = [];
      this.showNotification("error", e);
      this.searchClickedAcademicSession = false;
    }
  }

  async getSchools(date : string) 
  {
    try
    {
        this.searchClickedSchool = true;
        let response = await this.commonService.getSchools("Active", date).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schools = response.schools;
            this.schools.unshift({ uuid : "", name : "Select School" });
            this.searchClickedSchool = false;
        }
        else
        {
            this.schools.unshift({ uuid : "", name : "Select School" });
            this.searchClickedSchool = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSchool = false;
    }
  }

  async getSchoolSchoolingPrograms(schoolUUID : string, date : string) 
  {
    try
    {
        this.searchClickedSchoolingProgram = true;
        this.schoolingProgramForm.get("schoolingProgram").setValue("");
        let response = await this.commonService.getSchoolSchoolingPrograms(schoolUUID, 'Active', date).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
            this.schoolingPrograms = response.schoolSchoolingPrograms;
            this.schoolingPrograms.unshift({schoolingProgram : { id : "", name : "Select Schooling Program" }});
            this.searchClickedSchoolingProgram = false;
        }
        else
        {
            this.schoolingPrograms.unshift({schoolingProgram : { id : "", name : "Select Schooling Program" }});
            this.searchClickedSchoolingProgram = false;
        }
    }
    catch(e)
    {
        this.showNotification("error", e);
        this.searchClickedSchoolingProgram = false;
    }
  }

  async getGradeCategories() 
  {  
    try
    {
      let response = await this.commonService.getGradeCategories('Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.gradeCategories = response.gradeCategories;
        this.gradeCategories.unshift({id : "", name : "Select Grade Category"});
      }
      else
      {
        this.gradeCategories = [];
      }
    }
    catch(e)
    {
      this.gradeCategories = [];
      this.showNotification("error", e);
    }
  }

  async getGrades(gradeCategoryId : number) 
  {  
    try
    {
      //////Get Syllabuses
      this.getSyllabuses(gradeCategoryId);
      //////////
      this.gradeForm.get("grade").setValue("");
      this.searchClickedGrade = true;
      let response = await this.commonService.getGrades(gradeCategoryId, 'Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.grades = response.grades;
        this.grades.unshift({id : "", name : "Select Grade"});
        this.searchClickedGrade = false;
      }
      else
      {
        this.grades = [];
        this.searchClickedGrade = false;
      }
    }
    catch(e)
    {
      this.grades = [];
      this.searchClickedGrade = false;
      this.showNotification("error", e);
    }
  }

  async getSyllabuses(gradeCategoryId : number) 
  {  
    try
    {
      this.syllabusForm.get("syllabus").setValue("");
      this.searchClickedSyllabus = true;
      let response = await this.commonService.getSyllabuses(gradeCategoryId, 'Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.syllabuses = response.syllabuses;
        this.syllabuses.unshift({id : "", name : "Select Syllabus"});
        this.searchClickedSyllabus = false;
      }
      else
      {
        this.syllabuses = [];
        this.searchClickedSyllabus = false;
      }
    }
    catch(e)
    {
      this.syllabuses = [];
      this.searchClickedSyllabus = false;
      this.showNotification("error", e);
    }
  }
 
  async getSubjectGroups(gradeCategoryId : number, gradeId : number, syllabusId : number) 
  {  
    try
    {
      this.subjectGroupForm.get("subjectGroup").setValue("");
      this.searchClickedSubjectGroup = true;
      let response = await this.commonService.getSubjectGroups(syllabusId, gradeCategoryId, gradeId, 'Active').toPromise();
      if (response.status_code == 200 && response.message == 'success') 
      {
        this.subjectGroups = response.subjectGroups;
        this.subjectGroups.unshift({id : "", groupName : "Select Subject Group"});
        this.searchClickedSubjectGroup = false;
      }
      else
      {
        this.subjectGroups = [];
        this.searchClickedSubjectGroup = false;
      }
    }
    catch(e)
    {
      this.subjectGroups = [];
      this.searchClickedSubjectGroup = false;
      this.showNotification("error", e);
    }
  }

  async getSubjects(subjectGroupId : number) 
  {  
    try
    {
      this.selectedSubjects = [];
      if(subjectGroupId > 0)
      {
        this.searchClickedSubject = true;
        let response = await this.commonService.getSubjectGroupAllocations(subjectGroupId, 'Active').toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.subjectGroupAllocations = response.subjectGroupAllocations;
      ////Get Subject Group Minimum And Maximum Subject
          let tempSubjectGroups = this.subjectGroups.filter(subjectGroup=>subjectGroup.id == subjectGroupId);
          if(tempSubjectGroups.length > 0)
          {
            this.minSubject = tempSubjectGroups[0].minSubject;
            this.maxSubject = tempSubjectGroups[0].maxSubject;
          }
      //////
      ////Mandatory Subject Selections
          this.subjectGroupAllocations.forEach((allocation) => {
            allocation.subject.isSelected = allocation.subject?.isMandatory === 1;
            if(allocation.subject.isSelected)
            {
              this.selectedSubjects.push([
                this.selectedSubjects.length + 1, // Incrementing the length for the serial number
                allocation?.subject.name, // Subject name
                allocation?.subject.isMandatory === 1 ? 'Yes' : 'No' // Whether it's mandatory
              ]);              
            }
          });
      /////////////
          this.searchClickedSubject = false;
        }
        else
        {
          this.subjectGroupAllocations = [];
          this.searchClickedSubject = false;
        }
      }
      else
      {
        this.subjectGroupAllocations = [];
        this.searchClickedSubject = false;
      }
    }
    catch(e)
    {
      this.subjectGroupAllocations = [];
      this.searchClickedSubject = false;
      this.showNotification("error", e);
    }
  }

  selSubjects(event : any)
  {
    this.selectedSubjects = [];
    this.subjectGroupAllocations.forEach((allocation) => {
      if(parseInt(event.target.value) === parseInt(allocation.subject.id))
      {
        if(!event.target.checked)
        {
          allocation.subject.isSelected = 0;
        }
        else
        {
          allocation.subject.isSelected = 1;
        }
      }
    });

    this.subjectGroupAllocations.forEach((allocation) => {
      if(allocation.subject.isSelected)
      {
        this.selectedSubjects.push([
          this.selectedSubjects.length + 1, // Incrementing the length for the serial number
          allocation?.subject.name, // Subject name
          allocation?.subject.isMandatory === 1 ? 'Yes' : 'No' // Whether it's mandatory
        ]);              
      }
    });
  }

  pdfGeneration()
  {
    ///////Form Data
    let issuerName = this.blankAdmissionForm.get("issuerName").value;
    let academicYear = this.academicSessions.filter(acs=>acs.id == this.academicSessionForm.get("academicSession").value)[0]?.year;
    let schoolName = this.schools.filter(school=>school.uuid == this.schoolForm.get("school").value)[0]?.name;
    let schoolingProgram = this.schoolingPrograms.filter(sp=>sp.schoolingProgram.id == this.schoolingProgramForm.get("schoolingProgram").value)[0]?.schoolingProgram?.name;
    let syllabus = this.syllabuses.filter(syllabus=>syllabus.id == this.syllabusForm.get("syllabus").value)[0]?.name;
    let gradeCategory = this.gradeCategories.filter(gradeCategory=>gradeCategory.id == this.gradeCategoryForm.get("gradeCategory").value)[0]?.name;
    let grade = this.grades.filter(grade=>grade.id == this.gradeForm.get("grade").value)[0]?.name;


    // Generate the file name
    const fileName = "BlankAdmissionForm.pdf";

    const doc = new jsPDF();
/////Page-1
    // Add Image (Logo) on top-left corner (x=10, y=10, width=20, height=20)
    doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
    if(this.logoBase64 != "")
    {
       doc.addImage(this.logoBase64, 'PNG', 150, 5, 40, 10);
    }
    doc.setFontSize(20);
    doc.setFont("arial", "bold");
    doc.text('Admission Application Form', 100, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("arial", "bold");
    doc.text(`Form Issued To: ${issuerName}`, 8, 35, { align: "left" });
    doc.text(`Academic Year: ${academicYear}`, 200, 35, { align: "right" });

    doc.setFontSize(12);
    doc.setFont("arial", "bold");
    doc.text('Student Profile', 8, 45, { align: "left" });

    // Create table data
    const tableColumns = [];
    const tableData = [
      ['Full Name (as per Aadhaar/Passport)', ''],
      ['Date of Birth', ''],
      ['Gender', ''],
      ['Nationality', ''],
      ['Aadhaar Number', ''],
      ['Passport Number', '']
    ];
    autoTable(doc, {
      body: tableData,
      startY: 50, // Position where the table starts
      theme: 'plain',
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.5, // Table border thickness
      styles: {
        lineWidth: 0.1, // Cell border thickness
        lineColor: [0, 0, 0], // Cell border color (black)
        valign: 'middle', // Set default vertical alignment for all cells
        fontSize: 10, // Font size for table content
      },
      columnStyles: {
        0: { cellWidth: 80, minCellHeight : 10 },
        1: { minCellHeight : 10 }
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [0, 0, 0], 
        lineWidth: 0.5, // Header border thickness
        lineColor: [0, 0, 0], // Header border color
      },
      bodyStyles: {
        lineWidth: 0.5, // Body cell border thickness
        lineColor: [0, 0, 0], // Body cell border color
      },
      margin: { top: 10 },
    });

    doc.setFontSize(12);
    doc.setFont("arial", "bold");
    doc.text('Parent/Guardian Profile', 8, 125, { align: "left" });

    // Create table data
    const tableColumns1 = [];
    const tableData1 = [
      ['Full Name (as per Aadhaar/Passport)', ''],
      ['Relationship with Student', ''],
      ['Mobile Number', ''],
      ['Email', ''],
      ['Postal Address', ''],
      ['Aadhaar Number', ''],
      ['PAN Number', ''],
      ['Passport Number', '']
    ];
    autoTable(doc, {
      body: tableData1,
      startY: 130, // Position where the table starts
      theme: 'plain',
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.5, // Table border thickness
      styles: {
        lineWidth: 0.1, // Cell border thickness
        lineColor: [0, 0, 0], // Cell border color (black)
        valign: 'middle', // Set default vertical alignment for all cells
        fontSize: 10, // Font size for table content
      },
      columnStyles: {
        0: { cellWidth: 80, minCellHeight : 10 },
        1: { minCellHeight : 10 }
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [0, 0, 0], 
        lineWidth: 0.5, // Header border thickness
        lineColor: [0, 0, 0], // Header border color
      },
      bodyStyles: {
        lineWidth: 0.5, // Body cell border thickness
        lineColor: [0, 0, 0], // Body cell border color
      },
      margin: { top: 10 },
    });

    doc.setFontSize(12);
    doc.setFont("arial", "bold");
    doc.text('Admission Details', 8, 225, { align: "left" });

    // Create table data
    const tableColumns2 = [];
    const tableData2 = [
      ['School Name', `${schoolName} - ${schoolingProgram}`],
      ['Syllabus', `${syllabus}`],
      ['Grade Category', `${gradeCategory}`],
      ['Class Seeking Admission', `${grade}`]
    ];
    autoTable(doc, {
      body: tableData2,
      startY: 230, // Position where the table starts
      theme: 'plain',
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.5, // Table border thickness
      styles: {
        lineWidth: 0.1, // Cell border thickness
        lineColor: [0, 0, 0], // Cell border color (black)
        valign: 'middle', // Set default vertical alignment for all cells
        fontSize: 10, // Font size for table content
      },
      columnStyles: {
        0: { cellWidth: 80, minCellHeight : 10 },
        1: { minCellHeight : 10 }
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [0, 0, 0], 
        lineWidth: 0.5, // Header border thickness
        lineColor: [0, 0, 0], // Header border color
      },
      bodyStyles: {
        lineWidth: 0.5, // Body cell border thickness
        lineColor: [0, 0, 0], // Body cell border color
      },
      margin: { top: 10 },
    });

////Page-2
    doc.addPage();
    
    doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
    if(this.logoBase64 != "")
    {
        doc.addImage(this.logoBase64, 'PNG', 150, 5, 40, 10);
    }
    doc.setFontSize(12);
    doc.setFont("arial", "bold");
    doc.text('Subject Details', 8, 25, { align: "left" });

    // Create table data
    const tableColumns3 = ['Sr.No.', 'Subject', 'Is Mandatory'];
    const tableData3 = this.selectedSubjects;
    autoTable(doc, {
      head: [tableColumns3],
      body: tableData3,
      startY: 30, // Position where the table starts
      theme: 'plain',
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.5, // Table border thickness
      styles: {
        lineWidth: 0.1, // Cell border thickness
        lineColor: [0, 0, 0], // Cell border color (black)
        valign: 'middle', // Set default vertical alignment for all cells
        fontSize: 10, // Font size for table content
      },
      columnStyles: {
        0: { minCellHeight : 10 },
        1: { minCellHeight : 10 },
        2: { minCellHeight : 10 }
      },
      headStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], 
        lineWidth: 0.5, // Header border thickness
        lineColor: [0, 0, 0], // Header border color
      },
      bodyStyles: {
        lineWidth: 0.5, // Body cell border thickness
        lineColor: [0, 0, 0], // Body cell border color
      },
      margin: { top: 10 },
    });

    doc.setFontSize(12);
    doc.setFont("arial", "bold");
    doc.text('Student Sport Engagement', 8, 110, { align: "left" });

    // Create table data
    const tableColumns4 = [];
    const tableData4 = [
      ['Engagement Since', ''],
      ['Academy Country', ''],
      ['Academy State', ''],
      ['Academy District', ''],
      ['Academy City', ''],
      ['Academy Name', ''],
      ['Academy  Contact No.', ''],
      ['Academy Address', ''],
      ['Coach Name', ''],
      ['Coach Contact No.', '']
    ];
    autoTable(doc, {
      body: tableData4,
      startY: 115, // Position where the table starts
      theme: 'plain',
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.5, // Table border thickness
      styles: {
        lineWidth: 0.1, // Cell border thickness
        lineColor: [0, 0, 0], // Cell border color (black)
        valign: 'middle', // Set default vertical alignment for all cells
        fontSize: 10, // Font size for table content
      },
      columnStyles: {
        0: { cellWidth: 80, minCellHeight : 10 },
        1: { minCellHeight : 10 }
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [0, 0, 0], 
        lineWidth: 0.5, // Header border thickness
        lineColor: [0, 0, 0], // Header border color
      },
      bodyStyles: {
        lineWidth: 0.5, // Body cell border thickness
        lineColor: [0, 0, 0], // Body cell border color
      },
      margin: { top: 10 },
    });

    doc.setFontSize(12);
    doc.setFont("arial", "bold");
    doc.text('Previous Education Details', 8, 225, { align: "left" });

    // Create table data
    const tableColumns5 = [];
    const tableData5 = [
      ['School Name', ''],
      ['Addresss', ''],
      ['Country', ''],
      ['State', ''],
      ['District', '']
    ];
    autoTable(doc, {
      body: tableData5,
      startY: 230, // Position where the table starts
      theme: 'plain',
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.5, // Table border thickness
      styles: {
        lineWidth: 0.1, // Cell border thickness
        lineColor: [0, 0, 0], // Cell border color (black)
        valign: 'middle', // Set default vertical alignment for all cells
        fontSize: 10, // Font size for table content
      },
      columnStyles: {
        0: { cellWidth: 80, minCellHeight : 10 },
        1: { minCellHeight : 10 }
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [0, 0, 0], 
        lineWidth: 0.5, // Header border thickness
        lineColor: [0, 0, 0], // Header border color
      },
      bodyStyles: {
        lineWidth: 0.5, // Body cell border thickness
        lineColor: [0, 0, 0], // Body cell border color
      },
      margin: { top: 10 },
    });

/////Page-3 
    doc.addPage();
    doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
    if(this.logoBase64 != "")
    {
        doc.addImage(this.logoBase64, 'PNG', 150, 5, 40, 10);
    }
    doc.setFontSize(12);
    doc.setFont("arial", "bold");
    
    // Create table data
    const tableColumns5_1 = [];
    const tableData5_1 = [
      ['City', ''],
      ['Syllabus', ''],
      ['Grade', ''],
      ['Medium Of Education', ''],
      ['Last Academic Year', '']
    ];
    autoTable(doc, {
      body: tableData5_1,
      startY: 25, // Position where the table starts
      theme: 'plain',
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.5, // Table border thickness
      styles: {
        lineWidth: 0.1, // Cell border thickness
        lineColor: [0, 0, 0], // Cell border color (black)
        valign: 'middle', // Set default vertical alignment for all cells
        fontSize: 10, // Font size for table content
      },
      columnStyles: {
        0: { cellWidth: 80, minCellHeight : 10 },
        1: { minCellHeight : 10 }
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [0, 0, 0], 
        lineWidth: 0.5, // Header border thickness
        lineColor: [0, 0, 0], // Header border color
      },
      bodyStyles: {
        lineWidth: 0.5, // Body cell border thickness
        lineColor: [0, 0, 0], // Body cell border color
      },
      margin: { top: 10 },
    });

    doc.setFontSize(12);
    doc.setFont("arial", "bold");
    doc.text('Declaration:', 8, 85, { align: "left" });

    doc.setFontSize(11);
    doc.setFont("arial", "bold");
    // Split text into lines based on the page width
    const pageWidth = doc.internal.pageSize.width; // Get page width
    const marginLeft = 14; // Left margin
    const textWidth = pageWidth - marginLeft * 2; // Available width for text
    let startLinY : number = 95;

    let lines : string[] = [
      "All information given above is True.",
      "I promise to abide by the rules and regulations of the school.",
      "I promise to send my child to school regularly and report, in writing the reasons for his/her absence.",
      "I promise that I shall ensure the attendance of my child in all the programmes organized by the school for which his/her participation is required.",
      "I promise that I shall report in person/online to the principal (class teacher) whenever asked to.",
      "I promise that I shall take responsibility for my child's conduct.",
      "I promise that I shall cooperate with the authorities in all the activities of the school and that I will attend the Parent-Teacher meetings without fail.",
      "I know that all grievances to be submitted to concerned authority of the school with utmost respect and wait for a response with patience.",
      "I know that the admission of my child to Gamechanger Schooling Program is not a matter of right and any violation of the rules and regulations of the institution would result in my child being removed from the roll of the school.",
      "I will inform the school immediately if the student changes a particular sports academy and join a new one. Will also update the school with the new academy details.",
      "I will keep the school informed on all the sports achievements and the progress in sports of the student.",
      "I will ensure my child does 1 hour of self-study daily and submit the assignments given.",
      "I will ensure my child attends planned assessment sincerely and honestly.",
      "I am aware that its my responsibility to take my child to the NIOS Study center for submission of assignments and writing exams.",
      "I undertake to submit all the required document evidences to complete the admission process of my ward, as listed in 'Documents to be Submitted During Admission' section.",
      "I hereby declare that all the information furnished in this application are true and correct."
    ]
    
    for(let i=0;i<lines.length;i++)
    {
      lines[i] = doc.splitTextToSize(`${i+1}. ${lines[i]}`, textWidth);
      doc.text(lines[i], marginLeft, startLinY);
      if(lines[i].length == 1)
      {
        startLinY+=10;
      }
      else
      {
        startLinY+=(10 * (lines[i].length/2)) + 5;
      }
    }
    
    doc.addPage();
    doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
    if(this.logoBase64 != "")
    {
        doc.addImage(this.logoBase64, 'PNG', 150, 5, 40, 10);
    }
    doc.setFontSize(12);
    doc.setFont("arial", "bold");

    doc.text('Signature', 8, 25, { align: "left" });
    doc.text('Name:', 8, 35, { align: "left" });
    doc.text('Parent/Guardian:', 8, 45, { align: "left" });

    doc.text('Place:', 150, 25, { align: "left" });
    doc.text('Date:', 150, 35, { align: "left" });

    doc.save(fileName);
  }

  async generateAdmissionForm()
  {
    try
    {
      if(this.blankAdmissionForm.valid && this.schoolForm.valid && this.academicSessionForm.valid && this.schoolingProgramForm.valid && this.syllabusForm.valid && this.gradeCategoryForm.valid && this.gradeForm.valid && this.subjectGroupForm.valid && this.subjectGroupAllocations.length > 0)
      {
        this.generateClicked = true;
        this.isValidForm = true;
        let response = await this.commonService.getSchoolLogo(this.schoolForm.get("school").value).toPromise();
        if (response.status_code == 200 && response.message == 'success') 
        {
          this.logoBase64 = response.fileData;
          this.pdfGeneration();
          this.generateClicked = false;
        }
        else
        {
          this.logoBase64 = "";
          this.pdfGeneration();
          this.generateClicked = false;
        }      
      }
      else
      {
        this.isValidForm = false;
      }
    }
    catch(e)
    {
      this.logoBase64 = "";
      this.pdfGeneration();
      this.generateClicked = false;
    }
  }

  back()
  {
    this.location.back();
  }
}
