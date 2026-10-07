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
            <p-tabs [(value)]="value" [lazy]="true">
                <p-tablist>
                    @for (tab of tabs; track tab.id) {
                        <p-tab [value]="tab.id">{{ tab.title }}</p-tab>
                    }
                </p-tablist>
                <p-tabpanels>
                    @for (tab of tabs; track tab.id) {
                        <p-tabpanel [value]="tab.id">
                            @switch (tab.id) {
                                @case ('modules') {
                                    <app-modules-table />
                                }
                                @case ('templates') {
                                    <app-templates-table />
                                }
                                @case ('permissions') {
                                    <app-permissions-table />
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
                                @default {
                                    <h2 class="text-lg font-bold">{{ tab.title }}</h2>
                                    <p class="text-surface-500 mt-1">{{ tab.content }}</p>
                                }
                            }
                        </p-tabpanel>
                    }
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
        { id: 'modules', title: 'Módulos', content: '' },
        { id: 'permissions', title: 'Permisos', content: '' },
        { id: 'templates', title: 'Plantillas', content: '' },
        { id: 'systems', title: 'Sistemas', content: '' },
        { id: 'departments', title: 'Departamentos', content: '' },
        { id: 'jobs', title: 'Puestos de trabajo', content: '' },
    ];

    ngOnInit(): void {
        this.pageHeader.setTitle('Configuración');
    }
}