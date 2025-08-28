class AboutPage extends TeleKitPage {
        constructor(tk) {
        super(tk); // Pass tk to the parent
		}

    render(props = {}) {
        const nav = this._c('TK_Navigation', { active: "about", title: "About This App" });
        const card = this._c('TK_Card', { title: "TeleKit Pro Framework", content: "This application is a demonstration of the TeleKit Pro framework for building modern Telegram Mini Apps." });

        return this._render(`
            <div>
                ${nav}
                ${card}
            </div>
        `);
    }

    onLoad(props = {}) {
        this.mainButton.hide();
        this.secondaryButton.hide();
        this.backButton.hide();
    }
    
    onLeave() {}
}