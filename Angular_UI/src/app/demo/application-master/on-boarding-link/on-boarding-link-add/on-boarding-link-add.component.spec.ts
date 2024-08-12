import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnBoardingLinkAddComponent } from './on-boarding-link-add.component';

describe('OnBoardingLinkAddComponent', () => {
    let component: OnBoardingLinkAddComponent;
    let fixture: ComponentFixture<OnBoardingLinkAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ OnBoardingLinkAddComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(OnBoardingLinkAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
