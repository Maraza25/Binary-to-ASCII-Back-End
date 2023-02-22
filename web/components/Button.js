class Button extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const button = document.createElement('button');
    button.setAttribute('class', 'custom-button');
    button.setAttribute('type', 'submit');
    button.setAttribute('onclick', 'submitForm(event)');

    const slot = document.createElement('slot');
    button.appendChild(slot);
    wrapper.appendChild(button);

    const buttonStyle = document.createElement('style');
    buttonStyle.textContent = `
      div {
        display: inline;
      }
      button {
          font-size: 16px;
          padding: 10px 20px;
          margin-top: 10px;
          background-color: #af4c66;
          color: #fff;
          border-radius: 5px;
          border: none;
      }
    `
    this.shadowRoot.append(buttonStyle, wrapper);
  }
}

customElements.define('custom-button', Button);