import React, { useContext, useState, useEffect, useCallback } from "react";
import FirebaseContext from "../firebase/context";
import Card from "./Card";

const Home = () => {
  const { firebase } = useContext(FirebaseContext);
  const [posts, setPosts] = useState([]);

  const getPosts = useCallback(() => {
    firebase.db
      .collection("posts")
      .orderBy("created_at", "desc")
      .onSnapshot(handleSnapshot);
  }, [firebase]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  function handleSnapshot(snapshot) {
    const posts = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(posts);
  }

  return (
    <div className="column is-half is-offset-one-quarter">
      {posts.map((post) => (
        <Card
          key={post.id}
          id={post.id}
          likes={post.likes}
          comments={post.comments}
          avatar={post.postedBy.avatar}
          username={post.postedBy.name}
          caption={post.caption}
          likeCount={post.likeCount}
          imageURL={post.imageURL}
          created={post.created_at}
        />
      ))}
    </div>
  );
};

export default Home;
