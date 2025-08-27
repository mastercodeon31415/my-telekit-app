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

class TK_Input extends TeleKitComponent {
    render() {
        const id = this.props.id || 'tk-input-' + Math.random().toString(36).substr(2, 9);
        const label = this.props.label || '';
        const placeholder = this.props.placeholder || '';
        const value = this.props.value || '';
        const onInput = this.props.onInput || '';

        const labelHtml = label ? `<label for="${id}" class="tk-input-label">${label}</label>` : '';

        return `
            <div class="tk-input-wrapper">
                ${labelHtml}
                <input
                    type="text"
                    id="${id}"
                    class="tk-input"
                    placeholder="${placeholder}"
                    value="${value}"
                    oninput="${onInput}"
                />
            </div>
        `;
    }
}

class TK_Modal extends TeleKitComponent {
    render() {
        const id = this.props.id;
        const title = this.props.title || 'Modal';
        const content = this.props.content || '';
        return `
            <div class="tk-modal-overlay" id="${id}-overlay" onclick="TK.components.TK_Modal.hide('${id}')">
                <div class="tk-modal-content" onclick="event.stopPropagation()">
                    <h2 class="tk-modal-title">${title}</h2>
                    <p>${content}</p>
                    <TK_Button props='{"text": "Close", "onClick": "TK.components.TK_Modal.hide(\\"${id}\\")"}' />
                </div>
            </div>
        `;
    }

    static show(id) {
        const modal = document.getElementById(`${id}-overlay`);
        modal.style.display = 'flex';
        // Use a slight delay to allow the display property to apply before starting the transition
        setTimeout(() => modal.classList.add('visible'), 10);
        TK.hapticFeedback.impactOccurred('light');
    }

    static hide(id) {
        const modal = document.getElementById(`${id}-overlay`);
        modal.classList.remove('visible');
        // Wait for the transition to finish before setting display to none
        setTimeout(() => modal.style.display = 'none', 200);
    }
}

// UPDATE this function at the bottom of the file
function registerTeleKitComponents(tkInstance) {
    tkInstance.addComponent('TK_Header', new TK_Header());
    tkInstance.addComponent('TK_Button', new TK_Button());
    tkInstance.addComponent('TK_Card', new TK_Card());
    tkInstance.addComponent('TK_List', new TK_List());
    tkInstance.addComponent('TK_Input', new TK_Input()); // Add the new component
    tkInstance.addComponent('TK_Modal', new TK_Modal());
}