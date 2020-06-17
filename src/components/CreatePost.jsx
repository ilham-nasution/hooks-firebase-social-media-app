import React, { useContext, useState } from "react";
import useFormValidation from "./auth/useFormValidation";
import FirebaseContext from "../firebase/context";

const INITIAL_STATE = {
  caption: "",
  imageURL: "",
};

const CreatePost = (props) => {
  const [imageURL, setImageURL] = useState(null);
  const [imageName, setImageName] = useState("");
  const { firebase, user } = useContext(FirebaseContext);
  const { handleSubmit, handleChange, values } = useFormValidation(
    INITIAL_STATE,
    handleCreatePost
  );

  async function imageUpload(event) {
    const image = event.target.files[0];
    setImageName(image.name);
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
    <form onSubmit={handleSubmit}>
      <h1 className="title has-text-centered">Create Post</h1>
      <div className="field">
        <div className="file has-name is-fullwidth">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              name="image"
              onChange={imageUpload}
            />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">Upload an image</span>
            </span>
            <span className="file-name">{imageName}</span>
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
