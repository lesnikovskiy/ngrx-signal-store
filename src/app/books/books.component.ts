import { Component, inject, OnInit } from '@angular/core';
import { Book, BookStore } from '../store/book.store';
import { JsonPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [JsonPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit {
  readonly store = inject(BookStore);

  bookForm = new FormGroup<{ title: FormControl<string> }>({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit(): Promise<void> {
    await this.store.loadAll();
  }

  addBook(book: Book) {
    this.store.addBook(book);
    this.bookForm.reset();
  }
}
