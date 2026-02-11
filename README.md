# SignalStore Live-Coding Demo

This repository contains a small Angular (v21) application used for live-coding demos of reactive state management with @ngrx/signals (signalStore). The app is a product inventory demo that loads product data from a local json-server and demonstrates filtering, adding, deleting, and a computed total price.

![Demo GIF placeholder](./src/assets/demo.gif)

> Replace the placeholder above with a recording of your live-coding session. Put the GIF at `src/assets/demo.gif` (or update the path below) so it will be included in the repository and visible on GitHub.

Quick summary

- Framework: Angular 21 (standalone components)
- State: @ngrx/signals (signalStore)
- Backend: json-server (db.json)

Important files

- src/app/app.ts — root component using ProductStore
- src/app/app.html — main UI
- src/app/store/product.store.ts — signalStore (state, computed selectors, methods)
- src/app/core/services/product.service.ts — API client
- db.json — local json-server dataset

Prerequisites

- Node.js (16+ recommended)
- npm

Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start fake backend (json-server):

   ```bash
   npx json-server --watch db.json --port 3000
   ```

   Backend API: http://localhost:3000/products

3. Start Angular dev server (second terminal):

   ```bash
   npm start
   # or
   ng serve
   ```

   Open the app at http://localhost:4200

How the demo works

- ProductStore is provided in root (providedIn: 'root') and calls loadProducts() on init to populate state from the backend.
- The UI binds to store.filteredProducts() and store.totalPrice()
- Methods: loadProducts(), addProduct(...), deleteProduct(id), updateFilter(query)

Troubleshooting

- No products visible? Verify json-server is running and returning data at http://localhost:3000/products. Check browser console/network for errors. Ensure ProductStore is not re-provided in a component providers array.

Adding a GIF

- Save an animated GIF as `demo.gif` into `src/assets/`. A simple text placeholder file exists in the repo; replace it with your actual recorded GIF.

Contributing

- This is an educational demo. Open issues or PRs to improve the demo or docs.

License

- No license file included. Add one if you plan to publish.
