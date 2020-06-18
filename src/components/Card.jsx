import React from "react";

const Card = (props) => {
  return (
    <div className="card mt-5">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={props.imageURL} alt="post image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src={props.avatar} alt="avatar" />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-4"> {props.username}</p>
          </div>
        </div>

        <div className="content">
          {props.caption}
          <br />
          <time dateTime="2016-1-1">{props.created}</time>
        </div>
      </div>
    </div>
  );
};

export default Card;
