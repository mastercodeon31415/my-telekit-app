# TeleKit Framework Documentation

TeleKit is a lightweight, component-based framework designed to simplify the development of modern, native-feeling Telegram Mini Apps. It provides a structured approach to building pages, managing state, and interacting with the Telegram Web App API, allowing developers to focus on creating features rather than boilerplate code.

This documentation will guide you through the core concepts, components, and functionalities of the TeleKit framework, using the provided example application as a reference.

## Table of Contents
1.  [Getting Started](#1-getting-started)
    *   [Project Structure](#project-structure)
    *   [Core Files](#core-files)
2.  [Framework Initialization](#2-framework-initialization)
    *   [Configuration](#configuration)
    *   [Registering Pages & Components](#registering-pages--components)
3.  [The Core: `TeleKit.js`](#3-the-core-telekitjs)
    *   [State Management](#state-management)
    *   [Navigation](#navigation)
    *   [Telegram API Wrappers](#telegram-api-wrappers)
4.  [Creating Pages](#4-creating-pages)
    *   [Page Lifecycle](#page-lifecycle)
    *   [Rendering Components](#rendering-components)
5.  [UI Components](#5-ui-components)
    *   [`TK_Navigation`](#tk_navigation)
    *   [`TK_Card`](#tk_card)
    *   [`TK_List`](#tk_list)
    *   [`TK_Button`](#tk_button)
    *   [`TK_Input`](#tk_input)
    *   [`TK_Toggle`](#tk_toggle)
    *   [`TK_Checkbox`](#tk_checkbox)
    *   [`TK_Select`](#tk_select)
6.  [Styling Your App](#6-styling-your-app)

---

## 1. Getting Started

### Project Structure
A typical TeleKit application follows a simple and organized folder structure.

```
/
├── index.html              # Main entry point of the app
├── telekit/
│   ├── telekit.js          # Core framework logic
│   ├── components.js       # UI component definitions
│   └── telekit.css         # Core styles for the framework
└── pages/
    ├── home.js             # Logic for the Home page
    ├── profile.js          # Logic for the Profile page
    ├── settings.js         # Logic for the Settings page
    └── about.js            # Logic for the About page
```

### Core Files

*   **`index.html`**: The main HTML file that loads the Telegram Web App script, the TeleKit framework, all pages, and initializes the application.
*   **`telekit/telekit.js`**: The heart of the framework. It contains the `TeleKit` class which manages state, navigation, API interactions, and page rendering. It also defines the base classes `TeleKitPage` and `TeleKitComponent`.
*   **`telekit/components.js`**: Contains the definitions for all standard UI components available in the framework (e.g., Cards, Lists, Buttons).
*   **`telekit/telekit.css`**: Provides the default styling for all framework components, utilizing Telegram's theme variables for a native look and feel that adapts to dark/light modes.
*   **`pages/*.js`**: Each file in this directory defines a page class that extends `TeleKitPage`. This is where the layout and logic for each screen of your app reside.

---

## 2. Framework Initialization

Everything starts in `index.html`. Here, you initialize the TeleKit framework and configure your application. The initialization script should be placed within a `DOMContentLoaded` event listener.

```html
<!-- App Initialization -->
<script>
    document.addEventListener('DOMContentLoaded', () => {
    
        // Initialize TeleKit with a global state and API URL
        const TK = new TeleKit({
            // CHOOSE YOUR NAVIGATION STYLE HERE: 'drawer' or 'bar'
            navStyle: 'drawer', 
            
            // Your Bot's backend API URL
            apiBaseUrl: 'https://your-backend.com/api', 
            // Initial global state
            state: {
                userProfile: {
                    name: 'Guest',
                    email: 'Not set'
                },
                items: ['Item 1', 'Item 2', 'Item 3'],
                
                // --- SETTINGS OBJECT --- 
                settings: {
                    enableNotifications: true,
                    showPreviews: false,
                    language: 'en'
                }
            }
        });

        // Make TK globally accessible
        window.TK = TK;

        // Register components
        registerTeleKitComponents(TK);

        // Register pages
        TK.addPage('home', HomePage);
        TK.addPage('profile', ProfilePage);
        TK.addPage('settings', SettingsPage);
        TK.addPage('about', AboutPage);
        
        // Set the initial page
        TK.navigateTo('home');
        
        // ... initial data loading ...
    });
</script>
```

### Configuration

When creating a new `TeleKit` instance, you can pass a configuration object with the following properties:

*   **`navStyle`** (String): Determines the primary navigation UI. Can be set to `'drawer'` for a hamburger menu and side panel, or `'bar'` for a bottom tab bar.
*   **`apiBaseUrl`** (String): The base URL for your bot's backend API. The framework includes a helper for making authenticated requests.
*   **`state`** (Object): The initial global state of your application. This object holds all the data that your UI will react to.

### Registering Pages & Components

*   **`registerTeleKitComponents(TK)`**: This function, found in `components.js`, registers all the standard UI components with your TeleKit instance, making them available for use in your pages.
*   **`TK.addPage('name', PageClass)`**: Use this method to register each of your page classes. The first argument is a unique string identifier for the page, and the second is the class name itself.
*   **`TK.navigateTo('name')`**: After registering your pages, call this method to render the initial page that the user will see.

---

## 3. The Core: `TeleKit.js`

The `TeleKit` class is the central controller of your app. It is instantiated once and made globally available as `window.TK`.

### State Management

TeleKit includes a simple and powerful reactive state management system.

*   **Accessing State**: You can access the global state from any page or component via `TK.state`. For example: `TK.state.userProfile.name`.
*   **Updating State**: To update the state, use the `TK.setState()` method. This method takes an object with the keys you want to update.

When you call `TK.setState()`, the framework **automatically re-renders the current page**, ensuring your UI always reflects the latest data.

**Example from `profile.js`:** The `updateName` function is called by the `onInput` event of the `TK_Input` component. It updates the `userProfile` object in the global state.

```javascript
static updateName(newName) {
    // Merges the new name into the existing userProfile object
    TK.setState({ userProfile: { ...TK.state.userProfile, name: newName } });
}
```

### Navigation

Navigation between pages is handled by a single method:

*   **`TK.navigateTo(pageName, props = {})`**: Call this method to switch to a different page.
    *   `pageName` (String): The string identifier you used when registering the page with `addPage`.
    *   `props` (Object, Optional): An object of properties to pass to the new page's `onLoad` method.

**Example from `components.js` (TK_NavBar):** The navigation bar uses `TK.navigateTo` to switch pages when a button is clicked.

```javascript
// ...
return `
    <button class="tk-navbar-button ${activeClass}" onclick="TK.navigateTo('${tab.id}')">
        <span>${tab.label}</span>
    </button>
`;
//...
```

### Telegram API Wrappers

TeleKit provides convenient getters to access the various parts of the official `Telegram.WebApp` object, making your code cleaner and more readable.

| TeleKit Getter         | Telegram API Object           | Description                                                                 |
| ---------------------- | ----------------------------- | --------------------------------------------------------------------------- |
| `TK.mainButton`        | `Telegram.WebApp.MainButton`  | Controls the main button at the bottom of the screen.                       |
| `TK.backButton`        | `Telegram.WebApp.BackButton`  | Controls the back button in the header.                                     |
| `TK.secondaryButton`   | `Telegram.WebApp.SecondaryButton` | Controls the secondary button at the bottom of the screen.                |
| `TK.hapticFeedback`    | `Telegram.WebApp.HapticFeedback` | Triggers native device haptics for feedback.                                |
| `TK.cloudStorage`      | `Telegram.WebApp.CloudStorage` | Saves and retrieves data from Telegram's cross-device cloud storage.        |
| `TK.showAlert()`       | `Telegram.WebApp.showAlert()` | Shows a simple native alert popup.                                          |
| `TK.showConfirm()`     | `Telegram.WebApp.showConfirm()` | Shows a native confirmation popup with OK/Cancel buttons.                   |

**Example from `home.js`:** The main button is configured in the `onLoad` lifecycle method.

```javascript
onLoad() {
    this.tk.mainButton.setText('Add Item');
    this.tk.mainButton.onClick(this.addItemHandler);
    this.tk.mainButton.show();
}
```

**Example from `profile.js`:** Using Cloud Storage to save and load user data.

```javascript
static saveToCloud() {
    const profileJson = JSON.stringify(TK.state.userProfile);
    TK.cloudStorage.setItem('user_profile', profileJson, (err, success) => {
        if (success) {
            TK.showAlert('Profile saved to cloud storage!');
            TK.hapticFeedback.notificationOccurred('success');
        } else {
            TK.showAlert(`Error saving profile: ${err}`);
        }
    });
}
```

---

## 4. Creating Pages

Every screen in your app is a "Page". Pages are JavaScript classes that extend the `TeleKitPage` base class.

```javascript
// pages/about.js

class AboutPage extends TeleKitPage {

    render(props = {}) {
        // ... render logic ...
    }

    onLoad(props = {}) {
        // ... runs when the page is navigated to ...
    }
    
    onLeave() {
        // ... runs when navigating away from the page ...
    }
}
```

### Page Lifecycle

Pages have three primary lifecycle methods you can override:

*   **`render(props = {})`**: This is a required method. It must return the HTML structure of your page. This method is called every time the state changes.
*   **`onLoad(props = {})`**: This method is called **once** when the page is first navigated to. It's the ideal place to set up Main/Back buttons, fetch initial data for the page, or perform other one-time setup tasks.
*   **`onLeave()`**: This method is called **once** when you navigate *away* from the page. It's useful for cleaning up event listeners to prevent memory leaks, especially for the Main Button.

**Example from `home.js`:** Note how the click handler for the main button is added in `onLoad` and removed in `onLeave`.

```javascript
class HomePage extends TeleKitPage {
    addItemHandler = () => {
         const newItem = `Item ${TK.state.items.length + 1}`;
         TK.setState({ items: [...TK.state.items, newItem] });
         TK.hapticFeedback.notificationOccurred('success');
    }

    onLoad() {
        this.tk.mainButton.setText('Add Item');
        // Add the handler
        this.tk.mainButton.onClick(this.addItemHandler);
        this.tk.mainButton.show();
    }
    
    onLeave() {
        // Remove the handler to prevent it from firing on other pages
        this.tk.mainButton.offClick(this.addItemHandler);
    }
    
    // ... render method ...
}
```

### Rendering Components

Inside the `render` method, you build your page's UI. To include a TeleKit component, you use the `this._c()` helper method.

*   **`this._c(componentName, props = {})`**: This method registers a placeholder for a component.
    *   `componentName` (String): The name of the component class (e.g., `'TK_Card'`).
    *   `props` (Object): An object containing the properties to pass to the component.

The `render` method must wrap its final HTML output in `this._render()`. This allows the framework to correctly replace the component placeholders with the rendered component HTML.

**Example from `about.js`:**

```javascript
render(props = {}) {
    // Create placeholders for navigation and a card
    const nav = this._c('TK_Navigation', { active: "about", title: "About This App" });
    const card = this._c('TK_Card', { title: "TeleKit Framework", content: "This application is a demonstration of the TeleKit framework..." });

    // Combine them into a final layout and return it
    return this._render(`
        <div>
            ${nav}
            ${card}
        </div>
    `);
}
```

---

## 5. UI Components

TeleKit comes with a set of pre-built, styleable UI components that automatically adapt to the user's Telegram theme.

### `TK_Navigation`
Provides the main navigation UI for the app. Its appearance is controlled by the `navStyle` option in the main `TeleKit` config.

*   **Props**:
    *   `active` (String): The ID of the currently active page (e.g., 'home', 'profile'). This is used to highlight the correct link.
    *   `title` (String): If using the 'drawer' style, this sets the title in the top bar.

*   **Usage (`home.js`)**:
    ```javascript
    const nav = this._c('TK_Navigation', { active: "home", title: "Home" });
    ```

### `TK_Card`
A styled container for grouping related content.

*   **Props**:
    *   `title` (String, Optional): The title displayed at the top of the card.
    *   `content` (String): The main text content inside the card.

*   **Usage (`home.js`)**:
    ```javascript
    const card = this._c('TK_Card', { title: `Welcome, ${TK.state.userProfile.name}`, content: "Welcome to the first ever TeleKit app!" });
    ```

### `TK_List`
Renders a styled list of items.

*   **Props**:
    *   `items` (Array of Strings): An array of strings to be rendered as list items.

*   **Usage (`home.js`)**:
    ```javascript
    const list = this._c('TK_List', { items: TK.state.items });
    ```

### `TK_Button`
A standard, full-width button.

*   **Props**:
    *   `text` (String): The text displayed on the button.
    *   `onClick` (String): A string of JavaScript code to be executed when the button is clicked.

*   **Usage (`profile.js`)**:
    ```javascript
    const saveButton = this._c('TK_Button', { text: "Save Profile to Cloud", onClick: "ProfilePage.saveToCloud()" });
    ```

### `TK_Input`
A labeled text input field.

*   **Props**:
    *   `id` (String): A unique ID for the input element, necessary for focus management.
    *   `label` (String, Optional): A label displayed above the input field.
    *   `value` (String): The current value of the input.
    *   `onInput` (String): A string of JavaScript to execute on the `oninput` event (fires instantly as the user types).
    *   `onChange` (String): A string of JavaScript to execute on the `onchange` event (fires when the input loses focus).

*   **Usage (`profile.js`)**:
    ```javascript
    const input = this._c('TK_Input', { 
        id: 'name-input', 
        label: 'User Name', 
        value: this.tk.state.userProfile.name, 
        // Calls a static method on the ProfilePage class
        onInput: 'ProfilePage.updateName(this.value)' 
    });
    ```

### `TK_Toggle`
A classic on/off slider switch.

*   **Props**:
    *   `label` (String): Text displayed next to the toggle.
    *   `checked` (Boolean): Determines if the toggle is in the "on" state.
    *   `onChange` (String): JavaScript string to execute when the toggle is flipped. The new state is available via `this.checked`.

*   **Usage (`settings.js`)**:
    ```javascript
    const notificationToggle = this._c('TK_Toggle', {
        label: "Enable Notifications",
        checked: TK.state.settings.enableNotifications,
        onChange: "SettingsPage.handleSettingChange('enableNotifications', this.checked)"
    });
    ```

### `TK_Checkbox`
A square checkbox.

*   **Props**:
    *   `label` (String): Text displayed next to the checkbox.
    *   `checked` (Boolean): Determines if the box is checked.
    *   `onChange` (String): JavaScript string to execute when the checkbox is clicked. The new state is available via `this.checked`.

*   **Usage (`settings.js`)**:
    ```javascript
    const previewsCheckbox = this._c('TK_Checkbox', {
        label: "Show Message Previews",
        checked: TK.state.settings.showPreviews,
        onChange: "SettingsPage.handleSettingChange('showPreviews', this.checked)"
    });
    ```

### `TK_Select`
A dropdown select menu.

*   **Props**:
    *   `label` (String): A label displayed above the dropdown.
    *   `selectedValue` (String): The value of the currently selected option.
    *   `onChange` (String): JavaScript string to execute when a new option is selected. The new value is available via `this.value`.
    *   `options` (Array of Objects): An array to populate the dropdown. Each object should have a `value` and a `text` property.

*   **Usage (`settings.js`)**:
    ```javascript
    const languageSelect = this._c('TK_Select', {
        label: "Language",
        selectedValue: TK.state.settings.language,
        onChange: "SettingsPage.handleSettingChange('language', this.value)",
        options: [
            { value: 'en', text: 'English' },
            { value: 'es', text: 'Español' },
            { value: 'de', text: 'Deutsch' }
        ]
    });
    ```

---

## 6. Styling Your App

The file `telekit.css` provides all the base styles. It is designed around CSS variables provided by the Telegram app, such as:

*   `var(--tg-theme-bg-color)`
*   `var(--tg-theme-text-color)`
*   `var(--tg-theme-button-color)`
*   `var(--tg-theme-secondary-bg-color)`

This ensures that all core components will automatically match the user's current Telegram theme (including light, dark, and custom themes) without any extra effort.

You can add your own CSS file to further customize the look and feel or to style your own custom components. Just be sure to link it in your `index.html`. For custom components, it's recommended to follow the existing BEM-like naming convention (e.g., `.tk-my-component`, `.tk-my-component-title`) to maintain consistency.