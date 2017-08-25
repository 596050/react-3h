import DOMManager from './DOMManager';
import { generateUID } from './utils';

export class ComponentBase {
  constructor(props = {}) {
    this.setProps(props);
    this.root = null;
    this.id = generateUID();
  }

  setProps(props) {
    this.props = Object.freeze(Object.assign({},props));
  }

  injectID(html) {
    let foundFirstTag = false;
    let spaceIndex = -1;
    for (let i = 0; i < html.length; i++ ) {
      const ch = html.charAt(i);
      if (foundFirstTag) {
        if (ch === ' ' || ch === '>') {
          spaceIndex = i;
          break;
        }
      } else if (ch === '<') {
        foundFirstTag = true;
      }
    }
    return `${html.substring(0,spaceIndex)} data-id="${this.id}"${html.substring(spaceIndex)}`;
  }

  renderComponent(isSnapshot = false) {
    if (!this.render) {
      throw new Error('Component must implement render function');
    }
    const html = this.render() || '';

    if (isSnapshot) return html;

    const htmlWithUniqueId = this.injectID(html);
    DOMManager.registerForRendered(() => {
      this.root = document.querySelector(`[data-id="${this.id}"]`);
      if (typeof this.componentWasRendered === 'function') {
        this.componentWasRendered();
      }
    });
    return htmlWithUniqueId;
  }

  _componentWasMounted() {
    this.root = document.querySelector(`[data-id="${this.id}"]`);
    if (typeof this.componentWasMounted === 'function') {
      this.componentWasMounted();
    }
  }

  _componentWasUnmounted() {
    this.root = null;
    if (typeof this.componentWasUnmounted === 'function') {
      this.componentWasUnmounted();
    }
  }

  setState(obj) {
    if (!this.state) {
      this.state = Object.freeze(Object.assign({},obj));
    } else {
      this.state = Object.freeze(Object.assign({},this.state,obj));
    }
    this.forceRender();
  }

  forceRender() {
    DOMManager.refresh();
  }

  getRootElement() {
    return this.root;
  }

  find(selector) {
    return this.getRootElement().querySelector(selector);
  }
}

ComponentBase.isComponent = true;
