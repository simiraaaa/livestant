/// <reference path="smr.js"/>
/// <reference path="smr.dom.js"/>
/// <reference path="smr.util.js"/>
/// <reference path="smr.ajax.js"/>
/// <reference path="smr.google.js"/>
/// <reference path="livestant.js"/>

//livestant/editor でiframeのrunstantを表示して
//そのrunstantのheadにappendされるコード
//html.innerHTMLをヒアドキュメントゴリ押しで作る

/*
parent.document.body.display='none'
MilkCocoa
smr
smr.dom
util
ajax
livestant
をrunstantのコードでparentに追加している
そのあと最後にこいつが追加される
*/


(function (smr, livestant, window, document, undefined) {

    //html描画
    var html = document.getElementsByTagName('html')[0];
    var s = html.style;
    s.width = '100%';
    s.height = '100%';
    s.padding = 0;
    s.margin = 0;

    html.innerHTML = "\<head\>\n\
        \<meta charset=\"UTF-8\" /\>\n\
        \<meta name=\"viewport\" content=\"width=device-width, user-scalable=no\" /\>\n\
        \<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" /\>\n\
        \<title\>livestant | editor\</title\>\n\
\</head\>\n\
\<body\>\n\
\</body\>";

    var rs = window.rs;
    var runstant = window.runstant;
    var isAlpha = !!rs;
    var isBeta = !!runstant;


    // id editpass
    var qs = window.location.search.substring(1);
    var temp = {};
    qs.split('&').forEach(function (e) {
        e = e.split('=');
        temp[e[0]] = e[1];
    });

    var EDIT_PASS = temp.edit;
    var LOOK_PASS = temp.look;
    var DEFAULT_URL = isAlpha ? 'AeFRmK' : 'JSTAh0';
    var TARGET_URL = temp.url || null;
    var LIVE_ID = temp.id;
    var GOOGL = 'http://goo.gl/';


    var frame = smr.dom.Element('iframe').attribute({
        width: '100%',
        height: '100%',
    }).setStyle({
        border: '0'
    });


    var milkcocoa = new MilkCocoa("dogia10xa80.mlkcca.com");
    var SENDTO = 'livestant/' + LIVE_ID + '/' + LOOK_PASS;

    var dataStore = milkcocoa.dataStore(SENDTO);

    var parent = window;
    var frameLoaded = false;

    frame.onload = function () {

        if (frameLoaded) return;

        var window = this.contentWindow;

        //alpha or beta replace
        if (window.location.pathname !== parent.location.pathname) {
            window.location.pathname = parent.location.pathname;
            return;
        }



        var rs = window.rs;
        var runstant = window.runstant;
        var isAlpha = !!rs;
        var isBeta = !!runstant;
        var shorten = isAlpha ? window.getShortURL : window.util.shorten;

        isAlpha && (window.document.onkeydown = null);
        //saveをどうにか改造

        //履歴はsearch=?edit&id&url
        isAlpha && (rs.data.save = function () {
            var t = this.data;
            t = JSON.stringify(t),
            this.cache != t && (this.cache = t, t = window.zip(t),
            t = encodeURI(t),
            window.history.pushState(null, "runstant", "#" + t)),
            window.document.title = this.getTitle() + " | runstant";

            //-----add

            window.getShortURL(window.location.href, function (url) {
                update(url);
            });

            //-----

            var e = this.getCurrentValue(),
                s = e.split("\n")[0],
                r = [
                    {
                        name: "tmlib",
                        regexp: /tmlib/,
                        message: "Let's tmlib programming!",
                        url: "http://goo.gl/B2JcWF"
                    },
                    {
                        name: "stg",
                        regexp: /stg/,
                        message: "シューティングゲームプログラミングを始めますか？",
                        url: "http://goo.gl/EHtBuv"
                    }, {
                        name: "es6",
                        regexp: /es6/,
                        message: "Let's es6 programming!",
                        url: "http://goo.gl/thJLBw"
                    }];
            r.forEach(function (t) {
                t.regexp.test(s) && confirm(t.message) && (frameLoaded = false, window.location.href = t.url);
            });
        });


        isBeta && (window.Main.project.save = function () {
            var t = JSON.stringify(this.data);
            if (this.cache !== t) {
                this.cache = t;
                var i = window.util.json2hash(this.data);
                window.history.pushState(null, "runstant", "#" + i);
                window.document.title = this.getTitle() + " | runstant";


                //---add
                window.util.shorten(location.href, function (url) { update(url); });
                //---

            }
        });

        //save して hashが書き換えられてshortenを実行したときのsuccess
        //update
        function update(url) {
            livestant.updateRoom(function (res) {
                parent.history.pushState(null, 'livestant',
                    '?id=' + LIVE_ID + '&edit=' + EDIT_PASS + '&url=' + res.url + parent.location.hash);
                sendUrl(res.url);
            }, function (e) { alert(e); }, {
                edit: EDIT_PASS,
                id: LIVE_ID,
                url: url
            });
        }

        //update のcallback で成功したとき
        //shortUrl をsend milkcocoa
        //goo.glは含まない
        function sendUrl(url) {
            dataStore.send({ url: url });
        }

        frameLoaded = true;
    };


    //urlを取得するよ
    livestant.editRoom(function (res) {
        var url = res.url || DEFAULT_URL;
        frame.element.src = TARGET_URL ? (GOOGL + TARGET_URL) : (GOOGL + url);
        frame.appendTo(document.body);
    }, function (e) {
        alert(e);
    }, {
        edit: EDIT_PASS,
        id: LIVE_ID,
    });

})(smr, livestant, window, document);