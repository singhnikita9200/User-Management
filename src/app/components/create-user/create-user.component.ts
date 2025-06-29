import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Country } from '../../models/country.model';
import { Location } from '@angular/common';
import { allowedEmailDomainsValidator } from '../../models/validators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-user',
  standalone: false,
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {

  // Reactive form for user creation 
  public userForm: FormGroup;

  //List of countries used in the dropdown 
  public countries: Country[] = [];

  // Inject required services with appropriate access level
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dataService: DataService,
    private router: Router,
    private location: Location
  ) {
    // Initialize form with validators and custom email domain check
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email,
        allowedEmailDomainsValidator(['gmail.com'])
      ]],
      country: ['', Validators.required],
      createdAt: ['']
    });
  }


  public ngOnInit(): void {
    this.getCountry();
  }

  //Fetch the list of countries from the API 
  private getCountry(): void {
    this.apiService.getCountries().subscribe(
      (result: Country[]) => {
        this.countries = result;
      },
      (error: HttpErrorResponse) => {
        this.dataService.showError('Something went wrong.');
      }
    );
  }

  //Handle form submission and save the user data 
  public onSubmit(): void {
    if (this.userForm.valid) {
      this.userForm.disable(); // prevent duplicate submissions

      // Set the creation timestamp
      this.userForm.get('createdAt')?.setValue(new Date().toISOString());

      const res = this.dataService.add(this.userForm.value);

      if (res) {
        this.userForm.enable();
        this.dataService.showSuccess('User has been added successfully.');
        this.router.navigate(['']);
      } else {
        this.userForm.enable();
        this.dataService.showError('This email address is already registered.');
      }

    } else {
      this.dataService.showError('Please complete all required fields before submitting.');
      this.userForm.markAllAsTouched();
    }
  }

  //Navigate to the previous page 
  public goBack(): void {
    this.location.back();
  }
}
