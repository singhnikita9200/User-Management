import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { Country } from '../../models/country.model';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {

  // Properties
  public userForm!: FormGroup;
  public countries: Country[] = [];
  private email: string = '';

  //Constructor Injection
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private dataService: DataService,
    private router: Router,
    private location: Location
  ) {
    // Initialize the form
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      createdAt: ['']
    });
  }


  ngOnInit(): void {
    // Extract email from URL
    this.email = this.route.snapshot.paramMap.get('email')!;

    this.getCountry();
    this.getUserData();
  }

  // Fetch country list from API
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

  // Populate form with existing user data
  private getUserData(): void {
    const user = this.dataService.getByEmail(this.email);
    if (user) {
      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country
      });
    }
  }

  // Submit updated data 
  public onSubmit(): void {
    if (this.userForm.valid) {
      this.userForm.disable();

      // Add current timestamp
      this.userForm.get('createdAt')?.setValue(new Date().toISOString());

      const updated = this.dataService.update(this.email, this.userForm.value);
      if (updated) {
        this.dataService.showSuccess('User details have been successfully updated.');
        this.router.navigate(['']);
      } else {
        this.userForm.enable();
        this.dataService.showError('Unable to update user details. Please try again.');
      }
    } else {
      this.userForm.markAllAsTouched();
      this.dataService.showError('Please complete all required fields before submitting the form.');
    }
  }

  // Navigate back
  public goBack(): void {
    this.location.back();
  }
}
