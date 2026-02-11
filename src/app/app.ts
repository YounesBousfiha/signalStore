import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ProductStore} from './store/product.store';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.4s cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),

        query(':leave', [
          animate('0.4s ease-in', keyframes([
            style({ offset: 0, opacity: 1, transform: 'translateX(0)' }),
            style({ offset: 0.2, backgroundColor: '#fee2e2', transform: 'scale(0.95)' }), // Start Red
            style({ offset: 0.5, backgroundColor: '#ef4444', transform: 'scale(0.9)' }), // Bright Red
            style({ offset: 1, opacity: 0, transform: 'translateX(100%) rotate(5deg)' }) // Fly away
          ]))
        ], { optional: true })
      ])
    ])
  ]
})
export class App {
  readonly store = inject(ProductStore);

  addProduct() {
    const random = Math.floor(Math.random() * 1000);
    this.store.addProduct({
      name: `Demo Product ${random}`,
      price: random * 10,
      category: ['Tech', 'Home', 'Auto'][Math.floor(Math.random() * 3)]
    });
  }
}
