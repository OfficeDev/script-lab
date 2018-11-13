window.addEventListener('message', windowMessageHandler, false);
function windowMessageHandler(event) {
  // TODO: currently not checking event source, since url can be either the Macro recorder addin or the automation test page, change to check for production IDE url
  window.eventOrigin = event.origin;
  worker.postMessage(event.data);
}

var worker = new Worker(`worker.js?name=${window.location.host.split('.')[0]}`, {
  name: window.location.host.split('.')[0],
});
worker.onmessage = workerMessageHandler;
function workerMessageHandler(event) {
  window.parent.postMessage(event.data, window.eventOrigin); // TODO has to be the consumer (IDE) url
}
