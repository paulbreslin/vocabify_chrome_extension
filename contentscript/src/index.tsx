import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import WordCard from './components/WordCard/index.tsx';
import './index.css';

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

  public componentDidMount() {
    chrome.runtime.onMessage.addListener((request: ChromeMessageRequest) => {
      const { word, definitionList, isDefinitionLoading } = request;
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

  public onCloseClick = () =>
    this.setState({
      showWord: false
    });

  public render() {
    const { showWord, word, definitionList, isDefinitionLoading } = this.state;

    if (!showWord) return null;

    return (
      <WordCard
        word={word}
        definitionList={definitionList}
        isDefinitionLoading={isDefinitionLoading}
        onCloseClick={this.onCloseClick}
      />
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
