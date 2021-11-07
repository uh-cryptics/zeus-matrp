import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input, Message, Segment, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { History } from '../../api/history/HistoryCollection';
import { sortList } from '../utilities/ListFunctions';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Medication } from '../../api/medication/MedicationCollection';

const DispenseQR = ({ set, open, setOpen, fullName }) => {

  const [patientNumber, setPatientNumber] = useState('');
  const [amount, setAmount] = useState('');

  const { name, quantity, location, expiration, obtained, lot, type, unit, note } = this.props.doc; // todo: i think

  // [] todo: figure out how to get set and fullName not as parameters
  // [] todo: might have to add a Medication publication in /imports/startup/server/Publication.js

  // [] todo: get the id from url, localhost/dispenseQR/id      -     should be good done at the bottom of the file
  // [] todo: search the database for the id     -    should be good, done at the bottom of the file
  // [X] todo: disable all form fields except patient number and amount
  // [X] todo: delete findLOT
  // [X] todo: delete the above hooks, except patient number and amount
  // [X] todo: delete findLOT
  // [] todo: delete the form or inputs onchange(), except for patient number and amount
  // [] todo: change form or input values to the values found from the database, except patient number and amount
  //          such as doc.lotnumber, doc.cliniclocation, etc...
  // [X] todo: delete const itemName in submit()
  // [] todo: delete all modal related stuff
  // [] todo: make the page look nice
  // [] todo: remove required from form fields that are disabled if its not working


  const submit = () => {
    if (patientNumber && clinicLocation && lotNumber && item && amount && fullName) {
      const oldAmount = _.find(set, (product) => product._id === item).quantity;
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


  console.log(this.props.doc);  // todo: check if this displays teh medication

  return (
    <div>
      
        <Header>
          <Icon.Group size='large'>
            <Icon color='blue' name='user md' />
            <Icon corner='top right' name='pills' />
          </Icon.Group>
          &nbsp;
          Dispense Medication
        </Header>
        <Content>
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
                  <Input placeholder="Clinic Location" name="clinic-location" value={} disabled/>
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <Form.Group widths="equal">
                  <Form.Field required width="5">
                    <label>LOT</label>
                    <Form.Dropdown
                      search
                      selection
                      placeholder="Lot Number"
                      options={lotList}
                      value={}
                     
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Item</label>
                    <Form.Dropdown
                      search
                      selection
                      placeholder="Select a medicine or supply to dispense..."
                      value={}
                
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
        </Content>
        <Actions>
          <Button secondary onClick={() => clear()}>Cancel</Button>
          <Button
            content="Dispense"
            labelPosition='right'
            icon='checkmark'
            primary
            onClick={() => submit()}
          />
        </Actions>
    </div>
  );
};

DispenseQR.propTypes = {
  doc: PropTypes.object,
};
/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
    // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
    const documentId = match.params._id;
    // Get access to med documents.
    const subscription = Medication.subscribeMedication();
    return {
      doc: Medication.findOne(documentId),
    };
  })(DispenseQR);
