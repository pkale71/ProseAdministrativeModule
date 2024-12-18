import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicAddComponent } from './topic-add.component';

describe('TopicAddComponent', () => {
    let component: TopicAddComponent;
    let fixture: ComponentFixture<TopicAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [ TopicAddComponent ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(TopicAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
