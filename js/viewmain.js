'use strict';

const { remote } = window.require('electron');
const exec = remote.require('child_process').exec;

window.addEventListener('DOMContentLoaded', () => {
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
    exec(`mount | grep ${mountPoint} | awk '{print \$1}'`, (err, stdout, stderr) => {
      mountURI.value = 'smb:' + decodeURIComponent(stdout);
      windowsPath.value = decodeURIComponent(stdout).replace(/^.*@/, '//').replace(/\//g, '\\')
        + '\\' + macPath.value.split('/').slice(3).join('\\');
    });
  }  

  function windowsPathInput() {
    const server = windowsPath.value.split('\\')[2];
    const topDir = windowsPath.value.split('\\')[3];
    const otherPath = windowsPath.value.split('\\').slice(4).join('/');
    const serverPrefix = userName.value ? userName.value + ':' : '';
    mountURI.value = `smb://${serverPrefix}${server}/${topDir}`
    macPath.value = `/Volumes/${topDir}/${otherPath}`
  }

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    macPath.value = file.path;
    macPathInput();
    return false;
  });
  

  macPath.addEventListener('input', macPathInput);
  windowsPath.addEventListener('input', windowsPathInput);
  userName.addEventListener('input', windowsPathInput);

  const openButton = document.getElementById('openButton');
  openButton.addEventListener('click', () => {
    exec(`open ${macPath.value}`)
  });

  exec('whoami', (err, stdout, stderr) => {
    userName.value = stdout;
  });

});

