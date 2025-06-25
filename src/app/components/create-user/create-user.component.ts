import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit{
  userForm: FormGroup;
  countries: any[] = [];

    constructor(private fb: FormBuilder, private apiService: ApiService,
       private dataService: DataService, private router: Router) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      createdAt: ['', Validators.required]
    });
  }

   ngOnInit(): void {
   this.getCountry()
   
  }

  //get country list
  getCountry(){
    this.apiService.getCountries().subscribe((result:any) => {
      this.countries = result;
    },(error:any)=>{
      this.dataService.showError('Something went wrong.')
    });
  }
   //on form submission
   onSubmit() {
    //update create date time
    this.userForm.get('createdAt')?.setValue(new Date().toISOString());
    
    if (this.userForm.valid) {
    const res =  this.dataService.add(this.userForm.value)
    if(res) {
       this.dataService.showSuccess('User Added Successfully')
     this.router.navigate([''])
    }
    else this.dataService.showError('email already exist')
    
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
