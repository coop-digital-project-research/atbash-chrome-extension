// This code gets injected into every Gmail page so it has (limited) access
// to the DOM etc.
"use strict";

var safeSendButtonClass = "safeSendButton";

function findAndModifyAttachmentButton() {
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
  var relatedInputArea = getRelatedInputElement(existingAttachmentButton);

  safeSendButton.style.backgroundColor = "green";
  safeSendButton.setAttribute('data-tooltip', "Send files securely");

  addDataRelatedInputUUIDAttributeToNodeAndChildren(safeSendButton, relatedInputArea.getAttribute('data-uuid'));

  addClass(safeSendButton, safeSendButtonClass);
  safeSendButton.addEventListener('click', triggerSecureSendDialog, false);
  return safeSendButton;
}

function addDataRelatedInputUUIDAttributeToNodeAndChildren(element, uuid) {
  element.setAttribute('data-related-input-uuid', uuid);

  for(var i = 0 ; i < element.children.length ; i++) {
    addDataRelatedInputUUIDAttributeToNodeAndChildren(element.children[i], uuid);
  }
}


function getRelatedInputElement(attachmentButton) {
  var enclosingTable = getElementsByXPath(
    './/ancestor::table[contains(@class, "aoP")]',
    parent=attachmentButton
  )[0];

  console.log("enclosingTable: ", enclosingTable);

  var composeTextInput = enclosingTable && enclosingTable.getElementsByClassName("editable")[0];

  console.log("composeTextInput: ", composeTextInput);

  if(composeTextInput) {
    var uuid = guid();
    console.debug("Adding UUID ", uuid, " to element ", composeTextInput);
    composeTextInput.setAttribute("data-uuid", uuid);
    return composeTextInput;
  } else {
    console.warn("Failed to find related text input box related to attachmentButton: ", attachmentButton);
  }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
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

function getElementsByAttribute(attribute, context) {
  var nodeList = (context || document).getElementsByTagName('*');
  var nodeArray = [];
  var iterator = 0;
  var node = null;

  while (node = nodeList[iterator++]) {
    if (node.hasAttribute(attribute)) nodeArray.push(node);
  }

  return nodeArray;
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

function triggerSecureSendDialog(event){
  console.debug("triggerSecureSendDialog got event: ", event);
  var inputElementUUID = event.target.getAttribute("data-related-input-uuid");

  if(inputElementUUID) {
    chrome.runtime.sendMessage({
      messageType: "openSecureSendDialog",
      inputElementUUID: inputElementUUID,
    }, handleSecureSendDialogResponse);
  } else {
    console.error("triggerSecureSendDialog couldn't get a data-related-input-uuid to send to the new dialog popup.");
  }

}

function handleSecureSendDialogResponse(response) {
  console.log("handleSecureSendDialogResponse: ", response);
}

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log("gmail content script got message ", message);

    if(message.messageType == "updateInputElementWithSecureURL") {
      console.log("I'm going to update element UUID ", message.uuid, " with URL ", message.secureURL);
      addUrlToInputElementWithUUID(message.secureURL, message.uuid);
    }
  });


function addUrlToInputElementWithUUID(secureURL, uuid) {
  var elementsWithDataUUID = getElementsByAttribute("data-uuid");
  console.log("Found elements with a data-uuid: ", elementsWithDataUUID);

  for(var i = 0 ; i < elementsWithDataUUID.length ; ++i) {
    if(elementsWithDataUUID[i].getAttribute("data-uuid") == uuid) {
      addUrlToInputElement(elementsWithDataUUID[i], secureURL);
    } else {
      console.debug("Element has wrong UUID, != ", uuid);
    }
  }

}

function addUrlToInputElement(element, secureURL) {
  console.debug("Adding secureURL ", secureURL, " to element ", element);
  if(element.innerText.length > 0) {
    element.innerText += "\n\n";
  }

  element.innerText += "Secure download link:\n" + secureURL;
}
