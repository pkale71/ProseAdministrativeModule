import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModuleAccessibilityComponent } from './user-module-accessibility.component';

describe('UserModuleAccessibilityComponent', () => {
  let component: UserModuleAccessibilityComponent;
  let fixture: ComponentFixture<UserModuleAccessibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserModuleAccessibilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserModuleAccessibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
