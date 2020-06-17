import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import FirebaseContext from "../firebase/context";

const Home = () => {
  const { user, firebase } = useContext(FirebaseContext);

  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <NavLink to="/" className="navbar-item">
          SociArc
        </NavLink>
      </div>
      <div className="navbar-menu is-active">
        <div className="navbar-end">
          {user ? (
            <>
              <p className="navbar-item">{user.displayName}</p>
              <a className="navbar-item" onClick={() => firebase.logout()}>
                Logout
              </a>
            </>
          ) : (
            <NavLink className="navbar-item" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Home;
