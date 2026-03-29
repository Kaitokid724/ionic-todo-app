import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

// Firebase imports
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  RemoteConfig,
} from 'firebase/remote-config';

export interface RemoteFlags {
  /** Feature flag: show task statistics dashboard on home */
  showStatsDashboard: boolean;
  /** Feature flag: enable priority selection for tasks */
  enablePriority: boolean;
  /** Feature flag: enable due date picker */
  enableDueDate: boolean;
  /** Feature flag: enable subtasks (future feature) */
  enableSubtasks: boolean;
}

const DEFAULT_FLAGS: RemoteFlags = {
  showStatsDashboard: true,
  enablePriority: true,
  enableDueDate: true,
  enableSubtasks: false,
};

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app: FirebaseApp | null = null;
  private remoteConfig: RemoteConfig | null = null;

  private _flags = signal<RemoteFlags>(DEFAULT_FLAGS);
  private _initialized = signal(false);
  private _loading = signal(false);

  readonly flags = this._flags.asReadonly();
  readonly initialized = this._initialized.asReadonly();
  readonly loading = this._loading.asReadonly();

  async initialize(): Promise<void> {
    try {
      this._loading.set(true);

      // Only initialize if a real API key is configured
      if (environment.firebase.apiKey === 'YOUR_API_KEY') {
        console.warn(
          '[Firebase] Using default flags — configure src/environments/environment.ts with your Firebase credentials.'
        );
        this._flags.set(DEFAULT_FLAGS);
        this._initialized.set(true);
        this._loading.set(false);
        return;
      }

      this.app = initializeApp(environment.firebase);
      this.remoteConfig = getRemoteConfig(this.app);

      // Set defaults so the app works even before fetching
      this.remoteConfig.defaultConfig = {
        showStatsDashboard: DEFAULT_FLAGS.showStatsDashboard,
        enablePriority: DEFAULT_FLAGS.enablePriority,
        enableDueDate: DEFAULT_FLAGS.enableDueDate,
        enableSubtasks: DEFAULT_FLAGS.enableSubtasks,
      };

      // Minimum fetch interval: 1 hour in production, 0 in development
      this.remoteConfig.settings.minimumFetchIntervalMillis = environment.production
        ? 3600000
        : 0;

      await fetchAndActivate(this.remoteConfig);

      const flags: RemoteFlags = {
        showStatsDashboard: getValue(this.remoteConfig, 'showStatsDashboard').asBoolean(),
        enablePriority: getValue(this.remoteConfig, 'enablePriority').asBoolean(),
        enableDueDate: getValue(this.remoteConfig, 'enableDueDate').asBoolean(),
        enableSubtasks: getValue(this.remoteConfig, 'enableSubtasks').asBoolean(),
      };

      this._flags.set(flags);
      this._initialized.set(true);

      console.log('[Firebase] Remote Config loaded:', flags);
    } catch (error) {
      console.error('[Firebase] Remote Config error, using defaults:', error);
      this._flags.set(DEFAULT_FLAGS);
      this._initialized.set(true);
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Force-refresh remote config values (useful for testing feature flags)
   */
  async refresh(): Promise<void> {
    if (!this.remoteConfig) return;
    try {
      this._loading.set(true);
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
      await fetchAndActivate(this.remoteConfig);
      const flags: RemoteFlags = {
        showStatsDashboard: getValue(this.remoteConfig, 'showStatsDashboard').asBoolean(),
        enablePriority: getValue(this.remoteConfig, 'enablePriority').asBoolean(),
        enableDueDate: getValue(this.remoteConfig, 'enableDueDate').asBoolean(),
        enableSubtasks: getValue(this.remoteConfig, 'enableSubtasks').asBoolean(),
      };
      this._flags.set(flags);
    } finally {
      this._loading.set(false);
    }
  }
}
