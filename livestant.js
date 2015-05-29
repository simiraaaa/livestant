/// <reference path="smr.js"/>
/// <reference path="smr.util.js"/>
/// <reference path="smr.ajax.js"/>
/// <reference path="smr.google.js"/>
/// <reference path="smr.dom.js"/>

var livestant = livestant || smr.Object();

(function (ls,smr,undefined) {
    
    var window = smr.global;
    var API_ROOT ='http://coffeemilk.php.xdomain.jp/service/livestant/';
    var apiUrls=smr.Object({
        room:'room.php',
        delete:'delete.php',
        edit:'edit.php',
        update:'update.php',
        create:'create.php',
        look:'look.php',
    }).forIn(function(k,v){
        this[k]=API_ROOT+v;
    });

    var jsonp = smr.ajax.loadJSONP;
    var queryStringify = smr.util.queryString.stringify;
    var DEFAULT_CALLBACK = function (data) {
        console.log(data);
    };
    var DEFAULT_ERROR= function (mes) {
        console.error(mes);
    };

    ls.extend({
        apiUrls: apiUrls,

        get:function get(url,callback,error){
            callback = callback || DEFAULT_CALLBACK;
            error = error || DEFAULT_ERROR;
            function _callback(data) {
                if (data.status === 'success') {
                    callback(data.data);
                } else {
                    error && error(data.message);
                }
            }
            return jsonp(url, _callback);
        },
        
        /**
        対応しているkey
        start number
        length number
        asc true
        */
        getRooms: function getRooms(callback,error,qs) {
            //全件取得のみ実装済み
            var url = ls.safeAddQuery(apiUrls.room, qs || {});
            
            return ls.get(url, callback, error);
        },

        /**
        keys
        title string 100
        look string 20 a-zA-Z0-9
        edit string 20 a-zA-Z0-9
        */
        createRoom:function createRoom(callback,error,qs){

            var url = ls.safeAddQuery(apiUrls.create, qs || {});

            return ls.get(url, callback, error);
        },


        /**
        keys
        id number
        edit string 20 a-zA-Z0-9
        */
        deleteRoom: function deleteRoom(callback, error, qs) {

            var url = ls.safeAddQuery(apiUrls.delete, qs || {});

            return ls.get(url, callback, error);
        },


        /**
        keys
        id number
        edit string 20 a-zA-Z0-9
        */
        editRoom: function editRoom(callback, error, qs) {

            var url = ls.safeAddQuery(apiUrls.edit, qs || {});

            return ls.get(url, callback, error);
        },



        /**
        keys
        id number
        url string http://goo.gl/{string.length<=20}
        edit string 20 a-zA-Z0-9
        */
        updateRoom: function updateRoom(callback, error, qs) {

            var url = ls.safeAddQuery(apiUrls.update, qs || {});

            return ls.get(url, callback, error);
        },


        /**
        keys
        id number
        look string 20 a-zA-Z0-9
        */
        getRoomUrl: function getRoomUrl(callback, error, qs) {

            var url = ls.safeAddQuery(apiUrls.look, qs || {});

            return ls.get(url, callback, error);
        },

        safeAddQuery: function (url,data) {
            var qs = {};
            for (var k in data) {
                if (data[k] !== undefined) qs[k] = data[k];
            }
            for (var k in qs) {
                url += '?' + queryStringify(qs);
                break;
            }
            return url;
        },
    });


})(livestant,smr);