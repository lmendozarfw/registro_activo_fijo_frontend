import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  CreateMaintenanceOrderCommand,
  MaintenanceOrder,
  MaintenanceOrderStatusEnum,
  MaintenanceTypeEnum
} from '../models/maintenance-plan.model';

const MOCK_ORDERS: MaintenanceOrder[] = [
  {
    id: 'order-1',
    resourceId: 'resource-1',
    maintenancePlanId: 'plan-1',
    maintenanceType: MaintenanceTypeEnum.PREVENTIVE,
    reason: 'Actualización de sistema operativo y antivirus.',
    startDate: '2026-01-15T09:00:00.000Z',
    endDate: '2026-01-15T11:30:00.000Z',
    responsibleEmployeeId: 'emp-1',
    responsibleEmployeeFullName: 'Juan Pérez López',
    status: MaintenanceOrderStatusEnum.COMPLETED,
    observations: 'Sin incidencias.',
    maintenanceCost: 0,
    createdAt: '2026-01-15T09:00:00.000Z'
  },
  {
    id: 'order-2',
    resourceId: 'resource-1',
    maintenancePlanId: 'plan-2',
    maintenanceType: MaintenanceTypeEnum.PREVENTIVE,
    reason: 'Limpieza interna y revisión de componentes.',
    startDate: '2026-02-01T10:00:00.000Z',
    endDate: null,
    responsibleEmployeeId: 'emp-2',
    responsibleEmployeeFullName: 'María Gómez Ruiz',
    status: MaintenanceOrderStatusEnum.IN_PROGRESS,
    observations: 'Pendiente reemplazo de pasta térmica.',
    maintenanceCost: 450,
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'order-3',
    resourceId: 'resource-1',
    maintenancePlanId: null,
    maintenanceType: MaintenanceTypeEnum.CORRECTIVE,
    reason: 'Equipo no enciende, revisión de fuente de poder.',
    startDate: null,
    endDate: null,
    responsibleEmployeeId: null,
    responsibleEmployeeFullName: null,
    status: MaintenanceOrderStatusEnum.PENDING,
    observations: null,
    maintenanceCost: 0,
    createdAt: '2026-02-10T08:00:00.000Z'
  }
];

@Injectable({ providedIn: 'root' })
export class MaintenanceOrderService {
  private orders = [...MOCK_ORDERS];

  getAll(): Observable<MaintenanceOrder[]> {
    return of(this.orders).pipe(delay(300));
  }

  getById(id: string): Observable<MaintenanceOrder> {
    return of(this.orders.find(o => o.id === id) as MaintenanceOrder).pipe(delay(200));
  }

  getByResource(resourceId: string): Observable<MaintenanceOrder[]> {
    return of(this.orders.map(o => ({ ...o, resourceId }))).pipe(delay(300));
  }

  getByPlan(planId: string): Observable<MaintenanceOrder[]> {
    return of(this.orders.filter(o => o.maintenancePlanId === planId)).pipe(delay(300));
  }

  create(data: CreateMaintenanceOrderCommand): Observable<MaintenanceOrder> {
    const created: MaintenanceOrder = {
      id: `order-${Date.now()}`,
      status: data.status ?? MaintenanceOrderStatusEnum.PENDING,
      createdAt: new Date().toISOString(),
      ...data
    } as MaintenanceOrder;
    this.orders = [created, ...this.orders];
    return of(created).pipe(delay(300));
  }

  update(id: string, data: Partial<CreateMaintenanceOrderCommand>): Observable<MaintenanceOrder> {
    let updated = this.orders.find(o => o.id === id) as MaintenanceOrder;
    updated = { ...updated, ...data, id } as MaintenanceOrder;
    this.orders = this.orders.map(o => (o.id === id ? updated : o));
    return of(updated).pipe(delay(300));
  }
}
