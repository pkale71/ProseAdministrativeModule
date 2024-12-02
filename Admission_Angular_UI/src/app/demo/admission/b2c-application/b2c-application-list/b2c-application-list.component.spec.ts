import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cApplicationListComponent } from './b2c-application-list.component';

describe('B2cApplicationListComponent', () => {
  let component: B2cApplicationListComponent;
  let fixture: ComponentFixture<B2cApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ B2cApplicationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2cApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
