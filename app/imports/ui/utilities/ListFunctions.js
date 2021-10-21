import _ from 'lodash';

/** Sorts given list  */
export const sortList = (list, filter) => {
  const result = _.sortBy(list, filter);
  return result;
};

export const filterOutUndefined = (list) => {
  const result = list.filter((item) => item.text !== undefined);
  return result;
};
