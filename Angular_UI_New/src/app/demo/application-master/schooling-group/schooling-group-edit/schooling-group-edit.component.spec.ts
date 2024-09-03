import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolingGroupEditComponent } from './schooling-group-edit.component';

describe('SchoolingGroupEditComponent', () => {
    let component: SchoolingGroupEditComponent;
    let fixture: ComponentFixture<SchoolingGroupEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ SchoolingGroupEditComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SchoolingGroupEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
