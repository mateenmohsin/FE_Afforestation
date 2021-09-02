import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationNonContractedComponent } from './organisation-non-contracted.component';

describe('OrganisationNonContractedComponent', () => {
  let component: OrganisationNonContractedComponent;
  let fixture: ComponentFixture<OrganisationNonContractedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationNonContractedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationNonContractedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
