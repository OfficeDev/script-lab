// Workers have no window object, which is used by office js
window = self;
importScripts(
  "https://appsforoffice.microsoft.com/lib/1.1/hosted/excel-web-16.00.debug.js"
);

var WorkerRequestExecutor = (function() {
  function WorkerRequestExecutor() {
    this.m_callbackList = {};
  }

  WorkerRequestExecutor.prototype.executeAsync = function(
    customData,
    requestFlags,
    requestMessage
  ) {
    var _this = this;
    var messageSafearray = window.OfficeExtension.RichApiMessageUtility.buildMessageArrayForIRequestExecutor(
      customData,
      requestFlags,
      requestMessage,
      "officejs"
    );
    return new window.OfficeExtension.Promise(function(resolve, reject) {
      var id = Date.now(); // TODO: Use a better way of creating a guid
      _this.m_callbackList[id] = resolve;
      addEventListener("message", _this.handleMessage.bind(_this), {
        once: true
      });
      postMessage({
        eventType: "officeJsMessage",
        id: id,
        message: messageSafearray
      });
    });
  };

  WorkerRequestExecutor.prototype.handleMessage = function(event) {
    if (event.data.eventType == "officeJsMessageResponse") {
      var result = event.data.result;
      var resolve = this.m_callbackList[event.data.id];
      delete this.m_callbackList[event.data.id];

      window.OfficeExtension.CoreUtility.log("Response:");
      window.OfficeExtension.CoreUtility.log(JSON.stringify(result));
      if (result.status == "succeeded") {
        var response = window.OfficeExtension.RichApiMessageUtility.buildResponseOnSuccess(
          window.OfficeExtension.RichApiMessageUtility.getResponseBody(result),
          window.OfficeExtension.RichApiMessageUtility.getResponseHeaders(
            result
          )
        );
      } else {
        var response = window.OfficeExtension.RichApiMessageUtility.buildResponseOnError(
          result.error.code,
          result.error.message
        );
        //_this.m_context._processOfficeJsErrorResponse(result.error.code, response); currently not even used
      }
      resolve(response);
    }
  };

  return WorkerRequestExecutor;
})();

window.OfficeExtension.SessionBase._overrideSession = {
  _resolveRequestUrlAndHeaderInfo: () => {
    return window.OfficeExtension.Utility._createPromiseFromResult(null);
  },
  _createRequestExecutorOrNull: () => {
    return new WorkerRequestExecutor();
  }
};

function loadCode(data) {
  try {
    importScripts(
      URL.createObjectURL(
        new Blob([data.scriptCode], { type: "application/javascript" })
      )
    );
  } catch (e) {
    // importScripts of blob url fails in chromium (used for testing)
    eval.call(this, data.scriptCode);
  }
  postMessage({
    eventId: data.eventId,
    eventType: "scriptCodeLoaded",
    message: { status: "Success", result: null }
  });
}

async function executeCode(data) {
  // TODO: Might need to check on Office.onready/Office.initialize
  try {
    let result = await self[data.functionName](...data.functionArgs);
    postMessage({
      eventId: data.eventId,
      eventType: "executionFinished",
      message: { status: "Success", result: result }
    });
  } catch (ex) {
    postMessage({
      eventId: data.eventId,
      eventType: "executionFinished",
      message: {
        status: "Fail",
        result: null,
        statusMessage: JSON.stringify(ex)
      }
    });
  }
}

onmessage = event => {
  if (event.data.eventType == "loadScriptCode") {
    loadCode(event.data);
  }

  if (event.data.eventType == "execute") {
    executeCode(event.data);
  }
};
