export const SEND_ACTION = 'sketch/bridge/SEND_ACTION';
export const RECEIVE_ACTION = 'sketch/bridge/RECEIVE_ACTION';

export const sendAction = (name, payload) => {
  return {
    type: SEND_ACTION,
    payload: {
      name,
      payload
    }
  };
};

export const receiveAction = (name, payload) => {
  return {
    type: RECEIVE_ACTION,
    payload: {
      name,
      payload
    }
  };
};
