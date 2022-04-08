// follows tutorial at https://medium.com/@machadogj/arduino-and-node-js-via-serial-port-bcf9691fab6a
import fs from 'fs';
import readlineSync from 'readline-sync';
import dateFormat from 'dateformat';

const question = readlineSync.question;

import SerialPort from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline'


var sensorValues;

SerialPort.SerialPort.list().then(ports => {
    const devices = chooseDevices(ports);
    initializeOutputFile();
    setupSerialDeviceListeners(devices);
});

const filename = `readings-${dateFormat(new Date(), "ddmmyyyy-hh:mm:ss")}.csv`;


function initializeOutputFile() {

    // create a new csv file to store all the data
    const headerRow= "time,v1,a1,v2,a2,v3,a3,tA,tB,tC\n";
    fs.writeFile(filename, headerRow, (err, data) => {
        if (err) throw err;
        console.log(data);
    })
}

function chooseDevices(ports) {
    const devices = ports;

    let chosenDevices = [];
    
    for (const device of devices) {

        let response = false; // as a default, we assume the user does not want to use this device
        while (true) {
            const input = question(`\nIs this the correct device?\n${JSON.stringify(device)}\n Yes/No (Y/n)\n> `);
            
            if (input.toLowerCase().includes("y")) { response = true; console.log("\nSelected device\n"); break; };
            if (input.toLowerCase().includes("n")) { response = false; break; };

            console.log("Please enter either 'Y' or 'N'");
        }

        if (response) {chosenDevices.push(device); continue}
        console.log("Choose " + 2-chosenDevices.length + " more device(s)");
    }

    // if (chosenDevices.length < 2) {
    //     // to prevent me from forgetting to add one of the devices
    //     console.log("You must choose at least 2 devices");
    //     process.exit();
    // }
    return chosenDevices;
}

function setupSerialDeviceListeners(devices) {
    // TODO
    for (const device of devices) {
        console.log("Device " + JSON.stringify(device))
        const port = new SerialPort.SerialPort({ path: device.path, baudRate: 9600 });
        const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

        parser.on('data', data => {
            console.log(data);
            try {
                updateData(data); writeData();
            } catch (err) {
                console.log(err);
            }
        });
    }
}

function updateData(newData) {
    sensorValues = JSON.parse(newData);
}


function writeData() {

    // for now stringify sensorValues
    fs.appendFile(filename, JSON.stringify(sensorValues) + "\n", (err, data) => {
        if (err) throw err;
        console.log(data);
    })
}