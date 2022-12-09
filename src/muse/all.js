/*
 *  DSP.js - a comprehensive digital signal processing  library for javascript
 *
 *  Created by Corban Brook <corbanbrook@gmail.com> on 2010-01-01.
 *  Copyright 2010 Corban Brook. All rights reserved.
 *
 */

/**
 * FFT is a class for calculating the Discrete Fourier Transform of a signal
 * with the Fast Fourier Transform algorithm.
 *
 * @param {Number} bufferSize The size of the sample buffer to be computed. Must be power of 2
 * @param {Number} sampleRate The sampleRate of the buffer (eg. 44100)
 *
 * @constructor
 */
export class FFT {
  constructor(bufferSize, sampleRate) {
    //save incoming vars
    this.bufferSize = bufferSize;
    this.sampleRate = sampleRate;

    //init and calc vars
    this.rval;
    this.ival;
    this.mag;
    this.sqrt = Math.sqrt;
    this.bandwidth = ((2 / bufferSize) * sampleRate) / 2;
    this.bSi = 2 / this.bufferSize;

    //init arrays that hold the real and imaginary data
    this.spectrum = new Float64Array(bufferSize / 2);
    this.real = new Float64Array(bufferSize);
    this.imag = new Float64Array(bufferSize);

    //peaks
    this.peakBand = 0;
    this.peak = 0;

    //save length
    this.maxLength = length;
    //fill buffer with zeroes to length
    this._buffer = new Array(length).fill(0);

    this.reverseTable = new Uint32Array(bufferSize);

    var limit = 1;
    var bit = bufferSize >> 1;

    var i;

    while (limit < bufferSize) {
      for (i = 0; i < limit; i++) {
        this.reverseTable[i + limit] = this.reverseTable[i] + bit;
      }

      limit = limit << 1;
      bit = bit >> 1;
    }

    this.sinTable = new Float64Array(bufferSize);
    this.cosTable = new Float64Array(bufferSize);

    for (i = 0; i < bufferSize; i++) {
      this.sinTable[i] = Math.sin(-Math.PI / i);
      this.cosTable[i] = Math.cos(-Math.PI / i);
    }
  }

  /**
   * Performs a forward transform on the sample buffer.
   * Converts a time domain signal to frequency domain spectra.
   *
   * @param {Array} buffer The sample buffer. Buffer Length must be power of 2
   *
   * @returns The frequency spectrum array
   */

  //called by code that needs to convert time based data into a frequency spectrum
  forward(buffer) {
    // Locally scope variables for speed up
    var bufferSize = this.bufferSize,
      cosTable = this.cosTable,
      sinTable = this.sinTable,
      reverseTable = this.reverseTable,
      real = this.real,
      imag = this.imag,
      spectrum = this.spectrum;

    var k = Math.floor(Math.log(bufferSize) / Math.LN2);

    if (Math.pow(2, k) !== bufferSize) {
      throw "Invalid buffer size, must be a power of 2.";
    }
    if (bufferSize !== buffer.length) {
      throw (
        "Supplied buffer is not the same size as defined FFT. FFT Size: " +
        bufferSize +
        " Buffer Size: " +
        buffer.length
      );
    }

    var halfSize = 1,
      phaseShiftStepReal,
      phaseShiftStepImag,
      currentPhaseShiftReal,
      currentPhaseShiftImag,
      off,
      tr,
      ti,
      tmpReal,
      i;

    for (i = 0; i < bufferSize; i++) {
      real[i] = buffer[reverseTable[i]];
      imag[i] = 0;
    }

    while (halfSize < bufferSize) {
      phaseShiftStepReal = cosTable[halfSize];
      phaseShiftStepImag = sinTable[halfSize];

      currentPhaseShiftReal = 1;
      currentPhaseShiftImag = 0;

      for (var fftStep = 0; fftStep < halfSize; fftStep++) {
        i = fftStep;

        while (i < bufferSize) {
          off = i + halfSize;
          tr =
            currentPhaseShiftReal * real[off] -
            currentPhaseShiftImag * imag[off];
          ti =
            currentPhaseShiftReal * imag[off] +
            currentPhaseShiftImag * real[off];

          real[off] = real[i] - tr;
          imag[off] = imag[i] - ti;
          real[i] += tr;
          imag[i] += ti;

          i += halfSize << 1;
        }

        tmpReal = currentPhaseShiftReal;
        currentPhaseShiftReal =
          tmpReal * phaseShiftStepReal -
          currentPhaseShiftImag * phaseShiftStepImag;
        currentPhaseShiftImag =
          tmpReal * phaseShiftStepImag +
          currentPhaseShiftImag * phaseShiftStepReal;
      }

      halfSize = halfSize << 1;
    }

    //update spectrum
    for (var i = 0, N = bufferSize / 2; i < N; i++) {
      this.rval = real[i];
      this.ival = imag[i];
      this.mag = this.bSi * sqrt(this.rval * this.rval + this.ival * this.ival);

      if (this.mag > this.peak) {
        this.peakBand = i;
        this.peak = this.mag;
      }

      spectrum[i] = this.mag;
    }

    //console.log("fft spec", spectrum);
    return spectrum;
  }
}

