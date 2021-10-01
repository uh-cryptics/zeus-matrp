import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input } from 'semantic-ui-react';
import _ from 'lodash';

const Dispense = ({ set, open, setOpen }) => {
  const uniqueNames = _.uniq(set.map(item => item.name))
    .map((type, index) => ({ key: `name${index}`, text: type, value: type }));
  const uniqueLot = _.uniq(set.map(item => item.lot)).map((lot, i) => ({ key: `loc${i}`, text: lot, value: lot }));

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
                  <Input placeholder="Medical Number" name="medical-number" />
                </Form.Field>
              </Form.Field>
              <Form.Field required>
                <label>Clinic Location</label>
                <Input placeholder="Clinic Location" name="clinic-location"/>
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
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Medicine</label>
                  <Form.Dropdown
                    search
                    selection
                    placeholder="Select a medicine to dispense..."
                    options={uniqueNames}
                  />
                </Form.Field>
                <Form.Field required width="5">
                  <label>Amount</label>
                  <Input type="number" name="amount" placeholder="#" />
                </Form.Field>
              </Form.Group>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => setOpen(false)}>Cancel</Button>
          <Button primary onClick={() => setOpen(false)}>Dispense</Button>
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
