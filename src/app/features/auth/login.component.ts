import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, getEnvironmentConfig } from '@core/services';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxInputGroupModule } from 'igniteui-angular/input-group';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IgxButtonDirective,
    IgxCardModule,
    IgxIconModule,
    IgxInputGroupModule,
  ],
  template: `
    <section class="login-page">
      <igx-card elevated="true" class="login-card">
        <div class="login-card__header">
          <div class="login-card__mark">DJ</div>
          <h1>Sign in</h1>
          <p>Use a DummyJSON account to continue.</p>
        </div>

        @if (error()) {
          <div class="alert">
            {{ error() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="login-form__field">
            <igx-input-group type="box">
              <igx-icon igxPrefix>person</igx-icon>
              <label igxLabel for="username">Username</label>
              <input
                #usernameInput
                id="username"
                igxInput
                type="text"
                formControlName="username"
                autocomplete="username"
              />
            </igx-input-group>

            @if (isFieldInvalid('username')) {
              <p class="login-form__error">
                Username is required.
              </p>
            }
          </div>

          <div class="login-form__field">
            <igx-input-group type="box">
              <igx-icon igxPrefix>lock</igx-icon>
              <label igxLabel for="password">Password</label>
              <input
                id="password"
                igxInput
                type="password"
                formControlName="password"
                autocomplete="current-password"
              />
            </igx-input-group>

            @if (isFieldInvalid('password')) {
              <p class="login-form__error">
                Password is required.
              </p>
            }
          </div>

          <button
            igxButton="contained"
            type="submit"
            [disabled]="isLoading() || loginForm.invalid"
            class="primary-button login-form__submit"
          >
            <igx-icon>{{ isLoading() ? 'hourglass_top' : 'login' }}</igx-icon>
            {{ isLoading() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        @if (demoCredentials) {
          <button
            igxButton="outlined"
            type="button"
            (click)="useDemoCredentials()"
            class="outline-button login-card__demo-button"
          >
            <igx-icon>bolt</igx-icon>
            Use demo credentials
          </button>

          <div class="demo-credentials">
            <p><span>Username:</span> {{ demoCredentials.username }}</p>
            <p><span>Password:</span> {{ demoCredentials.password }}</p>
          </div>
        }
      </igx-card>
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

    .login-form__submit,
    .login-card__demo-button {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
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

    @media (max-width: 560px) {
      .login-page {
        padding: 1rem;
      }

      .login-card {
        padding: 1.25rem;
      }
    }
  `],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly config = getEnvironmentConfig();
  private readonly subscriptions = new Subscription();
  private returnUrl = '/dashboard';

  @ViewChild('usernameInput') private usernameInput?: ElementRef<HTMLInputElement>;

  readonly isLoading = this.authService.isLoading;
  readonly error = this.authService.error;
  readonly demoCredentials = this.config.demoCredentials;
  readonly loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.queryParamMap.subscribe(params => {
        this.returnUrl = params.get('returnUrl') || '/dashboard';
      })
    );
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.usernameInput?.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
