import React from "react";
import ReactDOM from "react-dom";
import io from 'socket.io-client';
import Card from 'react-bootstrap/Card'
import PostComment from './postcomment'
require('../css/viewpoststyle.css');

var socket = io();

function PostContent(props){
  return(
    <Card id="view-post-card">
      <Card.Body>{props.displayContent}</Card.Body>
    </Card>
  );
}

function Comment(props){
  return(
    <Card id="comment-card">
      <Card.Body>{props.commentData}</Card.Body>
    </Card>
  );
}


export default class ViewPost extends React.Component{

  state = {
      id : 0,
      content : 'Not Found',
      comments : [
        {
        comment : 'No Comments',
        id: 0,
        post_owner: 0
        }
      ]
  }


  componentWillMount(){
    //WE NEED TO DO POST ID MATCHING
    if(localStorage.getItem('post')){
      let loadLocalPost = JSON.parse(localStorage.getItem('post'));
      this.setState({
        id : loadLocalPost.id,
        content : loadLocalPost.content,
        comments : loadLocalPost.comments
      })
    }
  }

  // updateComments(newData){
  //   console.log(newData);
  //   let newComment;
  //   newComment = this.state.comments.concat(newData);
  //   this.setState({ comments : newComment })
  // }

  setPost = (data) =>(
    this.setState({
      id: data.id,
      content: data.content,
      comments: data.comments
    })
  )
  joinRoom(postIdToLoad){
    socket.emit('join', postIdToLoad)
  }

  fetchPost(postIdToLoad){
    //console.log("FETCH HAS BEEN CALLED!")
    //we can write a custom function to stop check and stop it

    socket.emit('post-id', postIdToLoad);
    socket.on('load-post-page', this.setPost)
  }

  componentDidMount(){
    const { match : { params } } = this.props;

    if(!localStorage.getItem('post')){
      console.log('Not found in local storage. Using data fetch')
      this.fetchPost(params.postId);
      this.joinRoom(params.postId);
    } else {
      console.log("Using data from local storage")
    }
    //our non specific listeners getting killed?
    socket.on('update-comment', (data) =>
      console.log(data)
    )
    socket.on('joined',(data) =>
      console.log(data)
    )
  }

  componentWillUpdate(nextProps, nextState){
    //console.log(nextState)
    localStorage.setItem('post', JSON.stringify(nextState));
    socket.removeListener('load-post-page', this.setPost);
  }

  componentWillUnmount(){
    console.log("Clearing local storage and stoping socket listener")
    localStorage.clear();
    socket.removeAllListeners();
  }


  render(){
    return(
      <div>
        <PostContent displayContent={this.state.content}/>
        {this.state.comments.map((com, index) =>
          <Comment
          commentData={com.comment}
          key={index}
          />
        )}
        <PostComment />
      </div>
    );
  }
}

//<PostComment />
