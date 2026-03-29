import { Injectable, signal } from '@angular/core';

/**
 * Feature flags controlados por Remote Config.
 * 
 * Para conectar Firebase real:
 * 1. npm install firebase
 * 2. Reemplaza la implementación mock por la real (ver comentarios abajo)
 * 3. Configura src/environments/environment.ts con tus credenciales
 */
export interface RemoteFlags {
  /** Muestra el panel de estadísticas en home */
  showStatsDashboard: boolean;
  /** Activa la selección de prioridad en tareas */
  enablePriority: boolean;
  /** Activa el selector de fecha límite */
  enableDueDate: boolean;
  /** Activa subtareas (funcionalidad futura) */
  enableSubtasks: boolean;
}

// Valores por defecto — se usan cuando Firebase no está configurado
// o mientras se cargan los valores remotos
const DEFAULT_FLAGS: RemoteFlags = {
  showStatsDashboard: true,
  enablePriority: true,
  enableDueDate: true,
  enableSubtasks: false,
};

// Clave de localStorage para persistir flags entre sesiones
const FLAGS_STORAGE_KEY = 'remote_flags';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private _flags = signal<RemoteFlags>(DEFAULT_FLAGS);
  private _initialized = signal(false);
  private _loading = signal(false);

  readonly flags = this._flags.asReadonly();
  readonly initialized = this._initialized.asReadonly();
  readonly loading = this._loading.asReadonly();

  async initialize(): Promise<void> {
    this._loading.set(true);
    try {
      // Carga flags guardados localmente (simulando caché de Remote Config)
      const saved = localStorage.getItem(FLAGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<RemoteFlags>;
        this._flags.set({ ...DEFAULT_FLAGS, ...parsed });
      }

      /*
       * ── Integración Firebase Real ──────────────────────────────────
       * Cuando tengas Firebase configurado, reemplaza este bloque:
       *
       * import { initializeApp } from 'firebase/app';
       * import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
       * import { environment } from '../../environments/environment';
       *
       * const app = initializeApp(environment.firebase);
       * const rc  = getRemoteConfig(app);
       * rc.defaultConfig = DEFAULT_FLAGS as any;
       * rc.settings.minimumFetchIntervalMillis = environment.production ? 3600000 : 0;
       * await fetchAndActivate(rc);
       *
       * const flags: RemoteFlags = {
       *   showStatsDashboard: getValue(rc, 'showStatsDashboard').asBoolean(),
       *   enablePriority:     getValue(rc, 'enablePriority').asBoolean(),
       *   enableDueDate:      getValue(rc, 'enableDueDate').asBoolean(),
       *   enableSubtasks:     getValue(rc, 'enableSubtasks').asBoolean(),
       * };
       * this._flags.set(flags);
       * localStorage.setItem(FLAGS_STORAGE_KEY, JSON.stringify(flags));
       * ───────────────────────────────────────────────────────────────
       */

      console.log('[RemoteConfig] Flags activos:', this._flags());
      this._initialized.set(true);
    } catch (e) {
      console.warn('[RemoteConfig] Error al cargar flags, usando defaults:', e);
      this._flags.set(DEFAULT_FLAGS);
      this._initialized.set(true);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Permite cambiar flags en tiempo real desde la UI (demo del feature flag).
   * En producción esto lo haría Remote Config automáticamente.
   */
  setFlag<K extends keyof RemoteFlags>(key: K, value: RemoteFlags[K]): void {
    const updated = { ...this._flags(), [key]: value };
    this._flags.set(updated);
    localStorage.setItem(FLAGS_STORAGE_KEY, JSON.stringify(updated));
    console.log(`[RemoteConfig] Flag "${key}" → ${value}`);
  }

  resetFlags(): void {
    this._flags.set(DEFAULT_FLAGS);
    localStorage.removeItem(FLAGS_STORAGE_KEY);
  }
}
