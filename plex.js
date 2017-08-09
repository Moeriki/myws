'use strict';

const AWS = require('paws-sdk');

const { EC2_PENDING, EC2_RUNNING, EC2_STOPPING, EC2_STOPPED } = require('./constants');

// constants

const PLEX_INSTANCE_ID = 'i-039ffec92f9a21713';

// private

const ec2 = new AWS.EC2({ region: 'eu-west-2' });

// const getState = (data) => {
//   console.dir(data, { colors: true, depth: 5 });
//   return data.InstanceStatuses[0].InstanceState;
// };

// exports

exports.status = () => ec2.describeInstances()
  .then(({ data }) => {
    const reservation = data.Reservations.find(
      (reservation) => reservation.Instances[0].InstanceId === PLEX_INSTANCE_ID
    );
    return reservation.Instances[0].State.Name;
  })
;

exports.start = () => ec2.startInstances({ InstanceIds: [PLEX_INSTANCE_ID] })
  .then(({ data }) => {
    // console.dir(data, { colors: true, depth: null });
    const { Code, Name } = data.StartingInstances[0].CurrentState;
    if (Code !== EC2_PENDING && Code !== EC2_RUNNING) {
      throw new Error(`Expected state to be 'pending' or 'running'. Instead received '${Name}'.`)
    }
    return Name;
  })
;

exports.stop = () => ec2.stopInstances({ InstanceIds: [PLEX_INSTANCE_ID] })
  .then(({ data }) => {
    // console.dir(data, { colors: true, depth: null });
    const { Code, Name } = data.StoppingInstances[0].CurrentState;
    if (Code !== EC2_STOPPING && Code !== EC2_STOPPED) {
      throw new Error(`Expected state to be 'stopping' or 'stopped'. Instead received '${Name}'.`)
    }
    return Name;
  })
;
