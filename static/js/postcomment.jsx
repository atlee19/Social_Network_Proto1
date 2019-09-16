import React from "react";
import ReactDOM from "react-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import io from 'socket.io-client';

var socket = io();

function TextBox(props){
  return(
    <Form.Group controlId="exampleForm.ControlTextarea1">
      <Form.Label></Form.Label>
      <Form.Control as="textarea" rows="1" value={props.formValue} onChange={props.formChange}/>
    </Form.Group>
  );
}

function Submit(){
  return(
    <Button variant="secondary" size="lg" type="submit">
      Post
    </Button>
  );
}

export default class PostComment extends React.Component{
  state = {
    comment : ''
  }

  handleChange = (event) => {
    this.setState({ comment: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    //console.log(this.state.comment);
    let newComment = this.state.comment
    //TRY CALLING LOCALSTORAGE HERE INSTEAD?
    let local = JSON.parse(localStorage.getItem('post'))
    let localID = local.id;
    console.log("GOT IT: " + localID) //we can try this but we can also call localstorage here if doesnt work
    let commentData = {
      id : localID,
      comment : newComment
    }
    //its going to require the post id so we know which to add it to
    socket.emit('new-comment', commentData)
  }

  componentWillUnmount(){
    socket.removeAllListeners(); //close listener if there is any
  }

  render(){
    return(
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <TextBox formValue={this.state.data} formChange={this.handleChange}/>
          <Submit />
        </Form>
      </Container>
    );
  }
}
