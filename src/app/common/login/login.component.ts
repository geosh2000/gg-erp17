import { AfterContentInit, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormularioComponent } from './formulario/formulario.component';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormularioComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit  {

  // Verificar si existe userData en localStorage
  private _login = inject(LoginService);
  private router = inject(Router);

  public showLogin = signal<boolean>(false)

  constructor(){
  }
  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.showLogin.update( () => false )
      this.router.navigate(['/admin']);
    }else{
      this.showLogin.update( () => true )
    }

  }

}
