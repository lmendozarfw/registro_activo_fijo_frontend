import { Component, OnInit, inject } from "@angular/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDialogComponent } from "../../../../shared/components/form-dialog/form-dialog.component";
import { FormLabelComponent } from "../../../../shared/components/form-label/form-label.component";
import { JobStore } from "../../stores/job.store";
import { Job } from "../../models/job.model";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";
import { Pencil, Plus, Trash } from '@primeicons/angular';

@Component({
    selector: "app-jobs-table",
    templateUrl: "./jobs-table.component.html",
    styles: [],
    imports: [TableModule, ButtonModule, InputText, TooltipModule, ReactiveFormsModule,
        FormDialogComponent, FormLabelComponent, EmptyStateComponent, Pencil, Plus, Trash]
})
export class JobsTableComponent implements OnInit {
    protected readonly store = inject(JobStore);

    dialogVisible = false;
    dialogTitle = 'Nuevo puesto de trabajo';
    deleteDialogVisible = false;
    editingJob: Job | null = null;
    jobToDelete: Job | null = null;

    form = new FormGroup({
        name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });

    ngOnInit(): void {
        this.store.load();
    }

    openCreate(): void {
        this.editingJob = null;
        this.dialogTitle = 'Nuevo puesto de trabajo';
        this.form.reset({ name: '' });
        this.dialogVisible = true;
    }

    openEdit(job: Job): void {
        this.editingJob = job;
        this.dialogTitle = 'Editar puesto de trabajo';
        this.form.reset({ name: job.name });
        this.dialogVisible = true;
    }

    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload = { name: this.form.controls.name.value.trim() };

        const success = this.editingJob
            ? await this.store.update(this.editingJob.id, payload)
            : await this.store.create(payload);

        if (success) {
            this.dialogVisible = false;
        }
    }

    openDelete(job: Job): void {
        this.jobToDelete = job;
        this.deleteDialogVisible = true;
    }

    async confirmDelete(): Promise<void> {
        if (!this.jobToDelete) return;

        const success = await this.store.remove(this.jobToDelete.id);

        if (success) {
            this.jobToDelete = null;
            this.deleteDialogVisible = false;
        }
    }

    protected formatDate(value?: string | null): string {
        if (!value) return '—';

        const date = new Date(value);

        return isNaN(date.getTime()) ? '—' : date.toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    }
}
