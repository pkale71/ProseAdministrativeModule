import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
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
=======

import { GradeCategoryAddComponent } from './on-boarding-link-add.component';

describe('GradeCategoryAddComponent', () => {
  let component: GradeCategoryAddComponent;
  let fixture: ComponentFixture<GradeCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeCategoryAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
>>>>>>> parent of c617e70 (ss)
});
