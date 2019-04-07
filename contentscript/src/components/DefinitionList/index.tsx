import flatten from 'lodash/flatten';
import isNull from 'lodash/isNull';
import sortBy from 'lodash/sortBy';
import React, { PureComponent } from 'react';

import styles from './styles.css';

class DefinitionList extends PureComponent {
  get definitionList() {
    const { definitionList: fullDefinitionList } = this.props;

    const definitionListArray = fullDefinitionList.map(
      ({ definitionList, source }) => {
        if (!definitionList) return null;
        return Object.keys(definitionList).map(key => ({
          id: key,
          ...definitionList[key]
        }));
      }
    );

    return sortBy(
      flatten(definitionListArray)
        .filter(definition => definition)
        .filter(item => item.enabled),
      'order'
    );
  }

  public renderDefinitionList = () =>
    this.definitionList.map(({ definition, example, id, showQuote }, index) => {
      const hasDefinition = Boolean(definition);
      const hasExample = Boolean(example);

      return (
        <div key={id} className={styles.definitionItem}>
          <span className={styles.index}>{index + 1}.</span>
          {hasDefinition && (
            <p
              className={styles.definition}
              data-test-selector="wordCardDefinition"
            >
              {definition}
            </p>
          )}
          {hasExample && (
            <p className={styles.example} data-test-selector="wordCardExample">
              {showQuote && '"'}
              {example}
              {showQuote && '"'}
            </p>
          )}
        </div>
      );
    });

  render() {
    const { definitionList } = this.props;
    if (
      !definitionList ||
      definitionList.every(({ definitionList: list }) => isNull(list))
    ) {
      return null;
    }
    return (
      <div className={styles.definitionList}>{this.renderDefinitionList()}</div>
    );
  }
}

export default DefinitionList;
