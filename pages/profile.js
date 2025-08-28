// pages/profile.js

class ProfilePage extends TeleKitPage {
    // constructor is not needed
    
    render(props = {}) {
        const nav = this._c('TK_Navigation', { active: "profile", title: "User Profile" });
        const input = this._c('TK_Input', { 
            id: 'name-input', 
            label: 'User Name', 
            value: this.tk.state.userProfile.name, 
            
			// --- THIS IS THE CRITICAL FIX ---
            // We now use onchange, which only fires when the input loses focus.
            // This stops the re-render on every keystroke.
            onChange: 'ProfilePage.updateName(this.value)' 
        });
        const saveButton = this._c('TK_Button', { text: "Save Profile to Cloud", onClick: "ProfilePage.saveToCloud()" }); // Updated text
        const loadButton = this._c('TK_Button', { text: "Load Profile from Cloud", onClick: "ProfilePage.loadFromCloud()" }); // Updated text

        return this._render(`
            <div>
                ${nav}
                <div class="tk-card">
                    ${input}
                    <p style="margin-top: 10px; font-size: 16px;"><strong>Email:</strong> ${this.tk.state.userProfile.email}</p>
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
    
    static updateName(newName) {
        TK.setState({ userProfile: { ...TK.state.userProfile, name: newName } });
    }

    // --- UPGRADED SAVE FUNCTION ---
    static saveToCloud() {
        // Convert the entire userProfile object to a JSON string to save it
        const profileJson = JSON.stringify(TK.state.userProfile);
        
        TK.cloudStorage.setItem('user_profile', profileJson, (err, success) => {
            if (success) {
                TK.showAlert('Profile saved to cloud storage!');
                TK.hapticFeedback.notificationOccurred('success');
            } else {
                TK.showAlert(`Error saving profile: ${err}`);
            }
        });
    }

    // --- UPGRADED LOAD FUNCTION ---
    static loadFromCloud() {
        TK.cloudStorage.getItem('user_profile', (err, profileJson) => {
            if (err) {
                TK.showAlert(`Error loading profile: ${err}`);
                return;
            }

            if (profileJson) {
                try {
                    // Parse the JSON string back into an object
                    const savedProfile = JSON.parse(profileJson);
                    // Update the entire state with the loaded profile
                    TK.setState({ userProfile: savedProfile });
                    TK.showAlert(`Loaded profile for "${savedProfile.name}" from cloud.`);
                } catch (e) {
                    TK.showAlert('Failed to parse saved profile data.');
                }
            } else {
                TK.showAlert('No saved profile found in cloud.');
            }
        });
    }

    onLeave() {}
}