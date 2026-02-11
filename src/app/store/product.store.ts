import {Product} from '../model/Product';
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {computed, inject} from '@angular/core';
import {ProductService} from '../core/services/product.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';

// ProductState Type
type ProductState = {
  products: Product[];
  filterQuery: string;
  isLoading: boolean;
}
// InitialState
const initialState: ProductState = {
  products: [],
  filterQuery: '',
  isLoading: false
}
// @ngrx/signals
// @ngrx/operators

// create & Export signalStore
export const ProductStore = signalStore(
  // provide the signal store at root
  { providedIn: 'root'},

  // withState
  withState(initialState),

  // withComputed: filteredProducts, totalRevenues, productCounts
  withComputed(({ products, filterQuery}) => ({
    filteredProducts: computed(() => {
      const query = filterQuery().toLowerCase();
      return products().filter(p =>
        p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    }),
    totalPrice: computed(() => products().reduce((acc, curr) => acc + curr.price, 0)),
    productCounts: computed(() => products().length)
  })), // stop

  // withMethod: ProductService
  withMethods((store, productService = inject(ProductService)) => ({
    updateFilter(query: string) {
      patchState(store, { filterQuery: query})
    },
    loadProducts: rxMethod<void>(pipe(
      tap(() => patchState(store, { isLoading: true })),
      switchMap(() => productService.getProducts().pipe(
        tapResponse({
          next: (products) => patchState(store, { products, isLoading: false }),
          error: (err) => { console.error(err); patchState(store, { isLoading: false }); }
        })
      ))
    )),
    addProduct: rxMethod<{name: string, price: number, category: string}>(
      pipe(
        tap(() => patchState(store, { isLoading: true})),
        switchMap((newProduct) => productService.addProduct(newProduct).pipe(
         tapResponse({
           next: (savedProduct) => {
             patchState(store, (state) => ({ products: [...state.products, savedProduct], isLoading: false }));
           },
           error: (err) => {
             console.error(err);
             patchState(store, { isLoading: false})
           }
         })
        ))
      ),
    ),
    deleteProduct: rxMethod<string>(pipe(
      switchMap((id) => productService.deleteProduct(id).pipe(
        tapResponse({
          next: () => {
            patchState(store, (state) => ({
              products: state.products.filter(p => p.id !== id)
            }));
          },
          error: console.error
        })
      ))
    )),

  })),
  withHooks({
    onInit(store) {
      store.loadProducts(); // كيعيط بوحدو فاش الكومبوننت كيبدا
    }
  })


)
