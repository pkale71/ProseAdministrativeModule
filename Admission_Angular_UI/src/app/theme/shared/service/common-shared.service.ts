import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { FormGroup } from '@angular/forms';
import { IOption } from 'ng-select';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommonSharedService 
{
    public baseUrl : string;
    public adminBaseUrl : string;
    public yearCalenderCardComponentObject = new Subject<any>();
    public userListObject = new Subject<any>();
    public currentAcademicYearListObject = new Subject<any>();
    public loginUser : any;
    ////////////////
    public taxTypeListObject = new Subject<any>();
    public feeTypeListObject = new Subject<any>();
    public discountTypeListObject = new Subject<any>();
    public taxRateListObject = new Subject<any>();
    public studentDocumentListObject = new Subject<any>();
    public feeCategoryListObject = new Subject<any>();
    public courseExitReasonListObject = new Subject<any>();
    public gradeSectionListObject = new Subject<any>();
    public subjectGroupListObject = new Subject<any>();
    public subjectGroupAllocationListObject = new Subject<any>();
    public feeStructureListObject = new Subject<any>();
    public userModulesListObject = new Subject<any>();

    constructor() 
    { 
        this.baseUrl = location.origin;
        this.loginUser = JSON.parse(localStorage.getItem('user'));
    }

    public confirmPasswordValidator(controlName: string, matchingControlName: string)
    {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

    public prepareSelectOptions(options: Array<IOption>): Array<IOption> {
        return options.map((option) => ({ value: option.value, label: option.label }));
    }

    public ExcelFormatDownload(formatFor : string) 
    {
        // Create a link element
        const link = document.createElement('a');
    
        // Set the href attribute of the link to the file URL
        link.href = environment.apiUrl + '/common/downloadExcelFormat/' + formatFor;
    
        // Set the download attribute to suggest a filename
        // This is optional and depends on the API response headers
        link.download = '';
    
        // Append the link to the document body
        document.body.appendChild(link);
    
        // Programmatically click the link to trigger the download
        link.click();
    
        // Remove the link from the document
        document.body.removeChild(link);
    }

    public removeCommaSeperatedString(inputString : string, removeString : string)
    {
        // Convert the input string into an array by splitting at commas
        let items = inputString.toString().split(',');

        // Remove all instances of the removeString from the array
        items = items.filter(item => item.trim() !== removeString.trim());

        // Join the array back into a string with commas and trim any extra spaces
        let result = items.join(',').trim();

        // If the result is empty or only contains commas, return an empty string
        if (result === '' || result === ',') {
            result = '';
        }

        return result;
    }

    public convertTo12HourFormat(time24: string)
    {
        const [hour, minute] = time24.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
    }

    public getOrdinal(n : number,  extraText : string) 
    {
        let suffix = "th";
        if (n % 100 < 11 || n % 100 > 13) 
        {
            switch (n % 10) 
            {
                case 1: suffix = "st"; break;
                case 2: suffix = "nd"; break;
                case 3: suffix = "rd"; break;
            }
        }
        return `${n}${suffix} ${extraText}`;
    }

    public DirectFileDownload(fileData: Blob, fileName: string) 
    {
        // Create a temporary object URL for the file
        const objectUrl = URL.createObjectURL(fileData);

        // Create a link element
        const link = document.createElement('a');
        link.href = objectUrl;

        // Set the suggested filename for download
        link.download = fileName;

        // Append the link to the document body
        document.body.appendChild(link);

        // Programmatically trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);

        // Revoke the object URL to free memory
        URL.revokeObjectURL(objectUrl);
    }

    public formatDate(dateStr: string): string 
    {
        const [year, month, day] = dateStr.split('-');  // Split the string into year, month, and day
        return `${day}/${month}/${year}`;  // Return in dd/MM/yyyy format
    }

    public generateReceiptPDF(studentName: string, grade : string, enrollmentNumber : string, feeReceipt: any) 
    {
        // Generate the file name
        const fileName = (feeReceipt?.receiptNumber).toString().split("/").join("_") + ".pdf";
    
        const doc = new jsPDF();
    
        // Add Image (Logo) on top-left corner (x=10, y=10, width=20, height=20)
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 15);
    
        // Header Section
        doc.setFontSize(18);
        doc.setFont("arial", "bold");
        doc.text("RECEIPT", 95, 20, { align: "center" });
    
        // Organization Details (aligned to the right side)
        const pageWidth = doc.internal.pageSize.width; // Page width in mm
        const rightMargin = 10; // Right margin in mm
        const rightAlignX = pageWidth - rightMargin;
    
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.setFont("arial", "normal");
        doc.text("PROSE EDUCATION ACADEMY PVT LTD", rightAlignX, 10, { align: "right" });
        doc.setFontSize(10);
        doc.text("1740, 9th Cross, JP Nagar, 2nd Phase", rightAlignX, 16, { align: "right" });
        doc.text("Bengaluru, Karnataka - 560078", rightAlignX, 22, { align: "right" });
        doc.text("Email: accounts@proseedu.com", rightAlignX, 28, { align: "right" });
       
        doc.setFontSize(12);
        doc.setFont("arial", "normal");
    
        doc.text(`Receipt No: ${feeReceipt?.receiptNumber}`, 10, 50);
    
        doc.text(`Date: ${this.formatDate(feeReceipt?.paymentDate)}`, 150, 50);

        // Student information
        const tableColumns = [];
        const tableData = [
        ['Enrollment Number: ', enrollmentNumber],
        ['Student Name:', studentName],
        ['Grade:', grade],
        ['Amount:', `Rs. ${feeReceipt?.amount}   {In Words} : ${feeReceipt.inWords}`]
        ];
        autoTable(doc, {
        body: tableData,
        startY: 60, // Position where the table starts
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
            0: { cellWidth: 50, minCellHeight : 10 },
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
        
        // Footer Notes
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("* Subject to realization of the payment", 10, 110);
        doc.text("* This document is computer generated and does not require signature", 10, 115);
    
        // Save the PDF
        doc.save(fileName);
    }

    public applicationFormPdfGeneration(logoBase64 : string, studentProfile : any, parentProfile : any, sportProfile : any, subjects :any[])
    {
        // Generate the file name
        const fileName = "AdmissionForm.pdf";

        const doc = new jsPDF();
    /////Page-1
        // Add Image (Logo) on top-left corner (x=10, y=10, width=20, height=20)
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }
        doc.setFontSize(20);
        doc.setFont("arial", "bold");
        doc.text('Admission Application Form', 100, 20, { align: "center" });

        doc.setFontSize(14);
        doc.setFont("arial", "bold");
        doc.text(`Application No: ${studentProfile?.applicationNumber}`, 8, 35, { align: "left" });
        doc.text(`Academic Year: ${studentProfile?.academicYear}`, 200, 35, { align: "right" });
        doc.text(`Submission: ${studentProfile?.submission}`, 200, 40, { align: "right" });

        doc.setFontSize(12);
        doc.setFont("arial", "bold");
        doc.text('Student Profile', 8, 45, { align: "left" });

        // Create table data
        const tableColumns = [];
        const tableData = [
        ['Full Name (as per Aadhaar/Passport)', `${studentProfile?.name}`],
        ['Date of Birth', `${this.formatDate(studentProfile?.dob)}`],
        ['Gender', `${studentProfile?.gender}`],
        ['Nationality', `${studentProfile?.nationality}`],
        ['Aadhaar Number', `${studentProfile?.aadharNumber}`],
        ['Passport Number', `${studentProfile?.passportNumber}`]
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
        ['Full Name (as per Aadhaar/Passport)', `${parentProfile?.name}`],
        ['Relationship with Student', `${parentProfile?.relationship}`],
        ['Mobile Number', `${parentProfile?.mobile}`],
        ['Email', `${parentProfile?.email}`],
        ['Postal Address', `${parentProfile?.address}`],
        ['Aadhaar Number', `${parentProfile?.aadharNumber}`],
        ['PAN Number', `${parentProfile?.panNumber}`],
        ['Passport Number', `${parentProfile?.passportNumber}`]
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
        ['Class Seeking Admission', `${studentProfile?.grade}`],
        ['Preferred School Time', `${studentProfile?.batchTime}`]
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
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        doc.setFontSize(12);
        doc.setFont("arial", "bold");
        doc.text('Practicing Sport', 8, 25, { align: "left" });

        // Create table data
        const tableColumns4 = [];
        const tableData4 = [
        ['Sport Name', `${sportProfile?.sportName}`],
        ['Coach Name', `${sportProfile?.coachName}`],
        ['Coach Mobile', `${sportProfile?.coachMobile}`],
        ['Academy Name', `${sportProfile?.academyName}`],
        ['Academy Address', `${sportProfile?.academyAddress}`]
        ];
        autoTable(doc, {
        body: tableData4,
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
        doc.text('Subject Details', 8, 90, { align: "left" });        

        // Create table data
        const tableColumns3 = ['Sr.No.', 'Subject'];
        const tableData3 = subjects;
        autoTable(doc, {
        head: [tableColumns3],
        body: tableData3,
        startY: 95, // Position where the table starts
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
        doc.text('Declaration:', 8, 160, { align: "left" });

        doc.setFontSize(11);
        doc.setFont("arial", "bold");
        // Split text into lines based on the page width
        const pageWidth = doc.internal.pageSize.width; // Get page width
        const marginLeft = 14; // Left margin
        const textWidth = pageWidth - marginLeft * 2; // Available width for text
        let startLinY : number = 170;

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
        
        for(let i=0;i<9;i++)
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
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        startLinY = 25;
        for(let i=9;i<lines.length;i++)
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
        doc.setFontSize(12);
        doc.setFont("arial", "bold");

        doc.text('Signature', 8, 115, { align: "left" });
        doc.text('Name:', 8, 125, { align: "left" });
        doc.text('Parent/Guardian:', 8, 135, { align: "left" });

        doc.text('Place:', 150, 115, { align: "left" });
        doc.text('Date:', 150, 125, { align: "left" });

        doc.text('* Online submitted application does not require Signature.', 8, 145, { align: "left" });
        
        doc.save(fileName);
    }

    public undertakingFormPdfGeneration(logoBase64 : string, studentProfile : any, parentProfile : any, batches : any[])
    {
        // Generate the file name
        const fileName = "UndertakingForm.pdf";

        const doc = new jsPDF();
    /////Page-1
        // Add Image (Logo) on top-left corner (x=10, y=10, width=20, height=20)
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        // Split text into lines based on the page width
        const pageWidth = doc.internal.pageSize.width; // Get page width
        const marginLeft = 14; // Left margin
        const textWidth = pageWidth - marginLeft * 2; // Available width for text
       
        doc.setFontSize(12);
        doc.setFont("arial", "normal");
        doc.text(`Date: ${this.formatDate(studentProfile.admissionDate)}`, 8, 30, { align: "left" });
        doc.text(`To,`, 8, 40, { align: "left" });
        doc.text(`Mr./Ms. ${studentProfile.name}`, 8, 50, { align: "left" });
        doc.text(`Parent/Guardian of: ${parentProfile.name}`, 8, 60, { align: "left" });
        doc.text(`${parentProfile.address}`, 8, 70, { align: "left" });

        doc.setFontSize(12);
        doc.setFont("arial", "normal");
        doc.text(`Dear Parents/Guardians,`, 8, 85, { align: "left" });

        let text = `Homeschooling and online teaching platforms at PROSE EDUCATION ACADEMY PRIVATE LIMITED (PROSE) through its ${studentProfile.school.toUpperCase()} enables students to accelerate at their own pace as it concentrates on the excellence of education conformed to a child's capabilities. It encourages the growth of the child in a favourable and comfortable environment while being flexible enough to help the child excel in other areas. Regardless of the plenitude of benefits that our student gets, the important question that most parents have is the legality of the pedagogy and techniques of imparting education at the academy.`;
        
        let text1 : string[] = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        let y = 95;
        let lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        text = `In providing an appropriate perspective and reply it is important to realise that under The Right of Children to Free and Compulsory Education Act or The Right to Education Act (RTE), an act of the Parliament of India enacted on 4 August 2009,right to formal education is a fundamental right guaranteed under the Constitution of India to every child, who is a citizen of India, aged between the ages of 6 to 14. Under this right and the Act there is no specifications as to where or how the education can take place. Later, the government filed an affidavit stating that this act does not make homeschooling illegal and that the Indian judicial system does not hold homeschooling against any section or provision of the act.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 135;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        text = `Progressively on to the question of higher education, all children can attend or participate and qualify in curricular educational programmes which are affiliated to various examination boards in India and abroad for them to be eligible for college admissions and higher education throughout India or globally. There is no restriction for any child to attend a particular curriculum or qualification examination. The choice for the same is left to the child and its parents.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 175;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        text = `The world is rapidly changing with a multitude of technological advancements and we aid you in the process of growing your child to get accustomed to the progression of the future.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 205;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        text = `In the conduct of learning online, we are using electronically stored data, pedagogy,online conferencing platforms in conducting classes online, learning management systems, assessment management systems, digital blackboards, live video streaming, transmission of digital images, transfer of digital content and seeking inputs in the similar manner from the students.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 220;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        text = `We believe that there is no requirement of a particular teaching and learning method we will adopt as we will engage in conducting lessons through online classes. We would provide knowledge to everyone by conducting classes through the use of technologies available for the continuity of education as well to the best possible extent based on the programmes prescribed and recommended by The National Institute of Open Schooling (NIOS) (https://www.nios.ac.in/about-us/profile.aspx).`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 245;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        ////Page-2
        doc.addPage();
        
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        doc.setFontSize(12);
        doc.setFont("arial", "normal");

        text = `NIOS provides opportunities to interested learners by making available the following Courses/Programmes of Study (https://www.nios.ac.in/departmentsunits/academic/openbasic-education-(obe).aspx) through open and distance learning (ODL) mode.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 25;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        text = `• Open Basic Education (OBE) Programme for 14+ years age group, adolescents and adults at A, B and C levels that are equivalent to classes III, V and VIII of the formal school system.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 45;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        doc.text(`• Secondary Education Course.`, 8, 55, {align : "left"});
        doc.text(`• Senior Secondary Education Course.`, 8, 60, {align : "left"});

        text = `We believe that education starts at home and during this experience of online learning, we hope to build a strong partnership with families for a child's ways to learn at home with the help of technologies that allows us to remain in touch, provide instruction, educate, and interact with your child.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 70;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        doc.setFontSize(12);
        doc.setFont("arial", "bold");

        doc.text(`For`, 8, 100, {align : "left"});
        doc.text(`PROSE EDUCATION ACADEMY PVT LTD`, 8, 105, {align : "left"});
        doc.addImage('assets/images/logo/Sign.png', 'PNG', 8, 110, 40, 10);
        doc.text(`Chief Administrator`, 8, 125, {align : "left"});
       
        ////Page-2
        doc.addPage();
        
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        doc.setFontSize(14);
        doc.setFont("arial", "bold");
        doc.text(`DECLARATION`, 100, 30, {align : "center"});

        doc.setFontSize(12);
        doc.setFont("arial", "normal");
        doc.text(`As a school, we confirm the following:`, 8, 40, {align : "left"});

        let startLinY : number = 50;
        let lines : string[] = [
            "With these technologies available, we ensure that it is used properly as we make comply with all applicable laws.",
            "We will comply and ensure adhering to all laws that deals with how websites and other online operations, including applications, collect data and information from children under the age of 18. In compliance, no advertising shall appear during sessions of online classes. The school shall conduct classes and use the technologies with students for the sole purpose of education. No other third party shall have access or shall obtain the student information.",
            "We will to the best possible extent and technologically available resources address concerns about children's inappropriate use of technology and access to obscene or harmful content over the Internet. In compliance, we have set technological measures, guidelines, and policies to protect your child from harmful materials including those that are obscene and inappropriate. In this regard, we will not allow in any chat room, whether in private or in a group setting any materials or communication that may be contrary to the Act.",
            "We will protect the right to privacy of all students and confidentiality of education records while it gives authority and rights to parents to review student records.",
            "We will as required disclose lawfully permitted and consent based directory information of the students, however, in so far as it does not conflict with the minimum prescriptions under the law, parents may request the school not to disclose certain information. In this regard, in case you intend to limit or disallow the sharing of information, you may reach out to us.",
            "We will adhere to all the applicable laws of India in relation to imparting education to the students and comply with all the rules and regulations prescribed by the relevant educational boards of which the students are to be affiliated with and undertake examinations.",
            "We will make best efforts and reasonable endeavours as may be possible at the relevant time to provide the latest information and update the parents and guardians of the students with all changes that may be required, prescribed or laid down from time to time which may affect or have a bearing on the education of the student."
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

        doc.setFontSize(12);
        doc.setFont("arial", "bold");

        startLinY = startLinY + 10
        doc.text(`For`, 8, startLinY, {align : "left"});
        startLinY = startLinY + 5;
        doc.text(`PROSE EDUCATION ACADEMY PVT LTD`, 8, startLinY, {align : "left"});
        startLinY = startLinY + 5;
        doc.addImage('assets/images/logo/Sign.png', 'PNG', 8, startLinY, 40, 10);
        startLinY = startLinY + 15;
        doc.text(`Chief Administrator`, 8, startLinY, {align : "left"});

        ////Page-3
        doc.addPage();
        
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        doc.setFontSize(14);
        doc.setFont("arial", "bold");
        doc.text(`CONSENT`, 100, 30, {align : "center"});

        doc.setFontSize(12);
        doc.setFont("arial", "normal");
        text = `The school has laid out its objectives, intent and pronouncements relating to the laws and rules of imparting education and now seeks your consent in order for your child to participate in online class sessions.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 40;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 8, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        doc.setFontSize(12);
        doc.setFont("arial", "bold");
        doc.text("Note :", 20, 60, {align : "left"});

        doc.setFontSize(12);
        doc.setFont("arial", "normal");
        
        text = `The information shall also be used for the activity for online sessions as well as for grant of access to modules and files that shall be provided online by the School.`;
        
        text1 = doc.splitTextToSize(text, textWidth, {innerHeight : 10});
        y = 67;
        lineSpacing = 5;
        text1.forEach(line => {
            doc.text(line, 20, y, { align: "left" }); // (text, x, y)
            y += lineSpacing; // Move down by the line spacing
        });

        doc.setDrawColor(0, 0, 0); // Black border
        doc.setLineWidth(0.5); // Border thickness
        doc.rect(14, 55, 180, 20);

        doc.setFontSize(12);
        doc.setFont("arial", "bold");
        doc.text("Student Details:", 8, 85, {align : "left"});

        // Create table data
        const tableColumns1 = [];
        const tableData1 = [
        ['Full Name (As per ID proof Aadhaar/Passport)', `${studentProfile.name}`],
        ['Admission Application Number', `${studentProfile?.applicationNumber}`],
        ['Class', `${studentProfile.grade}`],
        ['Date of Birth', `${this.formatDate(studentProfile?.dob)}`],
        ['Passport Number', `${studentProfile?.passportNumber}`],
        ['Aadhar Number', `${studentProfile?.aadharNumber}`]
        ];
        autoTable(doc, {
        body: tableData1,
        startY: 90, // Position where the table starts
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
        doc.text("Parent Details:", 8, 160, {align : "left"});

        // Create table data
        const tableColumns2 = [];
        const tableData2 = [
        ['Full Name (As per ID proof Aadhaar/Passport)', `${parentProfile.name}`],
        ['Relationship with Student', `${parentProfile?.relationship}`],
        ['Mobile Number', `${parentProfile.mobile}`],
        ['Email', `${parentProfile?.email}`],
        ['PAN Number', `${parentProfile?.panNumber}`],
        ['Passport Number', `${parentProfile?.passportNumber}`],
        ['Aadhar Number', `${parentProfile?.aadharNumber}`],
        ['Address', `${parentProfile?.address}`]
        ];
        autoTable(doc, {
        body: tableData2,
        startY: 165, // Position where the table starts
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

        ////Page-4
        doc.addPage();
    
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        doc.setFontSize(12);
        doc.setFont("arial", "normal");
      
        startLinY = 30;
        lines = [
            "I am the lawful and legal guardian of the student named above. I have the full authority to provide this consent for the programme to which the student is enrolled.",
            "I will be fully and unconditionally liable and responsible for the financial dues and the conduct of the student during the programme enrolled with the school at all times.",
            "I waive all rights to proceed against the school under any circumstances save and except in case of any criminal conducts or acts by the school or its employees, agents or appointed personnel.",
            "I understand that GSP prepares me for the exams conducted by the National Institute of Open Schooling (NIOS). OBE (Open basic education) at Middle School, Secondary Certificate at Grade X (10), and Senior Secondary certificate at Grade XII (12).",
            "I grant permission for my child to participate in live virtual learning. I understand that live virtual learning is not pre-recorded and that anything stated or exposed during the virtual learning session can't be edited before the student witnesses the content.",
            "I understand the minimum time requirements and further that the specific timings of imparting education for the online education and GSP shall be:",
            "I understand that the Annual calendar of the GSP determines important activities and I will ensure that the student shall participate in all activities as per the calendar.",
            "I understand that GSP will not be able to issue a transfer certificate (TC) in case the student is withdrawn from the GSP at any time prior to the completion of the GSP tenure.",
            "I will ensure that the student informs the designated or nominated online instructor or programme co-ordinator of any scheduled or unscheduled absences and makeup missed work as required.",
            "I understand that GSP is an alternate school built to support the education need of students pursuing serious sports.",
            "I understand that GSP will not be in a position to issue any legal certificates like bonafide, domicile, etc., as may be required.",
            "I understand that GSP will not be responsible for any delay from the end of NIOS in relation to the despatch of textbooks, ID cards, conducting examination, issue of marks card ancillary matters relating to the education stream of GSP as it is completely to be provided by NIOS while PROSE shall make all efforts to ensure proper and timely provision of the same.",
            "I understand that once taken admission into a class and batch, I must stay in that class and batch for the duration of one Academic year and if there is a withdrawal, no part of the fees shall be refundable and nor will PROSE be liable to provide any qualification while it will make a reasonable efforts and provide support the best extent possible to ensure that the education of the student continues.",
            "I understand that it is my responsibility to provide all required documents in relation to the student as per NIOS requirements to help GSP to complete my enrolment with NIOS.",
            "I understand that GSP as part of the fees payable shall make NIOS exam fee payment for up to 5 subjects on behalf of the student for one appearance at the exams in each subject. However, in case the student is not successful in the exam or does not attend the exam, then it is my personal responsibility to make payments for additional appearances or additional subjects to attend the NIOS exam.",
            "I understand the Academic year starts in June and ends in April the consecutive year. The fee structure of GSP is for one Academic year and shall be payable in its entirety for the whole year on a non-refundable basis.",
            "I understand that it is my responsibility to arrange for the student a laptop as per the technical specifications with the installed software having valid legal licenses for all the required software on it, headphones, speaker, and internet connection to the specifications prescribed by PROSE to attend online classes.",
            "I undertake to reimburse PROSE for any costs that it may incur to ensure that the software required by the student is procured by PROSE on behalf of the student to enable teaching.",
            "I understand that I am required to attend all parent teacher meetings (PTM) as scheduled and informed by the GSP.",
            "I hereby give my permission for my child to participate in an online class in a platform preferred by the School.",
            "I hereby consent to the school's collection, use, and/or disclosure of information about my child through the course registration process and other manual and/or electronic procedures of the school and the nominated course providers.",
            "I understand that my child is registering for a virtual course or participating in virtual learning, and that the information collected is needed for both course registration and progress reporting to my child's school.",
            "I do agree, consent, and confirm that this consent form covers all forms of distance learning courses, including but not limited to satellite courses, video courses, and web-based courses. Your child's image may be transmitted during video portions of distance learning and online courses.",
            "By affirming my consent for my child to participate in an online class, I understand that no derogatory, obscene, or any form of racism shall be allowed in class.",
            "I understand that class session may be recorded for the purpose of archive or promotional purposes. In this regard, I give my consent for my child's participation to be included in the promotion of the school."
        ]
        
        for(let i=0;i<6;i++)
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

        ////////////Batch Details Table
        doc.setFontSize(12);
        doc.setFont("arial", "bold");
        doc.text("Batch Details:", 8, 135, {align : "left"});
        // Create table data
        const tableColumns3 = ['Sr.no.', 'Batch', 'Timing'];
        const tableData3 = batches;
        autoTable(doc, {
        head: [tableColumns3],
        body: batches,
        startY: 140, // Starting position
        theme: 'plain',
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.5,
        styles: {
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            valign: 'middle',
            fontSize: 10,
        },
        columnStyles: {
            0: { cellWidth: 20, minCellHeight: 10 },
            1: { minCellHeight: 10 },
        },
        headStyles: {
            fillColor: [192, 192, 192],
            textColor: [0, 0, 0],
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
        },
        bodyStyles: {
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
        },
        margin: { top: 10 },
        });

        doc.setFontSize(12);
        doc.setFont("arial", "normal");
        startLinY = 180;
        for(let i=6;i<11;i++)
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

        ////Page-5
        doc.addPage();
    
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        doc.setFontSize(12);
        doc.setFont("arial", "normal");
      
        startLinY = 30;
        for(let i=11;i<24;i++)
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

        ////Page-6
        doc.addPage();
    
        doc.addImage('assets/images/logo/logo.png', 'PNG', 10, 5, 40, 10);
        if(logoBase64 != "")
        {
            doc.addImage(logoBase64, 'PNG', 150, 5, 40, 10);
        }

        doc.setFontSize(12);
        doc.setFont("arial", "normal");
      
        startLinY = 30;
        for(let i=24;i<lines.length;i++)
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

        doc.setFontSize(12);
        doc.setFont("arial", "bold");

        doc.text('Signature', 8, 50, { align: "left" });
        doc.text('Name:', 8, 55, { align: "left" });
        doc.text('Parent/Guardian:', 8, 60, { align: "left" });

        doc.text('Place:', 150, 50, { align: "left" });
        doc.text('Date:', 150, 55, { align: "left" });

        doc.save(fileName);
    }
}
