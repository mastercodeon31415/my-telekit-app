// pages/home.js

class HomePage extends TeleKitPage {
    constructor() {
        super();
        this.addItemHandler = () => {
             const newItem = `Item ${TK.state.items.length + 1}`;
             TK.setState({ items: [...TK.state.items, newItem] });
             TK.hapticFeedback.notificationOccurred('success');
        }
        this.initialDataFetched = false;
    }

    render() {
        const headerProps = { title: "Home" }; // Changed title for clarity
        const cardProps = { title: `Welcome, ${TK.state.userProfile.name}`, content: "This is the main page of the application." };
        const listProps = { items: TK.state.items };
        const navBarProps = { active: "home", title: "Home" };

        return `
            <div>
				<TK_Navigation props='${JSON.stringify(navBarProps)}' />
                <TK_Header props='${JSON.stringify(headerProps)}' />
                <TK_Card props='${JSON.stringify(cardProps)}' />
                <h3>My Items:</h3>
                <TK_List props='${JSON.stringify(listProps)}' />
            </div>
        `;
    }

    onLoad() {
        // The Main Button is now for page-specific actions, not navigation
        TK.mainButton.setText('Add Item');
        TK.mainButton.offClick(this.addItemHandler); // Always remove before adding
        TK.mainButton.onClick(this.addItemHandler);
        TK.mainButton.show();

        // Hide other native buttons
        TK.secondaryButton.hide();
        TK.backButton.hide();

        if (!this.initialDataFetched) {
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
        // Clean up page-specific listeners
        TK.mainButton.offClick(this.addItemHandler);
        this.initialDataFetched = false;
    }
}