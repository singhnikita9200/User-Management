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
  // Columns to be displayed in the table 
  public displayedColumns: string[] = ['fullName', 'email', 'country', 'createdAt', 'action'];

  // Original data source 
  public dataSource: User[] = [];

  // Text input for search filter 
  public searchText: string = '';

  // Filtered list of users based on search input 
  public filteredUsers: User[] = [];

  // Subject to debounce user search input 
  public searchChanged = new Subject<string>();

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    //fetch users data.
    this.getUsersData();

    // Apply debounce to search input to reduce unnecessary filtering
    this.searchChanged
      .pipe(debounceTime(300))
      .subscribe((value: string) => {
        this.applyFilter(value);
      });
  }

  // Fetch all users from the data service 
  private getUsersData(): void {
    this.dataSource = this.dataService.getAll();
    this.filteredUsers = [...this.dataSource];
  }

  //   Delete a user and refresh the list
  //   @param user - user to delete

  public deleteUser(user: User): void {
    const deleted = this.dataService.delete(user.email);

    if (deleted) {
      this.dataService.showSuccess('User deleted successfully');
      this.getUsersData();
    } else {
      this.dataService.showError('User not found or could not be deleted');
    }
  }

  //  Apply search filter to user list
  //  @param searchText - user input from search box

  private applyFilter(searchText: string): void {
    const search = searchText.trim().toLowerCase();
    this.filteredUsers = this.dataSource.filter(user =>
      (`${user.firstName} ${user.lastName} ${user.email}`).toLowerCase().includes(search)
    );
  }

  // Clear search input and show full user list 
  public clear(): void {
    this.searchText = '';
    this.filteredUsers = [...this.dataSource];
  }

  //  Toggle view mode between table and grid
  //  @param mode - selected view mode

  public setViewMode(mode: 'table' | 'grid'): void {
    this.dataService.viewMode = mode;
  }
}
