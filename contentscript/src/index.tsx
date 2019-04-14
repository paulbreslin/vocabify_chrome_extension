import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";

import WordCard from "./components/WordCard/index.tsx";
import "./index.css";

Sentry.init({
  dsn: "https://96e555de31d14beca54976d68cf6de9a@sentry.io/1419202"
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
    word: "",
    showTimer: false
  };

  public hoverTimeout = 8000;
  // TODO - Keep consistent with css animation timer

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

  public onSetTimer = () => {
    clearTimeout(this.timerId);
    this.setState({
      showTimer: true
    });

    this.timerId = setTimeout(() => {
      this.setState({
        showWord: false,
        showTimer: false
      });
    }, this.hoverTimeout);
  };

  public onCloseClick = () =>
    this.setState({
      showWord: false
    });

  public onMouseEnter = () => {
    clearTimeout(this.timerId);
    this.setState({
      showTimer: false
    });
  };

  public onMouseLeave = () => {
    this.onSetTimer();
  };

  public render() {
    const {
      showWord,
      word,
      definitionList,
      isDefinitionLoading,
      showTimer
    } = this.state;

    if (!showWord) return null;

    return (
      <div onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter}>
        <WordCard
          word={word}
          definitionList={definitionList}
          isDefinitionLoading={isDefinitionLoading}
          onCloseClick={this.onCloseClick}
          showTimer={showTimer}
        />
      </div>
    );
  }
}

window.onload = function() {
  const extensionContainer = document.createElement("div");
  extensionContainer.id = "vocabify-chrome-extension";
  document.body.appendChild(extensionContainer);
  ReactDOM.render(
    <App />,
    document.getElementById("vocabify-chrome-extension")
  );

  const isInstalledNode = document.createElement("div");
  isInstalledNode.id = "vocabify-extension-is-installed";
  document.body.appendChild(isInstalledNode);
};
