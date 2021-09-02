import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtndByNurseryComponent } from './atnd-by-nursery.component';

describe('AtndByNurseryComponent', () => {
  let component: AtndByNurseryComponent;
  let fixture: ComponentFixture<AtndByNurseryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtndByNurseryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtndByNurseryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
