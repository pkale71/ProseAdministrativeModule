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
                userTypeCode: ['ADMGN'],
                hidden: false,
                children: [
                {
                    id: 'default',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/dashboard/default',
                    param: "",
                    userTypeCode: [],
                    hidden: false
                },
                ]
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
                        id: 'studentDocuments',
                        title: 'Student Documents',
                        type: 'item',
                        url: '/admissionMaster/studentDocuments',
                        param: "",
                        userTypeCode: ['ADMGN'],
                        hidden: false,
                        target: false
                    },                     
                ]
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
