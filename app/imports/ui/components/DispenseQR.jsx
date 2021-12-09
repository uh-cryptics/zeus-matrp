import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Message, Segment, Loader, Container } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import { History } from '../../api/history/HistoryCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Medication } from '../../api/medication/MedicationCollection';

const DispenseQR = ({ doc, ready }) => {

  const [patientNumber, setPatientNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState({ has: false, message: '' });
  const [location, setLocation] = useState('');
  const [nameF, setFName] = useState('');

  const clear = () => {
    setPatientNumber('');
    setLocation('');
    setAmount('');
    setFName('');
    setError({ has: false, message: '' });
  };

  const submit = () => {
    if (patientNumber && location && amount && nameF) {
      const oldAmount = doc.quantity;
      const newAmount = _.toNumber(amount);
      if (oldAmount < newAmount) {
        swal('Error', `There is not enough inventory to dispense ${newAmount} ${doc.name}`, 'error');
      } else {
        const definitionData = { patientNumber, clinicLocation: location, lotNumber: doc.lot.toString(), item: doc.name, amount: newAmount, provider: nameF };
        let collectionName = History.getCollectionName();
        defineMethod.callPromise({ collectionName, definitionData })
          .catch(e => swal('Error', e.message, 'error'))
          .then(() => {
            swal({ title: 'Success', text: `Dispensed ${newAmount} ${doc.name}`, icon: 'success', timer: 1500 });
          });
        const updateData = { id: doc._id, quantity: oldAmount - newAmount };
        collectionName = Medication.getCollectionName();
        updateMethod.callPromise({ collectionName, updateData })
          .catch(e => swal('Error', e.message, 'error'))
          .then(() => clear());
      }
    } else {
      setError({ has: true, message: 'Please input all required fields' });
    }
  };

  return (
    (ready ?

      <Container>
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
                <Input placeholder="Your Name" name="provider" value={nameF} onChange={(e) => setFName(e.target.value)} />

              </Form.Field>
              <Form.Field required width='10'>
                <label>Clinic Location</label>
                <Input placeholder="Clinic Location" name="clinic-location" value={location} onChange={(e) => setLocation(e.target.value)}/>
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <Form.Group widths="equal">
                <Form.Field required width="5">
                  <label>LOT</label>
                  <Input
                    value={doc.lot}
                    disabled
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Item</label>
                  <Input
                    value={doc.name}
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
      </Container>
      :
      <Loader active>Getting data</Loader>
    )
  );
};

DispenseQR.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};
/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const docu = Medication.findOne(documentId);
  // Get access to med documents.
  const subscription = Medication.subscribeMedication();
  const ready = (docu !== null) && subscription.ready();

  return {
    doc: docu,
    ready,
  };
})(DispenseQR);
