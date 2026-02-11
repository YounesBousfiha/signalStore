```angular20html
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Product, ProductService } from './product.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, mergeMap, map } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type ProductState = {
  products: Product[];
  filterQuery: string;
  isLoading: boolean;
};

const initialState: ProductState = {
  products: [],
  filterQuery: '',
  isLoading: false,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  
  // 1. Computed: الفلترة كاتحسب بوحدها Real-time
  withComputed(({ products, filterQuery }) => ({
    filteredProducts: computed(() => {
      const query = filterQuery().toLowerCase();
      return products().filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
    }),
    totalPrice: computed(() => products().reduce((acc, curr) => acc + curr.price, 0))
  })),

  // 2. Methods: هنا كنربطو RxJS مع Signals
  withMethods((store, service = inject(ProductService)) => ({
    
    updateFilter(query: string) {
      patchState(store, { filterQuery: query });
    },

    // Load Products
    loadProducts: rxMethod<void>(pipe(
      tap(() => patchState(store, { isLoading: true })),
      switchMap(() => service.getAll().pipe(
        tapResponse({
          next: (products) => patchState(store, { products, isLoading: false }),
          error: (err) => { console.error(err); patchState(store, { isLoading: false }); }
        })
      ))
    )),

    // Add Product (Optimistic UI Update example if you want, but simple here)
    addProduct: rxMethod<{name: string, price: number, category: string}>(pipe(
      mergeMap((newProduct) => service.add(newProduct).pipe(
        tapResponse({
          next: (savedProduct) => {
            // كنزيدو فـ State بلا ما نعيطو لـ loadProducts عاوتاني
            patchState(store, (state) => ({ products: [...state.products, savedProduct] }));
          },
          error: console.error
        })
      ))
    )),

    // Delete Product
    deleteProduct: rxMethod<string>(pipe(
      mergeMap((id) => service.delete(id).pipe(
        tapResponse({
          next: () => {
             // كنحيدو من State
            patchState(store, (state) => ({ 
              products: state.products.filter(p => p.id !== id) 
            }));
          },
          error: console.error
        })
      ))
    )),
  })),

  // 3. Hooks: Autoloading (الضربة القاضية)
  withHooks({
    onInit(store) {
      store.loadProducts(); // كيعيط بوحدو فاش الكومبوننت كيبدا
    }
  })
);
```
