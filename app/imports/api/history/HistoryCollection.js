import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const historyPublications = {
  history: 'History',
};

class HistoryCollection extends BaseCollection {
  constructor() {
    super('History', new SimpleSchema({
      patientNumber: String,
      clinicLocation: String,
      lotNumber: String,
      item: String,
      amount: Number,
      provider: String,
    }));
  }

  /**
   * Defines a new History item.
   * @param patientNumber the patient number
   * @param clinicLocation the clinic location
   * @param lotNumber the lot number of the item
   * @param item the item
   * @param amount the amount of item
   * @param provider the provider
   * @return {String} the docID of the new document.
   */
  define({ patientNumber, clinicLocation, lotNumber, item, amount, provider }) {
    const docID = this._collection.insert({
      patientNumber,
      clinicLocation,
      lotNumber,
      item,
      amount,
      provider,
    });

    return docID;
  }

  /**
   * Updates the given document.
   * @param patientNumber the new patient number
   * @param clinicLocation the new clinic location
   * @param lotNumber the new lot number of the item
   * @param item the new item
   * @param amount the new amount of item
   * @param provider the new provider
   */
  update(docID, { patientNumber, clinicLocation, lotNumber, item, amount, provider }) {
    const updateData = {};
    if (patientNumber) {
      updateData.patientNumber = patientNumber;
    }

    if (clinicLocation) {
      updateData.clinicLocation = clinicLocation;
    }

    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(amount)) {
      updateData.amount = amount;
    }

    if (lotNumber) {
      updateData.lotNumber = lotNumber;
    }

    if (item) {
      updateData.item = item;
    }

    if (provider) {
      updateData.provider = provider;
    }

    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the HistoryCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(historyPublications.history, function publish() {
        if (this.userId) {
          return instance._collection.find({});
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeHistory() {
    if (Meteor.isClient) {
      return Meteor.subscribe(historyPublications.history);
    }
    return null;
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{ name, location, quantity, expiration, obtained, lot }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const patientNumber = doc.patientNumber;
    const clinicLocation = doc.clinicLocation;
    const amount = doc.amount;
    const lotNumber = doc.lotNumber;
    const item = doc.item;
    const provider = doc.provider;
    return { patientNumber, clinicLocation, amount, lotNumber, item, provider };
  }

  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const History = new HistoryCollection();
