import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeSectionListComponent } from './grade-section-list.component';

describe('GradeSectionListComponent', () => {
  let component: GradeSectionListComponent;
  let fixture: ComponentFixture<GradeSectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GradeSectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
