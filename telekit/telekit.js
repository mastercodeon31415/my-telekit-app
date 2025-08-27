class TeleKit {
    constructor(config = {}) {
        this.app = Telegram.WebApp;
        this.app.ready();

        this.pages = {};
        this.components = {};
        this.currentPage = null;

        // 1. State Management
        this._state = new Proxy(config.state || {}, {
            set: (target, property, value) => {
                target[property] = value;
                this.renderCurrentPage(); // Re-render on state change
                return true;
            }
        });

        // 2. Data Fetching
        this.api = {
            baseUrl: config.apiBaseUrl || '',
            request: async (endpoint, options = {}) => {
                const headers = {
                    'Content-Type': 'application/json',
                    ...options.headers,
                };

                const body = {
                    ...options.body,
                    _auth: this.app.initData // Automatically send auth data
                };

                try {
                    const response = await fetch(`${this.api.baseUrl}${endpoint}`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(body),
                        ...options
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return await response.json();
                } catch (error) {
                    console.error('TeleKit API request failed:', error);
                    this.showAlert(`API request failed: ${error.message}`);
                    return null;
                }
            }
        };

        // Event listeners
        this.app.onEvent('themeChanged', () => this.updateTheme());
        this.updateTheme();
    }

    // --- State ---
    get state() {
        return this._state;
    }

    setState(newState) {
        for (const key in newState) {
            if (Object.hasOwnProperty.call(newState, key)) {
                this._state[key] = newState[key];
            }
        }
    }

    // --- Routing & Rendering ---
    addPage(name, page) {
        this.pages[name] = page;
    }

    addComponent(name, component) {
        this.components[name] = component;
    }

    navigateTo(pageName, props = {}) {
        if (this.currentPage && this.currentPage.onLeave) {
            this.currentPage.onLeave();
        }

        const page = this.pages[pageName];
        if (page) {
            this.currentPage = page;
            this.currentPage.props = props;
            this.renderCurrentPage();
        } else {
            console.error(`Page "${pageName}" not found.`);
        }
    }

    renderCurrentPage() {
        if (this.currentPage) {
            const appContainer = document.getElementById('app');
            appContainer.innerHTML = this._renderComponent(this.currentPage);

            if (this.currentPage.onLoad) {
                this.currentPage.onLoad(this.currentPage.props);
            }
        }
    }

    _renderComponent(component) {
        let html = component.render();
        // 3. Component Nesting Logic
        const componentTags = html.match(/<([A-Z][A-Za-z0-9_]+)(\s*[^>]*)\s*\/>/g) || [];

        for (const tag of componentTags) {
            const tagNameMatch = tag.match(/<([A-Z][A-Za-z0-9_]+)/);
            const tagName = tagNameMatch ? tagNameMatch[1] : null;

            if (tagName && this.components[tagName]) {
                const propsMatch = tag.match(/props='({[^']*})'/);
                let props = {};
                if (propsMatch && propsMatch[1]) {
                    try {
                        props = JSON.parse(propsMatch[1]);
                    } catch (e) {
                        console.error(`Invalid JSON in props for component ${tagName}:`, e);
                    }
                }

                const childComponent = this.components[tagName];
                childComponent.props = { ...childComponent.props, ...props };
                html = html.replace(tag, this._renderComponent(childComponent));
            }
        }
        return html;
    }


    // --- Core App Wrappers ---
    updateTheme() {
        document.documentElement.className = this.app.colorScheme;
    }

    get initDataUnsafe() {
        return this.app.initDataUnsafe;
    }

    showAlert(message) { this.app.showAlert(message); }
    showConfirm(message, callback) { this.app.showConfirm(message, callback); }
    showPopup(params, callback) { this.app.showPopup(params, callback); }
    expand() { this.app.expand(); }
    close() { this.app.close(); }

    // --- UI Button Wrappers ---
    get mainButton() { return this.app.MainButton; }
    get backButton() { return this.app.BackButton; }
    get settingsButton() { return this.app.SettingsButton; } // 5. Advanced Feature

    // 5. Advanced Feature Wrappers ---
    get hapticFeedback() { return this.app.HapticFeedback; }
    get cloudStorage() { return this.app.CloudStorage; }
    get biometricManager() { return this.app.BiometricManager; }
    get accelerometer() { return this.app.Accelerometer; }
    get gyroscope() { return this.app.Gyroscope; }
    get deviceOrientation() { return this.app.DeviceOrientation; }
}

// Base class for all renderable parts of the UI
class TeleKitComponent {
    constructor(props = {}) {
        this.props = props;
    }

    render() {
        throw new Error("Component must implement the 'render' method!");
    }
}

// A Page is just a top-level Component
class TeleKitPage extends TeleKitComponent {
    onLoad(props) { /* Optional: code to run when page loads */ }
    onLeave() { /* Optional: code to run when navigating away */ }
}