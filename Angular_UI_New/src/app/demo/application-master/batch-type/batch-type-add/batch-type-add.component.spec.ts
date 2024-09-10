import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTypeAddComponent } from './batch-type-add.component';

describe('BatchTypeAddComponent', () => {
  let component: BatchTypeAddComponent;
  let fixture: ComponentFixture<BatchTypeAddComponent>;

  beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ BatchTypeAddComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(BatchTypeAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
