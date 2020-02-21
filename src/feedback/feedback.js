var delayInMilliseconds = 2000; //1 second
setTimeout(function() {
    var frameDiv = document.getElementsByClassName("smcx-iframe-container")[0];
    var fframe = frameDiv.getElementsByTagName("iframe")[0];
    document.getElementById('smcx_frame').setAttribute('title', 'feedback form');
    document.getElementById('smcx_frame').removeAttribute('frameborder');
    fframe.style.width = "100%";
    fframe.style.height = "100%";
    fframe.style.border = "0";
    fframe.removeAttribute('width');
    fframe.removeAttribute('height');
    fframe.removeAttribute('frameborder');
    fframe.setAttribute('title', 'feedback form');
}, delayInMilliseconds);