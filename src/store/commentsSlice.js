import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadAllComments = createAsyncThunk(
  'comments/load-all',
  async () => {
    try {
      const response = await fetch('http://localhost:3001/comments/');
      const data = await response.json();

      return data;
    } catch (error) {}
  }
);
export const addComment = createAsyncThunk(
  'comments/add-comment',
  async (comment) => {
    try {
      const response = await fetch(`http://localhost:3001/comments/`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(comment),
      });
      const data = await response.json();

      return data;
    } catch (error) {}
  }
);
export const deleteComment = createAsyncThunk(
  'comments/delete-comment',
  async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json' },
      });
      await response.json();

      return id;
    } catch (error) {}
  }
);
export const addReplyOnServer = createAsyncThunk(
  'comments/add-reply',
  async (reply, { getState }) => {
    try {
      const newComment = JSON.parse(
        JSON.stringify(
          getState().comments.find(
            (comment) => comment.id === reply.replyingToId
          )
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
    } catch (error) {}
  }
);
export const deleteReplyOnServer = createAsyncThunk(
  'comments/delete-reply',
  async ({ id, replyingToId }, { getState }) => {
    try {
      const newComment = JSON.parse(
        JSON.stringify(
          getState().comments.find((comment) => comment.id === replyingToId)
        )
      );
      newComment.replies = newComment.replies.filter(
        (reply) => reply.id !== id
      );
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
    } catch (error) {}
  }
);
export const editCommentOnServer = createAsyncThunk(
  'comments/edit-reply',
  async ({ id, newContent, replyingToId }, { getState }) => {
    try {
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
      const response = await fetch(
        `http://localhost:3001/comments/${editedId}`,
        {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(newComment),
        }
      );
      const data = await response.json();

      return data;
    } catch (error) {}
  }
);
export const rateCommentOnServer = createAsyncThunk(
  'comments/rate-comment-reply',
  async ({ id, replyingToId, rating }, { getState }) => {
    try {
      const editedId = replyingToId ? replyingToId : id;
      const newComment = JSON.parse(
        JSON.stringify(
          getState().comments.find((value) => value.id === editedId)
        )
      );
      if (replyingToId) {
        const reply = newComment.replies.find((reply) => reply.id === id);
        reply.score += rating;
      } else {
        newComment.score += rating;
      }
      const response = await fetch(
        `http://localhost:3001/comments/${editedId}`,
        {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(newComment),
        }
      );
      const updatedComment = await response.json();
      return updatedComment;
    } catch (error) {}
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAllComments.fulfilled, (state, action) => {
        if (action.payload) {
          return action.payload;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (action.payload) {
          return [...state].concat(action.payload);
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        if (action.payload) {
          return [...state].filter((comment) => comment.id !== action.payload);
        }
      })
      .addMatcher(
        (action) => action.type.endsWith('reply/fulfilled'),
        (state, action) => {
          const updatedComment = action.payload;
          if (updatedComment) {
            const index = state.findIndex(
              (comment) => comment.id === action.payload.id
            );
            state[index] = updatedComment;
          }
        }
      );
  },
});

export default commentSlice;
