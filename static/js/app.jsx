import React from "react";
require('../css/appstyle.css');
import Container from 'react-bootstrap/Container';
import { BrowserRouter, Route } from 'react-router-dom';

//App components
import Home from "./home";
import CreatePost from "./createpost";
import NavBar from "./navbar";
import ViewPost from "./viewpost"

//will only render the component when the path matches the URL
//exact instructs the router render only when the path matches the URL exactly

export default class App extends React.Component{
  render(){
    return(
      <BrowserRouter>
        <Container>
          <NavBar />
          <Route exact path="/" component={Home} />
          <Route path="/createpost" component={CreatePost} />
          <Route path="/viewpost/:postId" component={ViewPost} />
        </Container>
      </BrowserRouter>
    );
  }
}
