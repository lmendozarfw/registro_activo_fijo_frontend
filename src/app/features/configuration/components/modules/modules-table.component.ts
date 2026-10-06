import { Component, signal, WritableSignal } from "@angular/core";
import { TableModule } from 'primeng/table';

@Component({
    selector: "app-modules-table",
    templateUrl: "./modules-table.component.html",
    styles: [],
    imports: [TableModule]
})
export class ModulesTableComponent {
    modules: WritableSignal<any[]> = signal([
        {
            id: '01A10CDA-B71A-7198-83FC-0B4BC5693A78',
            code: 'GESTION_CREDENCIALES',
            name: 'Gestion de credenciales',
            description: 'Ciclo de vida de las credenciales de los empleados'
        },
        {
            id: '01A10CDA-B71A-78DD-A523-1844588B3ABA',
            code: 'LINEAS_MOVILES',
            name: 'Lineas moviles',
            description: 'Lineas telefonicas de la institucion'
        },
        {
            id: '01A10CDA-B71A-7084-839D-2AA3130AF927',
            code: 'PLANTILLAS',
            name: 'Plantillas de permisos',
            description: 'Plantillas reutilizables con conjuntos de permisos predefinidos'
        },
        {
            id: '01A10CDA-B71A-78FA-A174-41DBFBA871D0',
            code: 'AUDITORIA_CREDENCIALES',
            name: 'Auditoria de credenciales',
            description: 'Bitacora de eventos registrados sobre las credenciales'
        },
        {
            id: '01A10CDA-B71A-7ED0-B5B2-558AF3601996',
            code: 'SOPORTE_CREDENCIALES',
            name: 'Solicitudes de soporte',
            description: 'Solicitudes de ayuda enviadas por los usuarios sobre sus credenciales'
        },
        {
            id: '01A10CDA-B71A-7809-AC2E-6D93F568E971',
            code: 'ACTIVO_FIJO',
            name: 'Activo fijo',
            description: 'Inventario de recursos activos de la institucion'
        },
        {
            id: '01A10CDA-B71A-7131-9AD4-7A18A67A315F',
            code: 'EMPLEADOS',
            name: 'Empleados',
            description: 'Catalogo de colaboradores de la institucion'
        },
        {
            id: '01A10CDA-B71A-72B3-BF43-93A1BBBBD636',
            code: 'EMPLEADOS_SISTEMAS',
            name: 'Empleados y sistemas',
            description: 'Asignacion de empleados a los sistemas de informacion'
        },
        {
            id: '01A10CDA-B71A-7D3D-B55E-98397677C328',
            code: 'SISTEMAS',
            name: 'Sistemas',
            description: 'Sistemas de informacion a los que se asignan credenciales'
        },
        {
            id: '01A10CDA-B71A-7224-93D6-A43F9D49DB3A',
            code: 'ASIGNACIONES',
            name: 'Asignaciones',
            description: 'Entrega de recursos y lineas a los empleados'
        },
        {
            id: '01A10CDA-B71A-7C99-AA07-B3DB922317C6',
            code: 'MODULOS_PERMISOS',
            name: 'Modulos y permisos',
            description: 'Catalogo de modulos y permisos disponibles en la aplicacion'
        },
        {
            id: '01A10CDA-B71A-7A3E-BD00-C697BF4A05C1',
            code: 'USUARIOS',
            name: 'Usuarios',
            description: 'Administracion de usuarios que acceden al sistema'
        },
        {
            id: '01A10CDA-B71A-7059-B882-CCE565E8773B',
            code: 'ORGANIZACION',
            name: 'Departamentos y puestos',
            description: 'Estructura organizacional: departamentos y puestos'
        },
        {
            id: '01A10CDA-B71A-754E-8DB7-CDEFCE5FCB20',
            code: 'CATALOGOS_ACTIVO_FIJO',
            name: 'Catalogos de activo fijo',
            description: 'Marcas y modelos disponibles para el inventario'
        }
    ]);
    constructor() { }
}