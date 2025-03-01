import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldCoinsComponent } from './gold-coins.component';

describe('GoldCoinsComponent', () => {
  let component: GoldCoinsComponent;
  let fixture: ComponentFixture<GoldCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldCoinsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
