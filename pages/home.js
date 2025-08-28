// pages/home.js

class HomePage extends TeleKitPage {
    constructor() {
        super();
        // Define handlers once so we can reference them for removal
        this.navigateToProfileHandler = () => TK.navigateTo('profile');
        this.showModalHandler = () => TK.components.TK_Modal.show('welcomeModal');
        this.initialDataFetched = false;
    }

    render() {
        const headerProps = { title: "TeleKit Pro" };
        const cardProps = { title: `Welcome, ${TK.state.userProfile.name}`, content: "This app demonstrates advanced TeleKit features." };
        const listProps = { items: TK.state.items };
        const modalProps = { id: "welcomeModal", title: "Hello!", content: "This is a modal component." };

        // We have removed the old in-page buttons for navigation
        return `
            <div>
                <TK_Header props='${JSON.stringify(headerProps)}' />
                <TK_Card props='${JSON.stringify(cardProps)}' />
                <h3>My Items:</h3>
                <TK_List props='${JSON.stringify(listProps)}' />
                <TK_Modal props='${JSON.stringify(modalProps)}' />
            </div>
        `;
    }

    onLoad() {
        // --- THE LISTENER FIX & NEW BUTTON SETUP ---

        // Main Button (for navigation)
        TK.mainButton.setText('View Profile');
        TK.mainButton.offClick(this.navigateToProfileHandler); // Remove old listener first
        TK.mainButton.onClick(this.navigateToProfileHandler);  // Add the new one
        TK.mainButton.show();

        // Secondary Button (for the modal)
        TK.app.SecondaryButton.setText('Show Modal');
        TK.app.SecondaryButton.offClick(this.showModalHandler); // Remove old listener first
        TK.app.SecondaryButton.onClick(this.showModalHandler);  // Add the new one
        TK.app.SecondaryButton.show();

        TK.backButton.hide();

        if (!this.initialDataFetched) {
            // We'll comment this out to prevent the API error for now
            // this.fetchInitialData();
            this.initialDataFetched = true;
        }
    }

    async fetchInitialData() {
        const data = await TK.api.request('/get-user-data');
        if (data && data.user) {
            TK.setState({ userProfile: data.user });
        }
    }

    onLeave() {
        // Correctly remove the specific handlers
        TK.mainButton.offClick(this.navigateToProfileHandler);
        TK.app.SecondaryButton.offClick(this.showModalHandler);
        // Hide the secondary button when we leave the page
        TK.app.SecondaryButton.hide();

        this.initialDataFetched = false;
    }
}