import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorDetails } from '../../../core/utils/error.utils';
import { resolveFileNameFromContentDisposition, saveBlob } from '../../../core/utils/file.utils';
import {
  CreateVisitRequest,
  UpdateVisitRequest,
  VisitDetailDto,
  VisitListItem,
  VisitStatusFilter,
  VisitorAccessStatus,
  VisitorDocumentDto,
  VisitorDocumentType,
  VisitorEquipmentDto,
  VisitorEquipmentRequest,
} from '../models/visit.model';
import { VisitService } from '../services/visit.service';

const DEFAULT_PAGE_SIZE = 10;

type VisitState = {
  items: VisitListItem[];
  detail: VisitDetailDto | null;
  status: VisitStatusFilter;
  search: string;
  businessUnitId: string | null;
  departmentId: string | null;
  from: string | null;
  to: string | null;
  skip: number;
  take: number;
  hasMore: boolean;
  loading: boolean;
  detailLoading: boolean;
  saving: boolean;
  actionLoading: boolean;
  visitorSaving: boolean;
  accessLoadingVisitorId: string | null;
  equipmentSaving: boolean;
  documentUploading: boolean;
  documentDeletingId: string | null;
  downloadingDocumentId: string | null;
  listError: string | null;
  detailError: string | null;
  detailNotFound: boolean;
};

const initialState: VisitState = {
  items: [],
  detail: null,
  status: 'All',
  search: '',
  businessUnitId: null,
  departmentId: null,
  from: null,
  to: null,
  skip: 0,
  take: DEFAULT_PAGE_SIZE,
  hasMore: false,
  loading: false,
  detailLoading: false,
  saving: false,
  actionLoading: false,
  visitorSaving: false,
  accessLoadingVisitorId: null,
  equipmentSaving: false,
  documentUploading: false,
  documentDeletingId: null,
  downloadingDocumentId: null,
  listError: null,
  detailError: null,
  detailNotFound: false,
};

