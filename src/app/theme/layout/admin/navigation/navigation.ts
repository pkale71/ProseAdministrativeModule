import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  userTypeCode : string[];
  hidden?: boolean;
  url?: string;
  param?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'collapse',
            icon: 'feather icon-home',
            userTypeCode : ['SUADM'],
            hidden : false,
            children: [
              {
                id: 'default',
                title: 'Dashboard',
                type: 'item',
                url: '/dashboard/default',
                param: "",
                userTypeCode : [],
                hidden : false
              },
            ]
          },
          {
                id: 'applicationMaster',
                title: 'Application Master',
                type: 'collapse',
                icon: 'feather icon-settings',
                userTypeCode : ['SUADM', 'HDOFA', 'SCHPL', 'SCHVP', 'SCHCD', 'SUBHD', 'TECHR'],
                hidden : false,
                children: [
                  {
                    id: 'userRoles',
                    title: 'User Roles',
                    type: 'item',
                    url: '/applicationMaster/userRoles',
                    param: "",
                    userTypeCode : ['SUADM'],
                    hidden : false,
                    target: false
                  },
                  
                  {
                    id: 'userTypes',
                    title: 'User Types',
                    type: 'item',
                    url: '/applicationMaster/userTypes',
                    param: "",
                    userTypeCode : ['SUADM'],
                    hidden : false,
                    target: false
                  },
                  
                  {
                    id: 'gradeCategories',
                    title: 'Grade Categories',
                    type: 'item',
                    url: '/applicationMaster/gradeCategories',
                    param: "",
                    userTypeCode : ['SUADM'],
                    hidden : false,
                    target: false
                  }
                ]
              }
    //   {
    //     id: 'dashboard',
    //     title: 'Dashboard',
    //     type: 'collapse',
    //     icon: 'feather icon-home',
    //     userTypeCode : [],
    //     hidden : false,
    //     children: [
    //       {
    //         id: 'default',
    //         title: 'Dashboard',
    //         type: 'item',
    //         url: '/dashboard/default',
    //         param: "",
    //         userTypeCode : [],
    //         hidden : false
    //       },
    //     ]
    //   },
    //   {
    //     id: 'applicationMaster',
    //     title: 'Application Master',
    //     type: 'collapse',
    //     icon: 'feather icon-settings',
    //     userTypeCode : ['SUADM', 'HDOFA', 'SCHPL', 'SCHVP', 'SCHCD', 'SUBHD', 'TECHR'],
    //     hidden : false,
    //     children: [
    //       {
    //         id: 'academicYears',
    //         title: 'Academic Years',
    //         type: 'item',
    //         url: '/applicationMaster/academicYears',
    //         param: "",
    //         userTypeCode : ['SUADM'],
    //         hidden : false,
    //         target: false
    //       },
    //       {
    //         id: 'syllabuses',
    //         title: 'Syllabuses',
    //         type: 'item',
    //         url: '/applicationMaster/syllabuses',
    //         param: "",
    //         userTypeCode : ['SUADM'],
    //         hidden : false,
    //         target: false
    //       },
    //       {
    //         id: 'grades',
    //         title: 'Grades',
    //         type: 'item',
    //         url: '/applicationMaster/grades',
    //         param: "",
    //         userTypeCode : ['SUADM','HDOFA'],
    //         hidden : false,
    //         target: false
    //       },
    //       {
    //         id: 'materialTypes',
    //         title: 'Material Types',
    //         type: 'item',
    //         url: '/applicationMaster/materialTypes',
    //         param: "",
    //         userTypeCode : ['SUADM','HDOFA'],
    //         hidden : false,
    //         target: false
    //       },
    //       {
    //         id: 'yearCalender',
    //         title: 'Year Calender',
    //         type: 'item',
    //         url: '/applicationMaster/yearCalender',
    //         param: "",
    //         userTypeCode : ['SCHPL', 'SCHVP', 'SCHCD', 'SUBHD', 'TECHR'],
    //         hidden : false,
    //         target: false
    //       },
    //       {
    //         id: 'gradeScheduleSettings',
    //         title: 'Grade Schedule Settings',
    //         type: 'item',
    //         url: '/applicationMaster/gradeScheduleSettings',
    //         param: "",
    //         userTypeCode : ['SUADM', 'SCHPL', 'SCHVP'],
    //         hidden : false,
    //         target: false
    //       }
    //     ]
    //   },
    //   {
    //     id: 'schools',
    //     title: 'Schools',
    //     type: 'item',
    //     classes: 'nav-item',
    //     url: '/schools',
    //     param: "",
    //     icon: 'fa fa-building',
    //     userTypeCode : ['SUADM','HDOFA'],
    //     hidden : false
    //   },
    //   {
    //     id: 'users',
    //     title: 'Users',
    //     type: 'item',
    //     classes: 'nav-item',
    //     url: '/users',
    //     param: "",
    //     icon: 'feather icon-user',
    //     userTypeCode : ['SUADM','HDOFA','SCHPL','SCHVP'],
    //     hidden : false
    //   },
    //   {
    //     id: 'weeklyTimeTable',
    //     title: 'Weekly Time Table',
    //     type: 'item',
    //     classes: 'nav-item',
    //     url: '/weeklyTimeTable',
    //     param: "",
    //     icon: 'feather icon-clipboard',
    //     userTypeCode : ['SCHPL', 'SCHVP'],
    //     hidden : false
    //   },
    //   {
    //     id: 'lessonPlans',
    //     title: 'Lesson Plans',
    //     type: 'item',
    //     classes: 'nav-item',
    //     url: '/lessonPlans',
    //     param: "",
    //     icon: 'fa fa-book-open',
    //     userTypeCode : ['SCHCD', 'SUBHD', 'TECHR', 'SCHPL', 'SCHVP'],
    //     hidden : false
    //   },
    //   {
    //     id: 'teachingSchedule',
    //     title: 'Teaching Schedule',
    //     type: 'item',
    //     classes: 'nav-item',
    //     url: '/teachingSchedule',
    //     param: "",
    //     icon: 'fa fa-chalkboard-teacher',
    //     userTypeCode : ['SCHCD', 'SUBHD', 'TECHR'],
    //     hidden : false
    //   },
    //   // {
    //   //   id: 'curriculumCompletion',
    //   //   title: 'Curriculum Completion',
    //   //   type: 'item',
    //   //   classes: 'nav-item',
    //   //   param: "",
    //   //   url: '/curriculumCompletion/',
    //   //   icon: 'feather icon-calendar',
    //   //   userTypeCode : ['SUBHD','TECHR','SCHCD'],
    //   //   hidden : false
    //   // },
    //   {
    //     id: 'curriculumUploads',
    //     title: 'Curriculum Uploads',
    //     type: 'item',
    //     classes: 'nav-item',
    //     param: "",
    //     url: '/curriculumUploads/',
    //     icon: 'feather icon-upload',
    //     userTypeCode : [],
    //     hidden : false
    //   },
    //   // {
    //   //   id: 'reports',
    //   //   title: 'Reports',
    //   //   type: 'collapse',
    //   //   icon: 'feather icon-book',
    //   //   userTypeCode : ['CURHD','HDOFA','SCHPL','SCHVP','SUBHD','SCHCD'],
    //   //   hidden : false,
    //   //   children: [
    //   //     {
    //   //       id: 'curriculumCompletetionReport',
    //   //       title: 'Curriculum Completetion',
    //   //       type: 'item',
    //   //       url: '/reports/curriculumCompletetionReport',
    //   //       param: "",
    //   //       userTypeCode : ['CURHD','HDOFA','SCHPL','SCHVP','SUBHD','SCHCD'],
    //   //       hidden : false
    //   //     },
    //   //   ]
    //   // },
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() 
  {
    return NavigationItems;
  }
}