//Muse variables which P5 can access
export let batteryLevel = 0;
export let gyro = {
  x: 0,
  y: 0,
  z: 0,
};
export let accel = {
  x: 0,
  y: 0,
  z: 0,
};

export let ppg = {
  bpm: 0,
  heartbeat: false,
  amplitude: 0,
  buffer: [],
};

export let eeg = {
  delta: 0,
  theta: 0,
  alpha: 0,
  beta: 0,
  gamma: 0,
  sensors: [],
};

//bluetooth class
export let bluetoothConnection;

//ID for muse devices
export const MUSE_SERVICE = 0xfe8d;

//channel to send commands to muse
export let controlChar;
export const MUSE_CONTROL_ID = "273e0001-4c4d-454d-96be-f03bac821358";

//eeg sensors
export const MUSE_LEFT_EAR_ID = "273e0003-4c4d-454d-96be-f03bac821358";
export const MUSE_LEFT_FOREHEAD_ID = "273e0004-4c4d-454d-96be-f03bac821358";
export const MUSE_RIGHT_FOREHEAD_ID = "273e0005-4c4d-454d-96be-f03bac821358";
export const MUSE_RIGHT_EAR_ID = "273e0006-4c4d-454d-96be-f03bac821358";

//battery
export const MUSE_BATTERY_ID = "273e000b-4c4d-454d-96be-f03bac821358";

//other sensors
export const MUSE_GYROSCOPE_ID = "273e0009-4c4d-454d-96be-f03bac821358";
export const MUSE_ACCELEROMETER_ID = "273e000a-4c4d-454d-96be-f03bac821358";
export const MUSE_PPG_ID = "273e0010-4c4d-454d-96be-f03bac821358";

export function connectToMuse() {
  //connection options, use MUSE id to search for nearby muse devices
  let connectionOptions = { filters: [{ services: [MUSE_SERVICE] }] };

  //ask bluetooth to connect
  bluetoothConnection.connect(connectionOptions, museConnected);
}

//connected listener
export async function initMuseStreaming(characteristics) {
  console.log("Connected to Muse");
  let controlActive = false;

  //go through each characteristic and add listeners
  for (let i = 0; i < characteristics.length; i++) {
    //get characteristic
    let characteristic = characteristics[i];

    //search by UUID
    switch (characteristic.uuid) {
      case MUSE_CONTROL_ID:
        //control is how to send message to the Muse, like 'start' and 'stop'
        controlChar = characteristic;
        controlActive = true; //ok to proceed with streaming
        break;

      //the EEG sensors
      case MUSE_LEFT_EAR_ID:
        bluetoothConnection.startNotifications(
          characteristic,
          didReceiveEegLeftEar
        );
        break;

      case MUSE_LEFT_FOREHEAD_ID:
        bluetoothConnection.startNotifications(
          characteristic,
          didReceiveEegLeftForehead
        );
        break;

      case MUSE_RIGHT_EAR_ID:
        bluetoothConnection.startNotifications(
          characteristic,
          didReceiveEegRightEar
        );
        break;

      case MUSE_RIGHT_FOREHEAD_ID:
        bluetoothConnection.startNotifications(
          characteristic,
          didReceiveEegRightForehead
        );
        break;

      case MUSE_PPG_ID:
        bluetoothConnection.startNotifications(characteristic, didReceivePpg);
        break;

      case MUSE_ACCELEROMETER_ID:
        bluetoothConnection.startNotifications(characteristic, didReceiveAccel);
        break;

      case MUSE_GYROSCOPE_ID:
        bluetoothConnection.startNotifications(characteristic, didReceiveGyro);
        break;

      case MUSE_BATTERY_ID:
        bluetoothConnection.startNotifications(
          characteristic,
          didReceiveBattery
        );
        break;

      default:
        //console.log("Unused characteristic:", characteristic)
        break;
    }
  }
  return controlActive;
}

