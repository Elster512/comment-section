import { useDispatch } from 'react-redux';
import styles from './Actions.module.css';
import { useState } from 'react';
import { rateCommentOnServer } from '../store/commentsSlice';
const Actions = ({ score, id, replyingToId }) => {
  const dispatch = useDispatch();
  const [buttonState, setButtonState] = useState(0);
  const upvoteHandler = () => {
    switch (buttonState) {
      case 1: {
        dispatch(rateCommentOnServer({ id, replyingToId, rating: -1 }));
        setButtonState(0);
        return;
      }
      case 0: {
        setButtonState(1);
        dispatch(rateCommentOnServer({ id, replyingToId, rating: 1 }));
        return;
      }
      case -1: {
        setButtonState(1);
        dispatch(rateCommentOnServer({ id, replyingToId, rating: 2 }));
        return;
      }
      default:
        return;
    }
  };
  const downvoteHandler = () => {
    switch (buttonState) {
      case 1: {
        setButtonState(-1);
        dispatch(rateCommentOnServer({ id, replyingToId, rating: -2 }));
        return;
      }
      case 0: {
        setButtonState(-1);
        dispatch(rateCommentOnServer({ id, replyingToId, rating: -1 }));
        return;
      }
      case -1: {
        setButtonState(0);
        dispatch(rateCommentOnServer({ id, replyingToId, rating: 1 }));
        return;
      }
      default:
        return;
    }
  };
  return (
    <div className={styles['comment-points']}>
      <button
        className={buttonState === 1 ? styles.activated : ''}
        onClick={upvoteHandler}
      >
        +
      </button>
      <span>{score}</span>
      <button
        className={buttonState === -1 ? styles.activated : ''}
        onClick={downvoteHandler}
      >
        –
      </button>
    </div>
  );
};
export default Actions;
