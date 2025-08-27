class ProfilePage extends TeleKitPage {
    render() {
        // --- CORRECTED PART ---
        // Build props as JavaScript objects first for safety and clarity.
        const headerProps = {
            title: "User Profile"
        };

        const inputProps = {
            id: 'name-input',
            label: 'User Name',
            value: TK.state.userProfile.name, // This now safely handles any special characters in the name
            onInput: 'ProfilePage.updateName(this.value)'
        };

        const saveButtonProps = {
            text: "Save Preference to Cloud",
            onClick: "ProfilePage.saveToCloud()"
        };
        
        const loadButtonProps = {
            text: "Load Preference from Cloud",
            onClick: "ProfilePage.loadFromCloud()"
        };

        // Now, safely stringify the objects into the component tags.
        return `
            <div>
                <TK_Header props='${JSON.stringify(headerProps)}' />

                <div class="tk-card">
                    <TK_Input props='${JSON.stringify(inputProps)}' />

                    <p style="margin-top: 10px; font-size: 16px;">
                        <strong>Email:</strong> ${TK.state.userProfile.email}
                    </p>
                </div>

                <TK_Button props='${JSON.stringify(saveButtonProps)}' />
                <TK_Button props='${JSON.stringify(loadButtonProps)}' />
            </div>
        `;
    }

    onLoad() {
        TK.mainButton.setText('Go Home').show().onClick(() => TK.navigateTo('home'));
        TK.backButton.show().onClick(() => TK.navigateTo('home'));
    }

    static updateName(newName) {
        // Directly update the global state. The UI will react automatically.
        TK.setState({
            userProfile: { ...TK.state.userProfile, name: newName }
        });
    }

    static saveToCloud() {
        // Using the Cloud Storage wrapper
        TK.cloudStorage.setItem('user_name', TK.state.userProfile.name, (err, success) => {
            if (success) {
                TK.showAlert('Name saved to cloud storage!');
            } else {
                TK.showAlert(`Error saving to cloud: ${err}`);
            }
        });
    }

    static loadFromCloud() {
        TK.cloudStorage.getItem('user_name', (err, value) => {
            if (value) {
                TK.showAlert(`Loaded "${value}" from cloud.`);
                ProfilePage.updateName(value);
            } else {
                TK.showAlert(`Could not load from cloud: ${err || 'No value set'}`);
            }
        });
    }

    onLeave() {
        // Clean up all page-specific listeners
        TK.mainButton.offClick();
        TK.backButton.offClick();
    }
}