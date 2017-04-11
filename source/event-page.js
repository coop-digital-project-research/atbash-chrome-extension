// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action (toolbar button)
chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  chrome.tabs.create({
    url: "https://mail.google.com/mail/#inbox?compose=new"
  });
});

chrome.runtime.onMessage.addListener(
  function(messageFromGmail, sender, sendResponseToGmailContentScript) {
    console.debug("event page got message: ", messageFromGmail);

    if (messageFromGmail.messageType == "openSecureSendDialog")
      var gmailTabId = sender.tab.id;
      var width = 615;
      var height = 400;
      var left = Math.round((screen.width/2)-(width/2));
      var _top = Math.round((screen.height/2)-(height/2));

      chrome.tabs.create({
          url: chrome.extension.getURL('options.html'),
          active: false
        }, function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true,
                width: width,
                height: height,
                left: left,
                top: _top
            }, function(createdWindow) {
              console.log("Created new window: ", createdWindow);

              chrome.tabs.sendMessage(
                tab.id,
                {
                  messageType: "setInputElementUUID",
                  gmailTabId: gmailTabId,
                  uuid: messageFromGmail.inputElementUUID
                }
              );
            });
        });
  }
);