export const VisitStore = signalStore(
  { providedIn: 'root' },
  withState<VisitState>(initialState),
  withComputed((store) => ({
    totalRecords: computed(
      () => store.skip() + store.items().length + (store.hasMore() ? store.take() : 0),
    ),
  })),
  withMethods((store, service = inject(VisitService), toast = inject(ToastService)) => {
    let listRequestId = 0;
    let detailRequestId = 0;

    const notifyError = (error: unknown, fallback: string): void => {
      const details = resolveErrorDetails(error, fallback);
      toast.error(details.message, details.errors.join(' · ') || undefined);
    };

    return {
      clearDetail(): void {
        patchState(store, {
          detail: null,
          detailError: null,
          detailNotFound: false,
          detailLoading: false,
        });
      },

      async load(resetPage = false): Promise<void> {
        const requestId = ++listRequestId;
        const skip = resetPage ? 0 : store.skip();
        const take = store.take();
        const statusFilter = store.status();

        if (resetPage) patchState(store, { skip: 0 });
        patchState(store, { loading: true, listError: null });

        try {
          const items = await firstValueFrom(
            service.getList({
              status: statusFilter === 'All' ? undefined : statusFilter,
              search: store.search().trim() || undefined,
              businessUnitId: store.businessUnitId() || undefined,
              departmentId: store.departmentId() || undefined,
              from: store.from() || undefined,
              to: store.to() || undefined,
              skip,
              take,
            }),
          );

          if (requestId !== listRequestId) return;

          patchState(store, {
            items,
            loading: false,
            hasMore: items.length === take,
          });
        } catch (error: unknown) {
          if (requestId !== listRequestId) return;

          const details = resolveErrorDetails(error, 'No se pudieron cargar las visitas');
          patchState(store, {
            loading: false,
            listError: details.message,
          });
          notifyError(error, 'No se pudieron cargar las visitas');
        }
      },

      async setFilters(
        filters: Partial<
          Pick<VisitState, 'status' | 'search' | 'businessUnitId' | 'departmentId' | 'from' | 'to'>
        >,
      ): Promise<void> {
        patchState(store, { ...filters, skip: 0 });
        await this.load();
      },

      async resetFilters(): Promise<void> {
        patchState(store, {
          status: 'All',
          search: '',
          businessUnitId: null,
          departmentId: null,
          from: null,
          to: null,
          skip: 0,
        });
        await this.load();
      },

      async setPage(first: number, rows: number): Promise<void> {
        patchState(store, { skip: first, take: rows });
        await this.load();
      },

      async loadDetail(id: string, force = false): Promise<void> {
        if (!force && store.detail()?.id === id) return;

        const requestId = ++detailRequestId;
        patchState(store, {
          detail: store.detail()?.id === id ? store.detail() : null,
          detailLoading: true,
          detailError: null,
          detailNotFound: false,
        });

        try {
          const detail = await firstValueFrom(service.getDetail(id));
          if (requestId !== detailRequestId) return;

          patchState(store, {
            detail,
            detailLoading: false,
          });
        } catch (error: unknown) {
          if (requestId !== detailRequestId) return;

          if (error instanceof HttpErrorResponse && error.status === 404) {
            patchState(store, {
              detail: null,
              detailLoading: false,
              detailNotFound: true,
            });
            return;
          }

          const details = resolveErrorDetails(error, 'No se pudo cargar la visita');
          patchState(store, {
            detailLoading: false,
            detailError: details.message,
          });
          notifyError(error, 'No se pudo cargar la visita');
        }
      },

      async refreshDetail(): Promise<void> {
        const id = store.detail()?.id;
        if (!id) return;
        await this.loadDetail(id, true);
      },

      async create(data: CreateVisitRequest): Promise<string | null> {
        patchState(store, { saving: true });

        try {
          const id = await firstValueFrom(service.create(data));
          patchState(store, { saving: false });

          if (!id) {
            toast.warning(
              'Visita registrada',
              'La visita se guardó, pero no fue posible obtener su identificador.',
            );
            return null;
          }

          toast.success('Visita registrada');
          return id;
        } catch (error: unknown) {
          patchState(store, { saving: false });
          notifyError(error, 'No se pudo registrar la visita');
          return null;
        }
      },

      async update(id: string, data: UpdateVisitRequest): Promise<boolean> {
        patchState(store, { saving: true });

        try {
          await firstValueFrom(service.update(id, data));
          patchState(store, { saving: false });
          toast.success('Visita actualizada');
          await this.loadDetail(id, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { saving: false });
          notifyError(error, 'No se pudo actualizar la visita');
          return false;
        }
      },

      async start(id: string): Promise<boolean> {
        return this.runStatusAction(
          id,
          () => service.start(id),
          'Visita iniciada',
          'No se pudo iniciar la visita',
        );
      },

      async finish(id: string): Promise<boolean> {
        return this.runStatusAction(
          id,
          () => service.finish(id),
          'Visita finalizada',
          'No se pudo finalizar la visita',
        );
      },

      async cancel(id: string): Promise<boolean> {
        return this.runStatusAction(
          id,
          () => service.cancel(id),
          'Visita cancelada',
          'No se pudo cancelar la visita',
        );
      },

      async addVisitor(visitId: string, fullName: string): Promise<boolean> {
        patchState(store, { visitorSaving: true });

        try {
          const visitorId = await firstValueFrom(service.addVisitor(visitId, fullName.trim()));
          patchState(store, { visitorSaving: false });

          if (!visitorId) {
            toast.warning(
              'Visitante agregado',
              'El visitante se guardó, pero no fue posible obtener su identificador.',
            );
          } else {
            toast.success('Visitante agregado');
          }

          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { visitorSaving: false });
          notifyError(error, 'No se pudo agregar el visitante');
          return false;
        }
      },

      async updateVisitor(visitId: string, visitorId: string, fullName: string): Promise<boolean> {
        patchState(store, { visitorSaving: true });

        try {
          await firstValueFrom(service.updateVisitor(visitId, visitorId, fullName.trim()));
          patchState(store, { visitorSaving: false });
          toast.success('Visitante actualizado');
          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { visitorSaving: false });
          notifyError(error, 'No se pudo actualizar el visitante');
          return false;
        }
      },

      async removeVisitor(visitId: string, visitorId: string): Promise<boolean> {
        patchState(store, { visitorSaving: true });

        try {
          await firstValueFrom(service.removeVisitor(visitId, visitorId));
          patchState(store, { visitorSaving: false });
          toast.success('Visitante eliminado');
          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { visitorSaving: false });
          notifyError(error, 'No se pudo eliminar el visitante');
          return false;
        }
      },

      async setVisitorAccess(
        visitId: string,
        visitorId: string,
        accessStatus: Exclude<VisitorAccessStatus, 'PENDING'>,
      ): Promise<boolean> {
        patchState(store, { accessLoadingVisitorId: visitorId });

        try {
          await firstValueFrom(service.setVisitorAccess(visitId, visitorId, accessStatus));
          patchState(store, { accessLoadingVisitorId: null });
          toast.success(accessStatus === 'PERMIT' ? 'Acceso permitido' : 'Acceso denegado');
          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { accessLoadingVisitorId: null });
          notifyError(error, 'No se pudo actualizar el acceso del visitante');
          return false;
        }
      },

      async addEquipment(
        visitId: string,
        visitorId: string,
        data: VisitorEquipmentRequest,
      ): Promise<boolean> {
        patchState(store, { equipmentSaving: true });

        try {
          const equipmentId = await firstValueFrom(service.addEquipment(visitId, visitorId, data));
          patchState(store, { equipmentSaving: false });

          if (!equipmentId) {
            toast.warning(
              'Equipo agregado',
              'El equipo se guardó, pero no fue posible obtener su identificador.',
            );
          } else {
            toast.success('Equipo agregado');
          }

          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { equipmentSaving: false });
          notifyError(error, 'No se pudo agregar el equipo');
          return false;
        }
      },

      async updateEquipment(
        visitId: string,
        visitorId: string,
        equipmentId: string,
        data: VisitorEquipmentRequest,
      ): Promise<boolean> {
        patchState(store, { equipmentSaving: true });

        try {
          await firstValueFrom(service.updateEquipment(visitId, visitorId, equipmentId, data));
          patchState(store, { equipmentSaving: false });
          toast.success('Equipo actualizado');
          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { equipmentSaving: false });
          notifyError(error, 'No se pudo actualizar el equipo');
          return false;
        }
      },

      async removeEquipment(
        visitId: string,
        visitorId: string,
        equipmentId: string,
      ): Promise<boolean> {
        patchState(store, { equipmentSaving: true });

        try {
          await firstValueFrom(service.removeEquipment(visitId, visitorId, equipmentId));
          patchState(store, { equipmentSaving: false });
          toast.success('Equipo eliminado');
          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { equipmentSaving: false });
          notifyError(error, 'No se pudo eliminar el equipo');
          return false;
        }
      },

      async uploadDocument(
        visitId: string,
        visitorId: string,
        documentType: VisitorDocumentType,
        file: File,
      ): Promise<boolean> {
        patchState(store, { documentUploading: true });

        try {
          const documentId = await firstValueFrom(
            service.uploadDocument(visitId, visitorId, documentType, file),
          );
          patchState(store, { documentUploading: false });

          if (!documentId) {
            toast.warning(
              'Documento cargado',
              'El documento se guardó, pero no fue posible obtener su identificador.',
            );
          } else {
            toast.success('Documento cargado');
          }

          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { documentUploading: false });
          notifyError(error, 'No se pudo cargar el documento');
          return false;
        }
      },

      async downloadDocument(
        visitId: string,
        visitorId: string,
        document: VisitorDocumentDto,
      ): Promise<void> {
        patchState(store, { downloadingDocumentId: document.id });

        try {
          const response = await firstValueFrom(
            service.downloadDocument(visitId, visitorId, document.id),
          );
          const filename =
            resolveFileNameFromContentDisposition(response.headers.get('content-disposition')) ??
            document.originalName;

          if (!response.body) {
            toast.error('No se pudo descargar el documento');
            return;
          }

          saveBlob(response.body, filename);
        } catch (error: unknown) {
          notifyError(error, 'No se pudo descargar el documento');
        } finally {
          patchState(store, { downloadingDocumentId: null });
        }
      },

      async removeDocument(
        visitId: string,
        visitorId: string,
        documentId: string,
      ): Promise<boolean> {
        patchState(store, { documentDeletingId: documentId });

        try {
          await firstValueFrom(service.removeDocument(visitId, visitorId, documentId));
          patchState(store, { documentDeletingId: null });
          toast.success('Documento eliminado');
          await this.loadDetail(visitId, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { documentDeletingId: null });
          notifyError(error, 'No se pudo eliminar el documento');
          return false;
        }
      },

      async runStatusAction(
        id: string,
        action: () => ReturnType<VisitService['start']>,
        successMessage: string,
        fallback: string,
      ): Promise<boolean> {
        patchState(store, { actionLoading: true });

        try {
          await firstValueFrom(action());
          patchState(store, { actionLoading: false });
          toast.success(successMessage);
          await this.loadDetail(id, true);
          return true;
        } catch (error: unknown) {
          patchState(store, { actionLoading: false });
          notifyError(error, fallback);
          return false;
        }
      },
    };
  }),
);
