import { useEffect } from 'react';
import Comment from './Comment';
import styles from './Comments.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllComments } from '../store/commentsSlice';

const Comments = () => {
  const comments = useSelector((state) =>
    [...state.comments].sort((a, b) => b.score - a.score)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAllComments());
  }, [dispatch]);

  return (
    <div className={styles.comments}>
      {comments.map((comment) => {
        return <Comment key={comment.id} isReply={false} {...comment} />;
      })}
    </div>
  );
};

export default Comments;
