import { Injectable } from '@angular/core';
import { Book } from './store/book.store';
import { delay, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  getAll(): Promise<Book[]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve([
            { title: 'The Bible' },
            { title: 'The End of the Fucking World' },
            { title: 'Kobzar' },
          ]),
        1500,
      );
    });
  }

  getByQuery(query: string): Observable<Book[]> {
    return of([
      { title: 'The Bible' },
      { title: 'The End of the Fucking World' },
      { title: 'Kobzar' },
    ]).pipe(
      map((books) => books.filter((b) => b.title.includes(query))),
      delay(1500),
    );
  }
}
