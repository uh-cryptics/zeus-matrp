import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input, Message, Segment, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { History } from '../../api/history/HistoryCollection';
import { sortList } from '../utilities/ListFunctions';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Medication } from '../../api/medication/MedicationCollection';

const DispenseMedication = ({ set, open, setOpen }) => {
  const uniqueNames = sortList(_.uniq(set.map(item => ({ _id: item._id, name: item.name })))
    .map((type) => ({ key: type._id, text: type.name, value: type._id })), (t) => t.text.toLowerCase());
  const uniqueLot = _.uniq(_.flattenDeep(set.map(item => item.lot))).map((lot, i) => ({ key: `loc${i}`, text: lot, value: lot }));

  const [patientNumber, setPatientNumber] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [lotList, setLotList] = useState(uniqueLot);
  const [lotNumber, setLotNumber] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState({ has: false, message: '' });

  const resetList = () => {
    setLotList(uniqueLot);
  };

  const clear = () => {
    setPatientNumber('');
    setClinicLocation('');
    resetList();
    setLotNumber('');
    setItem('');
    setAmount('');
    setProvider('');
    setError({ has: false, message: '' });
    setOpen(false);
  };

  const findLOT = (product) => {
    setItem(product);
    // Setting lot dropdown back to original list, just in case user switches to different item instead of previously selected
    resetList();
    // Finds the item with the same _id in the collection as the product variable and returns the lot(s)
    // Iterates through each lot number in the find and filters the lotList in the dropdown with matching lot numbers.
    // Lastly, flattens the result by one so it is just an array of objects.
    const lots = _.flatten((set.find((i) => i._id === product).lot).map((j) => uniqueLot.filter((i) => i.value === j)));
    setLotList(lots);
    // Grabbing index of lot num in entire list
    const index = _.findIndex(uniqueLot, lots[0]);
    setLotNumber(uniqueLot[index].text);
  };

  const findItem = (lotNum) => {
    setLotNumber(lotNum);

    const collectionID = set.find((i) => i.lot.includes(lotNum))._id;

    setItem(collectionID);
  };

  const submit = () => {
    if (patientNumber && clinicLocation && lotNumber && item && amount && provider) {
      const itemName = _.find(uniqueNames, (i) => i.key === item).text;
      const oldAmount = _.find(set, (product) => product._id === item).quantity;
      const newAmount = _.toNumber(amount);
      if (oldAmount < newAmount) {
        swal('Error', `There is not enough inventory to dispense ${newAmount} ${itemName}`, 'error');
      } else {
        const definitionData = { patientNumber, clinicLocation, lotNumber, item: itemName, amount: newAmount, provider };
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

  return (
    <div>
      <Modal
        closeIcon
        onClose={() => {
          setOpen(false);
          clear();
        }}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>
          <Icon.Group size='large'>
            <Icon color='blue' name='user md' />
            <Icon corner='top right' name='pills' />
          </Icon.Group>
          &nbsp;
          Dispense Medication
        </Modal.Header>
        <Modal.Content>
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
                  <Input placeholder="Provider" name="provider" value={provider} onChange={(e) => setProvider(e.target.value)} />
                </Form.Field>
                <Form.Field required width='10'>
                  <label>Clinic Location</label>
                  <Input placeholder="Clinic Location" name="clinic-location" value={clinicLocation} onChange={(e) => setClinicLocation(e.target.value)} />
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
                      value={lotNumber}
                      onChange={(e, data) => findItem(data.value)}
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Item</label>
                    <Form.Dropdown
                      search
                      selection
                      placeholder="Select a medicine or supply to dispense..."
                      options={uniqueNames}
                      value={item}
                      onChange={(e, data) => findLOT(data.value)}
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
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => clear()}>Cancel</Button>
          <Button
            content="Dispense"
            labelPosition='right'
            icon='checkmark'
            primary
            onClick={() => submit()}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

DispenseMedication.propTypes = {
  set: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default DispenseMedication;
