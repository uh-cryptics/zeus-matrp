import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input } from 'semantic-ui-react';
import _ from 'lodash';

const Dispense = ({ set, open, setOpen }) => {
  const uniqueNames = _.uniq(set.map(item => item.name))
    .map((type, index) => ({ key: `name${index}`, text: type, value: type }));
  const uniqueLot = _.uniq(set.map(item => item.lot)).map((lot, i) => ({ key: `loc${i}`, text: lot, value: lot }));

  const [patientNumber, setPatientNumber] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');

  const submit = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>Dispense Medication</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Patient Medical Number</label>
                <Form.Field>
                  <Input placeholder="Medical Number" name="medical-number" onChange={(e) => setPatientNumber(e.target.value)} value={patientNumber}/>
                </Form.Field>
              </Form.Field>
              <Form.Field required>
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
                    options={uniqueNames
                    }value={item}
                    onChange={(e, data) => setItem(data.value)}
                  />
                </Form.Field>
                <Form.Field required width="5">
                  <label>Amount</label>
                  <Input type="number" name="amount" placeholder="#" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                </Form.Field>
              </Form.Group>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => setOpen(false)}>Cancel</Button>
          <Button primary onClick={() => submit()}>Dispense</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

Dispense.propTypes = {
  set: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default Dispense;
