import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolingCategoryAddComponent } from './schooling-category-add.component';

describe('SchoolingCategoryAddComponent', () => {
    let component: SchoolingCategoryAddComponent;
    let fixture: ComponentFixture<SchoolingCategoryAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ SchoolingCategoryAddComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SchoolingCategoryAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