export async function startMuse() {
  //to stream data, send this sequence to headset
  //halt (a pause command)
  //connection type (PPG or no PPG)
  //start command
  //resume command
  //this sequence, in a row, starts the headset's streaming data

  if (controlChar) {
    await bluetoothConnection.sendCommand(controlChar, "h"); //halt

    if (usePPG) {
      //use ppg, Muse 2
      await bluetoothConnection.sendCommand(controlChar, "p50");
    } else {
      //no ppg, Muse 1
      await bluetoothConnection.sendCommand(controlChar, "p21");
    }

    await bluetoothConnection.sendCommand(controlChar, "s"); //start
    await bluetoothConnection.sendCommand(controlChar, "d"); //resume
  }
}

export default class MuseDataBuffer {
  constructor(length) {
    //save length
    this.maxLength = length;
    //fill buffer with zeroes to length
    this._buffer = new Array(length).fill(0);
  }

  //take a sample set and add to the buffer
  update(withSamples) {
    //add samples to the existing buffer
    this._buffer = [...this._buffer, ...withSamples];

    //keep the buffer the right size
    if (this._buffer.length > this.maxLength) {
      let diff = this._buffer.length - this.maxLength;
      this._buffer.splice(0, diff);
    }

    //return updated buffer
    return this._buffer;
  }

  getLength() {
    return this._buffer.length;
  }
}

export class EEGSensor {
  constructor() {
    //data buffer
    this.EEG_BUFFER_SIZE = 256;
    this.buffer = new MuseDataBuffer(this.EEG_BUFFER_SIZE);

    //fft to process time based samples in buffer into a frequency based spectrum
    let MUSE_SAMPLE_RATE = 220;
    this.fft = new FFT(this.EEG_BUFFER_SIZE, MUSE_SAMPLE_RATE);

    //divide the sample rate by the buffer size to get how many frequencies are covered per fft bin
    let freqInc = MUSE_SAMPLE_RATE / this.EEG_BUFFER_SIZE;

    //create and store an array to store what frequency is at what bin
    //only is the sample rate and the buffer size were exactly the same
    //(like 256 sample rate / 256 buffer size)
    //would each bin be 1 Hz
    //since they aren't, we need to calculate which bin corresponds with which Hz

    //start with an array of 0's
    this.frequencies = new Array(this.EEG_BUFFER_SIZE / 2).fill(0);
    //loop through
    for (let i = 0; i < this.frequencies.length; i++) {
      //each slot is the slot num x the incrementation
      //for example, if the sample rate is 220 and buffer is 246
      //then the frequencies in the bins are:
      //0, 0.859375, 1.71875, 2.578125, 3.4375, etc...
      //not 0, 1, 2, 3, 4, etc...
      this.frequencies[i] = i * freqInc;
    }

    //calc the high and low bin for each brainwave
    //pass in the Hz (like alpha is 8-12)
    //get back the bins (alpha bins are 9-14)

    let deltaLow = this._getPositionForFrequency(1, this.frequencies);
    let deltaHigh = this._getPositionForFrequency(3, this.frequencies);
    this.delta = new EEGWave(deltaLow, deltaHigh);
    let thetaLow = this._getPositionForFrequency(4, this.frequencies);
    let thetaHigh = this._getPositionForFrequency(7, this.frequencies);
    this.theta = new EEGWave(thetaLow, thetaHigh);
    let alphaLow = this._getPositionForFrequency(8, this.frequencies);
    let alphaHigh = this._getPositionForFrequency(12, this.frequencies);
    this.alpha = new EEGWave(alphaLow, alphaHigh);
    let betaLow = this._getPositionForFrequency(13, this.frequencies);
    let betaHigh = this._getPositionForFrequency(30, this.frequencies);
    this.beta = new EEGWave(betaLow, betaHigh);
    let gammaLow = this._getPositionForFrequency(31, this.frequencies);
    let gammaHigh = this._getPositionForFrequency(50, this.frequencies);
    this.gamma = new EEGWave(gammaLow, gammaHigh);

    //store all the new waves in an array for access
    this.waves = [this.delta, this.theta, this.alpha, this.beta, this.gamma];

    //and store the whole spectrum var for screen printing, etc...
    this.spectrum = new Array(this.EEG_BUFFER_SIZE / 2).fill(0);
  }

