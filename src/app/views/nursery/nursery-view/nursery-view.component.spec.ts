import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseryViewComponent } from './nursery-view.component';

describe('NurseryViewComponent', () => {
  let component: NurseryViewComponent;
  let fixture: ComponentFixture<NurseryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
