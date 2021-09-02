import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHeadGarnderComponent } from './edit-head-garnder.component';

describe('EditHeadGarnderComponent', () => {
  let component: EditHeadGarnderComponent;
  let fixture: ComponentFixture<EditHeadGarnderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHeadGarnderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHeadGarnderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
