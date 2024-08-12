import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD
import { UserRoleListComponent } from './user-role-list.component';

describe('UserRoleListComponent', () => {
    let component: UserRoleListComponent;
    let fixture: ComponentFixture<UserRoleListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ UserRoleListComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(UserRoleListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
=======

import { UserRoleListComponent } from './user-role-list.component';

describe('UserRoleListComponent', () => {
  let component: UserRoleListComponent;
  let fixture: ComponentFixture<UserRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
>>>>>>> parent of c617e70 (ss)
});
