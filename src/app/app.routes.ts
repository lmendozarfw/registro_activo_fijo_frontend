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
                path: 'kpis',
                loadComponent: () => import('./features/kpis/pages/kpis.page').then(p => p.KpisPage),
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/configuration/pages/configuration.page').then(p => p.ConfigurationPage),
            },
            {
                path: 'employees',
                loadComponent: () => import('./features/employees/pages/employees.page').then(p => p.EmployeesPage),
            },
            {
                path: 'phones',
                loadComponent: () => import('./features/resources/pages/phones.page').then(p => p.PhonesPage)
            },
            {
                path: 'fixed-asset',
                loadComponent: () => import('./features/resources/pages/resources.page').then(p => p.ResourcesPage)
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
                path: 'assignments',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'active',
                    },
                    {
                        path: 'active',
                        loadComponent: () => import('./features/assignments/pages/assignments.page').then(p => p.AssignmentsPage),
                    },
                    {
                        path: 'history',
                        loadComponent: () => import('./features/assignments/pages/assignment-history.page').then(p => p.AssignmentHistoryPage),
                    },
                    {
                        path: ':id/letter',
                        loadComponent: () => import('./features/assignments/pages/assignment-letter.page').then(p => p.AssignmentLetterPage),
                    },
                ],
            },
            {
                path: 'assets',
                loadComponent: () => import('./features/resources/pages/resources.page').then(p => p.ResourcesPage),
            },
            {
                path: 'assets/:id/maintenances',
                loadComponent: () => import('./features/resources/pages/resource-maintenances.page').then(p => p.ResourceMaintenancesPage),
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/pages/reports.page').then(p => p.ReportsPage),
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'auth/login',
    }
];
