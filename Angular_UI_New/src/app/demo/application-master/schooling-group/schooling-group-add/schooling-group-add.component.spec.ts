import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchoolingGroupAddComponent } from './schooling-group-add.component';

describe('SchoolingGroupAddComponent', () => {
  let component: SchoolingGroupAddComponent;
  let fixture: ComponentFixture<SchoolingGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolingGroupAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolingGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
