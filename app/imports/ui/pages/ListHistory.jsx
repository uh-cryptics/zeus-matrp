import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Menu, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { PAGE_IDS } from '../utilities/PageIDs';
import { ROLE } from '../../api/role/Role';
import { History } from '../../api/history/HistoryCollection';
import HistoryTable from '../components/HistoryTable';

const ListHistory = ({ ready, histories }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return ((ready) ? (
    <Container id={PAGE_IDS.LIST_STUFF}>
      <Header as="h1" textAlign="center">History</Header>
      <Menu attached='top' size='small' inverted>
        <Menu.Item>
          <Input className='icon' icon='search' placeholder='Search...' onChange={(e) => {
            setSearchTerm(e.target.value);
          }}/>
        </Menu.Item>
      </Menu>
      <HistoryTable inventory={histories} setting={searchTerm} filter={'All'}/>
    </Container>
  ) :
    <Loader active>Getting data</Loader>
  );
};

// Require an array of Stuff documents in the props.
ListHistory.propTypes = {
  histories: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  currentUser: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Check what level the current user is
  const currentUser = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
  // Get access to Stuff documents.
  const subscription = History.subscribeHistory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Medication and Supply documents and sort them by name.
  const histories = History.find({}, { sort: { name: 1 } }).fetch();
  return {
    histories,
    ready,
    currentUser,
  };
})(ListHistory);
