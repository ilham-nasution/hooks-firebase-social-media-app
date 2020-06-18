import React, { useContext, useState, useEffect } from "react";
import FirebaseContext from "../firebase/context";
import Card from "./Card";

const Home = () => {
  const { user, firebase } = useContext(FirebaseContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
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
    <div className="columns is-centered">
      {posts.map((post) => (
        <Card
          key={post.id}
          avatar={post.postedBy.avatar}
          username={post.postedBy.name}
          caption={post.caption}
          imageURL={post.imageURL}
          created={post.created_at}
        />
      ))}
    </div>
  );
};

export default Home;
