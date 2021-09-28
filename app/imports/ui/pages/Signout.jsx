import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header, Button } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';
import { NavLink } from 'react-router-dom';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout();
  return (
    <Header id={PAGE_IDS.SIGN_OUT} as="h2" textAlign="center">
      <p>You have been signed out.</p>
      <Button content='Login' color='blue' as={NavLink} exact to="/signin"/>
    </Header>
  );
};

export default Signout;
