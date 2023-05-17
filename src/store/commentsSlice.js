import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadAllComments = createAsyncThunk(
  'comments/load-all',
  async () => {
    const response = await fetch('http://localhost:3001/comments/');
    const data = await response.json();

    return data;
  }
);
export const addComment = createAsyncThunk(
  'comments/add-comment',
  async (comment) => {
    const response = await fetch(`http://localhost:3001/comments/`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(comment),
    });
    const data = await response.json();

    return data;
  }
);
export const deleteComment = createAsyncThunk(
  'comments/delete-comment',
  async (id) => {
    const response = await fetch(`http://localhost:3001/comments/${id}`, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
    });
    await response.json();

    return id;
  }
);
export const addReplyOnServer = createAsyncThunk(
  'comments/add-reply',
  async (reply, { getState }) => {
    const newComment = JSON.parse(
      JSON.stringify(
        getState().comments.find((comment) => comment.id === reply.replyingToId)
      )
    );
    newComment.replies.push(reply);
    const response = await fetch(
      `http://localhost:3001/comments/${reply.replyingToId}`,
      {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(newComment),
      }
    );
    const comment = await response.json();
    return comment;
  }
);
export const deleteReplyOnServer = createAsyncThunk(
  'comments/delete-reply',
  async ({ id, replyingToId }, { getState }) => {
    const newComment = JSON.parse(
      JSON.stringify(
        getState().comments.find((comment) => comment.id === replyingToId)
      )
    );
    newComment.replies = newComment.replies.filter((reply) => reply.id !== id);
    const response = await fetch(
      `http://localhost:3001/comments/${replyingToId}`,
      {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(newComment),
      }
    );
    const comment = await response.json();
    return comment;
  }
);
export const editCommentOnServer = createAsyncThunk(
  'comments/edit-reply',
  async ({ id, newContent, replyingToId }, { getState }) => {
    let editedId = 0;
    let newComment;
    if (replyingToId) {
      editedId = replyingToId;
      newComment = JSON.parse(
        JSON.stringify(
          getState().comments.find((value) => value.id === replyingToId)
        )
      );
      const reply = newComment.replies.find((reply) => reply.id === id);
      reply.content = newContent;
    } else {
      editedId = id;
      newComment = JSON.parse(
        JSON.stringify(getState().comments.find((value) => value.id === id))
      );
      newComment.content = newContent;
    }
    const response = await fetch(`http://localhost:3001/comments/${editedId}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newComment),
    });
    const data = await response.json();

    return data;
  }
);
export const rateCommentOnServer = createAsyncThunk(
  'comments/rate-comment-reply',
  async ({ id, replyingToId, rating }, { getState }) => {
    const editedId = replyingToId ? replyingToId : id;
    const newComment = JSON.parse(
      JSON.stringify(getState().comments.find((value) => value.id === editedId))
    );
    if (replyingToId) {
      const reply = newComment.replies.find((reply) => reply.id === id);
      reply.score += rating;
    } else {
      newComment.score += rating;
    }
    const response = await fetch(`http://localhost:3001/comments/${editedId}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newComment),
    });
    const updatedComment = await response.json();
    return updatedComment;
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAllComments.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        return [...state].concat(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        return [...state].filter((comment) => comment.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('reply/fulfilled'),
        (state, action) => {
          const updatedComment = action.payload;
          const index = state.findIndex(
            (comment) => comment.id === action.payload.id
          );
          state[index] = updatedComment;
        }
      );
  },
});

export default commentSlice;
