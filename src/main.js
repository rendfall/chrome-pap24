import './assets/stylesheets/main.scss';

import axios from 'axios';

const PAP_URL_HOME = 'https://www.pap.pl';
const PAP_URLS_RSS = [
    { name: 'Wszystkie', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/25' },
    { name: 'Biznes', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/1' },
    { name: 'Handel', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/9' },
    { name: 'Budownictwo i nieruchomości', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/2' },
    { name: 'Prawo', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/14' },
    { name: 'Komunikaty instytucji', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/36' },
    { name: 'Społeczne', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/13' },
    { name: 'Edukacja', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/3' },
    { name: 'Ekologia', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/4' },
    { name: 'Design', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/17' },
    { name: 'Emitent', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/5' },
    { name: 'Energetyka', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/6' },
    { name: 'Kultura', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/33' },
    { name: 'Lifestyle', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/32' },
    { name: 'Media', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/11' },
    { name: 'Motoryzacja', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/34' },
    { name: 'Nauka i technologie', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/16' },
    { name: 'PTE', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/7' },
    { name: 'Sport', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/18' },
    { name: 'Targi i konferencje', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/35' },
    { name: 'Transport', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/20' },
    { name: 'Turystyka', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/21' },
    { name: 'Zdrowie', url: 'http://centrumprasowe.pap.pl/cp/pl/rss/12' }
];

const monthNames = [
    'sty', 'lut', 'mar', 'kwi', 'maj', 'cze',
    'lip', 'sie', 'wrze', 'paź', 'lis', 'gru'
];

function translateMonthToName(m) {
    return monthNames[m];
}

function extractInnerHtml(source, selector) {
    const $el = source.querySelector(selector);

    return $el
        ? $el.innerHTML
        : '';
}

function prepareHeader(xml) {
    const title = extractInnerHtml(xml, 'channel title');
    const matched = title.match(/-\s+(.*)/i);

    return matched
        ? matched[1]
        : title;
}

function parseDate(date) {
    const d = new Date(date);

    if (d.toString() === 'Invalid Date') {
        return {
            hours: '',
            minutes: '',
            day: '',
            month: '',
            year: ''
        };
    }

    return {
        hours: String(d.getHours()).padStart(2, '0'),
        minutes: String(d.getMinutes()).padStart(2, '0'),
        day: String(d.getDate()).padStart(2, '0'),
        month: translateMonthToName(d.getMonth()),
        year: String(d.getFullYear())
    }
}

function fetchPAP24() {
    const $content = document.getElementById('page-content');

    axios.get(PAP_URL_HOME)
        .then((response) => {
            const htmlParser = new DOMParser();
            const html = htmlParser.parseFromString(response.data, 'text/html');
            const content = html.querySelector('.block-views-blockz-ostatniej-chwili-block-1');
            $content.innerHTML = `<div class="breaking-news-content">${content.innerHTML}</div>`;
        })
        .catch((err) => {
            $content.innerText = `Sorry, something went wrong: ${err}`;
        });
}

function fetchRSS(url) {
    const request = axios.get(url);
    const $content = document.getElementById('page-content');

    request.then((response) => {
        const xmlParser = new DOMParser();
        const xml = xmlParser.parseFromString(response.data, 'text/xml');
        const items = xml.getElementsByTagName('item');

        let header = `<h1>${prepareHeader(xml)}</h1>`;
        let content = '';

        [].forEach.call(items, (item) => {
            const title = extractInnerHtml(item, 'title');
            const link = extractInnerHtml(item, 'link');
            const publicationDate = parseDate(extractInnerHtml(item, 'pubDate'));

            content += `
                <a class="item row" href="${link}" target="_blank">
                    <div class="time col">
                        ${publicationDate.hours}:${[publicationDate.minutes]}
                    </div>
                    <div class="date col">
                        <div class="day">${publicationDate.day}</div>
                        <div class="month">${publicationDate.month}</div>
                    </div>
    
                    <div class="title col">${title}</div>
                </a>
            `;
        });

        $content.innerHTML = `${header}${content}`;
    }).catch((err) => {
        $content.innerText = `Sorry, something went wrong: ${err}`;
    });
}

function initializeBreakingNews() {
    const $navigation = document.getElementById('breaking-news');
    $navigation.innerHTML += `<a href="#" data-url="${PAP_URL_HOME}" class="collection-item center-align"><strong>Z ostatniej chwili</strong></a>`;

    $navigation.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        const $item = event.target;

        document.getElementById('navigation').querySelectorAll('a')
            .forEach(($item) => $item.classList.remove('active'));
        $item.classList.add('active');

        fetchPAP24();
    });
}

function initializeNavigation() {
    const $navigation = document.getElementById('categories');

    PAP_URLS_RSS.forEach((item) => {
        $navigation.innerHTML += `<a href="#" data-url="${item.url}" class="collection-item center-align">${item.name}</a>`;
    });

    const $navLinks = $navigation.querySelectorAll('a');

    $navLinks.forEach(($link) => $link.addEventListener('click', onNavigationClick.bind(this)));
}

function onNavigationClick(event) {
    event.preventDefault();
    const $item = event.target;

    document.getElementById('navigation').querySelectorAll('a')
        .forEach(($item) => $item.classList.remove('active'));
    $item.classList.add('active');

    fetchRSS($item.dataset.url);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeBreakingNews();
    initializeNavigation();

    document.getElementById('navigation').querySelector('a').click();
});
