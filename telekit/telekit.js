// telekit/telekit.js

class TeleKit {
    constructor(config = {}) {
        this.config = config;
        this.app = Telegram.WebApp;
        this.app.ready();

        this.pages = {};
        this.components = {};
        this.currentPage = null;
        this.currentPageProps = {};

        this._state = new Proxy(config.state || {}, {
            set: (target, property, value) => {
                target[property] = value;
                this.renderCurrentPage();
                return true;
            }
        });

        this.api = {
            baseUrl: config.apiBaseUrl || '',
            request: async (endpoint, options = {}) => {
                const headers = { 'Content-Type': 'application/json', ...options.headers };
                const body = { ...options.body, _auth: this.app.initData };
                try {
                    const response = await fetch(`${this.api.baseUrl}${endpoint}`, { method: 'POST', headers, body: JSON.stringify(body), ...options });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return await response.json();
                } catch (error) {
                    console.error('TeleKit API request failed:', error);
                    this.showAlert(`API request failed: ${error.message}`);
                    return null;
                }
            }
        };

        this.app.onEvent('themeChanged', () => this.updateTheme());
        this.updateTheme();
    }
    
    get state() { return this._state; }
    setState(newState) {
        for (const key in newState) {
            if (Object.hasOwnProperty.call(newState, key)) this._state[key] = newState[key];
        }
    }

    addPage(name, page) { this.pages[name] = page; }
    addComponent(name, component) { this.components[name] = component; }

    navigateTo(pageName, props = {}) {
        if (this.currentPage && this.currentPage.onLeave) this.currentPage.onLeave();
        const page = this.pages[pageName];
        if (page) {
            this.currentPage = page;
            this.currentPageProps = props;
            this.renderCurrentPage();
        } else {
            console.error(`Page "${pageName}" not found.`);
        }
    }

    renderCurrentPage() {
        if (!this.currentPage) return;
        const appContainer = document.getElementById('app');
        
        // --- NEW RENDERING LOGIC ---
        const renderData = this.currentPage.render(this.currentPageProps);
        appContainer.innerHTML = renderData.html;

        if (renderData.componentMap) {
            for (const id in renderData.componentMap) {
                const { componentName, props } = renderData.componentMap[id];
                const placeholder = document.getElementById(id);
                if (placeholder && this.components[componentName]) {
                    const componentInstance = this.components[componentName];
                    placeholder.outerHTML = componentInstance.render(props);
                }
            }
        }

        if (this.currentPage.onLoad) this.currentPage.onLoad(this.currentPageProps);
    }
    
    // --- CORE APP WRAPPERS (Unchanged) ---
    updateTheme() { document.documentElement.className = this.app.colorScheme; }
    // ... all other helper methods remain the same ...
}

class TeleKitComponent {
    constructor(tk) {
        // Store the main TeleKit instance
        this.tk = tk; 
    }
    render(props = {}) { throw new Error("Component must implement the 'render' method!"); }
}

class TeleKitPage extends TeleKitComponent {
    constructor(tk) {
        super(tk); // Pass the instance up to the parent
    }
    onLoad(props) {}
    onLeave() {}
    
    _c(componentName, props = {}) {
        const id = `tk-comp-${Math.random().toString(36).substr(2, 9)}`;
        this._componentMap = this._componentMap || {};
        this._componentMap[id] = { componentName, props };
        return `<div id="${id}"></div>`;
    }

    _render(html) {
        const map = this._componentMap;
        this._componentMap = {};
        return { html, componentMap: map };
    }
}