// This code gets injected into every Gmail page so it has (limited) access
// to the DOM etc.

var safeSendButtonClass = "safeSendButton";

function findAndModifyAttachmentButton() {
  console.debug("Looking for attachment button");
  // button container div is ".a8X.gU"
  // .a1.aaA.aMZ is the attachment button
  // i.a1.aaA.aMZ is the outer button container

  var buttonContainers = getElementsByXPath('//div[@command="Files"]/ancestor::td[1]/div[1]');

  for(var i = 0 ; i < buttonContainers.length ; ++i) {
    if(0 == buttonContainers[i].getElementsByClassName(safeSendButtonClass).length) {
      cloneAttachmentButton(buttonContainers[i]);
    }

  }


}

function cloneAttachmentButton(buttonContainer) {
  var existingAttachmentButton = getElementsByXPath('.//div[@command="Files"]', parent=buttonContainer)[0];

  if(existingAttachmentButton) {
    existingAttachmentButton.style.backgroundColor = "pink";

    var safeSendButton = createSafeSendButtonFromAttachmentButton(existingAttachmentButton);
    buttonContainer.insertBefore(safeSendButton, existingAttachmentButton);
  }
}

function createSafeSendButtonFromAttachmentButton(existingAttachmentButton) {
  console.log("Cloning existing attachment button", existingAttachmentButton);
  var safeSendButton = existingAttachmentButton.cloneNode(true);

  safeSendButton.style.backgroundColor = "green";
  safeSendButton.setAttribute('data-tooltip', "Send files securely");

  addClass(safeSendButton, safeSendButtonClass);
  return safeSendButton;
}

function getElementsByXPath(xpath, parent)
{
  let results = [];
  let query = document.evaluate(xpath,
      parent || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i=0, length=query.snapshotLength; i<length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results;
}

function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  }
  else {
    el.className += ' ' + className;
  }
}

setInterval(findAndModifyAttachmentButton, 2000);

setTimeout(triggerSecureSendDialog, 5000)

function triggerSecureSendDialog(){
  chrome.runtime.sendMessage({greeting: "hello"}, handleSecureSendDialogResponse);
}

function handleSecureSendDialogResponse(response) {
  console.log(response.farewell);
}
