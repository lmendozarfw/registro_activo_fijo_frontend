import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./shared/templates/auth.tempalte').then(t => t.AuthTemplate),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/pages/login/login.page').then(p => p.LoginPage),
            }
        ]
    },
    {
        path: 'app',
        loadComponent: () => import('./shared/templates/main.template').then(t => t.MainTemplate),
        children: [
            {
                path: 'settings',
                loadComponent: () => import('./features/configuration/pages/configuration.page').then(p => p.ConfigurationPage),
            },
            {
                path: 'employees',
                loadComponent: () => import('./features/employees/pages/employees.page').then(p => p.EmployeesPage),
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'auth/login',
    }
];
