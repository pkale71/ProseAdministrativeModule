import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  userGradeCode: string[];
  hidden?: boolean;
  url?: string;
  param?: string;
  target?: boolean;
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
        userGradeCode: ['HRADM','ACADM','BUADM'],
        hidden: false,
        children: [
          {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            param: "",
            userGradeCode: [],
            hidden: false
          },
        ]
      },
      {
        id: 'applicationMaster',
        title: 'Application Master',
        type: 'collapse',
        icon: 'feather icon-settings',
        userGradeCode: ['HRADM','ACADM','BUADM'],
        hidden: false,
        children: [
          {
            id: 'academicSession',
            title: 'Academic Sessions',
            type: 'item',
            url: '/applicationMaster/academicSessions',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },
          
          {
            id: 'schoolingPrograms',
            title: 'Schooling Programs',
            type: 'item',
            url: '/applicationMaster/schoolingPrograms',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },

          {
            id: 'syllabuses',
            title: 'Syllabuses',
            type: 'item',
            url: '/applicationMaster/syllabuses',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },

          {
            id: 'gradeCategories',
            title: 'Grade Categories',
            type: 'item',
            url: '/applicationMaster/gradeCategories',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },

          {
            id: 'grades',
            title: 'Grades',
            type: 'item',
            url: '/applicationMaster/grades',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },

          {
            id: 'grade-wise-syllabus',
            title: 'Grade Wise Syllabuses',
            type: 'item',
            url: '/applicationMaster/grade-wise-syllabus',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },

          {
            id: 'SyllabusWiseSubjects',
            title: 'Syllabus Wise Subjects',
            type: 'item',
            url: '/applicationMaster/SyllabusWiseSubjects',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },

          {
            id: 'SubjectWiseChapters',
            title: 'Subject Wise Chapters',
            type: 'item',
            url: '/applicationMaster/SubjectWiseChapters',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },

          {
            id: 'ChapterWiseTopics',
            title: 'Chapter Wise Topics',
            type: 'item',
            url: '/applicationMaster/ChapterWiseTopics',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
          },

          {
            id: 'userRoles',
            title: 'User Roles',
            type: 'item',
            url: '/applicationMaster/userRoles',
            param: "",
            userGradeCode: ['HRADM'],
            hidden: false,
            target: false
          },

          {
            id: 'userTypes',
            title: 'User Types',
            type: 'item',
            url: '/applicationMaster/userTypes',
            param: "",
            userGradeCode: ['HRADM'],
            hidden: false,
            target: false
          },

          {
            id: 'academyEnclosureDocument',
            title: 'Academy Enclosure Documents',
            type: 'item',
            url: '/applicationMaster/academyEnclosureDocument',
            param: "",
            userGradeCode: ['BUADM'],
            hidden: false,
            target: false
          },

          {
            id: 'coach',
            title: 'Coaches',
            type: 'item',
            url: '/applicationMaster/coaches',
            param: "",
            userGradeCode: ['BUADM'],
            hidden: false,
            target: false
          },

          {
            id: 'country',
            title: 'Countries',
            type: 'item',
            url: '/applicationMaster/countries',
            param: "",
            userGradeCode: ['BUADM'],
            hidden: false,
            target: false
          },

          
        ]
      },

      //for users
      {
        id: 'user',
        title: 'Users',
        type: 'collapse',
        icon: 'feather icon-user',
        userGradeCode: ['HRADM'],
        hidden: false,
        children: [
          {
            id: 'onBoardingLinks',
            title: 'On Boarding Links',
            type: 'item',
            url: '/user/onBoardingLinks',
            param: "",
            userGradeCode: ['HRADM'],
            hidden: false,
            target: false
          },
          {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/users',
            param: "",
            userGradeCode: ['HRADM'],
            hidden: false,
            target: false
          },      
        ]
      },

      //for business
      {
        id: 'business',
        title: 'Businesses',
        type: 'collapse',
        icon: 'feather icon-user',
        userGradeCode: ['BUADM'],
        hidden: false,
        children: [
          {
            id: 'businessVertical',
            title: 'Business Verticals',
            type: 'item',
            url: '/business/businessVertical',
            param: "",
            userGradeCode: ['BUADM'],
            hidden: false,
            target: false
          },

          {
            id: 'businessVerticalGroup',
            title: 'Business Vertical Groups',
            type: 'item',
            url: '/business/businessVerticalGroup',
            param: "",
            userGradeCode: ['BUADM'],
            hidden: false,
            target: false
          },

          {
            id: 'businessVerticalType',
            title: 'Business Vertical Types',
            type: 'item',
            url: '/business/businessVerticalType',
            param: "",
            userGradeCode: ['BUADM'],
            hidden: false,
            target: false
          },

        ]
      }

    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
