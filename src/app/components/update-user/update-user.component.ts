import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { Country } from '../../models/country.model';


@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
  userForm!: FormGroup;
  countries: Country[] = [];
  email: string = '';

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
    private apiService: ApiService, private dataService: DataService, private router: Router) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      createdAt: ['']
    });
  }

  ngOnInit() {
    // Get email from route param
    this.email = this.route.snapshot.paramMap.get('email')!;
    //get country
    this.getCountry()
    this.getUserData()
  }

  // Fetches the list of countries from the API and updates the local `countries` array.
  getCountry(): void {
    this.apiService.getCountries().subscribe((result: Country[]) => {
      this.countries = result;
    }, (error: any) => {
      this.dataService.showError('Something went wrong.')
    });
  }
  //Get user data
  getUserData() {
    const emailData = this.dataService.getByEmail(this.email)
    if (emailData) {
      this.userForm.patchValue({
        firstName: emailData.firstName,
        lastName: emailData.lastName,
        email: emailData.email,
        country: emailData.country,
      })
    }
  }
  //Update data
  onSubmit() {
    if (this.userForm.valid) {
      this.userForm.disable();
      //update create date time
      this.userForm.get('createdAt')?.setValue(new Date().toISOString());
      const res: boolean = this.dataService.update(this.email, this.userForm.value)
      if (res) {
        this.dataService.showSuccess('Updated Successfully')
        this.router.navigate([''])
      }

    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
