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

    if(localStorage.getItem('post')){
      let loadLocalPost = JSON.parse(localStorage.getItem('post'));
      this.setState({
        id : loadLocalPost.id,
        content : loadLocalPost.content,
        comments : loadLocalPost.comments
      })
    }
  }

  updateComments(newData){
    console.log(newData);
    let newComment;
    newComment = this.state.comments.concat(newData);
    this.setState({ comments : newComment })
  }

  fetchPost(postIdToLoad){
    console.log("FETCH HAS BEEN CALLED!")
    socket.emit('post-id', postIdToLoad);
    socket.on('load-post-page', (data) =>
      this.setState({
        id: data.id,
        content: data.content,
        comments: data.comments
      }),
    )

  }

  componentDidMount(){
    const { match : { params } } = this.props;

    if(!localStorage.getItem('post')){
      console.log('Not found in local storage. Using data fetch')
      this.fetchPost(params.postId); //we might get error on the backend because this is a string
    } else {
      console.log("Using data from local storage")
    }
    //wait this might cause logic bug given we're calling above
    socket.on('update-comment', (data) =>
      this.updateComments(data)
    )
  }

  componentWillUpdate(nextProps, nextState){
    //console.log(nextState)
    localStorage.setItem('post', JSON.stringify(nextState));
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
