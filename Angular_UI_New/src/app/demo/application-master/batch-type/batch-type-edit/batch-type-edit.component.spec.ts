import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTypeEditComponent } from './batch-type-edit.component';

describe('BatchTypeEditComponent', () => {
  let component: BatchTypeEditComponent;
  let fixture: ComponentFixture<BatchTypeEditComponent>;

  beforeEach(async () => {
		await TestBed.configureTestingModule({
		declarations: [ BatchTypeEditComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(BatchTypeEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
