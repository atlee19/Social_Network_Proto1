import React from "react";
import ReactDOM from "react-dom";
import Button from 'react-bootstrap/Button';
require('../css/likestyle.css');


export default class Like extends React.Component{
  state = {
    count : 0
  }

  incrementLike = () => {
    this.setState( prevState => {
      return {
        count : prevState.count + 1
      }
    });
  }

  render(){
    return(
      <Button onClick={this.incrementLike} variant="light" id="like-btn">❤️Like {this.state.count}</Button>
    )
  }
}