  //update from sensor
  update(withSamples) {
    //add new samples to buffer
    let sensorBuffer = this.buffer.update(withSamples);

    //turn samples into a frequency spectrum using FFT
    this.spectrum = this.fft.forward(sensorBuffer);
    //console.log("spectrum", this.spectrum);

    for (let i = 0; i < this.waves.length; i++) {
      let wave = this.waves[i];
      wave.update(this.spectrum.slice(wave.binLow, wave.binHigh));
    }
  }

  //helpers
  _findClosestValue(searchValue, inArray) {
    return inArray.reduce((a, b) => {
      let aDiff = Math.abs(a - searchValue);
      let bDiff = Math.abs(b - searchValue);

      if (aDiff == bDiff) {
        return a > b ? a : b;
      } else {
        return bDiff < aDiff ? b : a;
      }
    });
  }

  _getPositionForFrequency(frequency, inArray) {
    let exactFrequency = this._findClosestValue(frequency, inArray);
    let exactFrequencyPosition = inArray.indexOf(exactFrequency, 0);
    return exactFrequencyPosition;
  }
}

//global scope func to process EEG data per sensor
export function processEEG(sensor, data) {
  //process data buffer into samples and save
  let eegSamples = decodeUnsigned12BitData(
    new Uint8Array(data.buffer).subarray(2)
  );

  //pass into the specified sensor
  sensors[sensor].update(eegSamples);

  //get the post-fft frequency spectrum from each sensor
  let sensorSpectrums = [];
  for (let i = 0; i < sensorTotal; i++) {
    sensorSpectrums.push(sensors[i].spectrum);
  }
  //average the spectrums from all the sensors into one spectrum
  spectrum = _getAverageByIndex(sensorSpectrums);

  //init vars for the total of each brainwave across all sensors
  //for example, what is the average alpha across all 4 sensors
  let deltaTotal = 0;
  let thetaTotal = 0;
  let alphaTotal = 0;
  let betaTotal = 0;
  let gammaTotal = 0;

  //loop through each sensor
  for (let i = 0; i < sensorTotal; i++) {
    //target each sensor
    let sensor = sensors[i];

    //add brainwave average from each sensor to the total
    deltaTotal += sensor.delta.average;
    thetaTotal += sensor.theta.average;
    alphaTotal += sensor.alpha.average;
    betaTotal += sensor.beta.average;
    gammaTotal += sensor.gamma.average;
  }

  //then average out the totals by 4 (sensor total)
  //resulting in the average brainwave strength across the entire headband
  eeg.delta = deltaTotal / sensorTotal;
  eeg.theta = thetaTotal / sensorTotal;
  eeg.alpha = alphaTotal / sensorTotal;
  eeg.beta = betaTotal / sensorTotal;
  eeg.gamma = gammaTotal / sensorTotal;
}

