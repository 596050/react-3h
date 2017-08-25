import ComponentBase from '../src/ComponentBase';
import DOMManager from '../src/DOMManager';
import AppComponent from './helpers/AppComponent';

test('ComponentBase has a static property isComponent', () => {
  expect(ComponentBase.isComponent).toBe(true);
});

test('ComponentBase can be derived and rendered', () => {
  expect(DOMManager.renderComponentSnapshot(AppComponent)).toMatchSnapshot();
});