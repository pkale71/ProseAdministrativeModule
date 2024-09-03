import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolingProgramEditComponent } from './schooling-program-edit.component';

describe('SchoolingProgramEditComponent', () => {
    let component: SchoolingProgramEditComponent;
    let fixture: ComponentFixture<SchoolingProgramEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ SchoolingProgramEditComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(SchoolingProgramEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
