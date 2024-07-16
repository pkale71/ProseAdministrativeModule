import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleAddComponent } from './user-role-add.component';

describe('UserRoleAddComponent', () => {
  let component: UserRoleAddComponent;
  let fixture: ComponentFixture<UserRoleAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
