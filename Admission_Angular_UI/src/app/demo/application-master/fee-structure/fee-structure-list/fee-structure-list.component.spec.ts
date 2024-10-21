import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeStructureListComponent } from './fee-structure-list.component';

describe('FeeStructureListComponent', () => {
  let component: FeeStructureListComponent;
  let fixture: ComponentFixture<FeeStructureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FeeStructureListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeStructureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
