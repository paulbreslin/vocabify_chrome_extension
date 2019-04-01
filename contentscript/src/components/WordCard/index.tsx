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
    definitionList,
    isDefinitionLoading,
    onCloseClick
}: WordCardProps) => {
    return (
        <div className={styles.wordCard}>
            <span onClick={onCloseClick} className={styles.removeIcon}>
                &times;
            </span>
            <span className={styles.wordCardTitle}>{word}</span>
            <span />
            {isDefinitionLoading ? (
                <div className={styles.loading}>
                    Searching for definition...
                </div>
            ) : (
                <DefinitionList definitionList={definitionList} />
            )}
        </div>
    );
};

export default WordCard;
