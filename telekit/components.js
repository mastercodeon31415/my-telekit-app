// telekit/components.js

class TK_Header extends TeleKitComponent {
    render(props = {}) {
        const title = props.title || 'Page Title';
        return `<h1 class="tk-header">${title}</h1>`;
    }
}

class TK_Button extends TeleKitComponent {
    render(props = {}) {
        const text = props.text || 'Click Me';
        const onClickAction = props.onClick || "TK.showAlert('Button clicked')";
        const className = props.className || '';
        return `<button class="tk-button ${className}" onclick="${onClickAction}">${text}</button>`;
    }
}

class TK_Card extends TeleKitComponent {
    render(props = {}) {
        const title = props.title ? `<h3 class="tk-card-title">${props.title}</h3>` : '';
        const content = props.content || 'Card content goes here.';
        return `
            <div class="tk-card">
                ${title}
                <p class="tk-card-content">${content}</p>
            </div>
        `;
    }
}

class TK_List extends TeleKitComponent {
    render(props = {}) {
        const items = props.items || [];
        const listItems = items.map(item => `<li class="tk-list-item">${item}</li>`).join('');
        return `<ul class="tk-list">${listItems}</ul>`;
    }
}

class TK_Input extends TeleKitComponent {
    render(props = {}) {
        const id = props.id || 'tk-input-' + Math.random().toString(36).substr(2, 9);
        const label = props.label || '';
        const placeholder = props.placeholder || '';
        const value = props.value || '';
        const onInput = props.onInput || '';
        const labelHtml = label ? `<label for="${id}" class="tk-input-label">${label}</label>` : '';
        return `
            <div class="tk-input-wrapper">
                ${labelHtml}
                <input type="text" id="${id}" class="tk-input" placeholder="${placeholder}" value="${value}" oninput="${onInput}"/>
            </div>
        `;
    }
}

class TK_Modal extends TeleKitComponent {
    render(props = {}) {
        const id = props.id;
        const title = props.title || 'Modal';
        const content = props.content || '';
        const closeButtonProps = JSON.stringify({
            text: "Close",
            onClick: `TK.components.TK_Modal.hide('${id}')`
        });
        return `
            <div class="tk-modal-overlay" id="${id}-overlay" onclick="TK.components.TK_Modal.hide('${id}')">
                <div class="tk-modal-content" onclick="event.stopPropagation()">
                    <h2 class="tk-modal-title">${title}</h2>
                    <p>${content}</p>
                    <TK_Button props='${closeButtonProps}' />
                </div>
            </div>
        `;
    }
    static show(id) { /* ... same as before ... */ }
    static hide(id) { /* ... same as before ... */ }
}

function registerTeleKitComponents(tkInstance) {
    // No changes here, just registering the component classes
    tkInstance.addComponent('TK_Header', new TK_Header());
    tkInstance.addComponent('TK_Button', new TK_Button());
    tkInstance.addComponent('TK_Card', new TK_Card());
    tkInstance.addComponent('TK_List', new TK_List());
    tkInstance.addComponent('TK_Input', new TK_Input());
    tkInstance.addComponent('TK_Modal', new TK_Modal());
}