import * as React from 'react';

import DefinitionList from '../DefinitionList/index.tsx';
import * as styles from './styles.css';

interface WordCardProps {
  word: string;
  onCloseClick: () => void;
  isDefinitionLoading: boolean;
}

const WordCard = ({
  word,
  definitionList: fullDefinitionList,
  isDefinitionLoading,
  onCloseClick
}: WordCardProps) => {
  const showNotFound =
    Array.isArray(fullDefinitionList) &&
    fullDefinitionList.every(({ definitionList }) => !definitionList);

  return (
    <div className={styles.wordCard}>
      <div onClick={onCloseClick} className={styles.removeIcon}>
        <div>&times;</div>
      </div>
      <span className={styles.wordCardTitle}>{word}</span>
      {showNotFound && (
        <div className={styles.notFound}>No definition found</div>
      )}
      {isDefinitionLoading && (
        <div className={styles.loading}>Searching for definition...</div>
      )}
      <DefinitionList definitionList={fullDefinitionList} />
    </div>
  );
};

export default WordCard;
