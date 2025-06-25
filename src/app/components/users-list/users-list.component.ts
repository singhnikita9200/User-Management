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
export class UsersListComponent implements OnInit{
  displayedColumns: string[] = ['fullName', 'email', 'country', 'createdAt', 'action'];
  dataSource:User[]=[];
  searchText: string=''
  filteredUsers: User[] = []; 
  searchChanged = new Subject<string>();
  hoveredUser: any;
  
  constructor(private dataService: DataService){}
  ngOnInit(): void {
    this.getUsersData()

    //apply search filter
    this.searchChanged.pipe(debounceTime(300)).subscribe(value => {
    this.applyFilter(value);
   });
  }
//get users data
  getUsersData(){
    this.dataSource = this.dataService.getAll()
    this.filteredUsers = [...this.dataSource]
  }
//delete user
deleteUser(data:User){
  this.dataService.delete(data.email)
  this.dataService.showSuccess('Deleted Successfully')
  setTimeout(()=>{
    this.getUsersData()
  },200)
 
}
//apply filter method
applyFilter(searchText: string) {
  const search = searchText.trim().toLowerCase();
  this.filteredUsers = this.dataSource.filter(user =>
    (`${user.firstName} ${user.lastName} ${user.email}`)
      .toLowerCase()
      .includes(search)
  );
}

//clear filter
clear(){
  this.searchText=''
  this.filteredUsers = [...this.dataSource]
}


}
