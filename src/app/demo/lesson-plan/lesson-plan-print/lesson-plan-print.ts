import { NotifierService } from "angular-notifier";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { LessonPlanDescription } from "src/app/theme/shared/model/lessonPlanDescription";
import { LessonPlanMaster } from "src/app/theme/shared/model/lessonPlanMaster";
import { LessonPlanService } from "src/app/theme/shared/service/lesson-plan.service";

export class LessonPlanPrint {   
    
    constructor(private lessonPlanService : LessonPlanService, 
        private notifier: NotifierService)
    { }

    showNotification(type: string, message: string): void 
    {
        //type : default, info, success, warning, error
        this.notifier.notify(type, message);
    }

    async download(uuid : string)
    {
        try
        {
          let response = await this.lessonPlanService.getLessonPlan(uuid).toPromise();
          if (response.status_code == 200 && response.message == 'success') 
          {
            this.generatePDF(response.data.lessonPlan);
            this.showNotification("success", "Download Completed");
          }
        }
        catch(e)
        {
            this.showNotification("error", "Download Failed");
        }
    }

    generatePDF(lessonPlanMaster : LessonPlanMaster)
    {
        let academicYear : string = lessonPlanMaster.academicYear.year;
        let createdBy : string = lessonPlanMaster.createdBy.name;
        let grade : string = lessonPlanMaster.grade.name;
        let subject : string = lessonPlanMaster.subject.name;
        let periods : number = lessonPlanMaster.numberOfPeriods;
        let planNumber : number = lessonPlanMaster.lessonPlanNumber;
        let tempCreatedOn : string[] = lessonPlanMaster.createdOn.toString().split("T")[0].split("-");
        let createdOn : string = tempCreatedOn[2] + "/" + tempCreatedOn[1] + "/" + tempCreatedOn[0];
        let learningOutcome = lessonPlanMaster.learningOutcome.split("<br />").join("\n");
        let prerequisite : string = lessonPlanMaster.prerequisite;
        let methodology : string = lessonPlanMaster.methodology;
        let descriptions : LessonPlanDescription[] = lessonPlanMaster.lessonPlanDescriptions;
        let y_position : number = 10;

        const doc = new jsPDF('p', 'mm', [297, 210]);
        let fileName = "LessonPlan_" + academicYear + "_" + grade + "_" + subject;
        doc.setFont("arial", "normal", "bold");
//Header Text
        doc.setFontSize(16);
        let headerText = "Lesson Plan";
        doc.text(headerText, 90, y_position);
        const textWidth = doc.getTextWidth(headerText);
        doc.line(90, 11, 90 + textWidth, 11);

        y_position+=10;
//////Line 1
        doc.setFontSize(11);
        doc.setFont("arial", "normal", "bold");
        let line1_1 = "Teacher Name : ";
        doc.text(line1_1, 10, y_position);
        doc.setFont("arial", "normal");
        doc.text(createdBy, (10 + doc.getTextWidth(line1_1) + 3), 20, { maxWidth: 150 });
        
        doc.setFont("arial", "normal", "bold");
        let line1_2 = "Academic Year : ";
        doc.text(line1_2, 130, y_position);
        doc.setFont("arial", "normal");
        doc.text(academicYear, (130 + doc.getTextWidth(line1_2) + 3), 20, { maxWidth: 150 });

        y_position+=10;
//////Line 2
        doc.setFontSize(11);
        doc.setFont("arial", "normal", "bold");
        let line2_1 = "Class : ";
        doc.text(line2_1, 10, y_position);
        doc.setFont("arial", "normal");
        doc.text(grade, (10 + doc.getTextWidth(line2_1) + 3), y_position, { maxWidth: 150 });

        doc.setFont("arial", "normal", "bold");
        let line2_2 = "Subject : ";
        doc.text(line2_2, 80, y_position);
        doc.setFont("arial", "normal");
        doc.text(subject, (80 + doc.getTextWidth(line2_2) + 3), y_position, { maxWidth: 150 });

        doc.setFont("arial", "normal", "bold");
        let line2_3 = "No. of Periods : ";
        doc.text(line2_3, 130, y_position);
        doc.setFont("arial", "normal");
        doc.text(periods.toString(), (130 + doc.getTextWidth(line2_3) + 3), y_position, { maxWidth: 150 });

        y_position+=10;
//////Line 3
        doc.setFontSize(11);
        doc.setFont("arial", "normal", "bold");
        let line3_1 = "Date : ";
        doc.text(line3_1, 10, y_position);
        doc.setFont("arial", "normal");
        doc.text(createdOn, (10 + doc.getTextWidth(line3_1) + 3), y_position, { maxWidth: 150 });

        doc.setFont("arial", "normal", "bold");
        let line3_2 = "Lesson Plan Number : ";
        doc.text(line3_2, 130, y_position);
        doc.setFont("arial", "normal");
        doc.text(planNumber.toString(), (130 + doc.getTextWidth(line3_2) + 3), y_position, { maxWidth: 150 });
        
        y_position+=10;
//////Line 4
        doc.setFontSize(11);
        doc.setFont("arial", "normal", "bold");
        let line4_1 = "Learning Outcome : ";
        doc.text(line4_1, 10, y_position);

        y_position+=5;

        doc.setFont("arial", "normal");
        doc.text(learningOutcome, 10, y_position);
        y_position = y_position + (5 * learningOutcome.split("\n").length);

//////Line 5
        y_position = y_position + 10;
        doc.setFontSize(11);
        doc.setFont("arial", "normal", "bold");
        let line5_1 = "Prerequisites : ";
        doc.text(line5_1, 10, y_position);
        y_position = y_position + 5;
        doc.setFont("arial", "normal");
        doc.text(prerequisite, 10, y_position);

//////Line 6
        y_position = y_position + 10;
        doc.setFontSize(11);
        doc.setFont("arial", "normal", "bold");
        let line6_1 = "Methodology/Approach : ";
        doc.text(line6_1, 10, y_position);
        y_position = y_position + 5;
        doc.setFont("arial", "normal");
        doc.text(methodology, 10, y_position);

//////Line 7 Table
        y_position = y_position + 10;
        doc.setFontSize(11);
        doc.setFont("arial", "normal", "bold");
        let line7_1 = "Description of Topic : ";
        doc.text(line7_1, 10, y_position);
        y_position = y_position + 5;
        doc.setFont("arial", "normal");
        let tableHeader : string[][] = [[" Lesson Plan Sequence", " Teaching Aid"]];
        let tableData : string[][] = [];
        for(let m=0;m<descriptions.length;m++)
        {
            tableData.push([descriptions[m].sequence.split("<br />").join("\n"), descriptions[m].teachingAid.split("<br />").join("\n")]);
        }
        autoTable(doc, {
            head: tableHeader,
            headStyles : {lineWidth : 0.5, fillColor: [255, 255, 255], lineColor : [0, 0, 0], textColor : [0, 0, 0]},
            body: tableData,
            startY: y_position,
            theme: 'grid',
            didDrawPage: (d) => {y_position = d.cursor.y},
            columnStyles: {
                0: {lineWidth : 0.5, halign: 'left', fillColor: [255, 255, 255], lineColor : [0, 0, 0]},
                1: {lineWidth : 0.5, halign: 'left', fillColor: [255, 255, 255], lineColor : [0, 0, 0]}
            },
        })

//////Line 8
        y_position = y_position + 50;
        doc.setFontSize(12);
        let line8_1 = "Teacher’s Signature";
        doc.text(line8_1, 10, y_position);

        let line8_2 = "Vice Principal’s Signature";
        doc.text(line8_2, 80, y_position);

        let line8_3 = "Principal’s Signature";
        doc.text(line8_3, 150, y_position);

        // Save the PDF
        doc.save(fileName);
    }
}
