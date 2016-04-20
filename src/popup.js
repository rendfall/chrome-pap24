$(window).load(function () {
    var request = $.ajax({
        url: 'http://www.pap.pl',
        method: 'GET',
        dataType: 'html'
    });

    var $content = $('#content');

    request.done(function (response) {
        var items = $(response).find('.information-block-last-time .items .item');

        $content.html(items);
    });

    request.fail(function (jqXHR, textStatus) {
        $content.text('Sorry, something went wrong: ' + textStatus);
    });
});
