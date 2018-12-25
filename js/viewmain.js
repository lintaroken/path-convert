'use strict';

const { remote } = window.require('electron');
const exec = remote.require('child_process').exec;

window.addEventListener('DOMContentLoaded', function () {
  const windowsPath = document.getElementById('windowsPath');
  const mountURI = document.getElementById('mountURI');
  const macPath = document.getElementById('macPath');
  const userName = document.getElementById('userName');

  function macPathInput() {
    const volumesIndex = macPath.value.indexOf('/Volumes')
    if (volumesIndex === -1) {
      windowsPath.value = '';
      mountURI.value = '';
      return;
    }
    const mountPoint = macPath.value.split('/')[2];
    exec(`mount | grep ${mountPoint} | awk '{print \$1}'`, function(err, stdout, stderr){
      mountURI.value = 'smb:' + stdout;
      windowsPath.value = stdout.replace(/^.*@/, '//').replace(/\//g, '\\')
        + '\\' + macPath.value.split('/').slice(3).join('\\');
    });
  }  

  document.addEventListener('drop', function (e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    macPath.value = file.path;
    macPathInput();
    return false;
  });
  

  macPath.addEventListener('input', macPathInput);

  const openButton = document.getElementById('openButton');
  openButton.addEventListener('click', function () {
    ipcRenderer.sendSync('message1', 'ping');
  });
});

