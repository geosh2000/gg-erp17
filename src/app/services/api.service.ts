import { Injectable, NgZone, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { map, catchError, filter, share } from 'rxjs/operators'
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonService } from './service.index';

import { Location } from '@angular/common';
import { LoginFormularioComponent } from '../common/login/formulario/formulario.component';

declare global {
  interface Window {
    RTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  localIp = sessionStorage.getItem('LOCAL_IP');
  app = ''
  ip = ''

  public isLoading:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public newLogin:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public lastUrl: any

  public apiRestful:string = environment.apiURL;

  private http:HttpClient = inject(HttpClient)
  private domSanitizer:DomSanitizer = inject(DomSanitizer)
  private router: Router = inject(Router)
  private _common: CommonService = inject(CommonService)
  private location: Location = inject(Location)

  constructor() {
      // Obtiene ip publica
      this.getPublicIp();
  }

  transform( url: string): any {
    return this.domSanitizer.bypassSecurityTrustUrl( url );
  }

  // Get Token from localstorage
  getToken(): string | boolean {

    // Validar si existe token en localstorage
    if( !localStorage.getItem('token') ){
      return false;
    }

    return localStorage.getItem('token') as string;
  }

  // Generate headers
  getHeaders( params = { skipToken: false } ): any {

    let skipToken  = params['skipToken'] ?? false

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Obtener token, si es verdadero, agregarlo a los headers
    let token = this.getToken();

    if( params['skipToken'] ){
      return headers;
    }

    if( !token ){
      console.error('No existe token, debes loguearte primero');
      this.redirectToLogin();
      return false;
    }

    return headers.append('Authorization', `Bearer ${ token }`);

  }

  // Remove token from localstorage
  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }

  // Redirect to login or open modal
  redirectToLogin(): void {
    // Valida ruta actual, si es diferente a login, abre el modal de login
    if( this.router.url != '/login' ){
      this.openLoginModal();
    }
  }

  // Check if token is invalid
  isTokenInvalid( err: string ): boolean {

    if( err  == 'Invalid Token' ){

      this.removeToken();
      this.redirectToLogin();

      return false;
    }

    return true;
  }

  openLoginModal(): void {
    this._common.openModal( LoginFormularioComponent, '400px', (result) => {
      // Corre el token check
      this.get( '', 'auth/check', null, (err) => this.openLoginModal() ).subscribe();
    });
  }


  checkAuth( url: any ): Promise<boolean>{

    return new Promise(async resolve => {
      this.post( { uri: url }, 'login/checkAuthMod',
        (res) => resolve( res['data'] ),
        (err) => resolve( false )
      ).subscribe();
    });

  }

  externalGet( url: string, callback: ((res: any) => void) | null = null, errorCallback: ((err: any) => void) | null = null): Observable<any>{
    return this.http.get( url )
        .pipe(
          map( res => {
            if( callback ){
              callback( res );
            }
          }),
          catchError( err => {
            let error = this._common.returnError( err );
            errorCallback ? errorCallback( error ) : null;
            return of( error );
          }),
        );
  }

  put( data: Object | null, apiRoute: string, callback: ((res: any) => void) | null = null, errorCallback: ((err: any) => void) | null = null, params = { skipToken: false }): Observable<any>{

    let url = this.transform(`${ this.apiRestful }${ apiRoute }`)
    let body = data !== null ? JSON.stringify( data ) : '{}';
    let headers = this.getHeaders( params );

    // Si headers es false, termina la funcion y lanza un error de Sesion Invalida
    if( !headers ){
      return of( 'Invalid Session' );
    }

    return this.http.put( url.changingThisBreaksApplicationSecurity, body, { headers } )
      .pipe(
        map( res => {
          if( callback ){
            callback( res );
          }
        }),
        catchError( err => {
          let error = this._common.returnError( err );
          this.isTokenInvalid( error );
          errorCallback ? errorCallback( error ) : null;
          return of( error );
        }),
      );
  }

  post( data: Object | null, apiRoute: string, callback: ((res: any) => void) | null = null, errorCallback: ((err: any) => void) | null = null, params = { skipToken: false }): Observable<any>{

    let url = this.transform(`${ this.apiRestful }${ apiRoute }`)
    let body = data !== null ? JSON.stringify( data ) : '{}';
    let headers = this.getHeaders( params );

    // Si headers es false, termina la funcion y lanza un error de Sesion Invalida
    if( !headers ){
      return of( 'Invalid Session' );
    }

    return this.http.post( url.changingThisBreaksApplicationSecurity, body, { headers } )
      .pipe(
        map( res => {
          if( callback ){
            callback( res );
          }
        }),
        catchError( err => {
          let error = this._common.returnError( err );
          this.isTokenInvalid( error );
          errorCallback ? errorCallback( error ) : null;
          return of( error );
        }),
      );
  }

  get( id: string | number, apiRoute: string, callback: ((res: any) => void) | null = null, errorCallback: ((err: any) => void) | null = null, params = { skipToken: false }): Observable<any>{

    let url = this.transform(`${ this.apiRestful }${ apiRoute }`+ (id != '' ? `/${id}` : ''))
    let headers = this.getHeaders( params );

    // Si headers es false, termina la funcion y lanza un error de Sesion Invalida
    if( !headers ){
      return of( 'Invalid Session' );
    }

    return this.http.get( url.changingThisBreaksApplicationSecurity, { headers } )
      .pipe(
        map( res => {
          if( callback ){
            callback( res );
          }
        }),
        catchError( err => {
          let error = this._common.returnError( err );
          this.isTokenInvalid( error );
          errorCallback ? errorCallback( error ) : null;
          return of( error );
        }),
      );
  }

  async getPublicIp(): Promise<void> {
    try {
      const response = await this.http.get<any>('https://api64.ipify.org?format=json').toPromise();
      this.ip = response.ip;
    } catch (error) {
      console.error('Error al obtener la dirección IP pública:', error);
    }
  }



}
