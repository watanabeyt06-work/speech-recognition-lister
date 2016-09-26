
var filterVocab = function() {
    'use strict';
    var vocabs = ['じゃがいも','ジャガイモ', 'ニンジン', '人参', 'にんじん', 'たまねぎ', '玉ねぎ', '玉葱', 'タマネギ'];
    return _.filter(vocabs, function(vocab) {
        var testRegex = new RegExp(vocab, 'i');
        return testRegex.test($('#hidden-field').val());
    });
};

var appendVocab = function(item) {
    $('#list').append('<li>' + item + '</li>');
};

// initial setting
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';
recognition.interimResults = true;
recognition.continuous = true;

var flag_speech = 0;
function vr_function() {
    'use strict';

    recognition.onsoundstart = function() {
        $("#state").text("音声認識中");
    };

    recognition.onsoundend = function() {
        $("#state").text("停止中");
        vr_function();
    };


    //マッチする認識が無い
    recognition.onnomatch = function(){
        console.log("もう一度試してください");
    };
    //エラー
    recognition.onerror= function(event){
        console.log('Speech recognition error detected: ' + event.error);
        console.log('Additional information: ' + event.message);
        if(flag_speech === 0){
            console.log('start service again');
            vr_function();
        }
    };

    //認識が終了したときのイベント
    recognition.onresult = function(event){
        var results = event.results;
        var matched = filterVocab();
        for (var i = event.resultIndex; i<results.length; i++){
            //認識の最終結果
            if(results[i].isFinal){
                $("#recognizedText").val(results[i][0].transcript);
                $('#hidden-field').val(results[i][0].transcript);
                if(matched.length > 0){
                    // append item to the list
                    _.each(matched, appendVocab(item));

                    // delete hedden field when the vocaburaly matched
                    $('#hidden-field').val('');
                }
                vr_function();
            }
            //認識の中間結果
            else{
                $("#recognizedText").val(results[i][0].transcript);
                flag_speech = 1;
            }
        }
    };

    flag_speech = 0;
    recognition.start();
    console.log('start service');
    $("#state").text("喋ってください");
}

function stop() {
    recognition.stop();
    console.log('stop service');
    $("#state").text("停止中");
}