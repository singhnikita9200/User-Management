import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  countries: Country[] = [];

  constructor(private fb: FormBuilder, private apiService: ApiService,
    private dataService: DataService, private router: Router) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      createdAt: ['']
    });
  }

  ngOnInit(): void {
    this.getCountry()
  }

  //Get country list
  getCountry() {
    this.apiService.getCountries().subscribe((result: Country[]) => {
      this.countries = result;
    }, (error: any) => {
      this.dataService.showError('Something went wrong.')
    });
  }
  //Save data
  onSubmit() {
    if (this.userForm.valid) {
      this.userForm.disable();
      //update create date time
      this.userForm.get('createdAt')?.setValue(new Date().toISOString());
      const res = this.dataService.add(this.userForm.value)
      if (res) {
        this.userForm.enable();
        this.dataService.showSuccess('User Added Successfully.')
        this.router.navigate([''])
      }
      else this.dataService.showError('Email already exist.')

    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
