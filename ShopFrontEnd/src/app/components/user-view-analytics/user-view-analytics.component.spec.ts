import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewAnalyticsComponent } from './user-view-analytics.component';

describe('UserViewAnalyticsComponent', () => {
  let component: UserViewAnalyticsComponent;
  let fixture: ComponentFixture<UserViewAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserViewAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
