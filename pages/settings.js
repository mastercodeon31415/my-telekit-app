// pages/settings.js

class SettingsPage extends TeleKitPage {
    constructor() {
        super();
    }

    render(props = {}) {
        const navProps = { active: "settings", title: "Settings" };

        const notificationToggleProps = {
            label: "Enable Notifications",
            checked: TK.state.settings.enableNotifications,
            onChange: "SettingsPage.handleSettingChange('enableNotifications', this.checked)"
        };

        const previewsCheckboxProps = {
            label: "Show Message Previews",
            checked: TK.state.settings.showPreviews,
            onChange: "SettingsPage.handleSettingChange('showPreviews', this.checked)"
        };

        const languageSelectProps = {
            label: "Language",
            selectedValue: TK.state.settings.language,
            onChange: "SettingsPage.handleSettingChange('language', this.value)",
            options: [
                { value: 'en', text: 'English' },
                { value: 'es', text: 'Español' },
                { value: 'de', text: 'Deutsch' }
            ]
        };
        
        const saveButtonProps = {
            text: "Save Settings",
            onClick: "SettingsPage.handleSave()"
        };

        return `
            <div>
                <TK_Navigation props='${JSON.stringify(navProps)}' />

                <div class="tk-settings-group">
                    <TK_Toggle props='${JSON.stringify(notificationToggleProps)}' />
                    <TK_Checkbox props='${JSON.stringify(previewsCheckboxProps)}' />
                </div>
                
                <div class="tk-settings-group">
                    <TK_Select props='${JSON.stringify(languageSelectProps)}' />
                </div>
                
                <TK_Button props='${JSON.stringify(saveButtonProps)}' />
            </div>
        `;
    }

    onLoad(props = {}) {
        // Hide native buttons as they are not needed on this page
        TK.mainButton.hide();
        TK.secondaryButton.hide();
        TK.backButton.hide();
    }

    // A single, generic handler for all setting changes
    static handleSettingChange(key, value) {
        // Update the state immutably
        TK.setState({
            settings: {
                ...TK.state.settings, // Keep old settings
                [key]: value          // Overwrite the changed one
            }
        });
    }

    static handleSave() {
        // In a real app, you would send TK.state.settings to your backend here
        // const response = await TK.api.request('/save-settings', { body: TK.state.settings });
        
        // For the demo, we just show a confirmation
        console.log('Saving settings:', TK.state.settings);
        TK.showAlert('Settings saved successfully! (Check the console)');
        TK.hapticFeedback.notificationOccurred('success');
    }

    onLeave() {}
}