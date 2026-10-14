import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";
import { ToastService } from "../../../core/services/toast.service";
import { resolveErrorMessage } from "../../../core/utils/error.utils";
import { AssignmentDto } from "../../assignments/models/assignment.model";
import { AssignmentService } from "../../assignments/services/assignment.service";
import { Credential } from "../../credentials/models/credential.model";
import { CredentialService } from "../../credentials/services/credential.service";
import { Employee } from "../../employees/models/employee.model";
import { EmployeeService } from "../../employees/services/employee.service";
import { LineDto } from "../../resources/models/line.model";
import { LineService } from "../../resources/models/line.service";
import { ResourceDto } from "../../resources/models/resource.model";
import { ResourceService } from "../../resources/services/resource.service";
import { USE_KPI_MOCKS, loadKpiMockData } from "../mocks/kpi-mock.data";

type KpiState = {
    resources: ResourceDto[];
    assignments: AssignmentDto[];
    employees: Employee[];
    credentials: Credential[];
    lines: LineDto[];
    loading: boolean;
    error: string | null;
};

export const KpiStore = signalStore(
    { providedIn: 'root' },
    withState<KpiState>({
        resources: [],
        assignments: [],
        employees: [],
        credentials: [],
        lines: [],
        loading: false,
        error: null,
    }),
    withMethods(
        (
            store,
            resourceService = inject(ResourceService),
            assignmentService = inject(AssignmentService),
            employeeService = inject(EmployeeService),
            credentialService = inject(CredentialService),
            lineService = inject(LineService),
            toast = inject(ToastService),
        ) => ({
            async load(): Promise<void> {
                patchState(store, { loading: true, error: null });
                try {
                    if (USE_KPI_MOCKS) {
                        const { resources, assignments, employees, credentials, lines } = await loadKpiMockData();
                        patchState(store, { resources, assignments, employees, credentials, lines, loading: false });
                        return;
                    }

                    const [resources, assignments, employees, credentials, lines] = await Promise.all([
                        firstValueFrom(resourceService.getAll()),
                        firstValueFrom(assignmentService.getAll()),
                        firstValueFrom(employeeService.getAll()),
                        firstValueFrom(credentialService.getAll()),
                        firstValueFrom(lineService.getAll()),
                    ]);
                    patchState(store, { resources, assignments, employees, credentials, lines, loading: false });
                } catch (error) {
                    const message = resolveErrorMessage(error, 'No se pudieron cargar los indicadores');
                    patchState(store, { loading: false, error: message });
                    toast.error(message);
                }
            },
        }),
    ),
);
