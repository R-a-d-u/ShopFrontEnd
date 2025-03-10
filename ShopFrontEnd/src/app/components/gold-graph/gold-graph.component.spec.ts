import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldGraphComponent } from './gold-graph.component';

describe('GoldGraphComponent', () => {
  let component: GoldGraphComponent;
  let fixture: ComponentFixture<GoldGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
