import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { id } from 'date-fns/locale';
import { param } from 'jquery';

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

        // academic master for academic admin
        {
            id: 'academicMaster',
            title: 'Academic Master',
            type: 'collapse',
            icon: 'feather icon-list',
            userGradeCode: ['ACADM'],
            hidden: false,
            children: [
            {
                id: 'gradeCategories',
                title: 'Grade Categories',
                type: 'item',
                url: '/academicMaster/gradeCategories',
                param: "",
                userGradeCode: ['ACADM'],
                hidden: false,
                target: false
            },    
            {
            id: 'grades',
            title: 'Grades',
            type: 'item',
            url: '/academicMaster/grades',
            param: "",
            userGradeCode: ['ACADM'],
            hidden: false,
            target: false
            },
            {
                id: 'syllabuses',
                title: 'Syllabuses',
                type: 'item',
                url: '/academicMaster/syllabuses',
                param: "",
                userGradeCode: ['ACADM'],
                hidden: false,
                target: false
            },
            {
                id: 'academicSession',
                title: 'Academic Sessions',
                type: 'item',
                url: '/academicMaster/academicSessions',
                param: "",
                userGradeCode: ['ACADM'],
                hidden: false,
                target: false
            },
            {
                id: 'Subjects',
                title: 'Subjects',
                type: 'item',
                url: '/academicMaster/subjects',
                param: "",
                userGradeCode: ['ACADM'],
                hidden: false,
                target: false
            },
            {
                id: 'Chapters',
                title: 'Chapters',
                type: 'item',
                url: '/academicMaster/chapters',
                param: "",
                userGradeCode: ['ACADM'],
                hidden: false,
                target: false
            },
            {
                id: 'Topics',
                title: 'Topics',
                type: 'item',
                url: '/academicMaster/topics',
                param: "",
                userGradeCode: ['ACADM'],
                hidden: false,
                target: false
            },            
            ]
        },

        // schooling for academic admin
        {
            id: 'schoolingMaster',
            title: 'Schooling Master',
            type: 'collapse',
            icon: 'feather icon-layout',
            userGradeCode: ['ACADM'],
            hidden: false,
            children: [
                {
                    id: 'schoolingGroups',
                    title: 'Schooling Groups',
                    type: 'item',
                    url: '/schoolingMaster/schoolingGroups',
                    param: "",
                    userGradeCode: ['ACADM'],
                    hidden: false,
                    target: false
                },
                {
                    id: 'schoolingCategories',
                    title: 'Schooling Categories',
                    type: 'item',
                    url: '/schoolingMaster/schoolingCategories',
                    param: "",
                    userGradeCode: ['ACADM'],
                    hidden: false,
                    target: false 
                },            
                {
                    id: 'schoolingPrograms',
                    title: 'Schooling Programs',
                    type: 'item',
                    url: '/schoolingMaster/schoolingPrograms',
                    param: "",
                    userGradeCode: ['ACADM'],
                    hidden: false,
                    target: false
                },
                
                {
                    id: 'school-sub-group',
                    title: 'School Sub-Groups',
                    type: 'item',
                    url: '/schoolingMaster/schoolSubGroups',
                    param: '',
                    userGradeCode: ['ACADM'],
                    hidden: false,
                    target: false
                },
                {
                    id: 'batch-type',
                    title: 'Batch Types',
                    type: 'item',
                    url: '/schoolingMaster/batchTypes',
                    param: '',
                    userGradeCode: ['ACADM'],
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
            // {
            //     id: 'userRoles',
            //     title: 'Roles',
            //     type: 'item',
            //     url: '/user/userRoles',
            //     param: "",
            //     userGradeCode: ['HRADM'],
            //     hidden: false,
            //     target: false
            // },
            // {
            //     id: 'userTypes',
            //     title: 'Types',
            //     type: 'item',
            //     url: '/user/userTypes',
            //     param: "",
            //     userGradeCode: ['HRADM'],
            //     hidden: false,
            //     target: false
            // },
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

        //for business academic document
        {
            id: 'academicDocument',
            title: 'Document Master',
            type: 'collapse',
            icon: 'feather icon-file',
            userGradeCode: ['BUADM'],
            hidden: false,
            children: [
                {
                    id: 'academyEnclosureDocument',
                    title: 'Partner Documents',
                    type: 'item',
                    url: '/academicDocument/academyEnclosureDocument',
                    param: "",
                    userGradeCode: ['BUADM'],
                    hidden: false,
                    target: false
                },
            ]
        },

        //for business
        {
            id: 'business',
            title: 'Business Master',
            type: 'collapse',
            icon: 'feather icon-briefcase',
            userGradeCode: ['BUADM'],
            hidden: false,
            children: [
            {
                id: 'country',
                title: 'Countries',
                type: 'item',
                url: '/business/countries',
                param: "",
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false
            },
            {
                id: 'stateRegion',
                title: 'State/Regions',
                type: 'item',
                url: '/business/stateRegions',
                param: "",
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false
            },
            {
                id: 'district',
                title: 'Districts',
                type: 'item',
                url: '/business/districts',
                param: "",
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false
            },
            {
                id: 'city',
                title: 'Cities',
                type: 'item',
                url: '/business/cities',
                param: "",
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false
            },                
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

            {
                id: 'coaches',
                title: 'Coaches',
                type: 'item',
                url: '/business/coaches',
                param: "",
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false
            },

            {
                id: 'businessPartners',
                title: 'Business Partners',
                type: 'item',
                url: '/business/businessPartners',
                param: "",
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false
            },

            {
                id: 'tieUpSchools',
                title: 'Tie-Up Schools',
                type: 'item',
                url: '/business/tieUpSchools',
                param: "",
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false
            },

            {
                id: 'studyCenters',
                title: 'Study Centers',
                type: 'item',
                url: '/business/studyCenters',
                param: '',
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false,
            },
            {
                id: 'schools',
                title: 'Schools',
                type: 'item',
                url: '/business/schools',
                param: '',
                userGradeCode: ['BUADM'],
                hidden: false,
                target: false,
            }
            ]
        }

        ]
    }
];

@Injectable()
export class NavigationItem 
{
    get() {
        return NavigationItems;
    }
}
