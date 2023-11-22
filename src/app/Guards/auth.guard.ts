import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ApiService } from '../services/api.service';

export const authGuard: CanActivateFn = async (route, state) => {

  const _api = inject( ApiService);

  const status = await _api.checkAuth( state.url );

  return status;
};
