import { useDispatch, useSelector } from 'react-redux';
import Card from '../UI/Card';
import {
  addReplyOnServer,
  addReplyOnServerThunk,
} from '../store/commentsSlice';
import styles from './Addcomment.module.css';
import { addComment } from '../store/commentsSlice';
import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
const Addcomment = (props) => {
  const textRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const addCommentHandler = (event) => {
    event.preventDefault();
    const comment = {
      id: nanoid(),
      content: event.target.content.value,
      createdAt: 'now',
      score: 0,
      user: {
        image: user.image,
        username: user.username,
      },
      replies: [],
    };
    event.target.reset();
    dispatch(addComment(comment));
  };

  const addReplyHandler = (event) => {
    event.preventDefault();
    const comment = {
      id: nanoid(),
      content: event.target.content.value.replace(`@${props.toUser}`, ''),
      createdAt: 'now',
      score: 0,
      user: {
        image: user.image,
        username: user.username,
      },
      replyingTo: props.toUser,
      replyingToId: props.replyingToId,
    };
    event.target.reset();
    dispatch(addReplyOnServer(comment));
    props.replying();
  };

  useEffect(() => {
    textRef.current.value = props.toUser ? `@${props.toUser} ` : '';
    textRef.current.focus();
  }, [props.toUser]);
  return (
    <form onSubmit={props.toUser ? addReplyHandler : addCommentHandler}>
      <Card
        className={`${styles.addcomment} ${props.toReply && styles.replying}`}
      >
        <img src={user.image.png} alt="dasd" />
        <textarea
          placeholder="Add comment..."
          name="content"
          required
          ref={textRef}
        />
        <button>{props.toUser ? 'REPLY' : 'SEND'}</button>
      </Card>
    </form>
  );
};

export default Addcomment;
