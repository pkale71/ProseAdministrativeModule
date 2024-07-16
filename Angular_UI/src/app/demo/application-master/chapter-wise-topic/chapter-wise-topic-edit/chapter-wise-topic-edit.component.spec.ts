import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterWiseTopicEditComponent } from './chapter-wise-topic-edit.component';

describe('ChapterWiseTopicEditComponent', () => {
  let component: ChapterWiseTopicEditComponent;
  let fixture: ComponentFixture<ChapterWiseTopicEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChapterWiseTopicEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterWiseTopicEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
