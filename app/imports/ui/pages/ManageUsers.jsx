import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { Button, Dropdown, Table } from 'semantic-ui-react';
import { ProviderProfiles } from '../../api/user/ProviderProfileCollection';
import { ROLES } from '../../api/role/Role';
import swal from 'sweetalert';

const ManageUsers = ({ ready, users }) => {

  const [selected, setSelected] = useState({});

  const setRole = (user, role) => {
    Meteor.call('updateRoles', { targetUserId: user._id, roles: [role] }, (error, response) => {
      if (error) {
        swal('Error', error.message, 'error');
      }
      swal({ title: 'Success', text: `Made ${user.username} a ${role}`, icon: 'success', timer: 1500 });
    });
  };

  return (ready ? <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>User</Table.HeaderCell>
        <Table.HeaderCell>Roles</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      { users.map((user) => {
          const roles = ROLES.map((role, index) => ({ key: `role_${index}`, text: role, value: role }));
          console.log(roles);
          return <Table.Row key={user._id}>
            <Table.Cell>
              { user.email }
            </Table.Cell>
            <Table.Cell>
              <Dropdown selection options={roles} onChange={(e, { value }) => setSelected({ user, role: value})} defaultValue={user.role}/>
              <Button primary icon='save' content='Save' onClick={() => setRole(selected.user, selected.role)}/>
            </Table.Cell>
          </Table.Row>
        })
      }
    </Table.Body>
  </Table> :
  '');
};

export default withTracker(() => {
  const sub = AdminProfiles.subscribe();
  const sub2 = UserProfiles.subscribe();
  const sub3 = ProviderProfiles.subscribe(); //isnt working currently
  const ready = sub.ready() && sub2.ready();
  const users = UserProfiles.find({}).fetch();
  const admins = AdminProfiles.find({}).fetch();
  return {
    users: users.concat(admins),
    ready,
  };
})(ManageUsers);