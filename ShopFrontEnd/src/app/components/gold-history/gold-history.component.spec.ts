import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldHistoryComponent } from './gold-history.component';

describe('GoldHistoryComponent', () => {
  let component: GoldHistoryComponent;
  let fixture: ComponentFixture<GoldHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
