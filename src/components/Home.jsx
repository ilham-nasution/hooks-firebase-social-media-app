import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import FirebaseContext from "../firebase/context";
import Card from "./Card";

const Home = () => {
  const { user, firebase } = useContext(FirebaseContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = getPosts();
    return () => unsubscribe();
  }, []);

  function getPosts() {
    firebase.db
      .collection("posts")
      .orderBy("created_at", "desc")
      .onSnapshot(handleSnapshot);
  }

  function handleSnapshot(snapshot) {
    const posts = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(posts);
  }

  return (
    <>
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
      {posts.map((post) => (
        <Card
          key={post.id}
          avatar={post.avatar}
          username={post.postedBy.name}
          caption={post.caption}
          imageURL={post.imageURL}
          created={post.created_at}
        />
      ))}
    </>
  );
};

export default Home;
