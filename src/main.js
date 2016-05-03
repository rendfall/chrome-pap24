import Request from './scripts/lib/request';

import panel from './scripts/panel';

function fetchPAP24() {
    let request = new Request('http://www.pap.pl');
    let $content = $('#content');

    request.done((response) => {
        let items = $(response).find('.information-block-last-time .items .item');

        $content.html(items);
    });

    request.fail((jqXHR, textStatus) => {
        $content.text(`Sorry, something went wrong: ${textStatus}`);
    });
}

function fetchRSS() {
    let request = new Request('http://www.pap.pl/API/pl/Cms.Informations/Rss/1159/0');
    let $content = $('#page-rss-feed');

    request.done((response) => {
        let $items = $(response).find('item');
        let content = '';

        $items.each(function () {
            let title = $(this).find('title').text();
            let link = $(this).find('link').text();
            let description = $(this).find('description').text();

            content += `
                <li>
                    <h2>
                        <a href="${link}">${title}</a>
                    </h2>
                    <div class="description">${description}</div>
                </li>
            `;
        });

        $content.html(content);
    });

    request.fail((jqXHR, textStatus) => {
        $content.text(`Sorry, something went wrong: ${textStatus}`);
    });
}

$(function () {
    fetchPAP24();
    fetchRSS();
});
