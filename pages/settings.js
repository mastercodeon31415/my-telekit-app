// pages/settings.js

class SettingsPage extends TeleKitPage {
    constructor() {
        super();
    }
    
    // Helper function to safely stringify and encode props
    encodeProps(props) {
        return JSON.stringify(props).replace(/"/g, '&quot;');
    }

    render(props = {}) {
        const navProps = { active: "settings", title: "Settings" };

        // --- GENERAL SETTINGS ---
        const languageSelectProps = this.encodeProps({
            label: "Language",
            selectedValue: TK.state.settings.language,
            onChange: "SettingsPage.handleSettingChange('language', this.value)",
            options: [
                { value: 'en', text: 'English' },
                { value: 'es', text: 'Español' },
                { value: 'de', text: 'Deutsch' }
            ]
        });

        // --- NOTIFICATION SETTINGS ---
        const notificationToggleProps = this.encodeProps({
            label: "Enable Notifications",
            checked: TK.state.settings.enableNotifications,
            onChange: "SettingsPage.handleSettingChange('enableNotifications', this.checked)"
        });
        const previewsCheckboxProps = this.encodeProps({
            label: "Show Message Previews",
            checked: TK.state.settings.showPreviews,
            onChange: "SettingsPage.handleSettingChange('showPreviews', this.checked)"
        });

        const saveButtonProps = this.encodeProps({
            text: "Save Settings",
            onClick: "SettingsPage.handleSave()"
        });

        return `
            <div>
                <TK_Navigation props='${this.encodeProps(navProps)}' />

                <!-- General Settings Category -->
                <div class="tk-settings-category">
                    <h3 class="tk-settings-category-title">General</h3>
                    <div class="tk-card">
                        <TK_Select props='${languageSelectProps}' />
                    </div>
                </div>

                <!-- Notification Settings Category -->
                <div class="tk-settings-category">
                    <h3 class="tk-settings-category-title">Notifications</h3>
                    <div class="tk-card">
                        <TK_Toggle props='${notificationToggleProps}' />
                        <TK_Checkbox props='${previewsCheckboxProps}' />
                    </div>
                </div>
                
                <TK_Button props='${saveButtonProps}' />
            </div>
        `;
    }

    onLoad(props = {}) {
        TK.mainButton.hide();
        TK.secondaryButton.hide();
        TK.backButton.hide();
    }

    static handleSettingChange(key, value) {
        TK.setState({
            settings: { ...TK.state.settings, [key]: value }
        });
    }

    static handleSave() {
        console.log('Saving settings:', TK.state.settings);
        TK.showAlert('Settings saved successfully! (Check the console)');
        TK.hapticFeedback.notificationOccurred('success');
    }

    onLeave() {}
}