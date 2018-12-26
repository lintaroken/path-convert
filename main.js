'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain, ipcRenderer } = require('electron');

let mainWindow = null;
app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 400, height: 300});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

