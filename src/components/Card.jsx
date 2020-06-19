import React, { useContext } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { withRouter } from "react-router-dom";
import FirebaseContext from "../firebase/context";

const Card = (props) => {
  const { firebase, user } = useContext(FirebaseContext);
  const handleLike = () => {
    if (!user) {
      props.history.push("/login");
    } else {
      const likeRef = firebase.db.collection("posts").doc(props.id);
      likeRef.get().then((doc) => {
        if (doc.exists) {
          const previousLikes = doc.data().likes;
          const like = { likedBy: { id: user.uid, name: user.displayName } };
          if (previousLikes.some((prevLike) => prevLike.id === like.id)) {
            const updateLikes = previousLikes.filter(
              (prevLike) => prevLike.id !== like.id
            );
            const likeCount = updateLikes.length;
            likeRef.update({ likes: updateLikes, likeCount });
          } else {
            const updateLikes = [...previousLikes, like];
            const likeCount = updateLikes.length;
            likeRef.update({ likes: updateLikes, likeCount });
          }
        }
      });
    }
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
          {user && !props.likes.length && (
            <i
              onClick={handleLike}
              style={{ cursor: "pointer" }}
              className="far fa-heart mr-2"
            ></i>
          )}
          {user &&
            props.likes.map((like) => {
              if (like.likedBy.id === user.uid) {
                return (
                  <span key={like} className="icon has-text-danger">
                    <i
                      onClick={handleLike}
                      style={{ cursor: "pointer" }}
                      className="fas fa-heart mr-2"
                    ></i>
                  </span>
                );
              } else {
                return (
                  <i
                    onClick={handleLike}
                    style={{ cursor: "pointer" }}
                    className="far fa-heart mr-2"
                  ></i>
                );
              }
            })}
          <i className="far fa-comment"></i>
          <p>{props.likeCount} likes</p>
          <p className="subtitle is-5">{props.caption}</p>
          <br />
          <p className="has-text-right">{formatDistanceToNow(props.created)}</p>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Card);
