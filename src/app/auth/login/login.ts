import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);

  private authService = inject(Auth);

  private router = inject(Router);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(this.form.value).subscribe({
      next: (response: any) => {
        this.authService.storeToken(response.access_token);

        this.router.navigate(['/dashboard']);

        this.loading = false;
      },

      error: () => {
        this.loading = false;
        alert('Invalid credentials');
      },
    });
  }
}
