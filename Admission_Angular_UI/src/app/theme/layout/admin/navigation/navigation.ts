import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { id } from 'date-fns/locale';
import { param } from 'jquery';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  userTypeCode: string[];
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
                userTypeCode: ['ADMGN','ADMTM'],
                hidden: false,
                children: [
                    {
                        id: 'default',
                        title: 'Dashboard',
                        type: 'item',
                        url: '/dashboard/default',
                        param: "",
                        userTypeCode: ['ADMGN','ADMTM'],
                        hidden: false
                    },
                ]
            },
            {
                id: 'users',
                title: 'Users',
                type: 'item',
                classes: 'nav-item',
                url: '/user/users',
                param: "",
                userTypeCode: ['ADMGN'],
                icon: 'feather icon-user'
            },
            // academic master for academic admin
            {
                id: 'admissionMaster',
                title: 'Admission Master',
                type: 'collapse',
                icon: 'feather icon-list',
                userTypeCode: ['ADMGN'],
                hidden: false,
                children: [
                    {
                        id: 'taxTypes',
                        title: 'Tax Types',
                        type: 'item',
                        url: '/admissionMaster/taxTypes',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    },
                    {
                        id: 'feeTypes',
                        title: 'Fee Types',
                        type: 'item',
                        url: '/admissionMaster/feeTypes',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    },
                    {
                        id: 'discountTypes',
                        title: 'Discount Types',
                        type: 'item',
                        url: '/admissionMaster/discountTypes',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    },   
                    {
                        id: 'taxRates',
                        title: 'Tax Rates',
                        type: 'item',
                        url: '/admissionMaster/taxRates',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    }, 
                    {
                        id: 'feeCategories',
                        title: 'Fee Categories',
                        type: 'item',
                        url: '/admissionMaster/feeCategories',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    }, 
                    {
                        id: 'studentDocuments',
                        title: 'Student Documents',
                        type: 'item',
                        url: '/admissionMaster/studentDocuments',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    },
                    {
                        id: 'courseExitReasons',
                        title: 'Course Exit Reasons',
                        type: 'item',
                        url: '/admissionMaster/courseExitReasons',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    },
                    {
                        id: 'gradeSections',
                        title: 'Grade Sections',
                        type: 'item',
                        url: '/admissionMaster/gradeSections',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    },
                    {
                        id: 'subjectGroups',
                        title: 'Subject Group Combinations',
                        type: 'item',
                        url: '/admissionMaster/subjectGroups',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    }, 
                    {
                        id: 'feeStructures',
                        title: 'Fee Structures',
                        type: 'item',
                        url: '/admissionMaster/feeStructures',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    },                     
                ]
            },
            {
                id: 'b2cRegistrations',
                title: 'B2C Registrations',
                type: 'item',
                classes: 'nav-item',
                url: '/b2cApplication/registrations',
                param: "",
                userTypeCode: ['ADMTM'],
                icon: 'feather icon-umbrella'
            },
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
