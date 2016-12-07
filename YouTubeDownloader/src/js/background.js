// receive from content
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "download") {
            var filename = request.video.title + "." + request.video.ext;
            var options = {
                url: request.video.url,
                filename: filename,
                saveAs: true,
                method: "GET"
            };

            chrome.downloads.download(options, function (downloadId) {});
        }
    }
);
