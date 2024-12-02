import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModuleApprovalComponent } from './user-module-approval.component';

describe('UserModuleApprovalComponent', () => {
  let component: UserModuleApprovalComponent;
  let fixture: ComponentFixture<UserModuleApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserModuleApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserModuleApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
