'use strict';

let questionNum = 0; // used for accessing array index
let score = 0;

// Start Quiz
function handleStartButton () {
    $('.start-section button').click(event => {
        event.preventDefault();
        
        // Hide these elements specific to welcome screen 
        $('.start-section, .logo').hide();

        $('.js-maxQuestions').text(STORE.length);
        // Show these elements
        $('.score').show();

        // remove class on body for welcome screen
        $('body').removeClass('intro');

        $('.question-section').css("display","flex");

        renderQuestion();
        renderAnswers();

        // preload current answer image here for quick loading on answer page.
        preloadImage(`images/${STORE[questionNum].image}`);
    });

}

// Render Question
function renderQuestion () {
    $('legend').text(STORE[questionNum].question);
    $('.question-section').show();
}

// Render Answers
function renderAnswers () {

    // clear all answer choices from previous question
    $( "label" ).remove();

    // loop through all answers and render each
    for ( let i=0 ; i < STORE[questionNum].answers.length ; i++) {
        $('legend').after(`
        <label class="answerOption">
            <input type="radio" value="${STORE[questionNum].answers[i]}" name="answer" required="">
            <span>${STORE[questionNum].answers[i]}</span>
        </label>`);
    }  
}

// Get Submitted Answer
function handleSubmitButton () {

    // get submitted answer and determine if correct
    $('form').on('submit', function (event) {
        event.preventDefault();
    
        let selected = $('input:checked').val();
        let correctAnswer = `${STORE[questionNum].correctAnswer}`;
        
        let isCorrect = (selected === correctAnswer) ?  true : false;

        renderCorrectAnswer(isCorrect);
    });
}


// Render Answer
function renderCorrectAnswer (isAnswerCorrect) {

    // remove previous answer elements
    $( ".answer-section h2, .answer-section p, .correct-img" ).remove();

    // set variable for modifying result <h2> label
    let result = isAnswerCorrect ? 'correct' : 'incorrect';
    
    $('.answer-section')
        .prepend(`<p class="js-blurb">${STORE[questionNum].blurb}</p>`)
        .prepend(`<div class="correct-img"></div>`)
        .prepend(`<p class="js-correct">Correct Answer: <strong>${STORE[questionNum].correctAnswer}</strong>`)
        .prepend(`<h2 class="${result}">${result}!</h2>`);
    
    // assign image to background of div
    // $('.correct-img').css('background-image', 'url("images/population.jpg")');
    $('.correct-img').css('background-image', 'url("images/' + `${STORE[questionNum].image}` + '")');

    // highlight effect
    if (isAnswerCorrect === true) { 
        $('.answer-section h2').effect("highlight",{color:"#5cb85c"},1500);
    }
    else {
        $('.answer-section h2').effect("highlight",{color:"#e85a5a"},1500);
    }
    
    // hide question section
    $('.question-section').hide();

    // show answer section
    $('.answer-section').css("display","flex");

    // update score
    if (isAnswerCorrect === true) {
        updateScore();
    } 

}
    
function updateScore () {
    score++;
    $('.js-currentScore')
        .text(score)
        .effect('highlight',{color:"#5cb85c"},1500);
}

// preload current image
function preloadImage(imagePath) {
    $('<img/>')[0].src = imagePath;
}

function handleNextButton() {
       
    $('.nextBtn').click(event => {
        
        // if not on last question
        if (questionNum + 1 < STORE.length) {
                
            // update global var
            questionNum++; 

            // update question #
            updateQuestionNum();

            // hide answer section
            $('.answer-section').hide();

            // render next question and answers
            renderQuestion();
            renderAnswers(); 

            // preload current answer image here for quick loading on answer page.
            preloadImage(`images/${STORE[questionNum].image}`);
        }
        else {
            // render results
            renderResults();

            // hide answer and score section
            $('.answer-section, .score').hide();

            // show results section
            $('.results-section').show();
        }
    });

}    

function updateQuestionNum () {

    // render next question #
    $('.js-questionNumber').text(questionNum + 1);

    // if on last question, update Next button text
    if (questionNum === STORE.length - 1) {
        $('.nextBtn').text('See Results');
    }
}

function renderResults () {
    // render final score in header
    $('.final-score').text(`SCORE: ${score} out of ${STORE.length}`);

    // render final score in blurb
    $('.js-score').text(score);

    // render # of questions
    $('.js-num-of-questions').text(`${STORE.length}`);

    // if more than 9 questions then display levels and custom level message
    if (STORE.length > 8) {
        renderCustomLevels();
        $('.results-section ul').show();
    } 
    renderQandA();
}


