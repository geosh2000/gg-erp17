import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../common/login.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {

  private elementRef: ElementRef = inject(ElementRef);
  private login: LoginService = inject(LoginService);

  public open = false

  toggleMenu(){
    this.open = !this.open
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    // Cierra el menú si se hace clic en cualquier lugar fuera de él.
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }

  logout(){
    this.login.logout()
  }

}
