var filterVocab = function(value) {
    'use strict';
    var vocabs = ['じゃがいも','ジャガイモ', 'ニンジン', '人参', 'にんじん', 'たまねぎ', '玉ねぎ', '玉葱', 'タマネギ'];
    return _.filter(vocabs, function(vocab) {
        var testRegex = new RegExp(vocab, 'i');
        return testRegex.test(value);
    });
};

// initial setting
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';
recognition.interimResults = true;
recognition.continuous = false;

var manualStopFlg = false;
function vr_function() {
    'use strict';

    recognition.onsoundstart = function() {
        $("#state").text("音声認識中");
    };

    recognition.onsoundend = function() {
        $("#state").text("音声終了");
    };


    //マッチする認識が無い
    recognition.onnomatch = function(){
        console.log("もう一度試してください");
    };
    //エラー
    recognition.onerror= function(event){
        console.log('Speech recognition error detected: ' + event.error);
        console.log('Additional information: ' + event.message);
        console.log('start service again');
    };

    recognition.onend = function() {
        if(!manualStopFlg) {
            vr_function();
        } else {
            $("#state").text("停止中");
        }
    };

    //認識が終了したときのイベント
    recognition.onresult = function(event){
        var results = event.results;
        for (var i = event.resultIndex; i<results.length; i++){

            //認識の最終結果
            if(results[i].isFinal){
                $("#recognizedText").val(results[0][0].transcript);
                $('#hidden-field').val(results[0][0].transcript);

                var matched = filterVocab($('#hidden-field').val());
                if(matched.length > 0){
                    _.each(matched, function(item){
                            $('#list').append('<li>' + item + '</li>');
                    });
                    $('#hidden-field').val('');
                }
            }
            //認識の中間結果
            else{
                $("#recognizedText").val(results[i][0].transcript);
            }
        }
    };

    manualStopFlg = false;
    recognition.start();
    console.log('start service');
    $("#state").text("喋ってください");
}

function stop() {
    'use strict';

    manualStopFlg = true;
    recognition.stop();
    console.log('stop service');
    $("#state").text("停止中");
}