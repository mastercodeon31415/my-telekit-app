// pages/settings.js

class SettingsPage extends TeleKitPage {

    render(props = {}) {
        const nav = this._c('TK_Navigation', { active: "settings", title: "Settings" });

        const languageSelect = this._c('TK_Select', {
            label: "Language",
            selectedValue: TK.state.settings.language,
            onChange: "SettingsPage.handleSettingChange('language', this.value)",
            options: [
                { value: 'en', text: 'English' },
                { value: 'es', text: 'Español' },
                { value: 'de', text: 'Deutsch' }
            ]
        });

        const notificationToggle = this._c('TK_Toggle', {
            label: "Enable Notifications",
            checked: TK.state.settings.enableNotifications,
            onChange: "SettingsPage.handleSettingChange('enableNotifications', this.checked)"
        });

        const previewsCheckbox = this._c('TK_Checkbox', {
            label: "Show Message Previews",
            checked: TK.state.settings.showPreviews,
            onChange: "SettingsPage.handleSettingChange('showPreviews', this.checked)"
        });
        
        const saveButton = this._c('TK_Button', {
            text: "Save Settings",
            onClick: "SettingsPage.handleSave()"
        });

        return this._render(`
            <div>
                ${nav}
                <div class="tk-settings-category">
                    <h3 class="tk-settings-category-title">General</h3>
                    <div class="tk-card">${languageSelect}</div>
                </div>
                <div class="tk-settings-category">
                    <h3 class="tk-settings-category-title">Notifications</h3>
                    <div class="tk-card">
                        ${notificationToggle}
                        ${previewsCheckbox}
                    </div>
                </div>
                ${saveButton}
            </div>
        `);
    }

    onLoad(props = {}) {
        this.tk.mainButton.hide();
        this.tk.secondaryButton.hide();
        this.tk.backButton.hide();
    }

    static handleSettingChange(key, value) {
        TK.setState({ settings: { ...TK.state.settings, [key]: value } });
    }

    static handleSave() {
        console.log('Saving settings:', TK.state.settings);
        TK.showAlert('Settings saved successfully!');
        TK.hapticFeedback.notificationOccurred('success');
    }

    onLeave() {}
}