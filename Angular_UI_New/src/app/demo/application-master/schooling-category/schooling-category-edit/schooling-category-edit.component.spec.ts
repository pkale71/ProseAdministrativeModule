import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolingCategoryEditComponent } from './schooling-category-edit.component';

describe('SchoolingCategoryEditComponent', () => {
    let component: SchoolingCategoryEditComponent;
    let fixture: ComponentFixture<SchoolingCategoryEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ SchoolingCategoryEditComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SchoolingCategoryEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
