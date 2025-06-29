import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private userKey = 'users';
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  viewMode: 'table' | 'grid' = 'grid'; // default is table
  constructor() { }

  //Get all users
  getAll(): User[] {
    return JSON.parse(localStorage.getItem(this.userKey) || '[]');
  }

  //Add user
  add(user: User): boolean {
    const users = this.getAll();

    // Check if email already exists (case-insensitive)
    const exists = users.some(
      (u) => u.email.toLowerCase() === user.email.toLowerCase()
    );

    if (exists) return false;

    users.push(user);
    localStorage.setItem(this.userKey, JSON.stringify(users));
    return true;
  }

  //Update user by email
  update(email: string, updatedUser: User): boolean {
    const users = this.getAll();

    const index = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (index === -1) return false;

    users[index] = updatedUser;
    localStorage.setItem(this.userKey, JSON.stringify(users));
    return true;
  }

  //Delete user by email
  delete(email: string): boolean {
    const users = this.getAll();

    const updatedUsers = users.filter(
      (u) => u.email.toLowerCase() !== email.toLowerCase()
    );

    if (users.length === updatedUsers.length) return false;

    localStorage.setItem(this.userKey, JSON.stringify(updatedUsers));
    return true;
  }

  //Get single user by email
  getByEmail(email: string): User | undefined {
    return this.getAll().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  //Show success message
  showSuccess(msg: string): void {
    this._snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  //Show erro message
  showError(msg: string): void {
    this._snackBar.open(msg, 'Close', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
