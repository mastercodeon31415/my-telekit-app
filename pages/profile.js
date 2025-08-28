// pages/profile.js

class ProfilePage extends TeleKitPage {
    constructor() {
        super();
        this.goHomeHandler = () => TK.navigateTo('home');
    }

    render(props = {}) {
        const headerProps = { title: "User Profile" };
        const inputProps = { id: 'name-input', label: 'User Name', value: TK.state.userProfile.name, onInput: 'ProfilePage.updateName(this.value)' };
        const saveButtonProps = { text: "Save Preference to Cloud", onClick: "ProfilePage.saveToCloud()" };
        const loadButtonProps = { text: "Load Preference from Cloud", onClick: "ProfilePage.loadFromCloud()" };

        return `
            <div>
                <TK_Header props='${JSON.stringify(headerProps)}' />
                <div class="tk-card">
                    <TK_Input props='${JSON.stringify(inputProps)}' />
                    <p style="margin-top: 10px; font-size: 16px;"><strong>Email:</strong> ${TK.state.userProfile.email}</p>
                </div>
                <TK_Button props='${JSON.stringify(saveButtonProps)}' />
                <TK_Button props='${JSON.stringify(loadButtonProps)}' />
            </div>
        `;
    }

    onLoad(props = {}) {
        TK.mainButton.setText('Go Home').show();
        TK.mainButton.onClick(this.goHomeHandler);

        TK.backButton.show();
        // --- THIS IS THE FIX ---
        TK.backButton.onClick(this.goHomeHandler); // Corrected from goHomeHomeHandler
    }

    static updateName(newName) {
        TK.setState({ userProfile: { ...TK.alue) {
                TK.showAlert(`Loaded "${value}" from cloud.`);
                ProfilePage.updateName(value);
            } else {
                TK.showAlert(`Could not load from cloud: ${err || 'No value set'}`);
            }
        });
    }

    onLeave() {
        TK.mainButton.offClick(this.goHomeHandler);
        TK.backButton.offClick(this.goHomeHandler);
    }
}