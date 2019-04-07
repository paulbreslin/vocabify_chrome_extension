import React, { Component } from 'react';

import AudioIcon from '../../../img/audio.svg';
import * as styles from './styles.css';

class AudioPronunciation extends Component {
  audioRef: any = React.createRef();

  get audioLink() {
    const { definitions } = this.props;
    return definitions.map(({ audio }) => audio).filter(audio => audio);
  }

  handleAudioClick = () => {
    this.audioRef.play();
  };

  render() {
    const { definitions } = this.props;
    if (!definitions || !Boolean(this.audioLink.length)) {
      return null;
    }

    return (
      <>
        <img
          className={styles.audioIcon}
          src={AudioIcon}
          alt="Audio"
          onClick={this.handleAudioClick}
        />
        <audio
          ref={element => (this.audioRef = element)}
          src={this.audioLink[0]}
        />
      </>
    );
  }
}

export default AudioPronunciation;
