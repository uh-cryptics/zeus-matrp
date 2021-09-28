import React from 'react';
import { Button, Container } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container fluid className="background-blue">
    <div className="padding-fix" id={PAGE_IDS.LANDING}>
      <Container fluid textAlign='center' className="h1-white background-black">
        <h1 className="fontsize-big">ZEUS</h1>
        <p className="fontsize-medium">Inventory Management</p>
        <div>
          <Button compact content='Login' color='blue' as={NavLink} exact to="/signin"/>
          <Button compact content='Register' color='blue' as={NavLink} exact to="/signup"/>
        </div>
      </Container>
    </div>
  </Container>
);

export default Landing;
