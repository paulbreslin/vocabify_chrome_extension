import * as React from 'react';
import DefinitionList from '../DefinitionList/index.ts';
import * as styles from './styles.css';
const WordCard = ({ word, definitionList, isDefinitionLoading, onCloseClick }) => {
    return (React.createElement("div", { className: styles.wordCard },
        React.createElement("span", { onClick: onCloseClick, className: styles.removeIcon }, "\u00D7"),
        React.createElement("span", { className: styles.wordCardTitle }, word),
        React.createElement("span", null),
        isDefinitionLoading ? (React.createElement("div", { className: styles.loading }, "Searching for definition...")) : (React.createElement(DefinitionList, { definitionList: definitionList }))));
};
export default WordCard;