//delta, theta, alpha, beta, gamma waves
export class EEGWave {
  //create wave with the low and high end of the wave, in Hz
  //for example, alpha is 8Hz - 12 Hz
  //so binLow = 8, binHigh = 12
  constructor(binLow, binHigh) {
    this.binLow = binLow;
    this.binHigh = binHigh;
    this.spectrum = [];
    this.average = 0;
  }

  //receive frequency spectrum for just this wave from FFT
  //for example, alpha would just receive the 8 - 12 Hz slices of the frequency spectrum
  update(withSpectrum) {
    //average out each slice to one, averaged value for the whole brainwave
    //for example, alpha would take the values from 8Hz, 9Hz, 10Hz, and 11Hz
    //and average them into one value
    this.spectrum = withSpectrum;
    this.average = withSpectrum.reduce((a, b) => a + b) / withSpectrum.length;
  }
}

//helper
export function _getAverageByIndex(arrays) {
  //create blank array to store the averages
  let avgArr = new Array(arrays[0].length).fill(0);

  //step through each empty slot in averaged array
  for (let s = 0; s < avgArr.length; s++) {
    //loop throgh the values in this position
    let positionAvg = 0;
    for (let a = 0; a < arrays.length; a++) {
      positionAvg += arrays[a][s]; //add them up
    }
    //divide to get average
    positionAvg /= arrays.length;

    //store in slot
    avgArr[s] = positionAvg;
  }

  return avgArr;
}

//vars (need to be after the class definitions)

export let leftEar = new EEGSensor();
export let leftForehead = new EEGSensor();
export let rightForehead = new EEGSensor();
export let rightEar = new EEGSensor();

export let sensors = [leftEar, leftForehead, rightForehead, rightEar];
export let sensorTotal = sensors.length;

export let spectrum = new Array(leftEar.EEG_BUFFER_SIZE / 2).fill(0);

//parsing methods
//https://github.com/urish/muse-js/blob/4e864578c55dd7e26d85b429863f47ccabac54a0/src/lib/muse-parse.ts

//streaming listeners
export function didReceiveEegLeftEar(data) {
  processEEG(0, data);
}

export function didReceiveEegLeftForehead(data) {
  processEEG(1, data);
}

export function didReceiveEegRightEar(data) {
  processEEG(2, data);
}

export function didReceiveEegRightForehead(data) {
  processEEG(3, data);
}

export function didReceivePpg(data) {
  processPPG(data);
}

export function didReceiveAccel(data) {
  //parse the samples with multiplier
  let _samples = parseImuReading(data, 0.0000610352).samples;

  //average out the samples
  accel.x = (_samples[0].x + _samples[1].x + _samples[2].x) / 3;
  accel.y = (_samples[0].y + _samples[1].y + _samples[2].y) / 3;
  accel.z = (_samples[0].z + _samples[1].z + _samples[2].z) / 3;
  //console.log("Accel:", accel);
}

export function didReceiveGyro(data) {
  //parse the samples with multiplier
  let _samples = parseImuReading(data, 0.0074768).samples;

  //average out the samples
  gyro.x = (_samples[0].x + _samples[1].x + _samples[2].x) / 3;
  gyro.y = (_samples[0].y + _samples[1].y + _samples[2].y) / 3;
  gyro.z = (_samples[0].z + _samples[1].z + _samples[2].z) / 3;
  //console.log("Gyro:", gyro);
}

export function didReceiveBattery(data) {
  batteryLevel = data.getUint16(2) / 512;
  console.log("Battery level:", batteryLevel, "%");
}

//PARSING FUNCTIONS
//eeg samples
export function decodeUnsigned12BitData(samples) {
  const samples12Bit = [];
  for (let i = 0; i < samples.length; i++) {
    if (i % 3 === 0) {
      samples12Bit.push((samples[i] << 4) | (samples[i + 1] >> 4));
    } else {
      samples12Bit.push(((samples[i] & 0xf) << 8) | samples[i + 1]);
      i++;
    }
  }
  return samples12Bit;
}

