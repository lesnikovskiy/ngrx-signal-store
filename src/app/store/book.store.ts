import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { BookService } from '../book.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export interface Book {
  title: string;
}

interface BookState {
  books: Book[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
}

const initialState: BookState = {
  books: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const BookStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ books, filter }) => ({
    booksCount: computed(() => {
      return books().length;
    }),
    storedBooks: computed(() => {
      const direction = filter.order() === 'asc' ? 1 : -1;

      return books().toSorted(
        (a, b) => direction * a.title.localeCompare(b.title),
      );
    }),
  })),
  withMethods((store, bookService = inject(BookService)) => ({
    async loadAll(): Promise<void> {
      patchState(store, { isLoading: true });
      const books = await bookService.getAll();
      patchState(store, { books, isLoading: false });
    },
    addBook(book: Book): void {
      patchState(store, (state) => ({
        books: [...state.books, book],
      }));
    },
    updateQuery(query: string): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, query },
      }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({
        filter: { ...state.filter, order },
      }));
    },
    loadByQuery: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) => {
          return bookService.getByQuery(query).pipe(
            tapResponse({
              next: (books) => patchState(store, { books, isLoading: false }),
              error: (err) => {
                patchState(store, { isLoading: false });
                console.error(err);
              },
            }),
          );
        }),
      ),
    ),
  })),
);
