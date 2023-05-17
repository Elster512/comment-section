import Card from '../UI/Card';
import styles from './Comment.module.css';
import Cbutton from '../UI/Cbutton';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteComment,
  deleteReplyOnServer,
  editComment,
  editCommentOnServer,
} from '../store/commentsSlice';
import { useState, useRef } from 'react';
import Addcomment from './Addcomment';
import Actions from './Actions';

const Comment = ({
  id,
  content,
  createdAt,
  score,
  user,
  replies,
  replyingTo,
  replyingToId,
}) => {
  const textRef = useRef();
  const currentUser = useSelector((state) => state.user.username);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const editedText = `${replyingTo ? `@${replyingTo} ` : ''}${content}`;
  const isYou = currentUser === user.username;
  const repliesExist = replies && replies.length !== 0;
  const dispatch = useDispatch();

  const deleteHandler = () => {
    dispatch(
      replyingToId
        ? deleteReplyOnServer({ id, replyingToId })
        : deleteComment(id)
    );
  };
  const replyingHandler = () => {
    setReplying((state) => !state);
  };

  const editingHandler = () => {
    setEditing((state) => !state);
  };

  const updateHandler = (event) => {
    event.preventDefault();
    const newContent = event.target.editingComment.value.replace(
      `@${replyingTo}`,
      ''
    );
    dispatch(editCommentOnServer({ id, newContent, replyingToId }));
    editingHandler();
  };
  return (
    <div className={styles['comment-with-replies']}>
      <Card
        className={`${styles.comment} ${
          replyingTo ? styles.reply : styles.notreply
        }`}
      >
        <Actions score={score} replyingToId={replyingToId} id={id} />
        <div className={styles.class}>
          <div className={styles['comment-header']}>
            <div className={styles['comment-user']}>
              <img src={user.image.png} alt="avatar" />
              <h3>
                {user.username}
                {isYou && <span className={styles.you}> you</span>}
              </h3>
              <p>{createdAt}</p>
            </div>
            <div className={styles.actions}>
              {!isYou && (
                <Cbutton
                  title="Reply"
                  icon={'reply'}
                  onClick={replyingHandler}
                />
              )}
              {isYou && (
                <>
                  <Cbutton
                    title="Delete"
                    icon={'trash-can'}
                    onClick={deleteHandler}
                  />
                  <Cbutton
                    title="Edit"
                    icon={'edit'}
                    onClick={editingHandler}
                  />
                </>
              )}
            </div>
          </div>
          <div className={styles['comment-text']}>
            {!editing && (
              <p>
                {replyingTo && (
                  <span className={styles.hastag}>@{replyingTo} </span>
                )}
                {content}
              </p>
            )}
            {editing && (
              <form className={styles.editing} onSubmit={updateHandler}>
                <textarea
                  name="editingComment"
                  defaultValue={editedText}
                  ref={textRef}
                ></textarea>
                <button>UPDATE</button>
              </form>
            )}
          </div>
        </div>
      </Card>
      {replying && (
        <Addcomment
          toReply={replyingTo}
          replyingToId={replyingToId ? replyingToId : id}
          toUser={user.username}
          replying={replyingHandler}
        />
      )}
      {repliesExist && (
        <ul className={styles.replies}>
          {replies.map((reply) => {
            return <Comment key={reply.id} {...reply} />;
          })}
        </ul>
      )}
    </div>
  );
};

export default Comment;
