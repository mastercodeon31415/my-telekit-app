// pages/profile.js

class ProfilePage extends TeleKitPage {
    // --- NEW: Define a constructor to hold the event handler ---
    constructor() {
        super();
        // Define the handler once so we have a persistent reference for adding AND removing it.
        // Both the Main button and Back button will perform the same action on this page.
        this.goHomeHandler = () => TK.navigateTo('home');
    }

    // The render method is already correct from our previous fix.
    render(props = {}) { // Added props to match the new base class standard
        const headerProps = { title: "User Profile" };
        const inputProps = {
            id: 'name-input',
            label: 'User Name',
            value: TK.state.userProfile.name,
            onInput: 'ProfilePage.updateName(this.value)'
        };
        const saveButtonProps = { text: "Save Preference to Cloud", onClick: "ProfilePage.saveToCloud()" };
        const loadButtonProps = { text: "Load Preference from Cloud", onClick: "ProfilePage.loadFromCloud()" };

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

    // --- UPDATED: Use the named handler ---
    onLoad(props = {}) { // Added props to match the new base class standard
        TK.mainButton.setText('Go Home').show();
        TK.mainButton.onClick(this.goHomeHandler);

        TK.backButton.show();
        TK.backButton.onClick(this.goHomeHomeHandler);
    }

    // Static methods remain unchanged
    static updateName(newName) {
        TK.setState({ userProfile: { ...TK.state.userProfile, name: newName } });
    }
    static saveToCloud() {
        TK.cloudStorage.setItem('user_name', TK.state.userProfile.name, (err, success) => {
            if (success) { TK.showAlert('Name saved to cloud storage!'); } 
            else { TK.showAlert(`Error saving to cloud: ${err}`); }
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

    // --- UPDATED: Correctly remove the named handler ---
    onLeave() {
        TK.mainButton.offClick(this.goHomeHandler);
        TK.backButton.offClick(this.goHomeHandler);
    }
}