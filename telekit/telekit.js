// telekit/telekit.js

class TeleKit {
    constructor(config = {}) {
        this.app = Telegram.WebApp;
        this.app.ready();

        this.pages = {};
        this.components = {};
        this.currentPage = null;
        this.currentPageProps = {};

        // 1. State Management
        this._state = new Proxy(config.state || {}, {
            set: (target, property, value) => {
                target[property] = value;
                this.renderCurrentPage(); // Re-render on state change
                return true;
            }
        });

        // 2. Data Fetching (remains the same)
        this.api = { /* ... full api code from previous response ... */ };

        this.app.onEvent('themeChanged', () => this.updateTheme());
        this.updateTheme();
    }
    
    // --- State (remains the same) ---
    get state() { return this._state; }
    setState(newState) { /* ... */ }

    // --- Routing & Rendering (CRITICAL FIX) ---
    addPage(name, page) { this.pages[name] = page; }
    addComponent(name, component) { this.components[name] = component; }

    navigateTo(pageName, props = {}) {
        if (this.currentPage && this.currentPage.onLeave) {
            this.currentPage.onLeave();
        }

        const page = this.pages[pageName];
        if (page) {
            this.currentPage = page;
            this.currentPageProps = props; // Store props for the page
            this.renderCurrentPage();
        } else {
            console.error(`Page "${pageName}" not found.`);
        }
    }

    renderCurrentPage() {
        if (this.currentPage) {
            const appContainer = document.getElementById('app');
            // Pass the page its props to render
            appContainer.innerHTML = this._renderComponent(this.currentPage, this.currentPageProps);
            if (this.currentPage.onLoad) {
                this.currentPage.onLoad(this.currentPageProps);
            }
        }
    }

    // THIS FUNCTION IS THE CORE OF THE FIX
    _renderComponent(component, props = {}) {
        // Render the component's HTML, passing its props directly.
        // This does NOT modify the component instance.
        let html = component.render(props);

        // Find and render child components recursively
        const componentTags = html.match(/<([A-Z][A-Za-z0-9_]+)(\s*[^>]*)\s*\/>/g) || [];

        for (const tag of componentTags) {
            const tagNameMatch = tag.match(/<([A-Z][A-Za-z0-9_]+)/);
            const tagName = tagNameMatch ? tagNameMatch[1] : null;

            if (tagName && this.components[tagName]) {
                const propsMatch = tag.match(/props='({[^']*})'/);
                let childProps = {};
                if (propsMatch && propsMatch[1]) {
                    try {
                        childProps = JSON.parse(propsMatch[1]);
                    } catch (e) {
                        console.error(`Invalid JSON in props for component ${tagName}:`, e);
                    }
                }
                const childComponentTemplate = this.components[tagName];
                // Recursively call _renderComponent for the child, passing its own unique props
                const childHtml = this._renderComponent(childComponentTemplate, childProps);
                html = html.replace(tag, childHtml);
            }
        }
        return html;
    }

    // --- Core App Wrappers & UI Buttons (remain the same) ---
    /* ... all other methods like updateTheme, showAlert, mainButton, etc. ... */
    get hapticFeedback() { return this.app.HapticFeedback; }
    get cloudStorage() { return this.app.CloudStorage; }
    get biometricManager() { return this.app.BiometricManager; }
    get accelerometer() { return this.app.Accelerometer; }
    get gyroscope() { return this.app.Gyroscope; }
    get deviceOrientation() { return this.app.DeviceOrientation; }
}

// --- Base Classes (CRITICAL FIX) ---
class TeleKitComponent {
    // Render now accepts props directly, instead of using this.props
    render(props = {}) {
        throw new Error("Component must implement the 'render' method!");
    }
}

class TeleKitPage extends TeleKitComponent {
    onLoad(props) { /* Optional */ }
    onLeave() { /* Optional */ }
}