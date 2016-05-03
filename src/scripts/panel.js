$(document).ready(function() {
    $('.panel-container button').click(function (event) {
        event.preventDefault();

        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var tab = $(this).attr('target');

        $('.page-container .page').not(tab).removeClass('active');
        $(tab).addClass('active');
    });
});
