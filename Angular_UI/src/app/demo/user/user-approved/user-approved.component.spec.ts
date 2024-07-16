import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApprovedComponent } from './user-approved.component';

describe('UserApprovedComponent', () => {
  let component: UserApprovedComponent;
  let fixture: ComponentFixture<UserApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
