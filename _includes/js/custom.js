function showContent() {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = 1;
}

function setTheme(){
    // User preset setup
    var currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
        jtd.setTheme('dark');
    } else {
        jtd.setTheme('light');
    }
}

function setThemeToggle(){ 
    
    // Set current state of the icon based on current theme   
    const toggleTheme = document.querySelector('.toggle-theme');
    var currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
        toggleTheme.textContent = '🌕';
    } else {
        toggleTheme.textContent = '🌑';
    }

    // Setup toggle callback 
    jtd.addEvent(toggleTheme, 'click', function(){
        if (jtd.getTheme() === 'dark') {
            jtd.setTheme('light');
            toggleTheme.textContent = '🌑';
            localStorage.setItem('theme', 'light')
        } else {
            jtd.setTheme('dark');
            toggleTheme.textContent = '🌕';
            localStorage.setItem('theme', 'dark')
        }
    });

    // Setup hover callback
    $(".toggle-theme").hover(
        () => { //hover
            const toggleTheme = document.querySelector('.toggle-theme');
            var currentTheme = localStorage.getItem('theme');
            if (currentTheme == 'dark') {
                toggleTheme.textContent = '🌕';
            } else {
                toggleTheme.textContent = '🌑';
            }
        }, 
        () => { //out
            const toggleTheme = document.querySelector('.toggle-theme');
            var currentTheme = localStorage.getItem('theme');
            if (currentTheme == 'dark') {
                toggleTheme.textContent = '🌑';
            } else {
                toggleTheme.textContent = '🌕';
            }
        }
        );
}


function setAnchorUnclicked(){
    const anchors = $('body').find('h1, h2, h3');
    // set everything inactive first
    for (var i = 0; i < anchors.length; i++){
        $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('stackedit-clicked');
    }
}

function setAnchorUnscrolled(){
    const anchors = $('body').find('h1, h2, h3');
    // set everything inactive first
    for (var i = 0; i < anchors.length; i++){
        $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('stackedit-scrolled');
    }

}

// Helper function to check of jquery element is in ViewPort
$.fn.isInViewport = function() {
    if ($(this).length > 0){
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    }
    else{
        return false;
    }
};

function highlightTocInView(){
    const anchors = $('body').find('h1, h2, h3');

    // find if any element is in the viewport
    var element_in_viewport = false;
    for (var i = 0; i < anchors.length ; i++){
        var heading_element = $('#' + $(anchors[i]).attr('id')); 
        if (heading_element.isInViewport()){
            element_in_viewport = true;
            break;
        }
    }

    if (element_in_viewport){
        var clicked_present = false;
        // check for clicked heading 
        for (var i = 0; i < anchors.length; i++){
            var toc_anchor = $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]');
            var heading_element = $('#' + $(anchors[i]).attr('id')); 
            
            // check if clicked
            if (toc_anchor.hasClass('stackedit-clicked')){
                // check if element is in viewport
                if (heading_element.isInViewport()){
                    // do nothing
                    clicked_present = true;
                    break;
                }
                else{
                    toc_anchor.removeClass('stackedit-clicked');
                }
            }
        }
        
        if (clicked_present == false){
            for (var i = 0; i < anchors.length; i++){
                var toc_anchor = $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]');
                var heading_element = $('#' + $(anchors[i]).attr('id')); 
                
                if (heading_element.isInViewport()){
                    // remove all class
                    setAnchorUnscrolled();
                    toc_anchor.addClass('stackedit-scrolled');
                    break;
                }
                else{
                    toc_anchor.removeClass('stackedit-scrolled');
                }

            }
        }
    }
    else{
        return;
    }
}
// Runs set theme first based on local storage, and load the CSS
setTheme();

// Run scripts after DOM is loaded
window.addEventListener("DOMContentLoaded", (event) => {
    //dom is fully loaded, but maybe waiting on images & css files
    var btnScrollToTop = document.getElementById("btnScrollToTop");
    document.addEventListener("scroll", function () {
        document.scrollingElement.scrollTop > 50 ? btnScrollToTop.classList.add("show") : btnScrollToTop.classList.remove("show");
    });

    btnScrollToTop.addEventListener("click", function () {
        document.scrollingElement.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Auto convert bold and code inside content answer
    contentAnswers = document.getElementsByClassName("content_answer");
    var i;

    for (i = 0; i < contentAnswers.length; i++){
        stringval = contentAnswers[i].innerHTML;
        stringval = stringval.replace(/\*{1,2}(.*?)\*{1,2}/g, '<strong>$1</strong>');
        stringval = stringval.replace(/`(.*?)`/g, '<code>$1</code>');
        contentAnswers[i].innerHTML = stringval;
    }


    // Collapsible answers for quiz questions
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content_answer = this.nextElementSibling;
        if (content_answer.style.display === "block") 
        {
        content_answer.style.display = "none";
        } 
        else{
        content_answer.style.display = "block";
        }
    });
    }
    
    setThemeToggle();
    showContent();

    // Add callback for toc elements
    const anchors = $('body').find('h1, h2, h3');
    for (var i = 0; i < anchors.length; i++){
        $('.stackedit__toc ul li a[href="#' + $(anchors[i]).attr('id') + '"]').click(
            function(e){
                // remove highlight of everyone else
                setAnchorUnclicked();
                setAnchorUnscrolled();
                // add class
                $(this).addClass('stackedit-clicked');
            }
        )
    }
    
    // highlight whatever is in view
    highlightTocInView();

});



// Set Callback event to highlight toc
$(window).on('mousewheel touchmove', function(){
    highlightTocInView();
});
    



