import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  userKey='users';
  constructor(private toastr: ToastrService) { }
  //get all user
  getAll(): User[] {
    return JSON.parse(localStorage.getItem(this.userKey) || '[]');
  }
//add user
  add(user: User) {
    const users = this.getAll();
  // Check if email already exists
  const exists = users.some(u => u.email.toLowerCase() === user.email.toLowerCase());

  if (exists) {
    return false; 
  }
  users.push(user);
  localStorage.setItem(this.userKey, JSON.stringify(users));
  console.log('data added');
  
  return true; 
  }
  //update user
  update(email: string, updatedUser: User) {
    let users = this.getAll();
    users = users.map(u => u.email === email ? updatedUser : u);
    localStorage.setItem(this.userKey, JSON.stringify(users));
  }
 //delete user
  delete(email: string) {
    const users = this.getAll().filter(u => u.email !== email);
    localStorage.setItem(this.userKey, JSON.stringify(users));
  }
  //get single user data
  getByEmail(email: string): User | undefined {
    return this.getAll().find(u => u.email === email);
  }

  //show toster
   showSuccess(msg:string) {
    this.toastr.success(msg);
  }
  showError(msg:string){
    this.toastr.error(msg)
  }
}
