import $ from 'jquery';

class Request {
    constructor(url) {
        return $.ajax({
           url: 'http://www.pap.pl',
           method: 'GET',
           dataType: 'html'
       });
    }
}

export default Request;
