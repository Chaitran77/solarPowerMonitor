import fs from 'fs';
import dateFormat from 'dateformat';

// follows tutorial at https://medium.com/@machadogj/arduino-and-node-js-via-serial-port-bcf9691fab6a

import SerialPort from 'serialport';
import '@serialport/parser-readline';

// const nano1Port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
// const nano2Port = new SerialPort('/dev/ttyACM1', { baudRate: 9600 });
// const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Read the port data
// nano1port.on("open", () => {
//     console.log('serial port open');
// });
// nano1Port.on('data', data =>{
//     console.log('got word from arduino:', data);
// });

// create a new csv file to store all the data
const headerRow= "time,v1,a1,v2,a2,v3,a3,tA,tB,tC";
const filename = `readings-${dateFormat(new Date(), "ddmmyyyy-hh:mm:ss")}.csv`;
fs.writeFile(filename, headerRow, (err, data) => {
    if (err) throw err;
    console.log(data);
})