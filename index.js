/// <reference path="livestant.js"/>
/// <reference path="smr.js"/>
/// <reference path="smr.dom.js"/>
/// <reference path="smr.util.js"/>
/// <reference path="smr.ajax.js"/>

(function (window, smr, livestant) {

    var message = smr.dom.Element.query('.message');
    var rooms = smr.dom.Element.query('.rooms');
    var createButton = smr.dom.Element.query('.createButton');

    var versionDiv = smr.dom.Element('div');
    versionDiv.element.className = "createForm";

    versionDiv.create('span').setStyle({
        fontSize: '24px',
        fontWeight: 'bold',
    }).element.textContent = 'runstantのバージョンを選択してください';

    versionDiv.create('hr');

    versionDiv.create('div').setStyle({ margin: '10px' }).create('span').attribute({
        textContent: 'alpha',
        className: 'spanButton red',
    }).onclick = function () {
        livestant.toAlphaEditor(versionQs);
    }

    versionDiv.create('div').setStyle({ margin: '10px' }).create('span').attribute({
        textContent: 'beta',
        className: 'spanButton blue',
    }).onclick = function () {
        livestant.toBetaEditor(versionQs);
    }

    var versionQs = null;



    var lookForm = smr.dom.Element('div');
    lookForm.element.className = "createForm";

    lookForm.create('span').setStyle({
        fontSize: '24px',
        fontWeight: 'bold',
    }).element.textContent = '閲覧します';

    lookForm.create('hr');

    lookForm.create('div').element.textContent = '閲覧パスワード';


    var lkLookPassText = lookForm.create('input').attribute({
        type: 'text',
    }).setStyle({
        width: '50%'
    });
    var lkIdHidden = lookForm.create('input').attribute({
        type: 'hidden'
    });



    var lookFormButton = lookForm.create('div').create('button').attribute({
        type: 'button',
        textContent: '表示'
    }).on('click', function () {
        lookFormButton.noneDisp();
        lookRoom();
    });


    function lookRoom(popup) {
        popup = popup === undefined ? true : popup;
        livestant.getRoomUrl(
            function (res) {
                popup && removePopup();
                location.href = livestant.safeAddQuery('view.html', {
                    id: lkIdHidden.value,
                    look: res.look,
                    url: res.url
                });
            },
            function (e) {
                lookFormButton.showDisp();
                alert(e);
            },
            {
                id: lkIdHidden.value,
                look: lkLookPassText.value,
            }
            );
    }


    function popupLook(id, free) {
        lookFormButton.showDisp();
        lkLookPassText.value = "";
        lkIdHidden.value = id;
        free = free === undefined ? 1 : free;
        if (free) return lookRoom(false);

        popup(lookForm);
    }


    var editForm = smr.dom.Element('div');
    editForm.element.className = "createForm";

    editForm.create('span').setStyle({
        fontSize: '24px',
        fontWeight: 'bold',
    }).element.textContent = '編集します';

    editForm.create('hr');

    editForm.create('div').element.textContent = '編集パスワード';


    var efEditPassText = editForm.create('input').attribute({
        type: 'text',
    }).setStyle({
        width: '50%'
    });
    var efIdHidden = editForm.create('input').attribute({
        type: 'hidden'
    });



    var editFormButton = editForm.create('div').create('button').attribute({
        type: 'button',
        textContent: '編集'
    }).on('click', function () {
        editFormButton.noneDisp();
        editRoom();
    });

    function editRoom(popup) {
        popup = popup === undefined ? true : popup;
        livestant.editRoom(
            function (res) {
                popup && removePopup();
                popupVersion(efIdHidden.value, res);
            },
            function (e) {
                editFormButton.showDisp();
                alert(e);
            },
            {
                id: efIdHidden.value,
                edit: efEditPassText.value,
            }
            );
    }

    function popupEdit(id, free) {
        editFormButton.showDisp();
        efEditPassText.value = "";
        efIdHidden.value = id;
        free = free === undefined ? 1 : free;
        if (free) return editRoom(false);

        popup(editForm);
    }

    function popupVersion(id, qs) {
        qs.id = id;
        versionQs = qs;
        popup(versionDiv);
    }




    var createForm = smr.dom.Element('div');
    createForm.element.className = "createForm";

    createForm.create('span').setStyle({
        fontSize: '24px',
        fontWeight: 'bold',
    }).element.textContent = 'ルームを作成します';

    createForm.create('hr');

    createForm.create('div').element.textContent = 'タイトル';

    var titleText = createForm.create('input').attribute({
        name: 'title',
        id: 'title',
        type: 'text',
    }).setStyle({
        width: '50%'
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
        type: 'button'
    }).on('click', function () {
        submitButton.noneDisp();
        livestant.createRoom(
            function () {
                removePopup();
                getRooms();
                showMessage('ルームの作成の成功しました。');
            },
            function (e) {
                submitButton.showDisp();
                alert(e);
            },
            {
                title: titleText.value,
                edit: editPassText.value,
                look: lookPassText.value,
            }
            );
    });

    function showMessage(mes) {

        message.element.textContent = mes;
        message.setStyle({
            top: '10%',
            left: '40%',
        });
        message.showDisp();
        setTimeout(function () { message.noneDisp() }, 2000);
    }

    submitButton.element.textContent = '作成';

    var blackRect = smr.dom.Element('div')
        .fixed(0, 0)
        .setStyle({
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: '40',

        }).on('click', removePopup);



    createButton.onmouseover = function (e) {
        message.x = e.pageX + 10;
        message.y = e.pageY + 10;
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
            top: '15%',
            left: '15%',
            width: '70%',
            height: '70%',
        }).appendTo();
    }

    function popupCreate() {
        submitButton.showDisp();
        lookPassText.value = "";
        editPassText.value = "";
        titleText.value = "";
        popup(createForm);
    }
    function removePopup() {
        blackRect.remove();
        blackRect.popup.remove();
    }



    var roomList = [];

    function getRooms() {
        rooms.removeChildAll();
        roomList.length = 0;
        livestant.getRooms(function (d) {
            d.forEach(addRoom);
        })
    }

    function addRoom(room) {
        var id = room.id;
        var title = room.title;
        var lookFree = room.lookFree;
        var editFree = room.editFree;

        var div = smr.dom.Element('div');
        div.element.className = 'roomDiv';
        div.create('div').attribute({
            textContent: title,
            className: 'roomTitle'
        });


        div.create('span').attribute({
            textContent: '編集' + (editFree ? '(Free)' : ''),
            className: 'spanButton' + (editFree ? ' blue' : ''),
        }).setStyle({
            margin: '0 5px'
        }).onclick = function () {
            popupEdit(id, editFree);
        };

        div.create('span').attribute({
            textContent: '閲覧' + (lookFree ? '(Free)' : ''),
            className: 'spanButton' + (lookFree ? ' blue' : ''),
        }).setStyle({
            margin: '0 5px'
        }).onclick = function () {
            popupLook(id, lookFree);
        };


        div.create('span').attribute({
            textContent: '削除' + (editFree ? '(Free)' : ''),
            className: 'spanButton' + (editFree ? ' blue' : ''),
        }).setStyle({
            margin: '0 5px'
        }).onclick = function () {
            if (editFree) return deleteRoom(id);
            popupDelete(id);
        };

        rooms.append(div);
        roomList.push(div);
    }


    var deleteForm = smr.dom.Element('div');
    deleteForm.element.className = "createForm";

    deleteForm.create('span').setStyle({
        fontSize: '24px',
        fontWeight: 'bold',
    }).element.textContent = 'ルームを削除します';

    deleteForm.create('hr');

    deleteForm.create('div').element.textContent = '編集パスワード';


    var deletePassText = deleteForm.create('input').attribute({
        type: 'text',
    }).setStyle({
        width: '50%'
    });
    var deleteIdHidden = deleteForm.create('input').attribute({
        type: 'hidden',
    });

    var deleteButton = deleteForm.create('div').create('button').attribute({
        type: 'button',
        textContent: '削除'
    }).on('click', function () {
        deleteButton.noneDisp();
        var no_cancel = deleteRoom(deleteIdHidden.value, deletePassText.value,
            function () {
                removePopup();
            },
            function () {
                deleteButton.showDisp();
            }
            );
        no_cancel || deleteButton.showDisp();
    });


    function popupDelete(id) {
        deleteButton.showDisp();
        deletePassText.value = "";
        deleteIdHidden.value = id;
        popup(deleteForm);
    }

    function deleteRoom(id, edit, success, error) {
        if (!window.confirm('本当に削除しますか?')) { return false; }
        livestant.deleteRoom(function () {
            showMessage('ルームの削除に成功しました');
            getRooms();
            success && success();
        },
        function (e) {
            alert(e);
            error && error();
        }, { id: id, edit: edit });

        return true;
    }

    getRooms();


})(window, smr, livestant);
