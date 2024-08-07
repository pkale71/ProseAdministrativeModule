import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChapterWiseTopicAppComponent } from './chapter-wise-topic-add.component';

describe('ChapterWiseTopicAppComponent', () => {
    let component: ChapterWiseTopicAppComponent;
    let fixture: ComponentFixture<ChapterWiseTopicAppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ ChapterWiseTopicAppComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ChapterWiseTopicAppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
