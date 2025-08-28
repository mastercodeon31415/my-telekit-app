// pages/settings.js

class SettingsPage extends TeleKitPage {
    constructor() {
        super();
        // Page-specific event handlers can be defined here if needed
    }

    render(props = {}) {
        const headerProps = { title: "Settings" };
        const cardProps = {
            title: "App Configuration",
            content: "Options and settings for the app will appear here."
        };
        const navBarProps = { active: "settings", title: "Settings" };

        return `
            <div>
                <TK_Header props='${JSON.stringify(headerProps)}' />
                <TK_Card props='${JSON.stringify(cardProps)}' />
                
                <!-- This is our new navigation bar -->
                <TK_Navigation props='${JSON.stringify(navBarProps)}' />
            </div>
        `;
    }

    onLoad(props = {}) {
        // Since navigation is handled by the NavBar, we hide the native buttons
        TK.mainButton.hide();
        TK.secondaryButton.hide();
        TK.backButton.hide();
    }

    onLeave() {
        // Clean up any listeners if they were added
    }
}