import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { DataService } from '../../services/data.service';
import { debounceTime, Subject } from 'rxjs';


@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['fullName', 'email', 'country', 'createdAt', 'action'];
  dataSource: User[] = [];
  searchText: string = ''
  filteredUsers: User[] = [];
  searchChanged = new Subject<string>();

  constructor(private dataService: DataService) { }
  ngOnInit(): void {
    this.getUsersData()

    //Apply search filter
    this.searchChanged.pipe(debounceTime(300)).subscribe(value => {
      this.applyFilter(value);
    });
  }
  //Get users data
  getUsersData() {
    this.dataSource = this.dataService.getAll()
    this.filteredUsers = [...this.dataSource]
  }

  //Delete user
  deleteUser(user: User): void {
    const deleted = this.dataService.delete(user.email);

    if (deleted) {
      this.dataService.showSuccess('User deleted successfully');
      this.getUsersData();
    } else {
      this.dataService.showError('User not found or could not be deleted');
    }
  }

  //Apply filter method
  applyFilter(searchText: string) {
    const search = searchText.trim().toLowerCase();
    this.filteredUsers = this.dataSource.filter(user =>
      (`${user.firstName} ${user.lastName} ${user.email}`)
        .toLowerCase()
        .includes(search)
    );
  }

  //Clear filter
  clear(): void {
    this.searchText = ''
    this.filteredUsers = [...this.dataSource]
  }

}
