import React from "react";
import ReactDOM from "react-dom";
import Button from 'react-bootstrap/Button';
import io from 'socket.io-client';
require('../css/likestyle.css');

var socket = io();

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
    let newLike = this.state.count
    let postId = this.props.reqId
    let likeData = {
      id: postId,
      like : newLike
    }
    socket.emit('New-Like', likeData)
  }

  render(){
    return(
      <Button onClick={this.incrementLike} variant="light" id="like-btn">❤️Like {this.state.count}</Button>
    )
  }
}
