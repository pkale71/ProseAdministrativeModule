import { Time } from "@angular/common";
import { AcademicYear } from "./academic-year";
import { Grade } from "./grade";
import { School } from "./school";
import { User } from "./user";
import { SyllabusGradeSubject } from "./syllabus-grade-subject";
import { SchoolGradeSection } from "./school-grade-section";

export class WeeklyTimetableTemplate {
  id?: number;
  uuid?:string;
  grade?: Grade;
  school?: School;
  academicYear?:AcademicYear;
  subject?:SyllabusGradeSubject;
  allocatedTo?:User;
  section?: SchoolGradeSection;
  dayNumber?:number;
  periodNumber?:number;
  startTime?:Time;
  endTime?:Time;
  createdOn : Date;
  createdBy : User;
  isApplied : number;
  appliedOn : Date;
  appliedBy : User;
  modifyOn : Date;
  modifyBy : User;
}