//ppg samples
export function decodeUnsigned24BitData(samples) {
  const samples24Bit = [];
  for (let i = 0; i < samples.length; i = i + 3) {
    samples24Bit.push(
      (samples[i] << 16) | (samples[i + 1] << 8) | samples[i + 2]
    );
  }
  return samples24Bit;
}
//parses gyro and accel data
export function parseImuReading(data, scale) {
  function sample(startIndex) {
    return {
      x: scale * data.getInt16(startIndex),
      y: scale * data.getInt16(startIndex + 2),
      z: scale * data.getInt16(startIndex + 4),
    };
  }
  return {
    sequenceId: data.getUint16(0),
    samples: [sample(2), sample(8), sample(14)],
  };
}

export let ppgBuffer = new MuseDataBuffer(64);
export let heartbeatTimestamps = [];
export let BEAT_DETECTION_THRESHOLD = 0.9982; //0.998
export let BPM_SAMPLES_MAX = 10;

export function processPPG(data) {
  //process data buffer into samples and save
  let ppgSamples = decodeUnsigned24BitData(
    new Uint8Array(data.buffer).subarray(2)
  );

  //add decoded samples to the buffer
  ppg.buffer = ppgBuffer.update(ppgSamples);

  //calc the high value of the buffer
  let ppgMax = Math.max(...ppg.buffer);

  //grab most recent value in ppg array
  ppg.amplitude = ppg.buffer[ppg.buffer.length - 1];

  //what percentage is it of the max?
  let ppgPercent = ppg.amplitude / ppgMax;
  //console.log("ppg pct", ppgPercent);

  //if recent value is near the max value, it's a heartbeat
  if (ppgPercent > BEAT_DETECTION_THRESHOLD) {
    //threshold for a beat detection

    //if previously false...
    if (ppg.heartbeat == false) {
      //record the timestamp of this heartbeat
      heartbeatTimestamps.push(new Date().getTime());

      //keep timestamps array from growing too long
      if (heartbeatTimestamps.length > BPM_SAMPLES_MAX) {
        let diff = heartbeatTimestamps.length - BPM_SAMPLES_MAX;
        heartbeatTimestamps.splice(0, diff);
      }

      let durationsBetweenBeats = [];

      //if there are enough samples...
      if (heartbeatTimestamps.length > 1) {
        //loop through each timestamp
        for (var i = heartbeatTimestamps.length - 1; i > 1; i--) {
          //get this and the next timestamp
          let currTimestamp = heartbeatTimestamps[i];
          let prevTimestamp = heartbeatTimestamps[i - 1];

          //calculate time between beats and save it
          let durationBetweenBeats = currTimestamp - prevTimestamp;
          durationsBetweenBeats.push(durationBetweenBeats);
        }

        //calc durations between the beats
        let durationsTotal = 0;
        for (var i = 0; i < durationsBetweenBeats.length; i++) {
          //add up the durations
          durationsTotal += durationsBetweenBeats[i];
        }
        //calc average in milliseconds
        let durationAverage = durationsTotal / durationsBetweenBeats.length;

        //bpm = 60000 / ms duration of quarter note
        ppg.bpm = Math.round(60000 / durationAverage);
      }
    }

    //when heart beat is occurring
    ppg.heartbeat = true;
  } else {
    //else off
    ppg.heartbeat = false;
  }
}

//is it a Muse 1 (usePPG = false) or Muse 2 (usePPG = true)
export let usePPG = true;
export let connectButton;

export function setupMuse() {
  //this handles the bluetooth connection between the Muse and the computer
  bluetoothConnection = new p5BLE();

  //create the connect button
  connectButton = createButton("Connect");
  connectButton.mousePressed(connectButtonClicked);
}

//user clicks connect button
export function connectButtonClicked() {
  connectToMuse();
}

//when muse connects, this function fires
export function museConnected(error, characteristics) {
  if (error) {
    console.log(error); //error connecting
  } else {
    //hide the connect button
    connectButton.hide();

    //prepare muse to stream data
    let museIsReady = initMuseStreaming(characteristics);

    //if muse is ready for streaming
    if (museIsReady) {
      //then add a stream button to the page
      const startButton = createButton("Start");
      startButton.mousePressed(startButtonClicked);

      function startButtonClicked() {
        startButton.hide();
        startMuse();
      }
    }
  }
}

