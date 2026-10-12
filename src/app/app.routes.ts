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
            {
                path: 'credentials',
                loadComponent: () => import('./features/credentials/pages/credentials.page').then(p => p.CredentialsPage),
            },
            {
                path: 'users',
                loadComponent: () => import('./features/users/pages/users.page').then(p => p.UsersPage),
            },
            {
                path: 'my-credentials',
                loadComponent: () => import('./features/credentials/pages/my-credentials.page').then(p => p.MyCredentialsPage),
            },
            {
                path: 'assets',
                loadComponent: () => import('./features/resources/pages/resources.page').then(p => p.ResourcesPage),
            },
            {
                path: 'phones',
                loadComponent: () => import('./features/resources/pages/phones.page').then(p => p.PhonesPage),
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'auth/login',
    }
];
