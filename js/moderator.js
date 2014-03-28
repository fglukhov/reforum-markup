!function($){
    var connection,
        $spinner,
        $loadMask,
        $questionBoard,
        $questionBoardHeader,
        $questionList;

    function QBInit(){
        QB.init(QBPARAMS.appId, QBPARAMS.authKey, QBPARAMS.authSecret);
    }

    function QBUserLogin(authParams){
        showLoadMask();
        QB.createSession(function(err, result){
            console.debug('Session create callback', err, result);
            if (result){
                console.log(result.token);
                QB.login(authParams, function(err, result){
                    if (err) {
                        console.log('Something went wrong: ' + err.detail);
                        connectFailed();
                    } else {
                        console.log(result);
                        xmppConnect({
                            id: result.id,
                            login: authParams.login,
                            password: authParams.password,
                            name: result.full_name
                        });
                    }
                });
            } else {
                console.log(JSON.stringify(err));
            }
        });
    }

    function xmppConnect(user){

        connection = new Strophe.Connection(CHAT.boshUrl);
        connection.rawInput = rawInputCallback;
        connection.rawOutput = rawOutputCallback;

        userJID = user.id + "-" + QBPARAMS.appId + "@" + CHAT.server;

        connection.connect(userJID, user.password, function (status) {
            switch (status) {
                case Strophe.Status.ERROR:
                    console.log('[Connection] Error');
                    break;
                case Strophe.Status.CONNECTING:
                    console.log('[Connection] Connecting');
                    break;
                case Strophe.Status.CONNFAIL:
                    console.log('[Connection] Failed to connect');
                    connectFailed();
                    break;
                case Strophe.Status.AUTHENTICATING:
                    console.log('[Connection] Authenticating');
                    break;
                case Strophe.Status.AUTHFAIL:
                    console.log('[Connection] Unauthorized');
                    connectFailed();
                    break;
                case Strophe.Status.CONNECTED:
                    console.log('[Connection] Connected');
                    connectSuccess(user);
                    break;
                case Strophe.Status.DISCONNECTED:
                    console.log('[Connection] Disconnected');
                    break;
                case Strophe.Status.DISCONNECTING:
                    console.log('[Connection] Disconnecting');
                    leaveChats(user);
                    break;
                case Strophe.Status.ATTACHED:
                    console.log('[Connection] Attached');
                    break;
            }
        });
    }

    function joinChats(user){
        connection.muc.join(CHAT[ user.login ].roomJID, user.name, onMessage, onPresence, roster);
        connection.muc.join(CHAT.master.roomJID, user.name);
    }

    function leaveChats(user){
        connection.muc.leave(CHAT[ user.login ].roomJID, user.name);
        connection.muc.leave(CHAT.master.roomJID, user.name);
        clearQuestionBoard();
    }

    function clearQuestionBoard(){
        $questionBoard.hide();
        $questionBoardHeader.empty();
        $questionList.empty();
    }

    function rawInputCallback(data) {
        //console.log('RECV: ' + data);
    }

    function rawOutputCallback(data) {
        //console.log('SENT: ' + data);
    }

    function hasLocalStorage(){
        return typeof window.localStorage != 'undefined';
    }

    function getLocalStorage(key){
        if (hasLocalStorage()){
            return localStorage[ key ];
        }
        return null;
    }

    function onMessage(stanza, room) {
        console.log('[XMPP] Message');

        var response = Strophe.unescapeNode($(stanza).find('body').context.textContent),
            stamp = $(stanza).find('delay').attr('stamp'),
            time = stamp ? new Date(stamp) : new Date(),
            message = JSON.parse(response),
            $questionItem;

        if (!getLocalStorage(message.messageID) && message.text.indexOf('#вопрос') !== -1){
            $questionItem = $([
                '<a href="#" class="question-item list-group-item">',
                    '<h5 class="list-group-item-heading">', message.nickname,
                        ' <small>', $.formatDateTime('M dd, yy hh:ii:ss', time) , '</small>',
                    '</h5>',
                    '<p class="text-info">', message.text, '</p>',
                    '<input class="btn btn-sm btn-primary approve-btn" type="button" value="Одобрить">',
                '</a>'
            ].join(''));

            if (!$('.question-item', $questionList).length){
                $questionList.append($questionItem);
            } else {
                $('.question-item:first', $questionList).before($questionItem);
            }

            $questionItem.data(message);
            $questionItem.fadeTo(300, 1);
        }
        return true;
    }

    function onPresence(stanza, room) {
        console.log('[XMPP] Presence');
        return true;
    }

    function roster(users, room) {
        /*var occupants = Object.keys(users).length;
        $('.occupants .number').text(occupants);*/
        return true;
    }

    function connectFailed() {
        hideLoadMask();
    }

    function connectSuccess(user) {
        $questionBoardHeader.html('<h4>' + CHAT[ user.login ].roomName + '</h4>');
        $questionBoard.removeClass('hide');
        hideLoadMask();

        joinChats(user);
    }

    function showLoadMask(){
        var $body = $('body');
        $loadMask = $('<div class="loading-mask"></div>');
        $loadMask.appendTo($body);

        $spinner = $([
            '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px; z-index:101;">',
                '<div class="progress progress-striped active">',
                    '<div class="progress-bar" style="width: 100%;"></div>',
                '</div>',
            '</div>'].join(''));

        $spinner.appendTo($body).addClass('in');
    }

    function hideLoadMask(){
        $spinner && $spinner.remove();
        $loadMask && $loadMask.remove();
        $spinner = null;
        $loadMask = null;
    }

    function approveQuestion(data){
        var messageId = data.messageID,
            message = JSON.stringify(data);

        if (hasLocalStorage()){
            localStorage[ messageId ] = 'approved';
        }
        connection.muc.groupchat(CHAT.master.roomJID, Strophe.escapeNode(message));
    }

    function viewInit(){
        $questionBoard = $('.question-board');
        $questionBoardHeader = $('.question-board-header', $questionBoard);
        $questionList = $('.question-list', $questionBoard);

        $questionList.on('click', '.approve-btn', function(e) {
            var $approveBtn = $(e.target),
                $questionItem = $approveBtn.parents('.question-item');

            approveQuestion($questionItem.data());
            $questionItem.remove();
        });
    }

    function init(){
        viewInit();
        QBInit();
        QBUserLogin({
            login: 'moderator',
            password: 'chat_moderator'
        });
    }

    $(function(){
        init();
    });
}(jQuery);