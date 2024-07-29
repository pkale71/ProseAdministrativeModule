import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCenterListComponent } from './study-center-list.component';

describe('StudyCenterListComponent', () => {
  let component: StudyCenterListComponent;
  let fixture: ComponentFixture<StudyCenterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyCenterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyCenterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
