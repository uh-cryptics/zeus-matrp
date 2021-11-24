import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Button, Dropdown, Grid, Header, Icon, Label, List, Modal } from 'semantic-ui-react';
import moment from 'moment';
import { ROLE } from '../../api/role/Role';

const InventoryInformation = ({ table, list, currentUser, item, open, setOpen }) => {
  const [defaultLot, setDefaultLot] = useState(0);

  return (item ?
    <Modal
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      size='small'>
      <Modal.Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header icon={table === 'medications' ? 'pills' : 'first aid'} content={item.name} />
            </Grid.Column>
            <Grid.Column>
              <Label>LOT</Label>
              <Dropdown
                selection
                value={defaultLot}
                options={
                  list.filter((pro) => pro.name === item.name)
                    .map((prop, i) => ({ key: `item${i}`, value: i, text: prop.lot }))
                }
                onChange={(e, { value }) => setDefaultLot(value)}
                style={{ maxWidth: 'fit-content' }}
              >
              </Dropdown>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Header>
      <Modal.Content>
        {table === 'medications' ?
          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Name
                  <Header.Subheader>
                    {item.name}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Type
                  <Header.Subheader>
                    <List>
                      {item.type?.map((t, index) => <List.Item key={index}>{t}</List.Item>)}
                    </List>
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Quantity
                  <Header.Subheader>
                    {item.quantity}&nbsp;{item.unit}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Location
                  <Header.Subheader>
                    {item.location}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Lot
                  <Header.Subheader>
                    {item.lot}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Expiration
                  <Header.Subheader>
                    {moment(item.expiration).format('LL')}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Obtained
                  <Header.Subheader>
                    {item.obtained}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Notes
                  <Header.Subheader>
                    {item.note}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          :
          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Name
                  <Header.Subheader>
                    {item.name}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Quantity
                  <Header.Subheader>
                    {item.quantity}&nbsp;{item.unit}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Location
                  <Header.Subheader>
                    {item.location}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Lot
                  <Header.Subheader>
                    {item.lot}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Expiration
                  <Header.Subheader>
                    {item.expiration ? moment(item.expiration).format('LL') : 'N/A'}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Obtained
                  <Header.Subheader>
                    {item.obtained}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                Notes
                  <Header.Subheader>
                    {item.note}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
      </Modal.Content>
      {currentUser ?
        <Modal.Actions>
          <Button color='red' onClick={() => setOpen(false, 'delete')}>
            <Icon name='trash' /> Delete
          </Button>
          <Button color='blue' onClick={() => setOpen(false, 'edit')}>
            <Icon name='edit' /> Edit
          </Button>
        </Modal.Actions>
        :
        <Modal.Actions>
          <Button color='red' onClick={() => setOpen(false)}>
            <Icon name='close' /> Close
          </Button>
        </Modal.Actions>
      }
    </Modal>
    : <></>
  );
};

InventoryInformation.propTypes = {
  table: PropTypes.string,
  list: PropTypes.array.isRequired,
  item: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  currentUser: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Check what level the current user is
  const currentUser = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);

  return {
    currentUser,
  };
})(InventoryInformation);
