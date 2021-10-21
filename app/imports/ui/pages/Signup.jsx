import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { ROLE } from '../../api/role/Role';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
const Signup = ({ location }) => {
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [uhNumber, setUHNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  // Update the form controls each time the user interacts with them.
  const handleChange = (e, { name, value }) => {
    switch (name) {
    case 'role':
      setRole(value);
      break;
    case 'firstName':
      setFirstName(value);
      break;
    case 'lastName':
      setLastName(value);
      break;
    case 'uhNumber':
      setUHNumber(value);
      break;
    case 'email':
      setEmail(value);
      break;
    case 'password':
      setPassword(value);
      break;
    default:
      // do nothing.
    }
  };

  /* Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = () => {
    Accounts.createUser({ role, firstName, lastName, uhNumber, email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToReferer(true);
      }
    });
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  const { from } = location.state || { from: { pathname: '/list' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Redirect to={from} />;
  }

  return (
    <Container fluid id={PAGE_IDS.SIGN_UP} className="background-black-signin">
      <div className="padding-fix">
        <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center" color='black' inverted>
            Register your account
            </Header>
            <Form onSubmit={submit}>
              <Segment stacked>
                <Form.Group inline>
                  <label>Are you a provider?</label>
                  <Form.Radio
                    label='Yes'
                    id={COMPONENT_IDS.SIGN_UP_FORM_PROVIDER_ROLE}
                    value={ROLE.PROVIDER}
                    checked={role === ROLE.PROVIDER}
                    name='role'
                    onChange={handleChange}
                  />
                  <Form.Radio
                    label='No'
                    id={COMPONENT_IDS.SIGN_UP_FORM_USER_ROLE}
                    value={ROLE.USER}
                    checked={role === ROLE.USER}
                    name='role'
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.Input
                    label="First Name"
                    id={COMPONENT_IDS.SIGN_UP_FORM_FIRSTNAME}
                    icon="user"
                    iconPosition="left"
                    name="firstName"
                    placeholder="First Name"
                    type="firstname"
                    onChange={handleChange}
                  />
                  <Form.Input
                    label="Last Name"
                    id={COMPONENT_IDS.SIGN_UP_FORM_LASTNAME}
                    name="lastName"
                    placeholder="Last Name"
                    type="lastname"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Input
                  label="UH Number (optional)"
                  id={COMPONENT_IDS.SIGN_UP_FORM_UHNUMBER}
                  icon="drivers license"
                  iconPosition="left"
                  name="uhNumber"
                  placeholder="UH Number"
                  type="uhNumber"
                  onChange={handleChange}
                />
                <Form.Input
                  label="Email"
                  id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL}
                  icon="mail"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="E-mail address"
                  onChange={handleChange}
                />
                <Form.Input
                  label="Password"
                  id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD}
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={handleChange}
                />
                <Form.Button id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} color='blue' content="Submit" />
              </Segment>
            </Form>
            <Message>
            Already have an account? Login <Link to="/signin">here</Link>
            </Message>
            {error === '' ? (
              ''
            ) : (
              <Message
                error
                header="Registration was not successful"
                content={error}
              />
            )}
          </Grid.Column>
        </Grid>
      </div>
    </Container>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
