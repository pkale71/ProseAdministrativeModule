import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnBoardingLinkListComponent } from './on-boarding-link-list.component';

describe('OnBoardingLinkListComponent', () => {
    let component: OnBoardingLinkListComponent;
    let fixture: ComponentFixture<OnBoardingLinkListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ OnBoardingLinkListComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(OnBoardingLinkListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
