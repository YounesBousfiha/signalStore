import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../../model/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:3000/products';

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl)
  }

  addProduct(product: Omit<Product, 'id'>) {
  return this.http.post<Product>(this.apiUrl, product);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
