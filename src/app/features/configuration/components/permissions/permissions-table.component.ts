import { Component, signal, WritableSignal } from "@angular/core";
import { TableModule } from 'primeng/table';

@Component({
    selector: "app-permissions-table",
    templateUrl: "./permissions-table.component.html",
    styles: [],
    imports: [TableModule]
})
export class PermissionsTableComponent {
    permissions: WritableSignal<any[]> = signal([
        {
            code: 'SISTEMAS_ELIMINAR',
            name: 'Eliminar sistemas',
            description: 'Eliminar sistemas',
            modulo: 'Sistemas'
        },
        {
            code: 'RECURSOS_CREAR',
            name: 'Registrar activos fijos',
            description: 'Crear recursos nuevos',
            modulo: 'Activo fijo'
        },
        {
            code: 'MARCAS_EDITAR',
            name: 'Editar marcas',
            description: 'Modificar marcas',
            modulo: 'Catalogos de activo fijo'
        },
        {
            code: 'SISTEMAS_LEER',
            name: 'Consultar sistemas',
            description: 'Ver el listado de sistemas',
            modulo: 'Sistemas'
        },
        {
            code: 'DEPARTAMENTOS_EDITAR',
            name: 'Editar departamentos',
            description: 'Modificar departamentos',
            modulo: 'Departamentos y puestos'
        },
        {
            code: 'RECURSOS_EXPORTAR',
            name: 'Exportar activos fijos',
            description: 'Descargar el inventario de recursos',
            modulo: 'Activo fijo'
        },
        {
            code: 'DEPARTAMENTOS_CREAR',
            name: 'Registrar departamentos',
            description: 'Crear departamentos nuevos',
            modulo: 'Departamentos y puestos'
        },
        {
            code: 'MODULOS_LEER',
            name: 'Consultar modulos',
            description: 'Ver el listado de modulos',
            modulo: 'Modulos y permisos'
        },
        {
            code: 'PERMISOS_LEER',
            name: 'Consultar permisos',
            description: 'Ver el listado de permisos',
            modulo: 'Modulos y permisos'
        },
        {
            code: 'PLANTILLAS_CREAR',
            name: 'Registrar plantillas',
            description: 'Crear plantillas nuevas',
            modulo: 'Plantillas de permisos'
        },
        {
            code: 'DEPARTAMENTOS_LEER',
            name: 'Consultar departamentos',
            description: 'Ver el listado de departamentos',
            modulo: 'Departamentos y puestos'
        },
        {
            code: 'USUARIOS_CREAR',
            name: 'Registrar usuarios',
            description: 'Crear usuarios nuevos',
            modulo: 'Usuarios'
        },
        {
            code: 'USUARIOS_EDITAR',
            name: 'Editar usuarios',
            description: 'Modificar datos de usuarios existentes',
            modulo: 'Usuarios'
        },
        {
            code: 'ASIGNACIONES_LEER',
            name: 'Consultar asignaciones',
            description: 'Ver el historial de asignaciones',
            modulo: 'Asignaciones'
        },
        {
            code: 'MODULOS_CREAR',
            name: 'Registrar modulos',
            description: 'Crear modulos nuevos',
            modulo: 'Modulos y permisos'
        },
        {
            code: 'LINEAS_ELIMINAR',
            name: 'Eliminar lineas moviles',
            description: 'Eliminar lineas',
            modulo: 'Lineas moviles'
        },
        {
            code: 'ASIGNACIONES_CREAR',
            name: 'Registrar asignacion',
            description: 'Asignar un recurso a un empleado',
            modulo: 'Asignaciones'
        },
        {
            code: 'MODULOS_EDITAR',
            name: 'Editar modulos',
            description: 'Modificar datos de modulos',
            modulo: 'Modulos y permisos'
        },
        {
            code: 'SISTEMAS_CREAR',
            name: 'Registrar sistemas',
            description: 'Crear sistemas nuevos',
            modulo: 'Sistemas'
        },
        {
            code: 'LINEAS_CREAR',
            name: 'Registrar lineas moviles',
            description: 'Crear lineas nuevas',
            modulo: 'Lineas moviles'
        },
        {
            code: 'EMPLEADOS_VER_TODOS',
            name: 'Consultar todos los empleados',
            description: 'Acceder a registros de cualquier departamento, no solo al propio',
            modulo: 'Empleados'
        },
        {
            code: 'PUESTOS_EDITAR',
            name: 'Editar puestos',
            description: 'Modificar puestos',
            modulo: 'Departamentos y puestos'
        },
        {
            code: 'USUARIOS_ASIGNAR_PERMISOS',
            name: 'Asignar permisos',
            description: 'Asignar o quitar permisos a un usuario',
            modulo: 'Usuarios'
        },
        {
            code: 'EMPLEADOS_ELIMINAR',
            name: 'Eliminar empleados',
            description: 'Eliminar empleados',
            modulo: 'Empleados'
        },
        {
            code: 'SOPORTE_VER_TODAS',
            name: 'Consultar todas las solicitudes',
            description: 'Acceder a solicitudes de cualquier usuario',
            modulo: 'Solicitudes de soporte'
        },
        {
            code: 'EMPLEADOS_LEER',
            name: 'Consultar empleados',
            description: 'Ver el listado y el detalle de empleados',
            modulo: 'Empleados'
        },
        {
            code: 'RECURSOS_EDITAR',
            name: 'Editar activos fijos',
            description: 'Modificar recursos existentes',
            modulo: 'Activo fijo'
        },
        {
            code: 'MARCAS_LEER',
            name: 'Consultar marcas',
            description: 'Ver el listado de marcas',
            modulo: 'Catalogos de activo fijo'
        },
        {
            code: 'LINEAS_EDITAR',
            name: 'Editar lineas moviles',
            description: 'Modificar lineas existentes',
            modulo: 'Lineas moviles'
        },
        {
            code: 'PUESTOS_ELIMINAR',
            name: 'Eliminar puestos',
            description: 'Eliminar puestos',
            modulo: 'Departamentos y puestos'
        },
        {
            code: 'SOPORTE_LEER',
            name: 'Consultar solicitudes propias',
            description: 'Ver las solicitudes propias',
            modulo: 'Solicitudes de soporte'
        },
        {
            code: 'USUARIOS_ELIMINAR',
            name: 'Desactivar usuarios',
            description: 'Dar de baja logica a usuarios',
            modulo: 'Usuarios'
        },
        {
            code: 'MODELOS_EDITAR',
            name: 'Editar modelos',
            description: 'Modificar modelos',
            modulo: 'Catalogos de activo fijo'
        },
        {
            code: 'MARCAS_ELIMINAR',
            name: 'Eliminar marcas',
            description: 'Eliminar marcas',
            modulo: 'Catalogos de activo fijo'
        },
        {
            code: 'MODELOS_CREAR',
            name: 'Registrar modelos',
            description: 'Crear modelos nuevos',
            modulo: 'Catalogos de activo fijo'
        },
        {
            code: 'MODELOS_LEER',
            name: 'Consultar modelos',
            description: 'Ver el listado de modelos',
            modulo: 'Catalogos de activo fijo'
        },
        {
            code: 'PLANTILLAS_LEER',
            name: 'Consultar plantillas',
            description: 'Ver el listado de plantillas',
            modulo: 'Plantillas de permisos'
        },
        {
            code: 'RECURSOS_LEER',
            name: 'Consultar activos fijos',
            description: 'Ver el listado y el detalle de los recursos',
            modulo: 'Activo fijo'
        },
        {
            code: 'SOPORTE_ELIMINAR',
            name: 'Eliminar solicitud',
            description: 'Eliminar solicitudes',
            modulo: 'Solicitudes de soporte'
        },
        {
            code: 'SOPORTE_RESPONDER',
            name: 'Responder solicitud',
            description: 'Agregar respuestas a una solicitud',
            modulo: 'Solicitudes de soporte'
        },
        {
            code: 'PLANTILLAS_ELIMINAR',
            name: 'Eliminar plantillas',
            description: 'Eliminar plantillas',
            modulo: 'Plantillas de permisos'
        },
        {
            code: 'RECURSOS_ELIMINAR',
            name: 'Eliminar activos fijos',
            description: 'Eliminar recursos',
            modulo: 'Activo fijo'
        },
        {
            code: 'SOPORTE_CREAR',
            name: 'Abrir solicitud',
            description: 'Registrar una solicitud de soporte',
            modulo: 'Solicitudes de soporte'
        },
        {
            code: 'ASIGNACIONES_EDITAR',
            name: 'Editar asignacion',
            description: 'Modificar una asignacion existente',
            modulo: 'Asignaciones'
        },
        {
            code: 'LINEAS_LEER',
            name: 'Consultar lineas moviles',
            description: 'Ver el listado de lineas',
            modulo: 'Lineas moviles'
        },
        {
            code: 'ASIGNACIONES_ELIMINAR',
            name: 'Eliminar asignacion',
            description: 'Dar de baja una asignacion',
            modulo: 'Asignaciones'
        },
        {
            code: 'SOPORTE_CAMBIAR_ESTADO',
            name: 'Cambiar estado de la solicitud',
            description: 'Actualizar el estatus de la solicitud',
            modulo: 'Solicitudes de soporte'
        },
        {
            code: 'EMPLEADOS_SISTEMAS_LEER',
            name: 'Consultar asignaciones',
            description: 'Ver los sistemas asignados a un empleado',
            modulo: 'Empleados y sistemas'
        },
        {
            code: 'CREDENCIALES_ELIMINAR',
            name: 'Eliminar credenciales',
            description: 'Eliminar credenciales',
            modulo: 'Gestion de credenciales'
        },
        {
            code: 'USUARIOS_LEER',
            name: 'Consultar usuarios',
            description: 'Ver el listado y el detalle de usuarios',
            modulo: 'Usuarios'
        },
        {
            code: 'CREDENCIALES_EDITAR',
            name: 'Editar credenciales',
            description: 'Modificar credenciales existentes',
            modulo: 'Gestion de credenciales'
        },
        {
            code: 'CREDENCIALES_CREAR',
            name: 'Registrar credenciales',
            description: 'Crear credenciales nuevas',
            modulo: 'Gestion de credenciales'
        },
        {
            code: 'PUESTOS_CREAR',
            name: 'Registrar puestos',
            description: 'Crear puestos nuevos',
            modulo: 'Departamentos y puestos'
        },
        {
            code: 'EMPLEADOS_CREAR',
            name: 'Registrar empleados',
            description: 'Crear empleados nuevos',
            modulo: 'Empleados'
        },
        {
            code: 'CREDENCIALES_CAMBIAR_CONTRASENA',
            name: 'Cambiar contrasena',
            description: 'Permitir al empleado cambiar su propia contrasena',
            modulo: 'Gestion de credenciales'
        },
        {
            code: 'MODULOS_ACTIVAR',
            name: 'Activar o desactivar modulos',
            description: 'Cambiar el estado de un modulo',
            modulo: 'Modulos y permisos'
        },
        {
            code: 'PLANTILLAS_ASIGNAR_PERMISOS',
            name: 'Administrar permisos de la plantilla',
            description: 'Agregar o quitar permisos a una plantilla',
            modulo: 'Plantillas de permisos'
        },
        {
            code: 'CREDENCIALES_VER_TODAS',
            name: 'Consultar todas las credenciales',
            description: 'Acceder a credenciales de cualquier empleado',
            modulo: 'Gestion de credenciales'
        },
        {
            code: 'EMPLEADOS_SISTEMAS_ELIMINAR',
            name: 'Quitar sistema al empleado',
            description: 'Eliminar una asignacion de sistema',
            modulo: 'Empleados y sistemas'
        },
        {
            code: 'MODELOS_ELIMINAR',
            name: 'Eliminar modelos',
            description: 'Eliminar modelos',
            modulo: 'Catalogos de activo fijo'
        },
        {
            code: 'DEPARTAMENTOS_ELIMINAR',
            name: 'Eliminar departamentos',
            description: 'Eliminar departamentos',
            modulo: 'Departamentos y puestos'
        },
        {
            code: 'PERMISOS_EDITAR',
            name: 'Editar permisos',
            description: 'Modificar datos de permisos',
            modulo: 'Modulos y permisos'
        },
        {
            code: 'CREDENCIALES_RESTABLECER_CONTRASENA',
            name: 'Restablecer contrasena',
            description: 'Generar una nueva contrasena para un empleado',
            modulo: 'Gestion de credenciales'
        },
        {
            code: 'EMPLEADOS_EDITAR',
            name: 'Editar empleados',
            description: 'Modificar datos de empleados',
            modulo: 'Empleados'
        },
        {
            code: 'PUESTOS_LEER',
            name: 'Consultar puestos',
            description: 'Ver el listado de puestos',
            modulo: 'Departamentos y puestos'
        },
        {
            code: 'EMPLEADOS_SISTEMAS_CREAR',
            name: 'Asignar sistema a empleado',
            description: 'Registrar una asignacion de sistema',
            modulo: 'Empleados y sistemas'
        },
        {
            code: 'ASIGNACIONES_AGREGAR_OBSERVACION',
            name: 'Agregar observacion',
            description: 'Registrar observaciones sobre una asignacion',
            modulo: 'Asignaciones'
        },
        {
            code: 'PLANTILLAS_EDITAR',
            name: 'Editar plantillas',
            description: 'Modificar plantillas existentes',
            modulo: 'Plantillas de permisos'
        },
        {
            code: 'PERMISOS_CREAR',
            name: 'Registrar permisos',
            description: 'Crear permisos nuevos',
            modulo: 'Modulos y permisos'
        },
        {
            code: 'CREDENCIALES_LEER',
            name: 'Consultar credenciales propias',
            description: 'Ver las credenciales propias',
            modulo: 'Gestion de credenciales'
        },
        {
            code: 'SISTEMAS_EDITAR',
            name: 'Editar sistemas',
            description: 'Modificar sistemas',
            modulo: 'Sistemas'
        },
        {
            code: 'MARCAS_CREAR',
            name: 'Registrar marcas',
            description: 'Crear marcas nuevas',
            modulo: 'Catalogos de activo fijo'
        },
        {
            code: 'AUDITORIA_CREDENCIALES_LEER',
            name: 'Consultar la bitacora',
            description: 'Ver los eventos de auditoria',
            modulo: 'Auditoria de credenciales'
        },
        {
            code: 'AUDITORIA_CREDENCIALES_EXPORTAR',
            name: 'Exportar la bitacora',
            description: 'Descargar la bitacora de eventos',
            modulo: 'Auditoria de credenciales'
        },
        {
            code: 'LINEAS_ASIGNAR',
            name: 'Asignar o liberar linea',
            description: 'Asociar una linea a un recurso',
            modulo: 'Lineas moviles'
        }]);
    constructor() { }
}