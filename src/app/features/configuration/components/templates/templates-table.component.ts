import { Component, inject, signal, WritableSignal } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../../shared/components/form-label/form-label.component";

export interface PermissionOption {
    id: string;
    code: string;
    name: string;
}

@Component({
    selector: "app-templates-table",
    templateUrl: "./templates-table.component.html",
    styles: [],
    imports: [TableModule, ButtonModule, InputText, SelectModule, TextareaModule, ReactiveFormsModule, FormDialogComponent, FormLabelComponent]
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

    permissionOptions = signal<PermissionOption[]>([
        { id: '1', code: 'PLANTILLAS_CREAR', name: 'Registrar plantillas nuevas' },
        { id: '2', code: 'PERMISOS_LEER', name: 'Consultar permisos' },
        { id: '3', code: 'USUARIOS_ASIGNAR_PERMISOS', name: 'Asignar permisos a usuarios' },
        { id: '4', code: 'MODULOS_EDITAR', name: 'Editar modulos' },
        { id: '5', code: 'PLANTILLAS_EDITAR', name: 'Editar plantillas existentes' },
    ]);

    dialogVisible = false;

    form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
        description: new FormControl('', { nonNullable: true }),
        permission: new FormControl<PermissionOption | null>(null, Validators.required),
    });

    openDialog(): void {
        this.form.reset({ name: '', description: '', permission: null });
        this.dialogVisible = true;
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const { name, description, permission } = this.form.getRawValue();
        this.templates.update((items) => [
            ...items,
            { id: crypto.randomUUID(), name, description, permisos: 1 },
        ]);
        this.dialogVisible = false;
    }
}
