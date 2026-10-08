import { Component, OnInit, inject } from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { PageHeaderService } from "../../../core/services/page-header.service";
import { ModulesTableComponent } from "../components/modules/modules-table.component";
import { PermissionsTableComponent } from "../components/permissions/permissions-table.component";
import { TemplatesTableComponent } from "../components/templates/templates-table.component";
import { SystemsTableComponent } from "../components/systems/systems-table.component";
import { DepartmentsTableComponent } from "../components/departments/departments-table.component";
import { JobsTableComponent } from "../components/jobs/jobs-table.component";

@Component({
    selector: 'app-configuration',
    template: `
    <div class="space-y-4">
            <p-tabs [(value)]="value">
                <p-tablist>
                    @for (tab of tabs; track tab.id) {
                        <p-tab [value]="tab.id">{{ tab.title }}</p-tab>
                    }
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel [value]="value">
                        @switch (value) {
                            @case ('modules') {
                                <app-modules-table />
                            }
                            @case ('permissions') {
                                <app-permissions-table />
                            }
                            @case ('templates') {
                                <app-templates-table />
                            }
                            @case ('systems') {
                                <app-systems-table />
                            }
                            @case ('departments') {
                                <app-departments-table />
                            }
                            @case ('jobs') {
                                <app-jobs-table />
                            }
                        }
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
    styles: [`
        .p-tabs {
            border-radius: 12px;
        }
        .p-tablist {
            border-radius: 12px 12px 0 0;
        }
        .p-tabpanels {
            border-radius: 0 0 12px 12px;
        }
        `],
    imports: [TabsModule, ModulesTableComponent, PermissionsTableComponent, TemplatesTableComponent, SystemsTableComponent,
        DepartmentsTableComponent, JobsTableComponent],
})
export class ConfigurationPage implements OnInit {
    private readonly pageHeader = inject(PageHeaderService);

    value: string = 'modules';
    tabs = [
        { id: 'modules', title: 'Módulos' },
        { id: 'permissions', title: 'Permisos' },
        { id: 'templates', title: 'Plantillas' },
        { id: 'systems', title: 'Sistemas' },
        { id: 'departments', title: 'Departamentos' },
        { id: 'jobs', title: 'Puestos de trabajo' },
    ];

    ngOnInit(): void {
        this.pageHeader.setTitle('Configuración');
    }
}