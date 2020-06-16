import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.scss";
import firebase from "./firebase/firebase";
import FirebaseContext from "./firebase/context";
import useAuth from "./components/auth/useAuth";
import Login from "./components/auth/Login";
import Home from "./components/Home";

function App() {
  const user = useAuth();

  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={{ user, firebase }}>
        <div className="container is-fluid">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
          </Switch>
        </div>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
