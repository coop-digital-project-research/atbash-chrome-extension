# Atbash

This is an experimental Chrome plugin to send end-to-end encrypted files from
inside the Gmail web interface.

## Develop

In Chrome:

- visit [chrome://extensions](chrome://extensions)
- select "Load Unpacked Extension"
- select `source/` inside this repo's directory

## Message passing

### 1 of 3: Gmail content script to event page

```
{
  messageType: "openSecureSendDialog",
  inputElementUUID: "f07920d0-1e98-11e7-a1d1-cfc4bf2de84d"
}
```

### 2 of 3: Event page to new dialog window

The event page creates a new dialog and passes it this message:

```
{
  messageType: "setInputElementUUID",
  gmailTabId: "16",
  uuid: "f07920d0-1e98-11e7-a1d1-cfc4bf2de84d"
}
```

The dialog stores this reference to the Gmail tab and a text input element for later.

### 3 of 3: Dialog to Gmail content script

The dialog sends the following message directly back to the Gmail tab using
`chrome.tabs.sendMessage`.

```
{
  messageType: "updateInputElementWithSecureURL",
  uuid: "f07920d0-1e98-11e7-a1d1-cfc4bf2de84d",
  secureURL: "https://example.com/some-secure-url"
}
```

The Gmail content script receives this message, finds the input text area with
the matching UUID in its `data-uuid` attribute and updates it with the secure
URL.
