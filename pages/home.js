class HomePage extends TeleKitPage {
        addItemHandler = () => {
             const newItem = `Item ${TK.state.items.length + 1}`;
             TK.setState({ items: [...TK.state.items, newItem] });
             TK.hapticFeedback.notificationOccurred('success');
        }
        initialDataFetched = false;
    

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
        this.tk.mainButton.setText('Add Item');
        this.tk.mainButton.offClick(this.addItemHandler);
        this.tk.mainButton.onClick(this.addItemHandler);
        this.tk.mainButton.show();
        this.tk.secondaryButton.hide();
        this.tk.backButton.hide();
        if (!this.initialDataFetched) { this.initialDataFetched = true; }
    }
    
    onLeave() {
        this.tk.mainButton.offClick(this.addItemHandler);
        this.initialDataFetched = false;
    }
}