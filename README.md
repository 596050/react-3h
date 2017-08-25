# react-3h
A simple implementation of React which I built in 3 hours for a job interview. 
 
## Motivation  
 As part of a job interview I was requested to implement a simple web app that displays real-time information in a table. 
 I was requested not to use any frameworks and use only plain vanilla Javascript. TO make it a bit more interesting, 
 I decided to implement a very simple version of React. It took me 2 hours to develop it, hence the name. 
 
 I was so happy with the result that I decided to open-source it. 
 
## Install
```
$ npm install react-3h --save
```

## Documentation
First I want to explain the basic concept of this implementation. The main idea behind this implementation is that
components return html string, and it is all being compiled into a huge html string, that is being dumped into a given
root element as `innerHTML`. This is a very simple implementation, but very inefficient. To make it a ittle better, I thought
about implementing a very simple virtual DOM, or some mechainsm to compare DOM fragments and update it accordingly. Since 
I didn't want to put too much time into this job interview excercise, this was out of scope. Maybe I wil implement this
later, again, just for fun. 

While this approach is not for production, it might be relevant for server-side-rendering using node. The benefits of this
framework is that it is very light, and do not rely on any external dependencies. 

The whole framework is composed out of two modules: `DOMManager` and `ComponentBase`.

### DOMManager
This a singelton class which is responsible to manage the actual rendering and to preserve instances of components. 
 It expose the following functions:
  
#### `renderApp(rootSelector, component, props)`
This is the main function which you need to call to instantiate a `react-3h` app. 
- `rootSelector: string` - query selector to the app main root element. 
- `component: Component` - Component class which derives from `Component`.
- `props: Object` - props to be set to the app. 

#### `setAppProps(props)`
The App props can be used like a store for the entire app. You can update these props using this function. Calling this method
will trigger a render action, which will render the entire app.
 
#### `renderComponent(compoennt, key, props, children)`
 This method takes a component and generate an HTML for it. 
 - `component: Function | Component` - the component to render. Components can be either stateless function or a class
 component. 
 - `key: string` - since it was a bit challenge to associate an instance of a component to its actual DOM, i decided
 to simplify it and require a unique key for each component instance, so I will know to match them. It is actually only important for
 components who preserve state. 
 - `props: Object` - the component props. You can access them using `this.props` like in react. 
 - `children: string` - children of the component. You can access it using `this.props.children` like in react. 
 
#### `renderComponentSnapshot(component, props, children)`
 This is a helper function to render a component for testing purposes, to get the component html string, without invoking all 
 the internal mechinism for components. It can be used with `jest`, for example:
 
```
test('Component can be rendered correctly', () => {
  expect(DOMManager.renderComponentSnapshot(MyComponent)).toMatchSnapshot();
});
```
### Component
Like in react, a component can wither be a stateless function or a stateful class. If you implement a stateless function all you
need to do is to define a function that gets `props` and return html string. 

Here is an example:
```
// Title.js
export default ({ children, className }) => `<h1 class="${className}">${children}</h1>`;
```

In case you need a stateful component you need to derive from the `Component` class and at least implement the `render` method 
which return an html string. 

First you need to extend `Component`:
```
import { Component } from 'react-3h';

class Loading extends Component {}
```

Like in react there are also familiar concepts that are available:
- `this.props`  will give you access to the props. 
- `this.props.children` - will give you access to the children of this component that needs to be rendered (this is a string)
- `componentWasRendered` - if you implement this function it will be called after each render. After this function call you can use `getRootElement` and `find`
- `getRootElement` - return the dom element of the root of the component. This is only available after `componentWasRendered` or `componentWasMounted`. **caution: you should not 
store the reference to the DOM element since it is changed after each render**
- `find` - executing `querySelector` from the `getRootElement` method to find some element inside the component. 
- `componentWasMounted` - if you implement this function it will be called when the component was mounted. 
- `componentWasUnmounted` - if you implement this funciton it will be called after the component was unmounted.
- `setState` - allows you to update the state of the component. After caling this method it will trigger a render of the whole app. 

## Example
Lets see an example of a simple app

**app.js**
```
import { Component, renderComponent, renderApp, setAppProps } from 'react-3h';
import Loading from './components/Loading';
import Title from  './components/Title';
import Status from './components/Status';

const store = {
  wasInit: false,
  data: {},
};

class App extends Component {
  render() {
    return `
      <div class="content">
        ${renderComponent(Title,"main-title",{}, `
          <span>${children}${renderComponent(Status, 'status')}</span>
        `)}
        ${this.renderContent()}
      </div>
    `;
  }

  renderContent() {
    const { wasInit } = this.props;

    if (!wasInit) {
      return renderComponent(Loading, "loading");
    }

    return `
      <div>
        ${renderComponent(Content, "content", { data: this.props.data })}
      </div>
    `;
  }
}

renderApp("#root", App, store);

fetch('/data').then(response => response.json).then(data => {
  store.wasInit = true;
  store.data = data;
  setAppProps(store);
});

```


**Loading.js**
```
import { Component } from 'react-3h';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: '...',
    };
  }

  render() {
    return `<h1>Loading${this.state.dots}</h1>`;
  }

  componentWasMounted() {
    this.interval = setInterval(() => {
      let dots = `${this.state.dots}.`;
      if (dots.length > 3) {
        dots = '.';
      }
      this.setState({dots});
    }, 1000);
  }

  componentWasUnmounted() {
    clearInterval(this.interval);
  }
}

export default Loading;
```

**Title.js**
```
export default ({ children, className }) => `<h1 class="${className}">${children}</h1>`;
```
