// pages/about.js

class AboutPage extends TeleKitPage {
    constructor() {
        super();
    }

    render(props = {}) {
        const headerProps = { title: "About This App" };
        const cardProps = {
            title: "TeleKit Pro Framework",
            content: "This application is a demonstration of the TeleKit Pro framework for building modern Telegram Mini Apps."
        };
        const navBarProps = { active: "about", title: "About" };

        return `
            <div>
				<TK_Navigation props='${JSON.stringify(navBarProps)}' />
                <TK_Header props='${JSON.stringify(headerProps)}' />
                <TK_Card props='${JSON.stringify(cardProps)}' />
            </div>
        `;
    }

    onLoad(props = {}) {
        TK.mainButton.hide();
        TK.secondaryButton.hide();
        TK.backButton.hide();
    }

    onLeave() {}
}