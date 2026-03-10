import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'connectify_theme';
    theme = signal<Theme>(this.getInitialTheme());

    constructor() {
        // Apply theme whenever it changes
        effect(() => {
            const currentTheme = this.theme();
            if (typeof window !== 'undefined') {
                localStorage.setItem(this.THEME_KEY, currentTheme);
                this.applyTheme(currentTheme);
            }
        });
    }

    toggleTheme() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    private getInitialTheme(): Theme {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(this.THEME_KEY) as Theme;
            if (saved) return saved;

            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }

    private applyTheme(theme: Theme) {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.classList.add('dark-theme');
            } else {
                root.classList.remove('dark-theme');
            }
        }
    }
}
