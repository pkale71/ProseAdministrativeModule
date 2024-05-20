import { User } from "./user";
import { LessonPlanMaster } from "./lessonPlanMaster";
import { CurriculumUpload } from "./curriculum-upload";

export class LessonPlanDescription {
  id?: number;
  uuid?:string;
  sequence?: string;
  teachingAid?:string;
  lessonPlanMaster?: LessonPlanMaster;
  curriculumUpload?:CurriculumUpload;
  createdOn?: Date;
  createdBy?: User;
  modifyOn?: Date;
  modifyBy?: User;
}
