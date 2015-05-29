/// <reference path="livestant.js"/>

livestant.getRooms(function (data) {
    console.log(data);
});

var hoge = "\<script src=\"http://cdn.rawgit.com/phi-jp/high/0.0.3/high.js\"\>\</script\>";
document.getElementsByTagName('html')[0].innerHTML = hoge;
alert(0);
setTimeout('alert(345);', 1000);