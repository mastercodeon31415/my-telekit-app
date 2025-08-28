class HomePage extends TeleKitPage {
    constructor(tk) {
        super(tk); // Pass tk to the parent
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
        this.mainButton.setText('Add Item');
        this.mainButton.offClick(this.addItemHandler);
        this.mainButton.onClick(this.addItemHandler);
        this.mainButton.show();
        this.secondaryButton.hide();
        this.backButton.hide();
        if (!this.initialDataFetched) { this.initialDataFetched = true; }
    }
    
    onLeave() {
        this.mainButton.offClick(this.addItemHandler);
        this.initialDataFetched = false;
    }
}