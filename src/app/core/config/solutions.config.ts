export const SOLUTION_PERMISSIONS = {
  visitantes: 'registro_visitantes.acceso',
  salas: 'reserva_sala_juntas.acceso',
  permisos: 'solicitud_permisos.acceso',
  activoFijo: 'activo_fijo.acceso',
  mesaAyuda: 'mesa_ayuda.acceso',
  comunicacion: 'comunicacion.acceso',
  mantenimiento: 'mantenimiento.acceso'
} as const;

//registro_visitantes.acceso
//reserva_sala_juntas.acceso
//activo_fijo.acceso
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
    route: '/visitantes/visitas',
    theme: {
      tone: 'bg-neutral-100 text-neutral-700',
      gradient: 'from-neutral-950 via-neutral-800 to-neutral-600',
      accentText: 'text-neutral-300',
      accentSoft: 'bg-neutral-500/10 border-neutral-400/20',
    },
  },
  {
    code: 'salas',
    name: 'Reserva de sala de juntas',
    description: 'Consulta disponibilidad y agenda tus reuniones sin conflictos de horario.',
    icon: 'calendar',
    permission: SOLUTION_PERMISSIONS.salas,
    route: '/soluciones/salas',
    theme: {
      tone: 'bg-brand-50 text-brand-700',
      gradient: 'from-brand-950 via-brand-900 to-brand-700',
      accentText: 'text-brand-300',
      accentSoft: 'bg-brand-500/10 border-brand-400/20',
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
      tone: 'bg-neutral-100 text-neutral-700',
      gradient: 'from-neutral-950 via-neutral-800 to-neutral-600',
      accentText: 'text-neutral-300',
      accentSoft: 'bg-neutral-500/10 border-neutral-400/20',
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
      tone: 'bg-brand-50 text-brand-700',
      gradient: 'from-brand-950 via-brand-900 to-brand-700',
      accentText: 'text-brand-300',
      accentSoft: 'bg-brand-500/10 border-brand-400/20',
    },
  },
  {
    code: 'mesa-ayuda',
    name: 'Mesa de ayuda',
    description: 'Reporta incidencias y recibe soporte del equipo de Sistemas.',
    icon: 'headphones',
    permission: SOLUTION_PERMISSIONS.mesaAyuda,
    route: 'http://192.168.1.210:8081/Login.jsp',
    external: true,
    theme: {
      tone: 'bg-neutral-100 text-neutral-700',
      gradient: 'from-neutral-950 via-neutral-800 to-neutral-600',
      accentText: 'text-neutral-300',
      accentSoft: 'bg-neutral-500/10 border-neutral-400/20',
    },
  },
  {
    code: 'comunicacion',
    name: 'Comunicación Interna',
    description: 'Publica y consulta noticias, comunicados y avisos internos de la organización.',
    icon: 'comments',
    permission: SOLUTION_PERMISSIONS.comunicacion,
    route: '/comunicacion/noticias',
    theme: {
      tone: 'bg-brand-50 text-brand-700',
      gradient: 'from-brand-950 via-brand-900 to-brand-700',
      accentText: 'text-brand-300',
      accentSoft: 'bg-brand-500/10 border-brand-400/20',
    },
  },
  {
    code: 'mantenimiento',
    name: 'Mantenimiento',
    description: 'Gestiona los procesos de mantenimiento dentro de la organización.',
    icon: 'wrench',
    permission: SOLUTION_PERMISSIONS.mantenimiento,
    route: 'http://192.168.1.210:8081/Login.jsp',
    external: true,
    theme: {
      tone: 'bg-brand-50 text-brand-700',
      gradient: 'from-brand-950 via-brand-900 to-brand-700',
      accentText: 'text-brand-300',
      accentSoft: 'bg-brand-500/10 border-brand-400/20',
    },
  }
];
