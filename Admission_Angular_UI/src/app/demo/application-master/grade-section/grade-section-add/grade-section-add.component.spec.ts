import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeSectionAddComponent } from './grade-section-add.component';

describe('GradeSectionAddComponent', () => {
  let component: GradeSectionAddComponent;
  let fixture: ComponentFixture<GradeSectionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GradeSectionAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeSectionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
