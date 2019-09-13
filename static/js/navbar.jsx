import React from "react";
import ReactDOM from "react-dom";
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'
require('../css/navstyle.css');


// export default class NavBar extends React.Component{
//   render(){
//     return(
//       <Nav variant="pills" defaultActiveKey="/">
//         <Nav.Item>
//           <NavLink exact to="/">Home Feed</NavLink>
//         </Nav.Item>
//         <Nav.Item>
//           <NavLink to="/createpost">CreatePost</NavLink>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="disabled" disabled>
//           Disabled
//           </Nav.Link>
//         </Nav.Item>
//      </Nav>
//     );
//   }
// }

export default class NavBar extends React.Component{
  render(){
    return(
      <Nav variant="pills" defaultActiveKey="/home">
      <Nav.Item>
        <LinkContainer exact to="/">
          <Nav.Link>Home Feed</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/createpost">
          <Nav.Link>Create Post</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Disabled
        </Nav.Link>
      </Nav.Item>
    </Nav>
    );
  }
}
