import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-update-user',
  standalone: false,
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit{
  userForm!: FormGroup;
  countries: any[] = [];
  email: any;

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
     private apiService: ApiService, private dataService: DataService,private router: Router) {
     this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      createdAt: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Get email from route param
    this.email = this.route.snapshot.paramMap.get('email');
    //get country
    this.getCountry()
    this.getUserData()
  }

   //get country list
  getCountry(){
    this.apiService.getCountries().subscribe((result:any) => {
      this.countries = result;
    },(error:any)=>{
       this.dataService.showError('Something went wrong.')
    });
  }
  //get user data
  getUserData(){
    const emailData=this.dataService.getByEmail(this.email)
    if(emailData){
      this.userForm.patchValue({
      firstName:  emailData.firstName,
      lastName: emailData.lastName,
      email: emailData.email,
      country: emailData.country,
      })
    }
  }
   //on form submission
   onSubmit() {
    //update create date time
    this.userForm.get('createdAt')?.setValue(new Date().toISOString());
    
    if (this.userForm.valid) {
    const res:any =  this.dataService.update(this.email,this.userForm.value)
    this.dataService.showSuccess('Updated Successfully')
    this.router.navigate([''])
    
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
