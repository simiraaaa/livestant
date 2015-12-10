/// <reference path="smr.js"/>
/// <reference path="smr.util.js"/>
/// <reference path="smr.ajax.js"/>
/// <reference path="smr.google.js"/>
/// <reference path="smr.dom.js"/>

var livestant = livestant || smr.Object();

(function(ls, smr, undefined) {

  var window = smr.global;
  var API_ROOT = 'http://coffeemilk.php.xdomain.jp/service/livestant/';
  var RUNSTANT_ALPHA = 'http://phi-jp.github.io/runstant/release/alpha/';
  var RUNSTANT_BETA = 'http://phi-jp.github.io/runstant/release/beta/';
  var apiUrls = smr.Object({
    room: 'room.php',
    delete: 'delete.php',
    edit: 'edit.php',
    update: 'update.php',
    create: 'create.php',
    look: 'look.php',
  }).forIn(function(k, v) {
    this[k] = API_ROOT + v;
  });

  var jsonp = smr.ajax.loadJSONP;
  var queryStringify = smr.util.queryString.stringify;
  var DEFAULT_CALLBACK = function(data) {
    console.log(data);
  };
  var DEFAULT_ERROR = function(mes) {
    console.error(mes);
  };

  ls.extend({
    editorHash: "#UEsDBAoAAAAAALCgvkZCawHO2wcAANsHAAAEAAAAZGF0YXsidmVyc2lvbiI6IjAuMC4xIiwiY3VycmVudCI6InNjcmlwdCIsInNldHRpbmciOnsidGl0bGUiOiJsaXZlc3RhbnQgZWRpdG9yIiwiZGVzY3JpcHRpb24iOiJ0bWxpYi5qcyDnlKjlhazlvI/jgqjjg4fjgqPjgr8uIOiJsuOAheOBqOS9v+OBiOOBvuOBmeOCiOKZqiIsImZ1bGxzY3JlZW4iOmZhbHNlfSwiY29kZSI6eyJodG1sIjp7InR5cGUiOiJodG1sIiwidmFsdWUiOiI8IURPQ1RZUEUgaHRtbD5cbiBcbjxodG1sPlxuICAgIDxoZWFkPlxuICAgICAgICA8bWV0YSBjaGFyc2V0PVwiVVRGLThcIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCB1c2VyLXNjYWxhYmxlPW5vXCIgLz5cbiAgICAgICAgPG1ldGEgbmFtZT1cImFwcGxlLW1vYmlsZS13ZWItYXBwLWNhcGFibGVcIiBjb250ZW50PVwieWVzXCIgLz5cbiBcbiAgICAgICAgPHRpdGxlPiR7dGl0bGV9PC90aXRsZT5cbiAgICAgICAgPG1ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD1cIiR7ZGVzY3JpcHRpb259XCIgLz5cblxuICAgICAgICA8c3R5bGU+JHtzdHlsZX08L3N0eWxlPlxuXG5cdFx0PHNjcmlwdCBzcmM9XCJodHRwczovL2Nkbi5yYXdnaXQuY29tL3NpbWlyYWFhYS9pcm9pcm9qcy9naC1wYWdlcy9zbXIvc21yLmpzXCI+PC9zY3JpcHQ+XG4gICAgICAgIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9zaW1pcmFhYWEvaXJvaXJvanMvZ2gtcGFnZXMvc21yL3Ntci5kb20uanNcIj48L3NjcmlwdD5cblx0XHQ8c2NyaXB0PiR7c2NyaXB0fTwvc2NyaXB0PlxuICAgICAgICBcbiAgICA8L2hlYWQ+XG4gICAgPGJvZHk+XG4gICAgICAgIDxoMT5sb2FkaW5nPC9oMT5cbiAgICA8L2JvZHk+XG48L2h0bWw+In0sInN0eWxlIjp7InR5cGUiOiJjc3MiLCJ2YWx1ZSI6ImJvZHkge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNTIsIDI1MiwgMjU0KTtcbn1cblxuaDEge1xuICAgIGNvbG9yOiAjNDQ0O1xuICAgIGZvbnQtc2l6ZTogMjNweDtcbiAgICBmb250LWZhbWlseTogJ0x1Y2lkYSBHcmFuZGUnLCdIaXJhZ2lubyBLYWt1IEdvdGhpYyBQcm9OJywgTWVpcnlvLCBzYW5zLXNlcmlmO1xufSJ9LCJzY3JpcHQiOnsidHlwZSI6ImphdmFzY3JpcHQiLCJ2YWx1ZSI6ImlmKHBhcmVudC5sb2NhdGlvbi5zZWFyY2gpe1xyXG4gICAgXHJcblxyXG52YXIgU01SX1JPT1QgPSBcImh0dHA6Ly9zaW1pcmFhYWEuZ2l0aHViLmlvL2lyb2lyb2pzL3Ntci9zbXIuXCI7XHJcbnZhciBMSVZFU1RBTlRfUk9PVCA9IFwiaHR0cDovL3NpbWlyYWFhYS5naXRodWIuaW8vbGl2ZXN0YW50L1wiO1xyXG5cclxubG9hZFNjcmlwdHMoW1xyXG4naHR0cDovL2Nkbi5tbGtjY2EuY29tL3YyLjAuMC9taWxrY29jb2EuanMnLFxyXG5TTVJfUk9PVCsnanMnLFxyXG5TTVJfUk9PVCsnZG9tLmpzJyxcclxuU01SX1JPT1QrJ3V0aWwuanMnLFxyXG5TTVJfUk9PVCsnYWpheC5qcycsXHJcbkxJVkVTVEFOVF9ST09UKydsaXZlc3RhbnQuanMnLFxyXG5MSVZFU1RBTlRfUk9PVCsnY3JlYXRlRWRpdG9yLmpzJ1xyXG5dKTtcclxuICAgIFxyXG59ZWxzZXtcclxuICAgIGFsZXJ0KCfkuI3mraPjgarjg6rjgq/jgqjjgrnjg4jjgafjgZknKTtcclxuICAgIFxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU2NyaXB0cyhzcmNzKSB7XHJcbiAgICBpZiAoIXNyY3MgfHwgIXNyY3MubGVuZ3RoKSByZXR1cm47XHJcbiAgICB2YXIgbG9hZCA9IGZ1bmN0aW9uIGxvYWQoKSB7XHJcbiAgICAgICAgaWYgKCFzcmNzLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIHNtci5kb20uRWxlbWVudCgnc2NyaXB0JykuYXR0cmlidXRlKHtcclxuICAgICAgICAgICAgdHlwZTogXCJ0ZXh0L2phdmFzY3JpcHRcIixcclxuICAgICAgICAgICAgc3JjOiBzcmNzLnNoaWZ0KClcclxuICAgICAgICB9KS5vbihcImxvYWRcIiwgbG9hZCkuYXBwZW5kVG8ocGFyZW50LmRvY3VtZW50LmhlYWQpO1xyXG4gICAgfTtcclxuICAgIGxvYWQoKTtcclxufSJ9fX1QSwECFAAKAAAAAACwoL5GQmsBztsHAADbBwAABAAAAAAAAAAAAAAAAAAAAAAAZGF0YVBLBQYAAAAAAQABADIAAAD9BwAAAAA=",

    apiUrls: apiUrls,

    get: function get(url, callback, error) {
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
    getRooms: function getRooms(callback, error, qs) {
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
    createRoom: function createRoom(callback, error, qs) {

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

    safeAddQuery: function(url, data) {
      var qs = {};
      for (var k in data) {
        if (data[k] != undefined) qs[k] = data[k];
      }
      for (var k in qs) {
        url += '?' + queryStringify(qs);
        break;
      }
      return url;
    },

    toEditor: function toEditor(to, qs) {
      if (qs.id === undefined) return alert('idを指定してください');
      var url = ls.safeAddQuery(to, qs);
      ls.openLink(url + ls.editorHash);
    },

    openLink: function(link) {
      var a = smr.dom.Element('a').element;
      a.href = link;
      a.target = "_blank";
      a.click();
    },

    toAlphaEditor: function toAlphaEditor(qs) {
      ls.toEditor(RUNSTANT_ALPHA, qs);
    },

    toBetaEditor: function toBetaEditor(qs) {
      ls.toEditor(RUNSTANT_BETA, qs);
    },
  });


})(livestant, smr);