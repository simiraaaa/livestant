/// <reference path="livestant.js"/>
/// <reference path="smr.js"/>
/// <reference path="smr.dom.js"/>
/// <reference path="smr.util.js"/>
/// <reference path="smr.ajax.js"/>

(function (window,smr,livestant) {

    var message = smr.dom.Element.query('.message');
    var rooms = smr.dom.Element.query('.rooms');
    var createButton = smr.dom.Element.query('.createButton');
    var createForm = smr.dom.Element('div');
    createForm.element.className = "createForm";

    createForm.create('span').setStyle({
        fontSize: '24px',
        fontWeight: 'bold',
    }).element.textContent = 'ルームを作成します';

    createForm.create('hr');

    createForm.create('div').element.textContent = 'タイトル';

    var titleText=createForm.create('input').attribute({
        name: 'title',
        id: 'title',
        type: 'text',
    }).setStyle({
        width:'50%'
    });

    createForm.create('div').element.textContent = '編集パスワード(省略で誰でも編集削除可能)';

    var editPassText = createForm.create('input').attribute({
        name: 'edit',
        id: 'edit',
        type: 'text',
    }).setStyle({
        width: '50%'
    });

    createForm.create('div').element.textContent = '閲覧パスワード(省略で誰でも閲覧可能)';

    var lookPassText = createForm.create('input').attribute({
        name: 'look',
        id: 'look',
        type: 'text',
    }).setStyle({
        width: '50%'
    });



    var submitButton = createForm.create('div').create('button').attribute({
        type:'button'
    }).on('click', function () {
        livestant.createRoom(
            function () {
                removePopup();
                getRooms();
                message.element.textContent = 'ルームの作成の成功しました。';
                message.showDisp();
                setTimeout(function () {message.noneDisp() },2000);
            },
            function (e) { alert(e);},
            {
                title: titleText.value,
                edit: editPassText.value,
                look:lookPassText.value,
            }
            );
    });

    submitButton.element.textContent = '作成';

    var blackRect = smr.dom.Element('div')
        .absolute(0, 0)
        .setStyle({
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex:'40',

        }).on('click', removePopup);



    createButton.onmouseover = function (e) {
        message.x = e.pageX+10;
        message.y = e.pageY+10;
        message.element.textContent = "ルームを作成します。";
        message.showDisp();
    };

    createButton.onmouseout = function () {
        message.noneDisp();
    };

    createButton.onclick = function () {
        popupCreate();
    };



    //divをページの真ん中にだす
    function popup(div) {
        blackRect.popup = div;
        blackRect.appendTo();
        div.setStyle({
            zIndex: '60',
            position: 'fixed',
            top:'15%',
            left: '15%',
            width: '70%',
            height: '70%',
        }).appendTo();
    }

    function popupCreate() {
        popup(createForm);
    }
    function removePopup() {
        blackRect.remove();
        blackRect.popup.remove();
    }

    function popupVersion() {

    }

    function getRooms() {
        rooms.removeChildAll();
        livestant.getRooms(function (d) {
            console.log(d);
        })
    }


    getRooms();


})(window,smr,livestant);
