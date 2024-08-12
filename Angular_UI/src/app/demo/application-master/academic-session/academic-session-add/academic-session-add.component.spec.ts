import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeCategoryAddComponent } from './academic-session-add.component';

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
});
