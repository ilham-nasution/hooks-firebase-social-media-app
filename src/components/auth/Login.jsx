import React, { useState } from "react";
import useFormValidation from "../auth/useFormValidation";
import validateLogin from "../auth/validateLogin";
import firebase from "../../firebase/firebase";
import { Link } from "react-router-dom";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
};

const Login = (props) => {
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting,
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);
  const [login, setLogin] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  async function authenticateUser() {
    const { name, email, password } = values;
    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      props.history.push("/");
    } catch (error) {
      setFirebaseError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="title has-text-centered">
        {login ? "Log in" : "Create Account"}
      </h1>
      {!login && (
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
