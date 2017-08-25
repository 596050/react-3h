class DOMManager {
  constructor() {
    this.mountedComponents = [];
    this.components = {};
    this.renderedCallbacks = [];
  }

  renderApp(rootSelector, component, props) {
    if (!component) {
      throw new Error('component must be provided');
    }
    if (!component.isComponent) {
      throw new Error('main component must be a component extending Component');
    }
    const element = document.querySelector(rootSelector);
    if (!element) {
      throw new Error('Root element was not found');
    }
    this.root = element;
    this.app = new component(props);
    this.refresh();
  }

  callAfterRender() {
    this.mountedComponents.forEach(instance => instance._componentWasMounted());
    this.mountedComponents = [];

    this.renderedCallbacks.forEach(fn => fn());
    this.renderedCallbacks = [];

    this.removeUnmountedComponents();
  }

  isDetached(element) {
    if (!element) return true;
    let parent = element.parentElement;
    while (parent) {
      if (parent.tagName === 'BODY') return false;
      parent = parent.parentElement;
    }
    return true;
  }

  removeUnmountedComponents() {
    Object.keys(this.components).forEach(key => {
      const component = this.components[key];
      if (this.isDetached(component.getRootElement())) {
        delete this.components[key];
        component._componentWasUnmounted();
      }
    });
  }

  refresh() {
    this.root.innerHTML = this.app.renderComponent();
    this.callAfterRender();
  }

  renderComponentSnapshot(component, props = {}, children = '') {
    return this.renderComponent(component, 'snapshot', props, children, true);
  }

  renderComponent(component, key, props = {}, children = '', isSnapshot = false) {
    if (!component) {
      throw new Error('Component must be provided');
    }
    if (!key) {
      throw new Error('a unique key must be provided for the component ', component);
    }
    const propsAndChildren = Object.assign({}, props, { children });
    let html = '';

    if (component.isComponent) {
      let instance = this.components[key];
      if (!instance) {
        instance = new component();
        if (!isSnapshot) {
          this.components[key] = instance;
          this.mountedComponents.push(instance)
        }
      }
      instance.setProps(propsAndChildren);
      html = instance.renderComponent(isSnapshot);
    } else {
      html = component(propsAndChildren);
    }
    return html || '';
  }

  setAppProps(props) {
    this.app.setProps(props);
    this.refresh();
  }

  registerForRendered(callback) {
    this.renderedCallbacks.push(callback);
  }
}

const instance = new DOMManager();

export default instance;