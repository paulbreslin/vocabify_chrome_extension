// Adds div to page with unique ID so https://vocabifyapp.com can know if the extension has been installed or not
var isInstalledNode = document.createElement('div');
isInstalledNode.id = 'vocabify-extension-is-installed';
document.body.appendChild(isInstalledNode);