function renderCustomLevels () {

    let levelRanges = getRanges(); // returns array with max # for each level

    // render level ranges status on results page
    $('.js-l1 .scoreRange').text(`0 - ${levelRanges[0]}`);
    $('.js-l2 .scoreRange').text(`${levelRanges[0] + 1} - ${levelRanges[1]}`);
    $('.js-l3 .scoreRange').text(`${levelRanges[1] + 1} - ${levelRanges[2]}`);
    $('.js-l4 .scoreRange').text(STORE.length);

    const level_1 = 'Potential Visitor';
    const level_2 = 'Tourist';
    const level_3 = 'Tour Guide';
    const level_4 = 'Mayor';

    // render level names
    $('.js-l1 .name').text(level_1);
    $('.js-l2 .name').text(level_2);
    $('.js-l3 .name').text(level_3);
    $('.js-l4 .name').text(level_4);

    // get expertise level
    let expertLevel = getExpertiseLevel(levelRanges); // returns a # 1-4

    let customMsg = '';

    // render custom message based on level
    switch (expertLevel) {
        case '1':
            $('.js-l1').css('font-weight', 'bold').effect("highlight",{color:"#5cb85c"},1500);;
            customMsg = `It looks like you don't know much about San Diego, 
                        so we are calling you a <strong>${level_1}</strong>. 
                        Be sure to visit some time and experience all the great things San Diego has to offer!`;
            break;
        case '2':
            $('.js-l2').css('font-weight', 'bold').effect("highlight",{color:"#5cb85c"},1500);;
            customMsg = `Nice work! You seem to know a few things about San Diego. 
                        You have earned the <strong>${level_2}</strong> status! 
                        Hope you learned something new. Don't forget to visit!`;
            break;
        case '3':
            $('.js-l3').css('font-weight', 'bold').effect("highlight",{color:"#5cb85c"},1500);;
            customMsg = `Great work! You know a lot about the city of San Diego
                        and all the great things the city has to offer! You have earned the <strong>${level_3}</strong> status!`;
            break;
        case '4' :
            $('.js-l4').css('font-weight', 'bold').effect("highlight",{color:"#5cb85c"},1500);;
            customMsg = `Wow! A perfect score! You've earned the <strong>${level_4}</strong> status. Have you thought about running for office?`;
            break;
    }

    $('.js-custom-msg').html(customMsg);
}

function getRanges () {
    // max score
    const maxScore = STORE.length;

    // define level ranges dynamically based on scores
    const level_1_max = Math.round(maxScore * 0.4); // level 1 = bottom 40%
    const level_2_max = Math.round(maxScore * 0.7); // level 2 = roughly 40% to 70%      
    const level_3_max = maxScore - 1;               // level 3 = roughly 70% to max -1 (*level 4 = max)

    let levelRanges = [level_1_max, level_2_max, level_3_max];

    return (levelRanges);
}

// returns a string with the appropriate level of expertise based on score
function getExpertiseLevel (levelRanges) {

    // assign expertise status based off score
    let expertiseLevel = (score <= levelRanges[0]) ? '1'
       : (score > levelRanges[0] && score <= levelRanges[1]) ? '2'
       : (score > levelRanges[1] && score <= levelRanges[2]) ? '3'
       : (score === STORE.length) ? '4'
       : false;
    
    return (expertiseLevel);
}



function handleRestartButton () {

    $('.results-section .submitBtn').click(event => {

        // resets
        questionNum = 0;
        score = 0;
        $('.results-section').hide();
        $('.js-currentScore').text(score)
        $('.score').show();
        $('.nextBtn').text('Next Question');
        $('.results-section li').css('font-weight','normal');

        renderQuestion();
        renderAnswers();
        updateQuestionNum();

    });

} 

// renders all questions and answers
function renderQandA () {
    for ( let i = 0 ; i < STORE.length ; i++) {
        $('.js-QA-content').append(`
        <dt><strong>${STORE[i].question}</strong></dt>
        <dd><strong>${STORE[i].correctAnswer}</strong> - ${STORE[i].blurb}</dd>`);
    }  
}

function handleShowAllQandA () {

    $(".js-QA-link").on('click', function() {
        $(this).toggleClass('is-active')
            .next(".js-QA-content")
            .stop()
            .slideToggle(500);
        
        let showHide = $('.js-QA-link span').text();

        if (showHide == 'Show') {
            $('.js-QA-link span').text('Hide');
        }
        else {
            $('.js-QA-link span').text('Show');
        }
    });
}

// Show final results

// call back function when page loads
function handleButtons () {
    handleStartButton();
    handleSubmitButton();
    handleNextButton();
    handleShowAllQandA();
    handleRestartButton();
  }


$(handleButtons);