import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolingCategoryListComponent } from './schooling-category-list.component';

describe('SchoolingCategoryListComponent', () => {
    let component: SchoolingCategoryListComponent;
    let fixture: ComponentFixture<SchoolingCategoryListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ SchoolingCategoryListComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SchoolingCategoryListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
