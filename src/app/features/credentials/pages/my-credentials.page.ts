import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { EmptyStateComponent } from "../../../shared/components/empty-state/empty-state.component";
import { PageHeaderService } from "../../../core/services/page-header.service";
import { ToastService } from "../../../core/services/toast.service";
import { MyCredentialStore } from "../stores/my-credential.store";
import { Credential } from "../models/credential.model";
import { Copy, Eye, EyeSlash, Lock, Search, Spinner } from '@primeicons/angular';

@Component({
    selector: 'app-my-credentials-page',
    templateUrl: './my-credentials.page.html',
    styles: [],
    imports: [ButtonModule, InputText, TooltipModule, EmptyStateComponent, Copy, Eye, EyeSlash, Lock, Search, Spinner],
})
export class MyCredentialsPage implements OnInit {
    protected readonly store = inject(MyCredentialStore);
    private readonly pageHeader = inject(PageHeaderService);
    private readonly toast = inject(ToastService);

    protected readonly searchTerm = signal('');

    protected readonly filteredCredentials = computed(() => {
        const term = this.searchTerm().trim().toLowerCase();
        const credentials = this.store.credentials();

        if (!term) return credentials;

        return credentials.filter((credential) =>
            (credential.systemName ?? '').toLowerCase().includes(term) ||
            (credential.note ?? '').toLowerCase().includes(term),
        );
    });

    ngOnInit(): void {
        this.pageHeader.setTitle('Mis credenciales');
        this.store.load();
    }

    protected onSearch(event: Event): void {
        this.searchTerm.set((event.target as HTMLInputElement).value);
    }

    protected requestPassword(credential: Credential): void {
        if (!credential.canView) {
            this.toast.warning('Esta contraseña está cifrada', 'Acude a Sistemas para restablecerla.');
            return;
        }

        this.store.requestPassword(credential.id);
    }

    protected async copyPassword(credential: Credential): Promise<void> {
        const password = this.store.revealedPasswords()[credential.id];
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            this.toast.success('Contraseña copiada');
        } catch {
            this.toast.error('No se pudo copiar la contraseña');
        }
    }

    protected initials(name?: string | null): string {
        if (!name) return '?';
        return name.trim().charAt(0).toUpperCase();
    }
}
