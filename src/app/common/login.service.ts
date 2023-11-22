import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService, CommonService } from '@services/service.index';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private location: Location = inject(Location)
  private  _api: any = inject(ApiService)
  private _common: any = inject(CommonService)
  private route: any = inject(Router)

  // Funcion para guardar en localstorage el token
  saveToken(token: string, userData: Array<any>): void {
    localStorage.setItem('token', token);

    // Guardar userData en localstorage
    localStorage.setItem('userData', JSON.stringify( userData ));
  }

  // Obtener ruta anterior desde Location
  lastUrl(): void {
    const location = this.location as any;
    const state = location.getState() as any;
    this._api.lastUrl = state.navigationId > 1 ? location.getPreviousNavigation().extractedUrl.toString() : null;
  }

  // Post de login
  loginPost( form: FormGroup, redirect: boolean = false ) {

    if( form.invalid ){
      console.error('Formulario invalido')
      return;
    }

    let loginData = form.value
    loginData['ip'] = this._api.ip

    this._api.post( loginData, 'login',
      (res:any) => {
        this.saveToken( res.token, res.userData );

        this._common.showSnak( res.msg, 'success' );


        // Si redirect es true, redireccioa
        if( redirect ){
          if( this._api.lastUrl == null ){
            this.route.navigate(['/admin']);
          }else{
            this.route.navigateByUrl( this._api.lastUrl );
          }
        }else{
          // Si redirect es false, reload
          window.location.reload();
        }
        return
      },
      (err:any) => {
        // Delete localstorage token
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      },
      { skipToken: true }
    ).subscribe();
  }

  logout(){
    this._api.get('', 'login/out', (res: any) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');

      // Redireccionar a login con routes
      this.route.navigate(['/login']);
    }).subscribe();

  }

  getUserData(){
    // Get user data from localStorage
    return JSON.parse(localStorage.getItem('userData') || '{}')
  }

}
