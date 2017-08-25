import { ComponentBase } from './ComponentBase';
import DOMManager from './DOMManager'

export const renderComponent = (component, key, props = {}, children = '') =>
DOMManager.renderComponent(component, key, props, children);

export const renderComponentSnapshot = (component, props = {}, children = '') =>
DOMManager.renderComponentSnapshot(component, props, children);

export const renderApp = (rootSelector, component, props) => DOMManager.renderApp(rootSelector, component, props);

export const setAppProps = (props) => DOMManager.setAppProps(props);

export const Component = ComponentBase;

