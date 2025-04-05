import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthConfirmDialogComponent } from './auth-confirm-dialog.component';

describe('AuthConfirmDialogComponent', () => {
  let component: AuthConfirmDialogComponent;
  let fixture: ComponentFixture<AuthConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthConfirmDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
