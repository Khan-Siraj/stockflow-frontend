import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './signup.html',
})
export class Signup {
  private fb = inject(FormBuilder);

  private authService = inject(Auth);

  private router = inject(Router);

  loading = false;

  form = this.fb.group({
    organizationName: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.signup(this.form.value).subscribe({
      next: (response: any) => {
        this.authService.storeToken(response.access_token);

        this.router.navigate(['/dashboard']);

        this.loading = false;
      },

      error: () => {
        this.loading = false;
        alert('Signup failed');
      },
    });
  }
}
