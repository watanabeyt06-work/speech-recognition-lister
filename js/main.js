$(function(){
    var vocabs = ['じゃがいも','ジャガイモ', 'ニンジン', '人参', 'にんじん', 'たまねぎ', '玉葱', 'タマネギ'];

    $('#recognizedText').on('input', function(){
        var matched = _.filter(vocabs, function(vocab) {
            var testRegex = new RegExp(vocab, 'i');
            console.log(testRegex.test($('#recognizedText').val()));
            return testRegex.test($('#recognizedText').val());
        });
        if(matched.length > 0){
            $('#list').append(matched);
            $('#recognizedText').val('');
        }

    });
});




var flag_speech = 0;
function vr_function() {
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    var recognition = new webkitSpeechRecognition();
    recognition.lang = 'ja';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onsoundstart = function() {
        $("#state").text("認識中");
    };

    recognition.onsoundend = function() {
        $("#state").text("停止中");
        vr_function();
    };


    //マッチする認識が無い
    recognition.onnomatch = function(){
        $("#recognizedText").text("もう一度試してください");
    };
    //エラー
    recognition.onerror= function(event){
        $("#recognizedText").text(event.error);
        console.log('Speech recognition error detected: ' + event.error);
        console.log('Additional information: ' + event.message);
        if(flag_speech === 0){
            vr_function();
        }
    };

    //認識が終了したときのイベント
    recognition.onresult = function(event){
        var results = event.results;
        for (var i = event.resultIndex; i<results.length; i++){
            //認識の最終結果
            if(results[i].isFinal){
                $("#recognizedText").text(results[i][0].transcript);
                vr_function();
            }
            //認識の中間結果
            else{
                $("#recognizedText").text(results[i][0].transcript);
                flag_speech = 1;
            }
        }
    };

    flag_speech = 0;
    $("#state").text("開始");
    recognition.start();
}




