import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationContractedComponent } from './organisation-contracted.component';

describe('OrganisationContractedComponent', () => {
  let component: OrganisationContractedComponent;
  let fixture: ComponentFixture<OrganisationContractedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationContractedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationContractedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
