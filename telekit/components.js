class TK_Header extends TeleKitComponent {
    render() {
        const title = this.props.title || 'Page Title';
        return `<h1 class="tk-header">${title}</h1>`;
    }
}

class TK_Button extends TeleKitComponent {
    render() {
        const text = this.props.text || 'Click Me';
        const onClickAction = this.props.onClick || "TK.showAlert('Button clicked')";
        const className = this.props.className || '';
        return `<button class="tk-button ${className}" onclick="${onClickAction}">${text}</button>`;
    }
}

class TK_Card extends TeleKitComponent {
    render() {
        const title = this.props.title ? `<h3 class="tk-card-title">${this.props.title}</h3>` : '';
        const content = this.props.content || 'Card content goes here.';
        return `
            <div class="tk-card">
                ${title}
                <p class="tk-card-content">${content}</p>
            </div>
        `;
    }
}

class TK_List extends TeleKitComponent {
    render() {
        const items = this.props.items || [];
        const listItems = items.map(item => `<li class="tk-list-item">${item}</li>`).join('');
        return `<ul class="tk-list">${listItems}</ul>`;
    }
}

class TK_Modal extends TeleKitComponent {
    render() {
        const id = this.props.id;
        const title = this.props.title || 'Modal';
        const content = this.props.content || '';
        // The modal is hidden by default and controlled by its methods
        return `
            <div class="tk-modal-overlay" id="${id}-overlay" onclick="TK.components.TK_Modal.hide('${id}')">
                <div class="tk-modal-content" onclick="event.stopPropagation()">
                    <h2 class="tk-modal-title">${title}</h2>
                    <p>${content}</p>
                    <button onclick="TK.components.TK_Modal.hide('${id}')">Close</button>
                </div>
            </div>
        `;
    }
    
    // Static methods to control any modal by its ID
    static show(id) {
        document.getElementById(`${id}-overlay`).style.display = 'flex';
        TK.hapticFeedback.impactOccurred('light');
    }

    static hide(id) {
        document.getElementById(`${id}-overlay`).style.display = 'none';
    }
}

// Helper function to register all components at once
function registerTeleKitComponents(tkInstance) {
    tkInstance.addComponent('TK_Header', new TK_Header());
    tkInstance.addComponent('TK_Button', new TK_Button());
    tkInstance.addComponent('TK_Card', new TK_Card());
    tkInstance.addComponent('TK_List', new TK_List());
    tkInstance.addComponent('TK_Modal', new TK_Modal()); // Register the class for its static methods
}