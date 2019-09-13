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
      <Form.Label>Example textarea</Form.Label>
      <Form.Control as="textarea" rows="3" value={props.formValue} onChange={props.formChange}/>
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


export default class CreatePost extends React.Component{

  state = {
    data: ''
  }

  handleChange = (event) => {
    this.setState({ data: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.data);
    let newPostData = this.state.data;
    socket.emit('new-post-data', newPostData);
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
