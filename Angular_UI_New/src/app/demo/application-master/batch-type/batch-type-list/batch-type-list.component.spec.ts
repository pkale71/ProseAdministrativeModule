import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTypeListComponent } from './batch-type-list.component';

describe('BatchTypeListComponent', () => {
    let component: BatchTypeListComponent;
    let fixture: ComponentFixture<BatchTypeListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ BatchTypeListComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(BatchTypeListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
