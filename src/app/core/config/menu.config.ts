export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
}

export const ACTIVO_FIJO_MENU: MenuItem[] = [
  {
    key: 'kpis',
    label: 'Indicadores',
    icon: 'chart-bar',
    route: '/app/kpis',
  },
  {
    key: 'employees',
    label: 'Empleados',
    icon: 'users',
    route: '/app/employees',
  },
  {
    key: 'phones',
    label: 'Celulares',
    icon: 'mobile',
    route: '/app/phones',
  },
  {
    key: 'assignments',
    label: 'Asignaciones',
    icon: 'list-check',
    children: [
      {
        key: 'assignments-active',
        label: 'Activas',
        icon: 'check-circle',
        route: '/app/assignments/active',
      },
      {
        key: 'assignments-history',
        label: 'Historial',
        icon: 'history',
        route: '/app/assignments/history',
      },
    ],
  },
  {
    key: 'assets',
    label: 'Activo fijo',
    icon: 'briefcase',
    route: '/app/assets',
  },
  {
    key: 'credentials',
    label: 'Credenciales',
    icon: 'key',
    route: '/app/credentials',
  },
  {
    key: 'sharepoint-accesses',
    label: 'Accesos SharePoint',
    icon: 'microsoft',
    route: '/app/sharepoint-accesses',
  },
  {
    key: 'users',
    label: 'Usuarios',
    icon: 'user',
    route: '/app/users',
  },
  {
    key: 'my-credentials',
    label: 'Mis credenciales',
    icon: 'id-card',
    route: '/app/my-credentials',
  },
  {
    key: 'reports',
    label: 'Reportes',
    icon: 'file-pdf',
    route: '/app/reports',
  },
  {
    key: 'settings',
    label: 'Configuración',
    icon: 'cog',
    route: '/app/settings',
  },
];

export const COMUNICACION_MENU: MenuItem[] = [
  {
    key: 'noticias',
    label: 'Noticias',
    icon: 'comments',
    route: '/comunicacion/noticias',
  },
];

export const VISITOR_MENU: MenuItem[] = [
  {
    key: 'visitas',
    label: 'Visitas',
    icon: 'users',
    route: '/visitantes/visitas',
  },
];
