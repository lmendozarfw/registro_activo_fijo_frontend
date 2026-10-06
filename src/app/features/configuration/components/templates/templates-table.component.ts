import { Component, signal, WritableSignal } from "@angular/core";
import { TableModule } from 'primeng/table';

@Component({
    selector: "app-templates-table",
    templateUrl: "./templates-table.component.html",
    styles: [],
    imports: [TableModule]
})
export class TemplatesTableComponent {
    templates: WritableSignal<any[]> = signal([
        {
            id: '01A10CDA-B71A-7198-83FC-0B4BC5693A78',
            name: 'Permisos de sistemas',
            description: 'Conjunto de permisos relacionados a los usuarios del área de sistemas',
            permisos: 20
        },
        {
            id: '01A10CDA-B71A-78DD-A523-1844588B3ABA',
            name: 'Permisos de credenciales',
            description: 'Conjunto de permisos relacionados a la gestión de credenciales de los empleados',
            permisos: 15
        },
        {
            id: '01A10CDA-B71A-7198-83FC-0B4BC5693A78',
            name: 'Permisos de RRHH',
            description: 'Conjunto de permisos relacionados a los usuarios del área de recursos humanos',
            permisos: 10
        },
    ]);
    constructor() { }
}