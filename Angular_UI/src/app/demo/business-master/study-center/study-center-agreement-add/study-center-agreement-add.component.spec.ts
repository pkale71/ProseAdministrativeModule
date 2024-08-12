import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCenterAgreeMentAddComponent } from './study-center-agreement-add.component';

describe('StudyCenterAgreeMentAddComponent', () => {
  let component: StudyCenterAgreeMentAddComponent;
  let fixture: ComponentFixture<StudyCenterAgreeMentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyCenterAgreeMentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyCenterAgreeMentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
