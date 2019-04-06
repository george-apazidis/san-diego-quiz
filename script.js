'use strict';

let questionNum = 0; // used for accessing array index
let score = 0;

// Start Quiz
function handleStartButton () {
    $('.start-section button').click(event => {
        event.preventDefault();
        
        // Hide these elements specific to welcome screen 
        $('.start-section, .logo').hide();

        // Show these elements
        $('.score').show();

        // remove class on body for welcome screen
        $('body').removeClass('intro');

        renderQuestion();
        renderAnswers();
    });

}

// Render Question
function renderQuestion () {
    $('legend').text(`${STORE[questionNum].question}`);
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
    $('.answer-section').show();

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
            // $([`images/${STORE[questionNum].image}`]).preloadImage();
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

    // get expertise level
    // make this part dynamic in future based off dynamic # of questions
    let expertLevel = (score < 5) ? 'Potential Visitor'
                    : (score > 4 && score < 8) ? 'Tourist'
                    : (score > 7) ? 'Tour Guide'
                    : (score === 10) ? 'Mayor'
                    : false;
    
    // function getScoreLevels ()
    // divide score by # of questions
    // level 1 <= 40%           ---> 0 to Round(max * 0.4)                     i.e. for 17 max it's 0 to 7
    // level 2 > 40% && <= 70%  ---> Round(max * 0.4 + 1 ) to Round(max * 0.7) i.e. for 17 max it's 8 to 12
    // level 3 > 70% && < 100%  ---> Round(max * 0.7 +1 ) to max - 1           i.e. for 17 max it's 13 to 16
    // level 4 = 100%           ---> max                                       i.e. for 17 max it's 17
    // put in vars? level-1-min, level-1-max, level-2-min etc.

    let customMsg = '';

    switch (expertLevel) {
        case 'Potential Visitor':
            customMsg = `It looks like you don't know much about San Diego. 
                        Be sure to visit some time and experience all the 
                        great things San Diego has to offer!`;
            break;
        case 'Tourist':
            customMsg = `Nice work! You seem to know a few things about San Diego.
                        Hope you learned something new. Don't forget to visit!`;
            break;
        case 'Tour Guide':
            customMsg = `Great work! You know a lot about the city of San Diego
                        and all the great things the city has to offer!`;
            break;
        case 'Mayor' :
            customMsg = `Wow! A perfect score! Have you thought about running for office?`;
            break;
    }

    $('.js-custom-msg').text(customMsg);

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

        renderQuestion();
        renderAnswers();
        updateQuestionNum();
        
    });

} 

// Show final results

// call back function when page loads
function handleButtons () {
    handleStartButton();
    handleSubmitButton();
    handleNextButton();
    handleRestartButton();
  }


$(handleButtons);