// Copyright (c) 2018 p5ble
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

//import callCallback from './utils/callcallback';
//import parseData from './utils/parseData';

export class p5BLE {
  constructor() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristics = [];
    this.handleNotifications = null;
  }

  connect(serviceUuidOrOptions, callback) {
    let options = {};
    let serviceUuid;

    if (typeof serviceUuidOrOptions === "string") {
      serviceUuid = serviceUuidOrOptions.toLowerCase();
      options = {
        filters: [
          {
            services: [serviceUuid],
          },
        ],
      };
    } else if (
      typeof serviceUuidOrOptions === "object" &&
      serviceUuidOrOptions.filters
    ) {
      // Options = {
      //   filters: [{ namePrefix: "name" }, { services: ["2A5A20B9-0000-4B9C-9C69-4975713E0FF2"] }]
      // }
      const servicesArray = serviceUuidOrOptions.filters.find(
        (f) => f.services
      );
      if (
        servicesArray &&
        servicesArray.services &&
        servicesArray.services[0]
      ) {
        serviceUuid = servicesArray.services[0]; //.toLowerCase();
        options.filters = serviceUuidOrOptions.filters.map((f) => {
          if (f.services) {
            const newF = {};
            newF.services = f.services;
            return newF;
          }
          return f;
        });
      } else {
        console.error(
          "Please pass an option object in this format: options = { filters: [{ services: [serviceUuid] }]} "
        );
      }
    } else {
      console.error(
        "Please pass in a serviceUuid string or option object, e.g. options = { filters: [{ services: [serviceUuid] }]} "
      );
    }

    console.log("Requesting Bluetooth Device...");

    return callCallback(
      navigator.bluetooth
        .requestDevice(options)
        .then((device) => {
          this.device = device;
          console.log(`BLE: Device found: ${device.name}`);
          return device.gatt.connect();
        })
        .then((server) => {
          this.server = server;
          console.log("BLE: Getting service...");
          return server.getPrimaryService(serviceUuid);
        })
        .then((service) => {
          this.service = service;
          console.log("BLE: Getting characteristics...");
          return service.getCharacteristics();
        })
        .then((characteristics) => {
          this.characteristics = characteristics;
          console.log("BLE: Characteristics found");
          return characteristics;
        })
        .catch((error) => {
          console.error(`BLE: Error: ${error}`);
        }),
      callback
    );
  }

  async read(characteristic, dataTypeOrcallback, cb) {
    let callback;
    let dataType;
    if (typeof dataTypeOrcallback === "function") {
      callback = dataTypeOrcallback;
    } else if (typeof dataTypeOrcallback === "string") {
      dataType = dataTypeOrcallback;
    }
    if (typeof cb === "function") {
      callback = cb;
    }

    if (!characteristic || !characteristic.uuid)
      console.error("The characteristic does not exist.");
    const validChar = this.characteristics.find(
      (char) => char.uuid === characteristic.uuid
    );
    if (!validChar) return console.error("The characteristic does not exist.");

    return callCallback(
      characteristic.readValue().then((value) => parseData(value, dataType)),
      callback
    );
  }

  sendCommand(char, cmd) {
    const encoded = new TextEncoder().encode(`X${cmd}\n`);
    encoded[0] = encoded.length - 1;

    return char.writeValue(encoded);
  }

  encodeCommand(cmd) {
    const encoded = new TextEncoder().encode(`X${cmd}\n`);
    encoded[0] = encoded.length - 1;
    return encoded;
  }

  write(characteristic, inputValue) {
    if (!characteristic || !characteristic.uuid)
      console.error("The characteristic does not exist.");
    const validChar = this.characteristics.find(
      (char) => char.uuid === characteristic.uuid
    );
    if (!validChar) return console.error("The characteristic does not exist.");

    let bufferToSend;
    if (typeof inputValue === "string") {
      const encoder = new TextEncoder("utf-8");
      bufferToSend = encoder.encode(inputValue);
    } else bufferToSend = Uint8Array.of(inputValue);
    console.log(`Writing ${inputValue} to Characteristic...`);
    console.log("Returning", bufferToSend);
    return characteristic.writeValue(bufferToSend);
  }

  async startNotifications(characteristic, handleNotifications, dataType) {
    if (!characteristic || !characteristic.uuid)
      console.error("The characteristic does not exist.");
    const validChar = this.characteristics.find(
      (char) => char.uuid === characteristic.uuid
    );
    if (!validChar) return console.error("The characteristic does not exist.");

    await characteristic.startNotifications();

    //console.log('> Notifications started');

    //this runs with each update refresh from device
    this.handleNotifications = (event) => {
      // const { value } = event.target;
      // const parsedData = parseData(value, dataType);
      // handleNotifications(parsedData);
      handleNotifications(event.target.value);
    };

    return characteristic.addEventListener(
      "characteristicvaluechanged",
      this.handleNotifications
    );
  }

  async stopNotifications(characteristic) {
    if (!characteristic || !characteristic.uuid)
      console.error("The characteristic does not exist.");
    const validChar = this.characteristics.find(
      (char) => char.uuid === characteristic.uuid
    );
    if (!validChar) return console.error("The characteristic does not exist.");

    try {
      await characteristic.stopNotifications();

      if (this.handleNotifications) {
        console.log("> Notifications stopped");
        return characteristic.removeEventListener(
          "characteristicvaluechanged",
          this.handleNotifications
        );
      }
      return console.log("> Notifications stopped");
    } catch (error) {
      return console.error(`Error: ${error}`);
    }
  }

  disconnect() {
    if (!this.device) return;
    console.log("Disconnecting from Bluetooth Device...");
    if (this.device.gatt.connected) {
      this.device.gatt.disconnect();
    } else {
      console.log("> Bluetooth Device is already disconnected");
    }
  }

  onDisconnected(handleDisconnected) {
    if (!this.device) return console.error("There is no device connected.");
    return this.device.addEventListener(
      "gattserverdisconnected",
      handleDisconnected
    );
  }

  isConnected() {
    if (!this.device) return false;
    if (this.device.gatt.connected) {
      return true;
    }
    return false;
  }
}

