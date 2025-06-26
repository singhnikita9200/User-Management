import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private userKey = 'users';

  constructor(private toastr: ToastrService) {}

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

  //Toast notifications
  showSuccess(msg: string): void {
    this.toastr.success(msg);
  }

  showError(msg: string): void {
    this.toastr.error(msg);
  }
}
