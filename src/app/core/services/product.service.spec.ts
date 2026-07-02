import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests products with DummyJSON pagination params', () => {
    service
      .getProducts({
        limit: 0,
        skip: 0,
        select: ['title', 'price'],
      })
      .subscribe();

    const request = httpMock.expectOne((req) => req.url === 'https://dummyjson.com/products');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('limit')).toBe('0');
    expect(request.request.params.get('skip')).toBe('0');
    expect(request.request.params.get('select')).toBe('title,price');

    request.flush({ products: [], total: 0, skip: 0, limit: 0 });
  });

  it('searches products with the documented q query param', () => {
    service.searchProducts(' phone ', { limit: 10, skip: 0 }).subscribe();

    const request = httpMock.expectOne(
      (req) => req.url === 'https://dummyjson.com/products/search',
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('q')).toBe('phone');
    expect(request.request.params.get('limit')).toBe('10');
    expect(request.request.params.get('skip')).toBe('0');

    request.flush({ products: [], total: 0, skip: 0, limit: 10 });
  });
});
