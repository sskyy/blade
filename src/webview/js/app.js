import React, { Component } from 'react';
import { sendAction } from 'actions/bridge';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import sketchLogo from 'assets/sketch-logo.svg';
import 'styles/index.scss';

const mapStateToProps = state => {
  return {
    actions: state.bridge.actions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendAction: (name, payload) => dispatch(sendAction(name, payload))
  };
};

@connect(mapStateToProps, mapDispatchToProps)
@autobind
export default class App extends Component {
  sendMessage () {
    this.props.sendAction('foo', {foo: 'bar'});
  }

  render () {
    return (
      <div className="app">
        <img className='logo' src={sketchLogo} width={100} />
        <h1>Sketch Plugin Boilerplate</h1>
        <div className="app-content">
          <p>To get started, edit <code>src/webview/js/app.js</code> and save to reload.</p>
          <p><button onClick={this.sendMessage}>Send Action</button></p>
          {this.props.actions.map(action => {
            return <pre>{JSON.stringify(action, null, 2)}</pre>;
          })}
        </div>
      </div>
    );
  }
}
