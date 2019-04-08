'use strict';

// Fix for 100% height in mobile. 100vh does not account for browser tabs
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// recalc background image size on window resize
function resizeStuff() {
    //Time consuming resize stuff here
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

let TO = false;
$(window).resize(function(){
    if(TO !== false) {
        clearTimeout(TO);
    }
    TO = setTimeout(resizeStuff, 200); //200 is time in miliseconds
});