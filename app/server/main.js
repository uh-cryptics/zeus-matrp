import '/imports/startup/server/Accounts';
import '/imports/startup/server/Publications';
import '/imports/startup/server/Mongo';
// be sure to import the methods.
import '../imports/api/base/BaseCollection.methods';

import { Roles } from 'meteor/alanning:roles'
import { ROLE } from '../imports/api/role/Role';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
  /**
   * Update a user's roles.
   *
   * @param {Object} targetUserId Id of user to update.
   * @param {Array} roles User's new roles.
   */
  'updateRoles'({ targetUserId, roles }) {
    new SimpleSchema({
      targetUserId: { type: String },
      roles: { type: Array },
      'roles.$': { type: String }
    }).validate({ targetUserId, roles });

    const loggedInUser = Meteor.user();

    if (!loggedInUser ||
      !Roles.userIsInRole(loggedInUser, ROLE.ADMIN)) {
      throw new Meteor.Error('access-denied', "Access denied");
    }

    Roles.setUserRoles([targetUserId], roles);
    console.log(Roles.getRolesForUser(targetUserId));
  }
})