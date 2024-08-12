import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
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
=======

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
>>>>>>> parent of c617e70 (ss)
});
