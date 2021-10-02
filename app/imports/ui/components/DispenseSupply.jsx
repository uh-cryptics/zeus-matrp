import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input, Message, Segment, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { History } from '../../api/history/HistoryCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Supply } from '../../api/supply/SupplyCollection';

const DispenseSupply = ({ set, open, setOpen }) => {
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

  const submit = () => {
    if (patientNumber && clinicLocation && item && _.isNumber(amount) && provider) {
      const itemName = _.find(uniqueNames, (i) => i.key === item).text;
      const oldAmount = Supply.findDoc(item).quantity;
      if (oldAmount < amount) {
        swal('Error', `There is not enough inventory to dispense ${amount} ${itemName}`, 'error')
      } else {
        const definitionData = { patientNumber, clinicLocation, lotNumber, item: itemName, amount, provider };
        defineMethod.callPromise({ collectionName: History.getCollectionName(), definitionData })
          .catch(e => swal('Error', e.message, 'error'))
          .then(() => {
            swal('Success', `Dispensed ${amount} ${itemName}`, 'success');
          });
        const updateData = { id: item, quantity: oldAmount - amount };
        updateMethod.callPromise({ collectionName: Supply.getCollectionName(), updateData })
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
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>
          <Icon.Group size='large'>
            <Icon color='blue' name='user md' />
            <Icon corner='top right' name='first aid' />
          </Icon.Group>
          &nbsp;
          Dispense Supply
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
                  <Form.Field>
                    <label>LOT</label>
                    <Form.Dropdown
                      search
                      selection
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
                      onChange={(e, data) => setItem(data.value)}
                    />
                  </Form.Field>
                  <Form.Field required width="5">
                    <label>Amount</label>
                    <Input type="number" name="amount" placeholder="#" value={amount} onChange={(e) => setAmount(parseInt(e.target.value, 10))}/>
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

DispenseSupply.propTypes = {
  set: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default DispenseSupply;
