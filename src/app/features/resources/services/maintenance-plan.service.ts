import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  CreateMaintenancePlanCommand,
  FrequencyUnitEnum,
  MaintenancePlan,
  MaintenanceTypeEnum
} from '../models/maintenance-plan.model';

const MOCK_PLANS: MaintenancePlan[] = [
  {
    id: 'plan-1',
    resourceId: 'resource-1',
    name: 'Mantenimiento preventivo de software',
    description: 'Actualización de sistema operativo y antivirus.',
    maintenanceType: MaintenanceTypeEnum.PREVENTIVE,
    frequencyValue: 3,
    frequencyUnit: FrequencyUnitEnum.MONTH,
    startDate: '2026-01-15T00:00:00.000Z',
    nextMaintenanceDate: '2026-04-15T00:00:00.000Z',
    active: true,
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'plan-2',
    resourceId: 'resource-1',
    name: 'Limpieza física preventiva',
    description: 'Limpieza interna y revisión de componentes.',
    maintenanceType: MaintenanceTypeEnum.PREVENTIVE,
    frequencyValue: 6,
    frequencyUnit: FrequencyUnitEnum.MONTH,
    startDate: '2025-08-01T00:00:00.000Z',
    nextMaintenanceDate: '2026-02-01T00:00:00.000Z',
    active: true,
    createdAt: '2025-08-01T09:00:00.000Z'
  },
  {
    id: 'plan-3',
    resourceId: 'resource-1',
    name: 'Reemplazo de batería',
    description: 'Cambio de batería por desgaste.',
    maintenanceType: MaintenanceTypeEnum.CORRECTIVE,
    frequencyValue: 2,
    frequencyUnit: FrequencyUnitEnum.YEAR,
    startDate: '2024-05-10T00:00:00.000Z',
    nextMaintenanceDate: null,
    active: false,
    createdAt: '2024-05-10T11:00:00.000Z'
  }
];

@Injectable({ providedIn: 'root' })
export class MaintenancePlanService {
  private plans = [...MOCK_PLANS];

  getAll(): Observable<MaintenancePlan[]> {
    return of(this.plans).pipe(delay(300));
  }

  getActive(): Observable<MaintenancePlan[]> {
    return of(this.plans.filter(p => p.active)).pipe(delay(300));
  }

  getById(id: string): Observable<MaintenancePlan> {
    return of(this.plans.find(p => p.id === id) as MaintenancePlan).pipe(delay(200));
  }

  getByResource(resourceId: string): Observable<MaintenancePlan[]> {
    return of(this.plans.map(p => ({ ...p, resourceId }))).pipe(delay(300));
  }

  getActiveByResource(resourceId: string): Observable<MaintenancePlan[]> {
    return of(this.plans.filter(p => p.active).map(p => ({ ...p, resourceId }))).pipe(delay(300));
  }

  create(data: CreateMaintenancePlanCommand): Observable<MaintenancePlan> {
    const created: MaintenancePlan = {
      id: `plan-${Date.now()}`,
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      ...data
    };
    this.plans = [...this.plans, created];
    return of(created).pipe(delay(300));
  }

  update(id: string, data: Partial<CreateMaintenancePlanCommand>): Observable<MaintenancePlan> {
    let updated = this.plans.find(p => p.id === id) as MaintenancePlan;
    updated = { ...updated, ...data, id } as MaintenancePlan;
    this.plans = this.plans.map(p => (p.id === id ? updated : p));
    return of(updated).pipe(delay(300));
  }

  softRemove(id: string): Observable<boolean> {
    this.plans = this.plans.map(p => (p.id === id ? { ...p, active: false } : p));
    return of(true).pipe(delay(300));
  }
}
