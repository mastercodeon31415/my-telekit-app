class ProfilePage extends TeleKitPage {

    render(props = {}) {
        const nav = this._c('TK_Navigation', { active: "profile", title: "User Profile" });
        const input = this._c('TK_Input', { id: 'name-input', label: 'User Name', value: TK.state.userProfile.name, onInput: 'ProfilePage.updateName(this.value)' });
        const saveButton = this._c('TK_Button', { text: "Save Preference to Cloud", onClick: "ProfilePage.saveToCloud()" });
        const loadButton = this._c('TK_Button', { text: "Load Preference from Cloud", onClick: "ProfilePage.loadFromCloud()" });

        return this._render(`
            <div>
                ${nav}
                <div class="tk-card">
                    ${input}
                    <p style="margin-top: 10px; font-size: 16px;"><strong>Email:</strong> ${TK.state.userProfile.email}</p>
                </div>
                ${saveButton}
                ${loadButton}
            </div>
        `);
    }

    onLoad(props = {}) {
        this.tk.mainButton.hide();
        this.tk.secondaryButton.hide();
        this.tk.backButton.hide();
    }
    
    static updateName(newName) { TK.setState({ userProfile: { ...TK.state.userProfile, name: newName } }); }
    static saveToCloud() {
        // Use the global TK instance to access CloudStorage
        TK.cloudStorage.setItem('user_name', TK.state.userProfile.name, (err, success) => {
            if (success) {
                TK.showAlert('Name saved to cloud storage!');
                TK.hapticFeedback.notificationOccurred('success');
            } else {
                TK.showAlert(`Error saving to cloud: ${err}`);
            }
        });
    }

    static loadFromCloud() {
        // Use the global TK instance to access CloudStorage
        TK.cloudStorage.getItem('user_name', (err, value) => {
            if (value) {
                TK.showAlert(`Loaded "${value}" from cloud.`);
                // Call the static updateName method to update the state
                ProfilePage.updateName(value);
            } else {
                TK.showAlert(`Could not load from cloud: ${err || 'No value set'}`);
            }
        });
    }
    onLeave() {}
}