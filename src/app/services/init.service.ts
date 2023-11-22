import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, Event, ActivatedRouteSnapshot, Data } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
// import { ApiService } from './api.service';
// import { ZonaHorariaService } from './zona-horaria.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  preferences:any = {}
  currentUser:any
  isLogin:boolean = false
  agentName = ''

  token = new BehaviorSubject( false )
  snack = new BehaviorSubject( { status: false, msg: '', title: '', t: '' } )
  hideMenu = new BehaviorSubject( false )

  loadingRouteConfig = false
  app = ''

  currentUrl: string = ''
  previousUrl: string = ''

  title: string = ''
  tituloSubs$: Subscription | undefined;


  constructor(
    private _route:Router,
    private titleService: Title,
    private route: ActivatedRoute,
    // private _api:ApiService,
    // private _zh:ZonaHorariaService
    ) {
    // this.getPreferences()

    this._route.events.subscribe( v => {
      // $('.modal').modal('hide')
      this.hideMenu.next( true )
    })

    this.getRoute()

    // this._route.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe((event: NavigationEnd) => {
    //     this.previousUrl = this.currentUrl;
    //     this.currentUrl = event.url;

    //   });

    // this.agentName = localStorage.getItem('nombre')
  }



  // getPreferences( app = '' ){

  //   this._api.app = app

  //   if( localStorage.getItem(app + 'currentUser') ){
  //     this.currentUser = JSON.parse(localStorage.getItem(app + 'currentUser'))
  //     this._api.restfulGet( '', 'Preferences/userPreferences' )
  //         .subscribe( res => {
  //           this.preferences = res['data']
  //           this._zh.getZone( this.preferences['zonaHoraria'] )
  //         })
  //     this.isLogin = true
  //     this.token.next( true )
  //   }else{
  //     this.isLogin = false
  //     this.token.next( false )
  //   }
  // }

  // getUserInfo( app = ''){
  //   let currentUser = JSON.parse(localStorage.getItem(app + 'currentUser'));
  //   this.currentUser = currentUser
  //   if( currentUser ){
  //     this.isLogin = true
  //   }else{
  //     this.isLogin = false
  //   }
  //   return currentUser
  // }

  // checkCredential( credential, main:boolean=false, test:boolean = false, app = '' ){
  //   let currentUser = JSON.parse(localStorage.getItem(app + 'currentUser'));
  //   if( currentUser == null){

  //     this.showLoginModal( )
  //     return false
  //   }

  //   let cred = JSON.parse(atob(currentUser.creds))

  //   if(cred['allmighty'] == 1 && !test){
  //     return true
  //   }

  //   if(cred[credential] == 1){
  //     return true
  //   }else{
  //     this.displayNoCredentials( main )
  //     return false
  //   }

  // }

  // displayNoCredentials( display ){
  //   if(display){
  //     jQuery('#noCredentials').modal('show');
  //     this._route.navigateByUrl('/home')
  //   }
  // }

  // checkSingleCredential( credential, main:boolean=false, test:boolean = false, app = '' ){



  //   let currentUser = JSON.parse(localStorage.getItem(app + 'currentUser'));
  //   if( currentUser == null){
  //     return false
  //   }

  //   let cred = JSON.parse(atob(currentUser.creds))

  //   if(cred['allmighty'] == 1 && !test){
  //     return true
  //   }

  //   if(cred[credential] == 1){
  //     return true
  //   }else{
  //     return false
  //   }

  // }

  snackbar( t: any, title: any, msg: any ){

    // console.trace()

    this.snack.next( {
      status: true,
      msg,
      title,
      t
    } )

    setTimeout( () => {
      this.snack.next( {
        status:false,
        msg: '',
        title: '',
        t: 'error'
      })
    },1000)
  }

  private getRoute(): void {


    // Escuchar ActivationEnd para rutas internas
    this._route.events.pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    ).subscribe(data => {
      this.updateTitle(data['title']);
    });

    // Escuchar NavigationEnd para el primer ingreso
    this._route.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      const root = this._route.routerState.snapshot.root;
      const data = this.getLastRouteData(root);
      this.updateTitle(data?.['title']);
    });
  }

  private getLastRouteData(routeSnapshot: ActivatedRouteSnapshot): Data | null {
    let data = routeSnapshot.data;
    let child = routeSnapshot.firstChild;
    while (child) {
      data = { ...data, ...child.data };
      child = child.firstChild;
    }
    return data;
  }


  private updateTitle(title: string | undefined): void {
    const newTitle = title || 'Geosh Global Solutions';
    this.setTitle(newTitle);
  }


  setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }


}
