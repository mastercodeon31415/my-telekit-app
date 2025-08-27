class HomePage extends TeleKitPage {
    render() {
        // --- CORRECTED PART ---
        // Build props as JavaScript objects first.
        const headerProps = {
            title: "TeleKit Pro"
        };
        const cardProps = {
            title: `Welcome, ${TK.state.userProfile.name}`,
            content: "This app demonstrates advanced TeleKit features."
        };
        const viewProfileButtonProps = {
            text: "View Profile",
            onClick: "TK.navigateTo('profile')" // Use single quotes for strings inside the action
        };
        const showModalButtonProps = {
            text: "Show Welcome Modal",
            onClick: "TK.components.TK_Modal.show('welcomeModal')" // Use single quotes here too
        };
        const listProps = {
            items: TK.state.items
        };
        const modalProps = {
            id: "welcomeModal",
            title: "Hello!",
            content: "This is a modal component."
        };

        // Now, safely stringify the objects into the component tags.
        return `
            <div>
                <TK_Header props='${JSON.stringify(headerProps)}' />
                
                <TK_Card props='${JSON.stringify(cardProps)}' />
                
                <TK_Button props='${JSON.stringify(viewProfileButtonProps)}' />
                <TK_Button props='${JSON.stringify(showModalButtonProps)}' />

                <h3>My Items:</h3>
                <TK_List props='${JSON.stringify(listProps)}' />

                <TK_Modal props='${JSON.stringify(modalProps)}' />
            </div>
        `;
    }

    onLoad() {
        TK.mainButton.setText('Add Item').show().onClick(() => {
            const newItem = `Item ${TK.state.items.length + 1}`;
            TK.setState({ items: [...TK.state.items, newItem] });
            TK.hapticFeedback.notificationOccurred('success');
        });

        TK.backButton.hide();
        
        this.fetchInitialData();
    }

    async fetchInitialData() {
        const data = await TK.api.request('/get-user-data');
        if (data && data.user) {
            TK.setState({ userProfile: data.user });
        }
    }

    onLeave() {
        // It's good practice to clear the Main Button's specific handler when leaving a page.
        TK.mainButton.offClick();
    }
}