//module.exports = p5ble;

//callcallback.js
export function callCallback(promise, callback) {
  if (callback) {
    promise
      .then((result) => {
        callback(undefined, result);
        return result;
      })
      .catch((error) => {
        callback(error);
        return error;
      });
  }
  return promise;
}

//parseData.js
export function parseData(data, t, encoding) {
  const type = t ? t.toLowerCase() : "unit8";
  let result;
  let decoder;
  switch (type) {
    case "unit8":
      result = data.getUint8(0);
      break;

    case "uint16":
      result = data.getUint16(0);
      break;

    case "uint32":
      result = data.getUint32(0);
      break;

    case "int8":
      result = data.getInt8(0);
      break;

    case "int16":
      result = data.getInt16(0);
      break;

    case "int32":
      result = data.getInt32(0);
      break;

    case "float32":
      result = data.getFloat32(0, true); // littleEndian
      break;

    case "float32-bigEndian":
      result = data.getFloat32(0); // BigEndian
      break;

    case "float64":
      result = data.getFloat64(0, true); // littleEndian
      break;

    case "float64-bigEndian":
      result = data.getFloat64(0); // BigEndian
      break;

    case "string":
      // TODO: have the ability to choose different string encoding: like utf16
      decoder = new TextDecoder(encoding || "utf8");
      result = decoder.decode(data);
      break;

    case "custom":
      // let the user do the parsing
      result = data;
      break;

    default:
      result = data.getUint8(0);
      break;
  }
  return result;
}

/*
  export async function observableCharacteristic(characteristic: BluetoothRemoteGATTCharacteristic) {
    await characteristic.startNotifications();
    const disconnected = fromEvent(characteristic.service!.device, 'gattserverdisconnected');
    return fromEvent(characteristic, 'characteristicvaluechanged').pipe(
        takeUntil(disconnected),
        map((event: Event) => (event.target as BluetoothRemoteGATTCharacteristic).value as DataView),
    );
}*/
