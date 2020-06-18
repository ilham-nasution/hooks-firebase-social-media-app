import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Card = (props) => {
  return (
    <div className="card mt-5">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={props.imageURL} alt="post" />
        </figure>
      </div>
      <div className="card-content">
        <div className="media" style={{ alignItems: "center" }}>
          <div className="media-left" style={{ alignItems: "center" }}>
            <figure className="image is-48x48 is-square">
              <img className="is-rounded" src={props.avatar} alt="avatar" />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-4"> {props.username}</p>
          </div>
        </div>

        <div className="content">
          <p className="subtitle is-5">{props.caption}</p>
          <br />
          <p className="has-text-right">{formatDistanceToNow(props.created)}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
