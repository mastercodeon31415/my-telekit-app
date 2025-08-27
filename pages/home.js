class HomePage extends TeleKitPage {
    render() {
        // Accessing global state to render the list
        const itemsJson = JSON.stringify(TK.state.items);

        return `
            <div>
                <!-- Component Nesting Example -->
                <TK_Header props='{"title": "TeleKit Pro With CSS NOW!"}' />
                
                <TK_Card props='{"title": "Welcome, ${TK.state.userProfile.name}", "content": "This app demonstrates advanced TeleKit features."}' />
                
                <TK_Button props='{"text": "View Profile", "onClick": "TK.navigateTo(\\"profile\\")"}' />
                <TK_Button props='{"text": "Show Welcome Modal", "onClick": "TK.components.TK_Modal.show(\\"welcomeModal\\")"}' />

                <h3>My Items:</h3>
                <TK_List props='{"items": ${itemsJson}}' />

                <!-- Modal is defined here but hidden by default -->
                <TK_Modal props='{"id": "welcomeModal", "title": "Hello!", "content": "This is a modal component."}' />
            </div>
        `;
    }

    onLoad() {
        TK.mainButton.setText('Add Item').show().onClick(() => {
            const newItem = `Item ${TK.state.items.length + 1}`;
            // Update the global state, which will trigger a re-render
            TK.setState({ items: [...TK.state.items, newItem] });
            TK.hapticFeedback.notificationOccurred('success');
        });

        TK.backButton.hide();
        
        // Example of fetching data from the backend
        this.fetchInitialData();
    }

    async fetchInitialData() {
        // Using the built-in API utility
        const data = await TK.api.request('/get-user-data');
        if (data && data.user) {
            // Update state with data from backend
            TK.setState({ userProfile: data.user });
        }
    }

    onLeave() {
        TK.mainButton.offClick(this.onLoad); // Clean up listener
    }
}