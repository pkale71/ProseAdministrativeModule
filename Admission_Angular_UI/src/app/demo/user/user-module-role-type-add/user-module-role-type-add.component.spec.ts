import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModuleRoleTypeAddComponent } from './user-module-role-type-add.component';

describe('UserModuleRoleTypeAddComponent', () => {
  let component: UserModuleRoleTypeAddComponent;
  let fixture: ComponentFixture<UserModuleRoleTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserModuleRoleTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserModuleRoleTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
