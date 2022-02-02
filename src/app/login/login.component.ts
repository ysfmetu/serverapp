import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoginFormModel } from 'src/app/models/form.models';
import { RequestService } from 'src/app/server-request/request.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [RequestService],
})
export class LoginComponent implements OnInit {
  form: LoginFormModel = new LoginFormModel();
  constructor(
    private service: RequestService,
    private authService: AuthService
  ) {}
  a;
  ngOnInit(): void {}
  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsDirty(); // or control.markAsTouched();
    });
  }
  submitLogin() {
    this.markFormGroupTouched(this.form);
    if (this.form.valid) {
      this.service.login(this.form.value).subscribe((x) => {
        if (x.result) {
          this.authService.loginSuccess(x.data);
          console.log(x.data);
        }
      });
    }
  }
}
