import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShopListComponent } from './product-shop-list.component';

describe('ProductShopListComponent', () => {
  let component: ProductShopListComponent;
  let fixture: ComponentFixture<ProductShopListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductShopListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductShopListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
