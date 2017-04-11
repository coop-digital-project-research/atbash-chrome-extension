/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

'use strict';

var inputElementUUID = null;
var gmailTabId = null;

;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});


  document.getElementById("insertButton").addEventListener("click", generateAndSendFakeUrl);
}( document, window, 0 ));


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log("dialog.js got message ", message);

    if(message.messageType == "setInputElementUUID") {
      console.log("I'm going to send a secure link back to tab id ", message.gmailTabId, " UUID ", message.uuid);

      inputElementUUID = message.uuid;
      gmailTabId = message.gmailTabId;
    }
  });


function generateAndSendFakeUrl() {
  var message = {
    messageType: "updateInputElementWithSecureURL",
    uuid: inputElementUUID,
    secureURL: "https://atbash.org/7118dc90/#key=broad.hued.whir.lois.db.cone"
  };

  console.log("Sending message to tab id ", gmailTabId, ": ", message);

  chrome.tabs.sendMessage(gmailTabId, message);
}
