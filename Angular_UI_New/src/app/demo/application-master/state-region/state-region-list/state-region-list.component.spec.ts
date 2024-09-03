import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateRegionListComponent } from './state-region-list.component';

describe('StateRegionListComponent', () => {
    let component: StateRegionListComponent;
    let fixture: ComponentFixture<StateRegionListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ StateRegionListComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(StateRegionListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
