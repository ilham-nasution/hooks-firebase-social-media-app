import React, { useState, useContext } from "react";
import useFormValidation from "../auth/useFormValidation";
import validateLogin from "../auth/validateLogin";
import firebase from "../../firebase/firebase";
import FirebaseContext from "../../firebase/context";

const INITIAL_STATE = {
  name: "",
  avatar: "",
  email: "",
  password: "",
};

const Login = (props) => {
  const { user } = useContext(FirebaseContext);
  if (user) {
    props.history.push("/");
  }
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting,
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);
  const [login, setLogin] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [firebaseError, setFirebaseError] = useState(null);

  async function avatarUpload(event) {
    const avatar = event.target.files[0];
    const storageRef = firebase.storage.ref();
    const avatarRef = storageRef.child(avatar.name);
    await avatarRef.put(avatar);
    setAvatar(await avatarRef.getDownloadURL());
  }

  async function authenticateUser() {
    const { name, email, password } = values;
    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password, avatar);
      props.history.push("/");
    } catch (error) {
      setFirebaseError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="title has-text-centered mt-5">
        {login ? "Log in" : "Create Account"}
      </h1>
      {!login && (
        <>
          <div className="columns is-centered">
            <figure className="image is-128x128">
              <img
                className="is-rounded"
                src={
                  avatar
                    ? avatar
                    : "https://bulma.io/images/placeholders/128x128.png"
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
                  onChange={avatarUpload}
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Upload Avatar</span>
                </span>
              </label>
            </div>
          </div>
          <div className="field">
            <label className="label">Name</label>
            <div className="control has-icons-left">
              <input
                className="input"
                name="name"
                type="text"
                onChange={handleChange}
                value={values.name}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>
          </div>
        </>
      )}
      <div className="field">
        <label className="label">Email</label>
        <div className="control has-icons-left">
          <input
            className={errors.email ? "input is-danger" : "input"}
            name="email"
            type="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
          </span>
        </div>
        <p className="help is-danger">{errors.email}</p>
      </div>
      <div className="field">
        <label className="label">Password</label>
        <div className="control has-icons-left">
          <input
            className={errors.password ? "input is-danger" : "input"}
            name="password"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-lock"></i>
          </span>
        </div>
        <p className="help is-danger">{errors.password}</p>
      </div>
      <div className=" buttons is-centered">
        <button className="button" type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </div>
      <h2 className="subtitle has-text-centered">
        {login ? (
          <button
            className="button is-text"
            onClick={() => setLogin((prevLogin) => !prevLogin)}
          >
            Don't have an account? Sign up here
          </button>
        ) : (
          <button
            className="button is-text"
            onClick={() => setLogin((prevLogin) => !prevLogin)}
          >
            Already have an account? Log in here
          </button>
        )}
      </h2>
      {firebaseError && (
        <article className="message is-danger">
          <div className="message-body">{firebaseError}</div>
        </article>
      )}
    </form>
  );
};

export default Login;
