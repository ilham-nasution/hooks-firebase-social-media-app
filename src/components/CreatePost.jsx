import React, { useContext, useState } from "react";
import useFormValidation from "./auth/useFormValidation";
import FirebaseContext from "../firebase/context";

const INITIAL_STATE = {
  caption: "",
  imageURL: "",
};

const CreatePost = (props) => {
  const [imageURL, setImageURL] = useState(null);
  const { firebase, user } = useContext(FirebaseContext);
  const { handleSubmit, handleChange, values } = useFormValidation(
    INITIAL_STATE,
    handleCreatePost
  );

  async function imageUpload(event) {
    const image = event.target.files[0];
    const storageRef = firebase.storage.ref();
    const imageRef = storageRef.child(image.name);
    await imageRef.put(image);
    setImageURL(await imageRef.getDownloadURL());
  }

  function handleCreatePost() {
    if (!user) {
      props.history.push("/login");
    } else {
      const { caption } = values;
      const newPost = {
        caption,
        imageURL,
        postedBy: {
          id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
        },
        likeCount: 0,
        likes: [],
        comments: [],
        created_at: Date.now(),
      };
      firebase.db.collection("posts").add(newPost);
      props.history.push("/");
    }
  }

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      <h1 className="title has-text-centered">Create Post</h1>
      <div className="columns is-centered">
        <figure className="image is-256x256">
          <img
            alt="post"
            src={
              imageURL
                ? imageURL
                : "https://bulma.io/images/placeholders/256x256.png"
            }
          />
        </figure>
      </div>
      <div className="field">
        <div className="file is-small is-centered is-boxed is-primary">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              name="avatar"
              onChange={imageUpload}
            />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">Upload Image</span>
            </span>
          </label>
        </div>
      </div>
      <div className="field">
        <input
          className="input"
          placeholder=" Caption"
          name="caption"
          type="text"
          onChange={handleChange}
          value={values.caption}
        />
      </div>
      <div className=" buttons is-centered">
        <button className="button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
