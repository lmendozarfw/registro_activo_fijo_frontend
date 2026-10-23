export const SOLUTION_PERMISSIONS = {
  visitantes: 'registro_visitantes.acceso',
  salas: 'reserva_sala_juntas.acceso',
  permisos: 'solicitud_permisos.acceso',
  activoFijo: 'activo_fijo.acceso',
  mesaAyuda: 'mesa_ayuda.acceso',
} as const;

export interface SolutionTheme {
  tone: string;
  gradient: string;
  accentText: string;
  accentSoft: string;
}

export interface SolutionConfig {
  code: string;
  name: string;
  description: string;
  icon: string;
  permission: string;
  route: string;
  theme: SolutionTheme;
  external?: boolean;
  preview?: boolean;
}

export const SOLUTIONS: SolutionConfig[] = [
  {
    code: 'visitantes',
    name: 'Registro de visitantes',
    description: 'Controla el ingreso y salida de visitantes con un registro claro y seguro.',
    icon: 'id-card',
    permission: SOLUTION_PERMISSIONS.visitantes,
    route: '/soluciones/visitantes',
    theme: {
      tone: 'bg-sky-50 text-sky-700',
      gradient: 'from-sky-950 via-sky-900 to-sky-700',
      accentText: 'text-sky-300',
      accentSoft: 'bg-sky-500/10 border-sky-400/20',
    },
    preview: true,
  },
  {
    code: 'salas',
    name: 'Reserva de sala de juntas',
    description: 'Consulta disponibilidad y agenda tus reuniones sin conflictos de horario.',
    icon: 'calendar',
    permission: SOLUTION_PERMISSIONS.salas,
    route: '/soluciones/salas',
    theme: {
      tone: 'bg-violet-50 text-violet-700',
      gradient: 'from-violet-950 via-violet-900 to-violet-700',
      accentText: 'text-violet-300',
      accentSoft: 'bg-violet-500/10 border-violet-400/20',
    },
    preview: true,
  },
  {
    code: 'permisos',
    name: 'Solicitud de permisos',
    description: 'Gestiona permisos, vacaciones y ausencias de forma rápida y ordenada.',
    icon: 'file-edit',
    permission: SOLUTION_PERMISSIONS.permisos,
    route: '/soluciones/permisos',
    theme: {
      tone: 'bg-amber-50 text-amber-700',
      gradient: 'from-amber-950 via-amber-900 to-amber-700',
      accentText: 'text-amber-300',
      accentSoft: 'bg-amber-500/10 border-amber-400/20',
    },
    preview: true,
  },
  {
    code: 'activo-fijo',
    name: 'Activo fijo',
    description: 'Administra, asigna y da seguimiento a los activos de la empresa.',
    icon: 'briefcase',
    permission: SOLUTION_PERMISSIONS.activoFijo,
    route: '/app/kpis',
    theme: {
      tone: 'bg-emerald-50 text-emerald-700',
      gradient: 'from-emerald-950 via-emerald-900 to-emerald-700',
      accentText: 'text-emerald-300',
      accentSoft: 'bg-emerald-500/10 border-emerald-400/20',
    },
  },
  {
    code: 'mesa-ayuda',
    name: 'Mesa de ayuda',
    description: 'Reporta incidencias y recibe soporte del equipo de Sistemas.',
    icon: 'headphones',
    permission: SOLUTION_PERMISSIONS.mesaAyuda,
    route: '/soluciones/mesa-ayuda',
    theme: {
      tone: 'bg-rose-50 text-rose-700',
      gradient: 'from-rose-950 via-rose-900 to-rose-700',
      accentText: 'text-rose-300',
      accentSoft: 'bg-rose-500/10 border-rose-400/20',
    },
    preview: true,
  },
  {
    code: 'difusion',
    name: 'Portal de difusión',
    description: 'Consulta comunicados, noticias y contenidos internos de la organización.',
    icon: 'megaphone',
    permission: '',
    route: 'https://sites.google.com/view/comunicacion-raudal/inicio',
    theme: {
      tone: 'bg-indigo-50 text-indigo-700',
      gradient: 'from-indigo-950 via-indigo-900 to-indigo-700',
      accentText: 'text-indigo-300',
      accentSoft: 'bg-indigo-500/10 border-indigo-400/20',
    },
    external: true,
  },
];
