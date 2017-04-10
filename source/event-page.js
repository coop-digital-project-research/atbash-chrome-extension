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
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      var width = 615;
      var height = 400;
      var left = Math.round((screen.width/2)-(width/2));
      var top = Math.round((screen.height/2)-(height/2));
      chrome.windows.create({ url: "options.html", type: "popup", width: width, height: height, left: left, top: top });
      sendResponse({farewell: "goodbye"});
  }
);
