import * as React from 'react';

import AudioPronunciation from '../AudioPronunciation/index.tsx';
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
      <span className={styles.wordCardTitle}>
        {word}
        <AudioPronunciation definitions={fullDefinitionList} />
      </span>
      {showNotFound && (
        <div className={styles.notFound}>No definition found</div>
      )}
      {isDefinitionLoading && (
        <div className={styles.loading}>Searching for definition...</div>
      )}
      <DefinitionList definitionList={fullDefinitionList} />
      <div className={styles.actions}>
        <a
          href="https://vocabifyapp.com/words?signIn=true"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className={styles.open}>Open Vocabify</button>
        </a>
      </div>
    </div>
  );
};

export default WordCard;
