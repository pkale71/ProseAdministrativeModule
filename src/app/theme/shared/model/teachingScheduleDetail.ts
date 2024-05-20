import { Time } from "@angular/common";
import { Grade } from "./grade";
import { SyllabusGradeSubject } from "./syllabus-grade-subject";
import { TeachingScheduleMaster } from "./teachingScheduleMaster";
import { User } from "./user";
import { SchoolGradeSection } from "./school-grade-section";
import { LessonPlanMapping } from "./lessonPlanMapping";

export class TeachingScheduleDetail {
  id?: number;
  uuid?:string;
  grade?:Grade;
  section?: SchoolGradeSection;
  subject?:SyllabusGradeSubject;
  teachingScheduleMaster?: TeachingScheduleMaster;
  periodNumber?: number;
  startTime : Time;
  endTime : Time;
  engagedBy : User;
  lessonPlanMappings : LessonPlanMapping[];
}
