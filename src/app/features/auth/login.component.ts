import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, getEnvironmentConfig } from '@core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div class="mb-8">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">DJ</div>
          <h1 class="text-2xl font-bold text-slate-950">Sign in</h1>
          <p class="mt-2 text-sm text-slate-600">Use a DummyJSON account to continue.</p>
        </div>

        <div *ngIf="error()" class="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ error() }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="username" class="mb-2 block text-sm font-medium text-slate-700">Username</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              autocomplete="username"
            />
            <p *ngIf="isFieldInvalid('username')" class="mt-1 text-xs text-red-600">Username is required.</p>
          </div>

          <div>
            <label for="password" class="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              autocomplete="current-password"
            />
            <p *ngIf="isFieldInvalid('password')" class="mt-1 text-xs text-red-600">Password is required.</p>
          </div>

          <button
            type="submit"
            [disabled]="isLoading() || loginForm.invalid"
            class="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:bg-slate-400"
          >
            {{ isLoading() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <button
          *ngIf="demoCredentials"
          type="button"
          (click)="useDemoCredentials()"
          class="mt-4 w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Use demo credentials
        </button>

        <div *ngIf="demoCredentials" class="mt-6 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
          <p><span class="font-semibold text-slate-900">Username:</span> {{ demoCredentials.username }}</p>
          <p class="mt-1"><span class="font-semibold text-slate-900">Password:</span> {{ demoCredentials.password }}</p>
        </div>
      </div>
    </section>
  `,
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly config = getEnvironmentConfig();

  readonly isLoading = this.authService.isLoading;
  readonly error = this.authService.error;
  readonly demoCredentials = this.config.demoCredentials;
  readonly loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  private returnUrl = '/dashboard';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login({
      ...this.loginForm.getRawValue(),
      expiresInMins: 30,
    }).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
    });
  }

  useDemoCredentials(): void {
    if (!this.demoCredentials) return;

    this.loginForm.setValue({
      username: this.demoCredentials.username,
      password: this.demoCredentials.password,
    });
  }

  isFieldInvalid(fieldName: 'username' | 'password'): boolean {
    const field = this.loginForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }
}
