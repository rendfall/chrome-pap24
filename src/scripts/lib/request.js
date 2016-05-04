import $ from 'jquery';

class Request {
    constructor(url) {
        return $.ajax({
           url: url,
           method: 'GET',
           dataType: 'html'
       });
    }
}

export default Request;
