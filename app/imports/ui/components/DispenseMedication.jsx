import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input, Message, Segment, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { History } from '../../api/history/HistoryCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Medication } from '../../api/medication/MedicationCollection';

const DispenseMedication = ({ set, open, setOpen }) => {
  const uniqueNames = _.uniq(set.map(item => ({ _id: item._id, name: item.name })))
    .map((type) => ({ key: type._id, text: type.name, value: type._id }));
  const uniqueLot = _.uniq(set.map(item => item.lot)).map((lot, i) => ({ key: `loc${i}`, text: lot, value: lot }));

  const [patientNumber, setPatientNumber] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState({ has: false, message: '' });

  const clear = () => {
    setPatientNumber('');
    setClinicLocation('');
    setLotNumber('');
    setItem('');
    setAmount('');
    setProvider('');
    setError({ has: false, message: '' });
    setOpen(false);
  };

  const findLOT = (product) => {
    setItem(product);

    const itemChoosen = uniqueNames.find((i) => i.key === product);
    const index = _.indexOf(uniqueNames, itemChoosen);

    setLotNumber(uniqueLot[index].text);
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
                    <Input placeholder="Medical Number" name="medical-number" onChange={(e) => setPatientNumber(e.target.value)} value={patientNumber}/>
                  </Form.Field>
                </Form.Field>
                <Form.Field required>
                  <label>Provider</label>
                  <Input placeholder="Provider" name="provider" value={provider} onChange={(e) => setProvider(e.target.value)}/>
                </Form.Field>
                <Form.Field required width='10'>
                  <label>Clinic Location</label>
                  <Input placeholder="Clinic Location" name="clinic-location" value={clinicLocation} onChange={(e) => setClinicLocation(e.target.value)}/>
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <Form.Group widths="equal">
                  <Form.Field required>
                    <label>LOT</label>
                    <Form.Dropdown
                      search
                      selection
                      disabled
                      placeholder="5678EFGH"
                      options={uniqueLot}
                      value={lotNumber}
                      onChange={(e, data) => setLotNumber(data.value)}
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
                    <Input type="number" name="amount" placeholder="1" value={amount} onChange={(e) => setAmount(e.target.value, 10)}/>
                  </Form.Field>
                </Form.Group>
              </Form.Field>
              <Message error header='Error' content={error.message}/>
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => clear()}>Cancel</Button>
          <Button primary onClick={() => submit()}>Dispense</Button>
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
