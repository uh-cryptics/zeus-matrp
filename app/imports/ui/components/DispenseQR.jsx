import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input, Message, Segment, Icon, Header, Content } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { History } from '../../api/history/HistoryCollection';
import { sortList } from '../utilities/ListFunctions';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Medication } from '../../api/medication/MedicationCollection';

import { withTracker } from 'meteor/react-meteor-data';

import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

const DispenseQR = ({ fullName, doc }) => {

  const [patientNumber, setPatientNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [userNames, setUserNames] = useState();
  const [error, setError] = useState({ has: false, message: '' });
  const space = ' ';

  const { name, location, lot} = doc; // todo: i think

  // [] todo: figure out how to get set and fullName not as parameters
  // [-]] todo: might have to add a Medication publication in /imports/startup/server/Publication.js

  // [-] todo: get the id from url, localhost/dispenseQR/id      -     should be good done at the bottom of the file
  // [-] todo: search the database for the id     -    should be good, done at the bottom of the file
  // [X] todo: disable all form fields except patient number and amount
  // [X] todo: delete findLOT
  // [X] todo: delete the above hooks, except patient number and amount
  // [X] todo: delete findLOT
  // [X] todo: delete the form or inputs onchange(), except for patient number and amount
  // [X] todo: change form or input values to the values found from the database, except patient number and amount
  //          such as doc.lotnumber, doc.cliniclocation, etc...
  // [X] todo: delete const itemName in submit()
  // [] todo: delete all modal related stuff
  // [] todo: make the page look nice
  // [] todo: remove required from form fields that are disabled if its not working


  const submit = () => {
    if (patientNumber && clinicLocation && lotNumber && item && amount && fullName) {
      const oldAmount = _.find(doc, (product) => product._id === item).quantity;
      const newAmount = _.toNumber(amount);
      if (oldAmount < newAmount) {
        swal('Error', `There is not enough inventory to dispense ${newAmount} ${itemName}`, 'error');
      } else {
        const definitionData = { patientNumber, clinicLocation, lotNumber, item: itemName, amount: newAmount, provider: fullName.firstName + space + fullName.lastName };
        let collectionName = History.getCollectionName();
        defineMethod.callPromise({ collectionName, definitionData })
          .catch(e => swal('Error', e.message, 'error'))
          .then(() => {
            swal({ title: 'Success', text: `Dispensed ${newAmount} ${itemName}`, icon: 'success', timer: 1500 });
          });
        const updateData = { id: item, quantity: oldAmount - newAmount };
        collectionName = Medication.getCollectionName();
        updateMethod.callPromise({ collectionName, updateData })
          .catch(e => swal('Error', e.message, 'error'))
          .then(() => clear());
      }
    } else {
      setError({ has: true, message: 'Please input all required fields' });
    }
  };


  console.log(doc);  // todo: check if this displays teh medication
  console.log(fullName);

  return (
    <div>
       
          <Form error={error.has}>
            <Segment>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Patient Medical Number</label>
                  <Form.Field>
                    <Input placeholder="Medical Number" name="medical-number" onChange={(e) => setPatientNumber(e.target.value)} value={patientNumber} />
                  </Form.Field>
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Provider</label>
                  {fullName ?
                    <Input placeholder="Provider" name="provider" value={fullName.firstName + space + fullName.lastName} disabled/>
                    :
                    <>
                    </>
                  }
                </Form.Field>
                <Form.Field required width='10'>
                  <label>Clinic Location</label>
                  <Input placeholder="Clinic Location" name="clinic-location" value={location} disabled/>
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <Form.Group widths="equal">
                  <Form.Field required width="5">
                    <label>LOT</label>
                    <Input
                     
                      value={lot}
                      disabled
                     
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Item</label>
                    <Input
                    
                      value={name}
                      disabled
                
                    />
                  </Form.Field>
                  <Form.Field required width="5">
                    <label>Amount</label>
                    <Input type="number" name="amount" placeholder="1" value={amount} onChange={(e) => setAmount(e.target.value, 10)} />
                  </Form.Field>
                </Form.Group>
              </Form.Field>
              <Message error header='Error' content={error.message} />
            </Segment>
          </Form>


          <Button secondary onClick={() => clear()}>Cancel</Button>
          <Button
            content="Dispense"
            labelPosition='right'
            icon='checkmark'
            primary
            onClick={() => submit()}
          />

    </div>
  );
};

DispenseQR.propTypes = {
  doc: PropTypes.object,
  names: PropTypes.object,
};
/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
    // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
    const documentId = match.params._id;
    const docu = Medication.findOne(documentId);
    // Get access to med documents.
    const subscription = Medication.subscribeMedication();

    const currentUser = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
    console.log(`curernt user ${currentUser}`);
    let names;
    if (currentUser) {
      names = AdminProfiles.findByEmail(Meteor.user().username);
    } else {
      names = UserProfiles.findByEmail(Meteor.user().username);
    }

    console.log(names);

    return {
      doc: docu,
      fullName: names
    };
  })(DispenseQR);
