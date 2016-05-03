import Request from './scripts/lib/request';

import panel from './scripts/panel';

$(function () {
    var request = new Request('http://www.pap.pl');
    var $content = $('#content');

    request.done((response) => {
        var items = $(response).find('.information-block-last-time .items .item');

        $content.html(items);
    });

    request.fail((jqXHR, textStatus) => {
        $content.text(`Sorry, something went wrong: ${textStatus}`);
    });
});
