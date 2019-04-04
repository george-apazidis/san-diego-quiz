'use strict';

let questionNum = 0; // used for accessing array index
let score = 0;

// Start Quiz
function handleStartButton () {
    $('.start-section button').click(event => {
        event.preventDefault();
        
        // Hide these elements 
        $('.start-section').hide();
        $('.logo').hide();

        // Show these elements
        $('.score').show();
        $('.question-section').show();

        // class on body to modify child styles
        $('body')
            .removeClass('intro')
            .addClass('question');

        renderQuestion();
        renderAnswers();
    });

}

// Render Question
function renderQuestion () {
    $('legend').text(`${STORE[questionNum].question}`);
}

// Render Answers
function renderAnswers () {
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

        renderResult(isCorrect);
    });
}


// Render Result
function renderResult (isAnswerCorrect) {
    
    // set variable for modifying result label
    let result = isAnswerCorrect ? 'correct' : 'incorrect';
    
    $('.answer-section')
        .prepend(`<p>${STORE[questionNum].blurb}</p>`)
        .prepend(`<p>Correct Answer: <strong>${STORE[questionNum].correctAnswer}</strong>`)
        .prepend(`<img src="images/${STORE[questionNum].image}">`)
        .prepend(`<h2 class="${result}">${result}!</h2>`);
        
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
    $('.js-currentScore').text(score);

}

function handleNextButton() {

}    

// Get user answer & update score


function handleRestartButton() {

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