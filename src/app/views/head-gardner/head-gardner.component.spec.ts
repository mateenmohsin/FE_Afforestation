import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadGardnerComponent } from './head-gardner.component';

describe('HeadGardnerComponent', () => {
  let component: HeadGardnerComponent;
  let fixture: ComponentFixture<HeadGardnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadGardnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadGardnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
