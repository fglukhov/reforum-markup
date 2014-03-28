!function($){
    var connection,
        questionStorage = {},
        $spinner,
        $loadMask,
        $questionBoard,
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
                    leaveChat(user);
                    break;
                case Strophe.Status.ATTACHED:
                    console.log('[Connection] Attached');
                    break;
            }
        });
    }

    function joinChat(user){
        connection.muc.join(CHAT[ user.login ].roomJID, user.name, onMessage, onPresence, roster);
    }

    function leaveChat(user){
        connection.muc.leave(CHAT[ user.login ].roomJID, user.name);
        clearQuestionBoard();
    }

    function clearQuestionBoard(){
        $questionBoard.hide();
        $questionList.empty();
    }

    function rawInputCallback(data) {
        //console.log('RECV: ' + data);
    }

    function rawOutputCallback(data) {
        //console.log('SENT: ' + data);
    }

    function onMessage(stanza, room) {
        console.log('[XMPP] Message');

        var response = JSON.parse(Strophe.unescapeNode($(stanza).find('body').context.textContent)),
            stamp = $(stanza).find('delay').attr('stamp'),
            time = stamp ? new Date(stamp) : new Date(),
            $questionItem;

        if (!questionStorage[ response.messageID ]){
            $questionItem = $([
                '<section class="question-item">',
                    '<h4>', response.nickname,
                        ' <small>' , $.formatDateTime('M dd, yy hh:ii', time) , '</small>',
                    '</h4>',
                    '<p>', response.text, '</p>',
                '</section>'
            ].join(''));

            $questionList.append($questionItem);
            questionStorage[ response.messageID ] = response;
        }

        return true;
    }

    function onPresence(stanza, room) {
        console.log('[XMPP] Presence');
        return true;
    }

    function roster(users, room) {
        return true;
    }

    function connectFailed() {
        hideLoadMask();
    }

    function connectSuccess(user) {
        joinChat(user);

        hideLoadMask();
        initSlides();
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

    function viewInit(){
        $questionBoard = $('.question-board');
        $questionList = $('.question-list', $questionBoard);
    }

    function initSlides(){
        Reveal.initialize({
            controls: false,
            width:'100%',
            height: '100%',
            margin: 0.2

        });
    }

    function init(){
        viewInit();
        QBInit();
        QBUserLogin({
            login: 'master',
            password: 'chat_master'
        });
    }

    $(function(){
        init();
    });
}(jQuery);