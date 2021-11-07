import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';

export const obtainTypes = ['Purchased', 'Donated'];
export const supplyPublications = {
  supply: 'Supply',
};

class SupplyCollection extends BaseCollection {
  constructor() {
    super('Supply', new SimpleSchema({
      name: String,
      location: String,
      quantity: Number,
      lot: Array,
      'lot.$': {
        type: String,
        optional: true,
      },
      obtained: {
        type: String,
        allowedValues: obtainTypes,
        defaultValue: 'Purchased',
      },
      expiration: {
        type: Date,
        optional: true,
      },
      unit: {
        type: String,
        optional: true,
      },
      note: {
        type: String,
        optional: true,
      },
    }));
  }

  /**
   * Defines a new Supply item.
   * @param name the name of the item.
   * @param location the location of the item.
   * @param quantity the supply of item
   * @param expiration the date that the item expires if applicable
   * @param lot the lot number
   * @param obtained whether the item was purchased or donated
   * @param unit the unit of the supply
   * @param note the note of the item.
   * @return {String} the docID of the new document.
   */
  define({ name, location, quantity, expiration, obtained, lot, unit, note }) {
    const docID = this._collection.insert({
      name,
      location,
      quantity,
      expiration,
      obtained,
      lot,
      unit,
      note,
    });

    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the new name (optional).
   * @param location the new location (optional).
   * @param quantity the new type (optional).
   * @param expiration the new expiration (optional).
   * @param obtained the new obtained (optional).
   * @param lot the new lot (optional).
   * @param note the new unit (optional).
   * @param unit the unit of the item (optional).
   */
  update(docID, { name, quantity, location, expiration, obtained, lot, unit, note }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    if (location) {
      updateData.location = location;
    }

    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(quantity)) {
      updateData.quantity = quantity;
    }

    if (unit) {
      updateData.unit = unit;
    }

    if (expiration) {
      updateData.expiration = expiration;
    }

    if (obtained) {
      updateData.obtained = obtained;
    }

    if (lot) {
      updateData.lot = lot;
    }

    if (note) {
      updateData.note = note;
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
      // get the SupplyCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(supplyPublications.supply, function publish() {
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
  subscribeSupply() {
    if (Meteor.isClient) {
      return Meteor.subscribe(supplyPublications.supply);
    }
    return null;
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{ name, location, quantity, expiration, obtained, lot, note }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const location = doc.location;
    const quantity = doc.quantity;
    const expiration = doc.expiration;
    const obtained = doc.obtained;
    const lot = doc.lot;
    const unit = doc.unit;
    const note = doc.note;
    return { name, location, quantity, expiration, obtained, lot, unit, note };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Supply = new SupplyCollection();
