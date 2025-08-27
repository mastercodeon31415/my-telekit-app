// pages/home.js

class HomePage extends TeleKitPage {
    constructor() {
        super();
        // Define the handler once so we can reference it for removal
        this.mainButtonHandler = this.handleAddItem.bind(this);
    }
    
    handleAddItem() {
        const newItem = `Item ${TK.state.items.length + 1}`;
        TK.setState({ items: [...TK.state.items, newItem] });
        TK.hapticFeedback.notificationOccurred('success');
    }

    render() {
        // This render logic is already correct from our last fix
        const headerProps = { title: "TeleKit Pro" };
        const cardProps = { title: `Welcome, ${TK.state.userProfile.name}`, content: "This app demonstrates advanced TeleKit features." };
        const viewProfileButtonProps = { text: "View Profile", onClick: "TK.navigateTo('profile')" };
        const showModalButtonProps = { text: "Show Welcome Modal", onClick: "TK.components.TK_Modal.show('welcomeModal')" };
        const listProps = { items: TK.state.items };
        const modalProps = { id: "welcomeModal", title: "Hello!", content: "This is a modal component." };

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
        TK.mainButton.setText('Add Item').show();
        // Add the named handler
        TK.mainButton.onClick(this.mainButtonHandler);

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
        // Correctly remove the specific handler
        TK.mainButton.offClick(this.mainButtonHandler);
    }
}