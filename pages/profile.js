class ProfilePage extends TeleKitPage {
    render() {
        // Prepare props for the TK_Input component
        const inputProps = {
            id: 'name-input',
            label: 'User Name',
            value: TK.state.userProfile.name,
            onInput: 'ProfilePage.updateName(this.value)'
        };

        return `
            <div>
                <TK_Header props='{"title": "TeleKit Pro"}' />
                
                <TK_Card props='{"title": "Welcome, ${TK.state.userProfile.name}", "content": "This app demonstrates advanced TeleKit features."}' />
                
                <!-- FIX: Use single quotes inside the onClick string -->
                <TK_Button props='{"text": "View Profile", "onClick": "TK.navigateTo(\'profile\')"}' />
                <TK_Button props='{"text": "Show Welcome Modal", "onClick": "TK.components.TK_Modal.show(\'welcomeModal\')"}' />

                <h3>My Items:</h3>
                <TK_List props='{"items": ${itemsJson}}' />

                <TK_Modal props='{"id": "welcomeModal", "title": "Hello!", "content": "This is a modal component."}' />
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
        TK.mainButton.offClick(this.onLoad);
        TK.backButton.offClick(this.onLoad);
    }
}