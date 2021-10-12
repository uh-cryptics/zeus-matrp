import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseProfileCollection from './BaseProfileCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';

class ProviderProfileCollection extends BaseProfileCollection {
  constructor() {
    super('ProviderProfile', new SimpleSchema({}));
  }

  /**
   * Defines the profile associated with an Provider and the associated Meteor account.
   * @param email The email associated with this profile. Will be the username.
   * @param password The password for this user.
   * @param firstName The first name.
   * @param lastName The last name.
   * @param uhNumber The optional UH Number a provider may have.
   */
  define({ email, uhNumber, firstName, lastName, password }) {
    if (Meteor.isServer) {
      // console.log('define', email, firstName, lastName, password);
      const username = email;
      const uhIdNumber = uhNumber;
      const user = this.findOne({ email, firstName, lastName });
      if (!user) {
        const role = ROLE.PROVIDER;
        const profileID = this._collection.insert({ email, firstName, lastName, userID: this.getFakeUserId(), role });
        const userID = Users.define({ username, uhIdNumber, role, password });
        this._collection.update(profileID, { $set: { userID } });
        return profileID;
      }
      return user._id;
    }
    return undefined;
  }

  /**
   * Updates the ProviderProfile. You cannot change the email or role.
   * @param docID the id of the ProviderProfile
   * @param firstName new first name (optional).
   * @param lastName new last name (optional).
   */
  update(docID, { firstName, lastName }) {
    this.assertDefined(docID);
    const updateData = {};
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Removes this profile, given its profile ID.
   * Also removes this user from Meteor Accounts.
   * @param profileID The ID for this profile object.
   */
  removeIt(profileID) {
    if (this.isDefined(profileID)) {
      return super.removeIt(profileID);
    }
    return null;
  }

  /**
   * Implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or Provider.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Provider.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.PROVIDER]);
  }

  /**
   * Returns an array of strings, each one representing an integrity problem with this collection.
   * Returns an empty array if no problems were found.
   * Checks the profile common fields and the role..
   * @returns {Array} A (possibly empty) array of strings indicating integrity issues.
   */
  checkIntegrity() {
    const problems = [];
    this.find().forEach((doc) => {
      if (doc.role !== ROLE.PROVIDER) {
        problems.push(`ProviderProfile instance does not have ROLE.PROVIDER: ${doc}`);
      }
    });
    return problems;
  }

  /**
   * Returns an object representing the ProviderProfile docID in a format acceptable to define().
   * @param docID The docID of a ProviderProfile
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const email = doc.email;
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    return { email, firstName, lastName };
  }
}

/**
 * Profides the singleton instance of this class to all other entities.
 * @type {ProviderProfileCollection}
 */
export const ProviderProfiles = new ProviderProfileCollection();
