import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormularioComponent } from './formulario/formulario.component';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormularioComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {



}
