import flatten from 'lodash/flatten';
import isNull from 'lodash/isNull';
import sortBy from 'lodash/sortBy';
import React, { PureComponent } from 'react';
import styles from './styles.css';
class DefinitionList extends PureComponent {
    constructor() {
        super(...arguments);
        this.renderDefinitionList = () => this.definitionList.map(({ definition, example, id, showQuote }, index) => {
            const hasDefinition = Boolean(definition);
            const hasExample = Boolean(example);
            return (React.createElement("div", { key: id, className: styles.definitionItem },
                React.createElement("span", { className: styles.index },
                    index + 1,
                    "."),
                hasDefinition && (React.createElement("p", { className: styles.definition, "data-test-selector": "wordCardDefinition" }, definition)),
                hasExample && (React.createElement("p", { className: styles.example, "data-test-selector": "wordCardExample" },
                    showQuote && '"',
                    example,
                    showQuote && '"'))));
        });
    }
    get definitionList() {
        const { definitionList: fullDefinitionList } = this.props;
        const definitionListArray = fullDefinitionList.map(({ definitionList, source }) => {
            if (!definitionList)
                return null;
            return Object.keys(definitionList).map(key => ({
                id: key,
                ...definitionList[key]
            }));
        });
        return sortBy(flatten(definitionListArray)
            .filter(definition => definition)
            .filter(item => item.enabled), 'order');
    }
    render() {
        const { definitionList } = this.props;
        if (!definitionList ||
            definitionList.every(({ definitionList: list }) => isNull(list))) {
            return null;
        }
        if (!this.definitionList.length) {
            return React.createElement("div", { className: styles.notSet }, "No definition set");
        }
        return (React.createElement("div", { className: styles.definitionList }, this.renderDefinitionList()));
    }
}
export default DefinitionList;
