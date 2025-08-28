// telekit/telekit.js

class TeleKit {
    constructor(config = {}) {
		this.config = config; // Store the entire config object
		
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

        // --- THIS IS THE FIX: Full API object implementation ---
        this.api = {
            baseUrl: config.apiBaseUrl || '',
            request: async (endpoint, options = {}) => {
                const headers = { 'Content-Type': 'application/json', ...options.headers };
                const body = { ...options.body, _auth: this.app.initData };

                try {
                    const response = await fetch(`${this.api.baseUrl}${endpoint}`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(body),
                        ...options
                    });
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

    // --- THIS IS THE FIX: Full setState implementation ---
    setState(newState) {
        for (const key in newState) {
            if (Object.hasOwnProperty.call(newState, key)) {
                this._state[key] = newState[key];
            }
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
        if (this.currentPage) {
            const appContainer = document.getElementById('app');
            appContainer.innerHTML = this._renderComponent(this.currentPage, this.currentPageProps);
            if (this.currentPage.onLoad) this.currentPage.onLoad(this.currentPageProps);
        }
    }

    _renderComponent(component, props = {}) {
        let html = component.render(props);
        const componentTags = html.match(/<([A-Z][A-Za-z0-9_]+)(\s*[^>]*)\s*\/>/g) || [];
        for (const tag of componentTags) {
            const tagNameMatch = tag.match(/<([A-Z][A-Za-z0-9_]+)/);
            const tagName = tagNameMatch ? tagNameMatch[1] : null;
            if (tagName && this.components[tagName]) {
                const propsMatch = tag.match(/props='(.*?)'/);
                let childProps = {};
                if (propsMatch && propsMatch[1]) {
                    try { childProps = JSON.parse(propsMatch[1]); } 
                    catch (e) { console.error(`Invalid JSON in props for component ${tagName}:`, e); }
                }
                const childComponentTemplate = this.components[tagName];
                const childHtml = this._renderComponent(childComponentTemplate, childProps);
                html = html.replace(tag, childHtml);
            }
        }
        return html;
    }
    
    // --- Core App Wrappers & UI Buttons ---
    updateTheme() { document.documentElement.className = this.app.colorScheme; }
    get initDataUnsafe() { return this.app.initDataUnsafe; }
    showAlert(message) { this.app.showAlert(message); }
    showConfirm(message, callback) { this.app.showConfirm(message, callback); }
    showPopup(params, callback) { this.app.showPopup(params, callback); }
    expand() { this.app.expand(); }
    close() { this.app.close(); }
    get mainButton() { return this.app.MainButton; }
    get backButton() { return this.app.BackButton; }
    get settingsButton() { return this.app.SettingsButton; }
    get hapticFeedback() { return this.app.HapticFeedback; }
    get cloudStorage() { return this.app.CloudStorage; }
    get biometricManager() { return this.app.BiometricManager; }
    get accelerometer() { return this.app.Accelerometer; }
    get gyroscope() { return this.app.Gyroscope; }
    get deviceOrientation() { return this.app.DeviceOrientation; }
}

class TeleKitComponent {
    render(props = {}) { throw new Error("Component must implement the 'render' method!"); }
}
class TeleKitPage extends TeleKitComponent {
    onLoad(props) {}
    onLeave() {}
}