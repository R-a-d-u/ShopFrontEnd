import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldBarsComponent } from './gold-bars.component';

describe('GoldBarsComponent', () => {
  let component: GoldBarsComponent;
  let fixture: ComponentFixture<GoldBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldBarsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
