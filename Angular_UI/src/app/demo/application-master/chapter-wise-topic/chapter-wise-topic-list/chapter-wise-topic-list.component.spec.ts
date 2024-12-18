import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChapterWiseTopicListComponent } from './chapter-wise-topic-list.component';

describe('ChapterWiseTopicListComponent', () => {
    let component: ChapterWiseTopicListComponent;
    let fixture: ComponentFixture<ChapterWiseTopicListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ ChapterWiseTopicListComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ChapterWiseTopicListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
