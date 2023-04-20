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

function setButtonsTheme(elements, value){
    const classTheme = value === "light" ? "light-button" : "dark-button"
    const removeClassTheme = value === "light" ? "dark-button" : "light-button"
    for (const e of elements){
        e.classList.add(classTheme)
        e.classList.remove(removeClassTheme)
    }
}

function setButtonsText(elements, value){
    for (var i = 0; i<elements.length; i++){
        elements[i].textContent = value;
    }
}

function setClickEvent(elements){
    for (var i = 0; i<elements.length; i++){
        jtd.addEvent(elements[i], 'click', function(){
            if (jtd.getTheme() === 'dark') {
                jtd.setTheme('light');
                // set both buttons to be light
                // setButtonsText(document.querySelectorAll('.toggle-theme'), '☼')
                setButtonsTheme(document.querySelectorAll('.toggle-theme'), 'light')
                localStorage.setItem('theme', 'light')
            } else {
                jtd.setTheme('dark');
                // set both buttons to be dark
                // setButtonsText(document.querySelectorAll('.toggle-theme'), '☽︎')
                setButtonsTheme(document.querySelectorAll('.toggle-theme'), 'dark')
                localStorage.setItem('theme', 'dark')
            }
        });
    }
}

function setThemeToggle(){ 
    
    // Set current state of the icon based on current theme   
    const toggleThemeButtons = document.querySelectorAll('.toggle-theme');
    var currentTheme = localStorage.getItem('theme');
    
    if (currentTheme == 'dark') {
        // setButtonsText(toggleThemeButtons, '☽︎');
        setButtonsTheme(toggleThemeButtons, 'dark')
    } else {
        // setButtonsText(toggleThemeButtons, '☼');
        setButtonsTheme(toggleThemeButtons, 'light')
    }

    // Setup toggle callback 
    setClickEvent(toggleThemeButtons);

    // Setup hover callback
    $(".toggle-theme").hover(
        () => { //hover
            const toggleThemeButtons = document.querySelectorAll('.toggle-theme');
            var currentTheme = localStorage.getItem('theme');
            if (currentTheme == 'dark') {
                // setButtonsText(toggleThemeButtons, '☼')
                setButtonsTheme(toggleThemeButtons, 'light')
            } else {
                // setButtonsText(toggleThemeButtons, '☽︎')
                setButtonsTheme(toggleThemeButtons, 'dark')
            }
        }, 
        () => { //out
            const toggleThemeButtons = document.querySelectorAll('.toggle-theme');
            var currentTheme = localStorage.getItem('theme');
            if (currentTheme == 'dark') {
                // setButtonsText(toggleThemeButtons, '☽︎')
                setButtonsTheme(toggleThemeButtons, 'dark')
            } else {
                // setButtonsText(toggleThemeButtons, '☼')
                setButtonsTheme(toggleThemeButtons, 'light')
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

//open external links in a new window
function external_new_window() {
    for(var c = document.getElementsByTagName("a"), a = 0;a < c.length;a++) {
        var b = c[a];
        if(b.getAttribute("href") && b.hostname !== location.hostname) {
            b.target = "_blank";
            b.rel = "noopener";
        }
    }
}
//open PDF links in a new window
function pdf_new_window ()
{
    if (!document.getElementsByTagName) return false;
    var links = document.getElementsByTagName("a");
    for (var eleLink=0; eleLink < links.length; eleLink ++) {
    if ((links[eleLink].href.indexOf('.pdf') !== -1)||(links[eleLink].href.indexOf('.doc') !== -1)||(links[eleLink].href.indexOf('.docx') !== -1)) {
        links[eleLink].onclick =
        function() {
            window.open(this.href);
            return false;
        }
    }
    }
} 



    


// // hide bar on scroll and show when scroll up 
// // Hide Header on on scroll down
// var didScroll;
// var lastScrollTop = 0;
// var delta = 15;
// var navbarHeight = 0;

// $(window).scroll(function(event){
//     didScroll = true;
// });

// setInterval(function() {
//     if (didScroll) {
//         hasScrolled();
//         didScroll = false;
//     }
// }, 250);

// function hasScrolled() {
//     var st = $(this).scrollTop();
    
//     // Make sure they scroll more than delta
//     if(Math.abs(lastScrollTop - st) <= delta)
//         return;
    
//     // If they scrolled down and are past the navbar, add class .nav-up.
//     // This is necessary so you never see what is "behind" the navbar.
//     if (st > lastScrollTop && st > navbarHeight){
//         // Scroll Down
//         console.log("scrolling down, hiding search input");
//         $('.search').removeClass('nav-stick')
//         $('.main-header').removeClass('nav-stick')
//     } else {
//         // Scroll Up
//         if(st + $(window).height() < $(document).height()) {
//             console.log("scrolling up, enabled search input");
//             $('.search').addClass('nav-stick');
//             $('.main-header').addClass('nav-stick');
//         }
//     }
    
//     lastScrollTop = st;
// }
   

// Button to copy code blocks
function setupCopyButton() {
    const codeBlocks = document.querySelectorAll("div.highlight");

    codeBlocks.forEach(function (codeBlock) {
        const copyButton = document.createElement("button");
        copyButton.className = "copy";
        copyButton.type = "button";
        copyButton.ariaLabel = "Copy code to clipboard";
        copyButton.style =  "z-index: 0 !important"

        codeBlock.append(copyButton);

        copyButton.addEventListener("click", function () {
        const code = codeBlock.querySelector("code").innerText.trim();
        navigator.clipboard.writeText(code);

        // copyButton.innerText = "Copied";
        copyButton.classList.add("done")

        setTimeout(function () {
            copyButton.classList.remove("done");
        }, 5000);
        });
    });
}


// Run scripts after DOM is loaded
window.addEventListener("DOMContentLoaded", (event) => {
    //dom is fully loaded, but maybe waiting on images & css files
    // var btnScrollToTop = document.getElementById("btnScrollToTop");
    // document.addEventListener("scroll", function () {
    //     document.scrollingElement.scrollTop > 50 ? btnScrollToTop.classList.add("show") : btnScrollToTop.classList.remove("show");
    // });

    // btnScrollToTop.addEventListener("click", function () {
    //     document.scrollingElement.scrollTo({
    //         top: 0,
    //         behavior: 'smooth'
    //     });
    // });

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
    
    setupCopyButton();
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

    // check device width
    handleDeviceChange(smallDevice);

    // set mouse up listener
    setMouseUpListener();

    // open links in new tab
    pdf_new_window();
    external_new_window();


});

// Set Callback event to highlight toc
$(window).on('mousewheel touchmove', function(){
    highlightTocInView();
});


// Define the query
const smallDevice = window.matchMedia("(min-width: 1200px)");

smallDevice.addListener(handleDeviceChange);

function handleDeviceChange(e) {
  if (e.matches){
    console.log("Bigger Than Mobile");
    jQuery(".aux-nav").detach().prependTo(".main-header")
    jQuery(".search").detach().prependTo(".main-header")
  }
  else {
    // detach the search bar
    // detach the hamburger
    console.log("Mobile");
    jQuery(".aux-nav").detach().appendTo(".site-header")
    jQuery(".search").detach().insertBefore(".side-bar")
  }
}

function setMouseUpListener(){
    var container = document.getElementById('site-nav');
    var hamburger = document.getElementsByClassName('hamburger-button')[0];
    var main_header = document.getElementsByClassName('main-header')[0];
    var overlay = document.getElementsByClassName('search-overlay')[0];
    
    document.addEventListener('mouseup', function(e) {
        if (!container.contains(e.target) && container.classList.contains("nav-open")) {
            container.classList.remove("nav-open");
            hamburger.classList.remove("nav-open");
            main_header.classList.remove("nav-open");
            overlay.classList.remove('search-overlay-active');
            console.log("close sidebar");
        }
    });
}

