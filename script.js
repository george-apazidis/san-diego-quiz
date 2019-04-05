'use strict';

// // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// // Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

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
    let expertLevel = (score < 5) ? 'Out-of-towner'
                    : (score > 4 && score < 8) ? 'Tourist'
                    : (score > 8) ? 'Resident'
                    : false;
    
    // render expertise level
    $('.js-level').text(expertLevel);

}


function handleRestartButton () {

    $('.results-section .submitBtn').click(event => {

        // resets
        questionNum = 0;
        score = 0;
        $('.results-section').hide();
        $('.nextBtn').text('Check');
        $('.js-currentScore').text(score)
        $('.score').show();

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