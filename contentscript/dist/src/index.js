import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WordCard from './components/WordCard/index';
import './index.css';
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            definitionList: [],
            isDefinitionLoading: false,
            showWord: false,
            word: ''
        };
        this.onCloseClick = () => this.setState({
            showWord: false
        });
    }
    componentDidMount() {
        chrome.runtime.onMessage.addListener((request) => {
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
    render() {
        const { showWord, word, definitionList, isDefinitionLoading } = this.state;
        if (!showWord)
            return null;
        return (React.createElement(WordCard, { word: word, definitionList: definitionList, isDefinitionLoading: isDefinitionLoading, onCloseClick: this.onCloseClick }));
    }
}
const extensionContainer = document.createElement('div');
extensionContainer.id = 'vocabify-chrome-extension';
document.body.appendChild(extensionContainer);
ReactDOM.render(React.createElement(App, null), document.getElementById('vocabify-chrome-extension'));
const isInstalledNode = document.createElement('div');
isInstalledNode.id = 'vocabify-extension-is-installed';
document.body.appendChild(isInstalledNode);
