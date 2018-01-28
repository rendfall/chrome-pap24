import './assets/stylesheets/main.scss';

import axios from 'axios';

const PAP_URL_HOME = 'http://www.pap.pl';
const PAP_URL_RSS = 'http://www.pap.pl/API/pl/Cms.Informations/Rss/1159/0';

function fetchPAP24() {
    const $content = document.getElementById('page-news-24');

    axios.get(PAP_URL_HOME)
        .then((response) => {
            const htmlParser = new DOMParser();
            const html = htmlParser.parseFromString(response.data, 'text/html')
            const content = html.querySelector('.information-block-last-time .list .item');
            $content.innerHTML = content.innerHTML;
        })
        .catch((err) => {
            $content.innerText = `Sorry, something went wrong: ${err}`;
        });
}

function fetchRSS() {
    const request = axios.get(PAP_URL_RSS);
    const $content = document.getElementById('page-rss-feed');

    request.then((response) => {
        const xmlParser = new DOMParser();
        const xml = xmlParser.parseFromString(response.data, 'text/xml');
        const items = xml.getElementsByTagName('item');
        let content = '';

        [].forEach.call(items, (item) => {
            const { title, link, description } = parseXmlResponseItem(item);

            content += `
                <li>
                    <h2>
                        <a href="${link}" target="_blank">${title}</a>
                    </h2>
                    <div class="description">${description}</div>
                </li>
            `;
        });

        $content.innerHTML = `<ul>${content}</ul>`;
    }).catch((err) => {
        $content.innerText = `Sorry, something went wrong: ${err}`;
    });
}

function initializeNavigation() {
    const $navLinks = document.getElementById('navigation').querySelectorAll('button');
    $navLinks.forEach(($link) => $link.addEventListener('click', onNavigationClick.bind(this)));
}

function parseXmlResponseItem(item) {
    const title = item.getElementsByTagName('title');
    const link = item.getElementsByTagName('link');
    const description = item.getElementsByTagName('description');

    function getValue(el) { return el && el[0].innerHTML }

    return {
        title: getValue(title),
        link: getValue(link),
        description: getValue(description),
    }
}

function onNavigationClick(event) {
    event.preventDefault();

    const $el = event.target;
    const target = $el.getAttribute('target');
    const $navLinks = document.getElementById('navigation').querySelectorAll('button');
    const $tabPages = document.getElementById('pages').querySelectorAll('.page');

    $navLinks.forEach(($link) => $link.classList.remove('active'));

    $el.classList.add('active');

    $tabPages.forEach(($page) => {
        ($page.id === target.slice(1))
            ? $page.classList.add('active')
            : $page.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPAP24();
    fetchRSS();
    initializeNavigation();
});
