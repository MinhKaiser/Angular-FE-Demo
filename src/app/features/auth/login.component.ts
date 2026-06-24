import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, getEnvironmentConfig } from '@core/services';
import { IgxButtonDirective } from 'igniteui-angular/directives';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IgxButtonDirective],
  template: `
    <section class="login-page">
      <div class="login-card card">
        <div class="login-card__header">
          <div class="login-card__mark">DJ</div>
          <h1>Sign in</h1>
          <p>Use a DummyJSON account to continue.</p>
        </div>

        <div *ngIf="error()" class="alert">
          {{ error() }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="login-form__field">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              class="field"
              autocomplete="username"
            />
            <p *ngIf="isFieldInvalid('username')" class="login-form__error">Username is required.</p>
          </div>

          <div class="login-form__field">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="field"
              autocomplete="current-password"
            />
            <p *ngIf="isFieldInvalid('password')" class="login-form__error">Password is required.</p>
          </div>

          <button
            igxButton="contained"
            type="submit"
            [disabled]="isLoading() || loginForm.invalid"
            class="primary-button login-form__submit"
          >
            {{ isLoading() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <button
          igxButton="outlined"
          *ngIf="demoCredentials"
          type="button"
          (click)="useDemoCredentials()"
          class="outline-button login-card__demo-button"
        >
          Use demo credentials
        </button>

        <div *ngIf="demoCredentials" class="demo-credentials">
          <p><span>Username:</span> {{ demoCredentials.username }}</p>
          <p><span>Password:</span> {{ demoCredentials.password }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .login-page {
      display: grid;
      min-height: 100vh;
      place-items: center;
      padding: 2.5rem 1rem;
      background: var(--app-bg);
    }

    .login-card {
      width: min(100%, 420px);
      padding: 2rem;
    }

    .login-card__header {
      margin-bottom: 2rem;
    }

    .login-card__mark {
      display: grid;
      width: 3rem;
      height: 3rem;
      place-items: center;
      margin-bottom: 1rem;
      border-radius: var(--app-radius);
      color: #fff;
      background: var(--app-text);
      font-size: 0.9rem;
      font-weight: 800;
    }

    .login-card h1,
    .login-card p {
      margin: 0;
    }

    .login-card h1 {
      font-size: 1.65rem;
    }

    .login-card__header p,
    .demo-credentials {
      margin-top: 0.5rem;
      color: var(--app-text-muted);
      font-size: 0.9rem;
    }

    .login-form {
      display: grid;
      gap: 1rem;
    }

    .login-form__field label {
      display: block;
      margin-bottom: 0.5rem;
      color: #334155;
      font-size: 0.9rem;
      font-weight: 700;
    }

    .login-form__error {
      margin: 0.35rem 0 0;
      color: var(--app-danger);
      font-size: 0.78rem;
    }

    .login-form__submit,
    .login-card__demo-button {
      width: 100%;
    }

    .login-card__demo-button {
      margin-top: 1rem;
    }

    .demo-credentials {
      padding: 1rem;
      border-radius: var(--app-radius);
      background: var(--app-surface-muted);
    }

    .demo-credentials p + p {
      margin-top: 0.3rem;
    }

    .demo-credentials span {
      color: var(--app-text);
      font-weight: 800;
    }
  `],
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
