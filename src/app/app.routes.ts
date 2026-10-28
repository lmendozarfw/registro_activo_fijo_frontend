import { Routes } from '@angular/router';
import { SOLUTION_PERMISSIONS } from './core/config/solutions.config';
import { authGuard } from './core/guards/auth.guard';
import { solutionAccessGuard } from './core/guards/solution-access.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/pages/landing.page').then((p) => p.LandingPage),
  },
  {
    path: 'auth',
    loadComponent: () => import('./shared/templates/auth.tempalte').then((t) => t.AuthTemplate),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.page').then((p) => p.LoginPage),
      },
    ],
  },
  {
    path: 'hub',
    canActivate: [authGuard],
    loadComponent: () => import('./features/hub/pages/hub.page').then((p) => p.HubPage),
  },
  {
    path: 'sin-acceso',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/access-denied/pages/access-denied.page').then((p) => p.AccessDeniedPage),
  },
  {
    path: 'noticias',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/news/pages/public-news-list/public-news-list.page').then(
        (p) => p.PublicNewsListPage,
      ),
  },
  {
    path: 'noticias/:id',
    loadComponent: () =>
      import('./features/news/pages/public-news-detail/public-news-detail.page').then(
        (p) => p.PublicNewsDetailPage,
      ),
  },
  {
    path: 'soluciones/:solution',
    canActivate: [authGuard, solutionAccessGuard],
    loadComponent: () =>
      import('./shared/templates/solution/solution.template').then((t) => t.SolutionTemplate),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/solutions/pages/solution-home.page').then((p) => p.SolutionHomePage),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: 'comunicacion',
    canActivate: [authGuard, permissionGuard],
    data: { permission: SOLUTION_PERMISSIONS.comunicacion },
    loadComponent: () => import('./shared/templates/notice.template').then((t) => t.NoticeTemplate),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'noticias',
      },
      {
        path: 'noticias',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/news/pages/news-list/news-list.page').then((p) => p.NewsListPage),
      },
      {
        path: 'noticias/nueva',
        loadComponent: () =>
          import('./features/news/pages/news-form/news-form.page').then((p) => p.NewsFormPage),
      },
      {
        path: 'noticias/:id/editar',
        loadComponent: () =>
          import('./features/news/pages/news-form/news-form.page').then((p) => p.NewsFormPage),
      },
      {
        path: '**',
        redirectTo: 'noticias',
      },
    ],
  },
  {
    path: 'visitantes',
    canActivate: [authGuard, permissionGuard],
    data: { permission: SOLUTION_PERMISSIONS.visitantes },
    loadComponent: () =>
      import('./shared/templates/visitor.template').then((t) => t.VisitorTemplate),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'visitas',
      },
      {
        path: 'visitas',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/visitors/pages/visits-list/visits-list.page').then(
            (p) => p.VisitsListPage,
          ),
      },
      {
        path: 'visitas/nueva',
        loadComponent: () =>
          import('./features/visitors/pages/visit-form/visit-form.page').then(
            (p) => p.VisitFormPage,
          ),
      },
      {
        path: 'visitas/:id/editar',
        loadComponent: () =>
          import('./features/visitors/pages/visit-form/visit-form.page').then(
            (p) => p.VisitFormPage,
          ),
      },
      {
        path: 'visitas/:id',
        loadComponent: () =>
          import('./features/visitors/pages/visit-detail/visit-detail.page').then(
            (p) => p.VisitDetailPage,
          ),
      },
      {
        path: '**',
        redirectTo: 'visitas',
      },
    ],
  },
  {
    path: 'app',
    canActivate: [authGuard, permissionGuard],
    data: { permission: SOLUTION_PERMISSIONS.activoFijo },
    loadComponent: () => import('./shared/templates/main.template').then((t) => t.MainTemplate),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assets',
      },
      {
        path: 'kpis',
        loadComponent: () => import('./features/kpis/pages/kpis.page').then((p) => p.KpisPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/configuration/pages/configuration.page').then(
            (p) => p.ConfigurationPage,
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/pages/employees.page').then((p) => p.EmployeesPage),
      },
      {
        path: 'phones',
        loadComponent: () =>
          import('./features/resources/pages/phones.page').then((p) => p.PhonesPage),
      },
      {
        path: 'fixed-asset',
        loadComponent: () =>
          import('./features/resources/pages/resources.page').then((p) => p.ResourcesPage),
      },
      {
        path: 'credentials',
        loadComponent: () =>
          import('./features/credentials/pages/credentials.page').then((p) => p.CredentialsPage),
      },
      {
        path: 'sharepoint-accesses',
        loadComponent: () =>
          import('./features/sharepoint/pages/sharepoint-accesses.page').then(
            (p) => p.SharePointAccessesPage,
          ),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/pages/users.page').then((p) => p.UsersPage),
      },
      {
        path: 'my-credentials',
        loadComponent: () =>
          import('./features/credentials/pages/my-credentials.page').then(
            (p) => p.MyCredentialsPage,
          ),
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
            loadComponent: () =>
              import('./features/assignments/pages/assignments.page').then(
                (p) => p.AssignmentsPage,
              ),
          },
          {
            path: 'history',
            loadComponent: () =>
              import('./features/assignments/pages/assignment-history.page').then(
                (p) => p.AssignmentHistoryPage,
              ),
          },
          {
            path: ':id/letter',
            loadComponent: () =>
              import('./features/assignments/pages/assignment-letter.page').then(
                (p) => p.AssignmentLetterPage,
              ),
          },
        ],
      },
      {
        path: 'assets',
        loadComponent: () =>
          import('./features/resources/pages/resources.page').then((p) => p.ResourcesPage),
      },
      {
        path: 'assets/:id/maintenances',
        loadComponent: () =>
          import('./features/resources/pages/resource-maintenances.page').then(
            (p) => p.ResourceMaintenancesPage,
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/pages/reports.page').then((p) => p.ReportsPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
