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
		
        // --- ADD THIS PROPERTY ---
        this.navigation = null; // Will hold the active navigation component instance

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

    addPage(name, pageClass) { this.pages[name] = pageClass; }
	
	addComponent(name, componentClass) {
        this.components[name] = componentClass;
    }

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
        // Create a new instance of the page, injecting `this` (the TK instance)
        const pageInstance = new this.currentPage(this);
        const renderData = pageInstance.render(this.currentPageProps);
        appContainer.innerHTML = renderData.html;

        if (renderData.componentMap) {
            for (const id in renderData.componentMap) {
                const { componentName, props } = renderData.componentMap[id];
                const placeholder = document.getElementById(id);
                const componentClass = this.components[componentName]; // Get the class
                if (placeholder && componentClass) {
                    // Create a new instance of the component, injecting `this`
                    const componentInstance = new componentClass(this);
                    placeholder.outerHTML = componentInstance.render(props);
                }
            }
        }

        // We now call onLoad on the new instance
        if (pageInstance.onLoad) pageInstance.onLoad(this.currentPageProps);
    }
	
	openDrawer() {
        if (this.navigation && this.navigation.openDrawer) {
            this.navigation.openDrawer();
        }
    }
    closeDrawer() {
        if (this.navigation && this.navigation.closeDrawer) {
            this.navigation.closeDrawer();
        }
    }
    handleNavLinkClick(pageName) {
        if (this.navigation && this.navigation.handleLinkClick) {
            this.navigation.handleLinkClick(pageName);
        }
    }
    
    // Core App Wrappers & UI Buttons
    updateTheme() { document.documentElement.className = this.app.colorScheme; }
    get initDataUnsafe() { return this.app.initDataUnsafe; }
    showAlert(message) { this.app.showAlert(message); }
    showConfirm(message, callback) { this.app.showConfirm(message, callback); }
    showPopup(params, callback) { this.app.showPopup(params, callback); }
    expand() { this.app.expand(); }
    close() { this.app.close(); }

    // Button Getters
    get mainButton() { return this.app.MainButton; }
    get backButton() { return this.app.BackButton; }
    get settingsButton() { return this.app.SettingsButton; }
    get secondaryButton() { return this.app.SecondaryButton; }

    // Advanced Feature Getters
    get hapticFeedback() { return this.app.HapticFeedback; }
    get cloudStorage() { return this.app.CloudStorage; }
    get biometricManager() { return this.app.BiometricManager; }
    get accelerometer() { return this.app.Accelerometer; }
    get gyroscope() { return this.app.Gyroscope; }
    get deviceOrientation() { return this.app.DeviceOrientation; }
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