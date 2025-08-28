// pages/profile.js

class ProfilePage extends TeleKitPage {
    constructor() {
        super();
    }

    render(props = {}) {
        const headerProps = { title: "User Profile" };
        const inputProps = { id: 'name-input', label: 'User Name', value: TK.state.userProfile.name, onInput: 'ProfilePage.updateName(this.value)' };
        const navBarProps = { active: "profile" };

        return `
            <div>
                <TK_Header props='${JSON.stringify(headerProps)}' />
                <div class="tk-card">
                    <TK_Input props='${JSON.stringify(inputProps)}' />
                    <p style="margin-top: 10px; font-size: 16px;"><strong>Email:</strong> ${TK.state.userProfile.email}</p>
                </div>
                <TK_Button props='{"text": "Save Preference to Cloud", "onClick": "ProfilePage.saveToCloud()"}' />
                <TK_Button props='{"text": "Load Preference from Cloud", "onClick": "ProfilePage.loadFromCloud()"}' />
                
                <TK_NavBar props='${JSON.stringify(navBarProps)}' />
            </div>
        `;
    }

    onLoad(props = {}) {
        // No Main/Secondary buttons needed here
        TK.mainButton.hide();
        TK.secondaryButton.hide();
        TK.backButton.hide();
    }

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
    onLeave() {}
}