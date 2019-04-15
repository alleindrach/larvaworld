

import Date from '../common/Date'

export const getDateString = (t) => {
  let date = new Date(t);

  return date.Format('yyyy-MM-dd');
}

export const getZhDateString = (t) => {
  let date = new Date(t);

  return date.Format('yyyy年MM月dd日');
}

export const getDateTimeString = (t) => {
  let date = new Date(t);

  return date.Format('yyyy-MM-dd hh:mm')
}

export const getTimeString = (t) => {
  let date = new Date(t);

  return date.Format('hh:mm:ss');
}

export const getTimestamp = (t) => {
  let date = new Date(t);
  return date.getTime();
}