import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';

import WordCard from './components/WordCard/index.tsx';
import './index.css';

Sentry.init({
  dsn: 'https://96e555de31d14beca54976d68cf6de9a@sentry.io/1419202'
});

declare const chrome: any;

interface ChromeMessageRequest {
  word: string;
  isDefinitionLoading: boolean;
}

class App extends React.Component<any, any> {
  public readonly state = {
    definitionList: [],
    isDefinitionLoading: false,
    showWord: false,
    word: ''
  };

  public hoverTimeout = 8000;

  public componentDidMount() {
    chrome.runtime.onMessage.addListener((request: ChromeMessageRequest) => {
      const { word, definitionList, isDefinitionLoading } = request;

      const {
        isDefinitionLoading: prevLoadingState,
        word: prevWord
      } = this.state;

      if (
        (prevLoadingState && !isDefinitionLoading) ||
        (prevLoadingState === isDefinitionLoading && prevWord !== word)
      ) {
        this.onSetTimer();
      }

      if (request) {
        this.setState({
          definitionList,
          isDefinitionLoading,
          showWord: true,
          word
        });
      }
    });
  }

  public onSetTimer = (timeout = this.hoverTimeout) => {
    clearTimeout(this.timerId);

    this.timerId = setTimeout(() => {
      this.setState({
        showWord: false
      });
    }, this.hoverTimeout);
  };

  public onCloseClick = () =>
    this.setState({
      showWord: false
    });

  public onMouseEnter = () => {
    clearTimeout(this.timerId);
  };

  public onMouseLeave = () => {
    this.onSetTimer(5000);
  };

  public render() {
    const { showWord, word, definitionList, isDefinitionLoading } = this.state;

    if (!showWord) return null;

    return (
      <div onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter}>
        <WordCard
          word={word}
          definitionList={definitionList}
          isDefinitionLoading={isDefinitionLoading}
          onCloseClick={this.onCloseClick}
        />
      </div>
    );
  }
}

const extensionContainer = document.createElement('div');
extensionContainer.id = 'vocabify-chrome-extension';
document.body.appendChild(extensionContainer);
ReactDOM.render(<App />, document.getElementById('vocabify-chrome-extension'));

const isInstalledNode = document.createElement('div');
isInstalledNode.id = 'vocabify-extension-is-installed';
document.body.appendChild(isInstalledNode);
