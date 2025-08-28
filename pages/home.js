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
        const nav = this._c('TK_Navigation', { active: "home", title: "Home" });
        const card = this._c('TK_Card', { title: `Welcome, ${TK.state.userProfile.name}`, content: "This is the main page of the application." });
        const list = this._c('TK_List', { items: TK.state.items });

        return this._render(`
            <div>
                ${nav}
                ${card}
                <h3>My Items:</h3>
                ${list}
            </div>
        `);
    }

    onLoad() {
        TK.mainButton.setText('Add Item');
        TK.mainButton.offClick(this.addItemHandler);
        TK.mainButton.onClick(this.addItemHandler);
        TK.mainButton.show();
        TK.secondaryButton.hide();
        TK.backButton.hide();
        if (!this.initialDataFetched) { this.initialDataFetched = true; }
    }
    
    onLeave() {
        TK.mainButton.offClick(this.addItemHandler);
        this.initialDataFetched = false;
    }
}