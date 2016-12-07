var http = {

    xhrSync : function (url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {

            console.log(request.responseText);

            if (request.status >= 200 && request.status < 400) {
                // Success!
                var resp = request.responseText;

                console.log(resp);

            } else {
                // We reached our target server, but it returned an error
                console.log("error",request);
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
        };

        request.send();        // var request = new XMLHttpRequest();
        request.open('GET', url, false);
    },
    getSync: function (url) {
        var result = "";
        $.ajax({
            type: "GET",
            async: !1,
            url: url,
            success: function (response, status) {
                result = response;
            }, error: function (a, b, c) {
                console.error("http.getSync : ", a, b, c);
            }
        });

        return result;
    },
    xhrHeadSync: function (url) {

        var response = null;
        var xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, false); // Notice "HEAD" instead of "GET", to get only the header
        xhr.onreadystatechange = function() {
            if (this.readyState == this.DONE) {
                response = xhr;
            }
        };
        xhr.send();

        return response;
    },
    xhrGetContentLength: function (xhr) {
        
        if(xhr.status == 200) {
            
            return parseInt(xhr.getResponseHeader("Content-Length"));
        }

        return 0;
    },
    XMLHttpFactories: [
        function () {
            return new XMLHttpRequest()
        },
        function () {
            return new ActiveXObject("Msxml2.XMLHTTP")
        },
        function () {
            return new ActiveXObject("Msxml3.XMLHTTP")
        },
        function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }
    ],

    createXMLHTTPObject: function () {
        var xmlhttp = false;
        for (var i = 0; i < http.XMLHttpFactories.length; i++) {
            try {
                xmlhttp = http.XMLHttpFactories[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    },

    xhr: function (url, callback) {

        var ajax = http.createXMLHTTPObject();
        ajax.open('GET', url, true); // Async
        ajax.onload = function () {
            callback(JSON.parse(this.responseText));
        };

        ajax.onerror = function () {
            callback(null);
        };

        ajax.send(null);
    }

};