import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import FirebaseContext from "../firebase/context";

const Navbar = () => {
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
        <div className="navbar-start">
          <NavLink className="navbar-item" to="/create-post">
            Create Post
          </NavLink>
        </div>
        <div className="navbar-end">
          {user ? (
            <>
              <NavLink className="navbar-item" to={`/profile/${user.uid}`}>
                <figure className="image is-24x24 mr-2">
                  <img
                    className="is-rounded"
                    src={user.photoURL}
                    alt="avatar"
                  />
                </figure>
                {user.displayName}
              </NavLink>
              <NavLink
                to="/"
                className="navbar-item"
                onClick={() => firebase.logout()}
              >
                Logout
              </NavLink>
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

export default Navbar;
