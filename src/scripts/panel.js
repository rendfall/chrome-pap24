$(document).ready(function() {
    $('.panel-container button').click(function (event) {
        event.preventDefault();

        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
        var tab = $(this).attr('target');

        $('.page-container .page').not(tab).removeClass('active');
        $(tab).addClass('active');
    });
});
