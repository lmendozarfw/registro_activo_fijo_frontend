import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import { resolveErrorMessage } from '../../../core/utils/error.utils';
import { ResourceReportItemDto } from '../models/report.model';
import { ReportService } from '../services/report.service';

type ReportState = {
    inventory: ResourceReportItemDto[];
    mobilePhones: ResourceReportItemDto[];
    availableMobilePhones: ResourceReportItemDto[];
    loadingInventory: boolean;
    loadingMobilePhones: boolean;
    loadingAvailableMobilePhones: boolean;
    downloadingInventory: boolean;
    downloadingMobilePhones: boolean;
    downloadingAvailableMobilePhones: boolean;
    error: string | null;
};

export const ReportStore = signalStore(
    { providedIn: 'root' },
    withState<ReportState>({
        inventory: [],
        mobilePhones: [],
        availableMobilePhones: [],
        loadingInventory: false,
        loadingMobilePhones: false,
        loadingAvailableMobilePhones: false,
        downloadingInventory: false,
        downloadingMobilePhones: false,
        downloadingAvailableMobilePhones: false,
        error: null,
    }),
    withMethods((store, reportService = inject(ReportService), toast = inject(ToastService)) => ({
        async loadInventory(): Promise<void> {
            patchState(store, { loadingInventory: true, error: null });
            try {
                const inventory = await firstValueFrom(reportService.getInventory());
                patchState(store, { inventory, loadingInventory: false });
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo cargar el reporte de inventario');
                patchState(store, { loadingInventory: false, error: message });
                toast.error(message);
            }
        },
        async loadMobilePhones(): Promise<void> {
            patchState(store, { loadingMobilePhones: true, error: null });
            try {
                const mobilePhones = await firstValueFrom(reportService.getMobilePhones());
                patchState(store, { mobilePhones, loadingMobilePhones: false });
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo cargar el reporte de celulares');
                patchState(store, { loadingMobilePhones: false, error: message });
                toast.error(message);
            }
        },
        async loadAvailableMobilePhones(): Promise<void> {
            patchState(store, { loadingAvailableMobilePhones: true, error: null });
            try {
                const availableMobilePhones = await firstValueFrom(reportService.getAvailableMobilePhones());
                patchState(store, { availableMobilePhones, loadingAvailableMobilePhones: false });
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo cargar el reporte de celulares disponibles');
                patchState(store, { loadingAvailableMobilePhones: false, error: message });
                toast.error(message);
            }
        },
        async downloadInventoryExcel(): Promise<void> {
            patchState(store, { downloadingInventory: true, error: null });
            try {
                const blob = await firstValueFrom(reportService.downloadInventoryExcel());
                this.saveBlob(blob, `Inventario_${this.getTimestamp()}.xlsx`);
                toast.success('Reporte de inventario descargado');
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo descargar el reporte de inventario');
                patchState(store, { error: message });
                toast.error(message);
            } finally {
                patchState(store, { downloadingInventory: false });
            }
        },
        async downloadMobilePhonesExcel(): Promise<void> {
            patchState(store, { downloadingMobilePhones: true, error: null });
            try {
                const blob = await firstValueFrom(reportService.downloadMobilePhonesExcel());
                this.saveBlob(blob, `Celulares_${this.getTimestamp()}.xlsx`);
                toast.success('Reporte de celulares descargado');
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo descargar el reporte de celulares');
                patchState(store, { error: message });
                toast.error(message);
            } finally {
                patchState(store, { downloadingMobilePhones: false });
            }
        },
        async downloadAvailableMobilePhonesExcel(): Promise<void> {
            patchState(store, { downloadingAvailableMobilePhones: true, error: null });
            try {
                const blob = await firstValueFrom(reportService.downloadAvailableMobilePhonesExcel());
                this.saveBlob(blob, `Celulares_disponibles_${this.getTimestamp()}.xlsx`);
                toast.success('Reporte de celulares disponibles descargado');
            } catch (error) {
                const message = resolveErrorMessage(error, 'No se pudo descargar el reporte de celulares disponibles');
                patchState(store, { error: message });
                toast.error(message);
            } finally {
                patchState(store, { downloadingAvailableMobilePhones: false });
            }
        },
        saveBlob(blob: Blob, filename: string): void {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
        getTimestamp(): string {
            const now = new Date();
            return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        },
    })),
);
