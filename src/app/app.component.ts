import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { BookStore } from './store/book.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BooksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly store = inject(BookStore);

  title = 'ngrx-state';
}
