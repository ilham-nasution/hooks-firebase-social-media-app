import React, { useContext, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { withRouter } from "react-router-dom";
import FirebaseContext from "../firebase/context";

const Card = (props) => {
  const { firebase, user } = useContext(FirebaseContext);
  const [comment, setComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const linkRef = firebase.db.collection("posts").doc(props.id);

  const handleLike = () => {
    if (!user) {
      props.history.push("/login");
    } else {
      linkRef.get().then((doc) => {
        if (doc.exists) {
          const previousLikes = doc.data().likes;
          const like = { likedBy: { id: user.uid, name: user.displayName } };
          if (
            previousLikes.some(
              (prevLike) => prevLike.likedBy.id === like.likedBy.id
            )
          ) {
            const updateLikes = previousLikes.filter(
              (prevLike) => prevLike.likedBy.id !== like.likedBy.id
            );
            const likeCount = updateLikes.length;
            linkRef.update({ likes: updateLikes, likeCount });
          } else {
            const updateLikes = [...previousLikes, like];
            const likeCount = updateLikes.length;
            linkRef.update({ likes: updateLikes, likeCount });
          }
        }
      });
    }
  };

  const commentForm = () => {
    if (user) {
      setComment(!comment);
    } else {
      props.history.push("/login");
    }
  };

  const handleComment = () => {
    linkRef.get().then((doc) => {
      if (doc.exists) {
        const previousComments = doc.data().comments;
        const comment = {
          postedBy: {
            id: user.uid,
            name: user.displayName,
            avatar: user.photoURL,
          },
          created_at: Date.now(),
          text: commentText,
        };
        const updatedComments = [...previousComments, comment];
        linkRef.update({ comments: updatedComments });
        setCommentText("");
      }
    });
  };

  return (
    <div className="card mt-5">
      <div className="media pt-2 pl-2" style={{ alignItems: "center" }}>
        <div className="media-left" style={{ alignItems: "center" }}>
          <figure className="image is-48x48 is-square">
            <img className="is-rounded" src={props.avatar} alt="avatar" />
          </figure>
        </div>
        <div className="media-content">
          <p className="title is-4"> {props.username}</p>
        </div>
      </div>
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={props.imageURL} alt="post" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          {!user && (
            <i
              onClick={handleLike}
              style={{ cursor: "pointer" }}
              className="far fa-heart mr-2"
            ></i>
          )}
          {user && props.likes.some((like) => like.likedBy.id === user.uid) && (
            <span className="icon has-text-danger">
              <i
                onClick={handleLike}
                style={{ cursor: "pointer" }}
                className="fas fa-heart mr-2"
              ></i>
            </span>
          )}
          {user &&
            props.likes.every((like) => like.likedBy.id !== user.uid) && (
              <i
                onClick={handleLike}
                style={{ cursor: "pointer" }}
                className="far fa-heart mr-2"
              ></i>
            )}
          <i
            className="far fa-comment"
            onClick={commentForm}
            style={{ cursor: "pointer" }}
          ></i>
          <div className="columns is-gapless mb-0">
            <p className="mr-2">{props.likeCount} likes</p>
            <p>{props.comments.length} comments</p>
          </div>
          <p className="subtitle is-5">{props.caption}</p>
          <p className="has-text-right">{formatDistanceToNow(props.created)}</p>
          {comment && (
            <>
              <hr />
              <p>Comments</p>
              {props.comments.map((comment) => (
                <div key={comment.created_at} className="columns is-vcentered">
                  <figure className="image is-24x24 mb-0 mr-2">
                    <img className="is-rounded" src={comment.postedBy.avatar} />
                  </figure>
                  <p className="is-size-7">{comment.text}</p>
                </div>
              ))}

              <div className="field">
                <div className="control">
                  <textarea
                    className="textarea is-small"
                    placeholder="Comment..."
                    onChange={(event) => setCommentText(event.target.value)}
                    value={commentText}
                  ></textarea>
                  <div className="has-text-right pt-1">
                    <button
                      className="button is-small is-right"
                      onClick={handleComment}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Card);
