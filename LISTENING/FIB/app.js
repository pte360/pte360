function loadQuestion(qArray, QIndex, localStorageVariableName) {
    var id = qArray[QIndex].id;
    var content = qArray[QIndex].content;
    var answersArr = qArray[QIndex].answers;
    //var audio_url = qArray[QIndex].audio_url;
    var audio_url = "audio/" + qArray[QIndex].audio_filename;

    var textBoxStr = '<input class="fibinputbox" size="12" type="text" spellcheck="false">';
    var diffStr = '<span class="badge badge-warning diff" style="display:none;"></span>';

    var answersSpans = [];
    //generate answers     
    for (var i = 0; i < answersArr.length; i++) {
        //generate answers spans 
        answersSpans[i] = textBoxStr + '&nbsp;<span class="badge badge-success answer-hint" style="display:none;" >&nbsp;' + answersArr[i] + '</span>' + diffStr;
        //Replace first occurene BLANK, One By One
        content = content.replace("{{BLANK}}", answersSpans[i]);
    }

    // inject HTML content 		
    $("#content").html(content);
    $("#audio_src").attr("src", audio_url); // inject the audio_url

    //Play sound clip
    var audio = $("#audio");
    audio[0].pause();
    audio[0].load(); //suspends and restores all audio element    
    setTimeout(function () {
        audio[0].play();
    }, 5000)


    //reset timer 
    $('#timer').timer('remove');
    $('#timer').timer();


}

function showResult(qArray, questionIndex) {
    var score = 0;
    var total = 0;
    var optionsCount = 0;
    var diff = [];
    var answersArr = qArray[questionIndex].answers;

    $('.fibinputbox').each(function (index, obj) {
        total++;
        //alert(obj.value + " - " + answersArr[index]);
        diff[index] = diff_lineMode(obj.value, answersArr[index]);
        if (obj.value.trim() == answersArr[index].trim()) score++;

    });
    //alert("showResult  " + total);
    $('.diff').each(function (index, obj) {
        obj.innerHTML = diff[index];
    });


    var smile = ":)";
    var scorePcnt = Math.round(((score * 10) / total));

    if (scorePcnt >= 5) {
        smile = ", Very Good  :)";
        $("#answers").attr('class', 'alert alert-success');
    } else if (scorePcnt < 5 && scorePcnt > 0) {
        smile = ", Good but do better  :|";
        $("#answers").attr('class', 'alert alert-warning');
    } else {
        smile = ", Be ready next time  :(";
        $("#answers").attr('class', 'alert alert-danger');
    }

    var userScoreMsg = 'Your score = ' + score + ' out of ' + total + ' in ' + $("#timer").text() + ' ' + smile;


    $("#answers").html(userScoreMsg);
    $('.answer-hint').show();
    $('.diff').show();

}
function hideResult(qArray, questionIndex) {
    $('.answer-hint').hide();
    $('.diff').hide();
    //$("#answers").html('');

}

function diff_lineMode(text1, text2) {
    var dmp = new diff_match_patch();
    var diffs = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diffs);
    var diffHTML = dmp.diff_prettyHtml(diffs);
    return diffHTML;
}