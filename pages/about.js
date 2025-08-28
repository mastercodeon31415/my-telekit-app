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
        const navBarProps = { active: "about" };

        return `
            <div>
                <TK_Header props='${JSON.stringify(headerProps)}' />
                <TK_Card props='${JSON.stringify(cardProps)}' />
                
                <TK_NavBar props='${JSON.stringify(navBarProps)}' />
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