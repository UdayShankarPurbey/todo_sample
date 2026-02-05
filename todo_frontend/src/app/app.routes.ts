import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/todo/todo').then((m) => m.TodoComponent),
  },
];
