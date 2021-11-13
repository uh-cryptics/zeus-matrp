import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { PAGE_IDS } from '../utilities/PageIDs';
import { ROLE } from '../../api/role/Role';
import ProviderTable from '../components/ProviderTable';
import AddMedication from '../components/AddMedication';
import { Medication } from '../../api/medication/MedicationCollection';
import { Supply } from '../../api/supply/SupplyCollection';
import AddSupply from '../components/AddSupply';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

const ListProviders = ({ currentUser, ready, medications, supplies, adminNames, basicNames }) => {
  const [showTable] = useState('medications');
  const [open, setOpen] = useState(false);
  const [searchTerm] = useState('');
  const [userNames] = useState();
  console.log(adminNames, basicNames);

  return ((ready) ? (
    <Container id={PAGE_IDS.LIST_STUFF}>
      <Header as="h1" textAlign="center">Test Providers</Header>
      {(showTable === 'medications') ?
        <>
          <AddMedication medications={medications} open={open} setOpen={setOpen} />
          <ProviderTable inventory={medications} table={showTable} setting={searchTerm} basicUsers={basicNames} adminUsers={adminNames}/>
        </>
        :
        <>
          <AddSupply supplies={supplies} open={open} setOpen={setOpen} />
          <ProviderTable inventory={supplies} table={showTable} setting={searchTerm} basicUsers={basicNames} adminUsers={adminNames}/>
        </>
      }
    </Container>
  ) :
    <Loader active>Getting data</Loader>
  );
};

// Require an array of Stuff documents in the props.
ListProviders.propTypes = {
  medications: PropTypes.array.isRequired,
  supplies: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  currentUser: PropTypes.bool.isRequired,
  adminNames: PropTypes.array.isRequired,
  basicNames: PropTypes.array.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Check what level the current user is
  const currentUser = Roles.userIsInRole(Meteor.userId(), [ROLE.PROVIDER]);
  // Get access to Stuff documents.
  const subscription = Medication.subscribeMedication();
  const subscription2 = Supply.subscribeSupply();
  const subscription3 = UserProfiles.subscribe();
  const subscription4 = AdminProfiles.subscribe();
  // Determine if the subscription is ready
  const ready = subscription.ready() && subscription2.ready() && subscription3.ready() && subscription4.ready();
  // Get the Medication and Supply documents and sort them by name.
  const medications = Medication.find({}, { sort: { name: 1 } }).fetch();
  const supplies = Supply.find({}, { sort: { name: 1 } }).fetch();
  const adminNames = AdminProfiles.find().fetch();
  const basicNames = UserProfiles.find().fetch();
  return {
    medications,
    supplies,
    ready,
    currentUser,
    adminNames,
    basicNames,
  };
})(ListProviders);
