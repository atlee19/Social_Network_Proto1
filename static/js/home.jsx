import React from "react";
import ReactDOM from "react-dom";
import Nav from 'react-bootstrap/Nav';
import Feed from './feed'
// require('../css/homestyle.css')



export default class Home extends React.Component{

  //temp solution i suppose
  componentWillMount(){
      localStorage.clear();
  }

  render(){
    return(
      <Feed />
    );
  }
}
