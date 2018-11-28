import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandsOnTableComponent } from './hands-on-table.component';

describe('HandsOnTableComponent', () => {
  let component: HandsOnTableComponent;
  let fixture: ComponentFixture<HandsOnTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandsOnTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandsOnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
