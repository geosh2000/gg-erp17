import { Component, Input, booleanAttribute, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { businessData } from '../../../globals';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../login.service';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class LoginFormularioComponent {

  @Input({ transform: booleanAttribute }) redirect: boolean = false;

  public login: LoginService = inject(LoginService);

  public _bd = businessData
  private fb: FormBuilder = inject(FormBuilder);

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


}
