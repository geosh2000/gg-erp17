import { Inject, Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public snack: MatSnackBar = inject(MatSnackBar)
  private _dialog: MatDialog = inject(MatDialog)

  // mostrar error en consola y snackbar
  showError( err: any ) {

    const error = err.error;
    console.error( error.msg );

    this.snack.open( error.msg, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  returnError( err: any ) {
    const error = err.error;
    console.error( error.msg );

    return error.msg;
  }

  // mostrar mensaje en snackbar
  showSnak( msg: string, type: 'success' | 'error' = 'success' ) {

    this.snack.open( msg, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [ `${type}-snackbar` ]
    });
  }

  openModal( component: ComponentType<unknown>, width: '400px', callback: ((result: any) => void) | null = null ): void {
    const dialogRef = this._dialog.open(component, {
      width: width, // Ancho del modal (personalizable)
      // Puedes agregar más opciones aquí según tus necesidades
    });

    // Puedes realizar acciones después de que se cierre el modal, si es necesario
    dialogRef.afterClosed().subscribe(result => {
      if( callback ){
        callback( result );
      }else{
        return
      }
    });
  }

}
