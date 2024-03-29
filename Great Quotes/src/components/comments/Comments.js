import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '../UI/LoadingSpinner';
import CommentsList from '../comments/CommentsList';

import classes from './Comments.module.css';
import NewCommentForm from './NewCommentForm';
import useHttp from '../../hooks/use-http';
import { getAllComments } from '../../lib/api';

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params = useParams();

  const { quoteId } = params;

  const { sendRequest, status, data: loadedComments } = useHttp(getAllComments);

  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId])

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  const addedCommentHandler = useCallback(() => {
    sendRequest(quoteId);
   }, [quoteId, sendRequest]);

  let comments;

  if (status === 'pending') {
    comments = (
      <div className='centered'>
        <LoadingSpinner />
      </div>
    )
  }

  if (status === 'completed' && (loadedComments && loadedComments.length > 0)) {
    comments = <CommentsList comments={loadedComments} />
  }

  if (status === 'comleted' && (!loadedComments && loadedComments.length === 0)) {
    comments = <p className='centered'>No Comments Added Yet</p>
  }

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className='btn' onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment &&
        <NewCommentForm
          quoteId={quoteId}
          onAddedComment={addedCommentHandler}
        />}
      {comments}
    </section>
  );
};

export default Comments;
