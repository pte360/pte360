const loadContent = (loadQuestion, showResult, hideResult, qArray, visited, localStorageVariableName) => {
    //Get data
    var jsonURL = "data.json";
    var questionIndex = 0;
    // var visited;
    var searchKeys = [];
    //get visited quize items
    if (localStorage.getItem(localStorageVariableName)) {
        visited = JSON.parse(localStorage.getItem(localStorageVariableName))
    }

    var sortByPro = $("#search_by").children("option:selected").val();
    //Consruct the select  menu
    $.getJSON(jsonURL, function (data) {


        qArray = data;

        buildQuizzSelect(data, visited , localStorageVariableName, sortByPro);
        /*
        $.each(data, function (index, value) {
            // APPEND OR INSERT DATA TO SELECT ELEMENT.				
            var optionClass = "";
            if (visited.includes(value.id)) optionClass = "visited";
            $('#samples').append('<option value="' + index + '" class="' + optionClass + '">[' + value.id + '] </option>');
        });

        // Initialize Quetion area into question index zero 
        questionIndex = 0;
        loadQuestion(qArray, questionIndex, localStorageVariableName);
        */
    });

    // SHOW SELECTED VALUE.
    $('#samples').change(function () {
        questionIndex = this.options[this.selectedIndex].index;
        loadQuestion(qArray, questionIndex, localStorageVariableName);
        //If result shown swap 
        if ($('#result:visible').length) { $('#show_answer').trigger('click'); }
        //$("#result").hide();
        //$('#show_answer').text('SHOW ANSWERS');
    });

    $("#next").click(function () {
        var nextElement = $('#samples > option:selected').next('option');
        if (nextElement.length > 0) {
            $('#samples > option:selected').removeAttr('selected').next('option').attr('selected', 'selected');
            $('#samples').trigger('change');
        }
    });

    $("#prev").click(function () {
        var nextElement = $('#samples > option:selected').prev('option');
        if (nextElement.length > 0) {
            $('#samples > option:selected').removeAttr('selected').prev('option').attr('selected', 'selected');
            $('#samples').trigger('change');
        }
    });

    // SHOW ANSWERS 
    $("#show_answer").click(function (event) {
        //questionIndex = $("#samples").options[$("#samples").selectedIndex].index;
        //var questionIndex = $("#samples").selectedIndex;
        //alert(questionIndex);
        var id = qArray[questionIndex].id;
        //visited 
        item_visited(id, visited, localStorageVariableName);

        if ($('#result:visible').length) {

            hideResult(qArray, questionIndex);
            //reset
            $("#result").hide();
            $('#show_answer').text('SHOW ANSWERS');

        } else {

            showResult(qArray, questionIndex);
            //reset
            $('#show_answer').text('HIDE ANSWERS');
            $("#result").show();
        }
    });


    $("#search").click(function (event) {

        var searchKeyword = $("#searchKeywords").val();
        var sortByPro = $("#search_by").children("option:selected").val();
        //searchKeyword.match(/\S+/g) || []
        var found = qArray;

        //alert("start search >>>>> "+searchKeyword);
        if (searchKeyword.length != 0) {
            found = findout(qArray, "content", searchKeyword, sortByPro);
        }
        alert("Array length = "+found.length+" , Sort By = "+sortByPro );
        buildQuizzSelect(found, visited, localStorageVariableName, sortByPro);

    });

    $("#reset").click(function (event) {
        $("#searchKeywords").val("");

        var sortByPro = $("#search_by").children("option:selected").val();

        buildQuizzSelect(qArray, visited, localStorageVariableName, sortByPro);

    });




    return 1;
}

/*
function serach(objArray, key, value){
    var foundArray = [];

    $.each(objArray, function (index, item) {
        // APPEND OR INSERT DATA TO SELECT ELEMENT.				
        if(item[key].includes(value)) foundArray.push(item);
       
    });

    return foundArray;
}
*/

function buildQuizzSelect(data, visited, localStorageVariableName, sortByPro) {

    $('#samples').html("");
    data.sort(sortBy(sortByPro));

    $.each(data, function (index, value) {
        // APPEND OR INSERT DATA TO SELECT ELEMENT.				
        var optionClass = "";
        if (visited.includes(value.id)) optionClass = "visited";
        $('#samples').append('<option value="' + index + '" class="' + optionClass + '">[' + value.id + '] </option>');
    });

    // Initialize Quetion area into question index zero 
    questionIndex = 0;
    loadQuestion(data, questionIndex, localStorageVariableName);

}


function item_visited(id, visited, visitedQuiz) {
    if (!visited.includes(id)) {
        visited.push(id);
        visited.sort();
        localStorage.setItem(visitedQuiz, JSON.stringify(visited))
        //refresh style for visited options 

        $(".visited").css({ 'margin': '40px', 'background-color': 'rgb(225, 0, 255)', 'color': '#fff', 'text-shadow': '0 1px 0 rgba(0, 0, 0, 0.4)' });

    }
}

function findout(objArray, key, value, sortByPro) {
    var foundArray = [];

    var searchKeywordSplit = value.trim().split(/\s+/);
    var searchKeyword = searchKeywordSplit.join("|");
    var regex = new RegExp(searchKeyword, "i");

    //alert(searchKeyword)

    $.each(objArray, function (index, item) {
        // APPEND OR INSERT DATA TO SELECT ELEMENT.				
        //if (item[key].includes(value)) foundArray.push(item);

        if (regex.test(item[key])) foundArray.push(item);

    });

    foundArray.sort(sortBy(sortByPro));

    return foundArray;
}

//sort by id or rating

function sortBy(prop) {
    return function (a, b) {
        var aVal = a[prop];
        var bVal = b[prop];
        return ((aVal < bVal) ? -1 : ((aVal > bVal) ? 1 : 0));
    }
}  
