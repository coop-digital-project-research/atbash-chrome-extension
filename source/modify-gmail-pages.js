// This code gets injected into every Gmail page so it has (limited) access
// to the DOM etc.

function findAndModifyAttachmentButton() {
  console.debug("Looking for attachment button");
  var attachmentButtons = document.querySelectorAll(".a1.aaA.aMZ"); // gmail attachment button

  for(i = 0 ; i < attachmentButtons.length ; ++i) {
    modifyAttachmentButton(attachmentButtons[i])
  }
}

function modifyAttachmentButton(element) {
    element.style.backgroundColor = "red";
}

setInterval(findAndModifyAttachmentButton, 2000);
