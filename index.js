var global_username = '';
var global_recipient = '';

sinchClient = new SinchClient({
	applicationKey: 'your-app-key',
	capabilities: {messaging: true},
});

var clearError = function() {
	$('div.error').text("");
}

var showPickRecipient = function() {
    $('div#auth').css('display', 'none');
    $('form#pickRecipient').show();
}

var showChat = function() {
    $('form#pickRecipient').css('display', 'none');
    $('div#chat').show();
	$('span#username').text(global_username);
    $('span#recipient').text(global_recipient);
}

var handleError = function(error) {
	$('button#createUser').attr('disabled', false);
	$('button#loginUser').attr('disabled', false);
	$('div.error').text(error.message);
}

$('button#createUser').on('click', function(event) {
    event.preventDefault();
    $('button#createUser').attr('disabled', true);
    $('button#loginUser').attr('disabled', true);
	clearError();
    
	var username = $('input#username').val();
	var password = $('input#password').val();
    
    var loginObject = {username: username, password: password};
	sinchClient.newUser(loginObject, function(ticket) {
		sinchClient.start(ticket, function() {
			global_username = username;
			showPickRecipient();
		}).fail(handleError);
	}).fail(handleError);
});

$('button#loginUser').on('click', function(event) {
    event.preventDefault();
    $('button#createUser').attr('disabled', true);
    $('button#loginUser').attr('disabled', true);
	clearError();
    
	var username = $('input#username').val();
	var password = $('input#password').val();

    var loginObject = {username: username, password: password};
	sinchClient.start(loginObject, function() {
		global_username = username;
		showPickRecipient();
	}).fail(handleError);
});

$('button#pickRecipient').on('click', function(event) {
    event.preventDefault();
    clearError();
    global_recipient = $('input#recipient').val();
    showChat();
});

var messageClient = sinchClient.getMessageClient();

$('button#sendMsg').on('click', function(event) {
	event.preventDefault();
	clearError();

	var text = $('input#message').val();
    $('input#message').val('');
	var sinchMessage = messageClient.newMessage(global_recipient, text);
	messageClient.send(sinchMessage).fail(handleError);
});

var eventListener = {
	onIncomingMessage: function(message) {
        if (message.senderId == global_username) {
            $('div#chatArea').append('<div>' + message.textBody + '</div>');
        } else {
            $('div#chatArea').append('<div style="color:red;">' + message.textBody + '</div>');
        }		
	}
}

messageClient.addEventListener(eventListener);





