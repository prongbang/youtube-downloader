var youtube = {

    getVideoIdFromURL: function (url) {
        var videoId = "";
        url = url.substring(url.indexOf("?") + 1);
        var delimiters = "&";
        var props = url.split(delimiters);
        Array.prototype.forEach.call(props, function (p, i) {
            if (p.indexOf("v=") != -1) {
                videoId = p.substring(p.indexOf("v=") + 2);
            }
        });
        return videoId;
    },
    getYouTubeVideoFromUrls: function (videoUrl) {

        var link = "//www.youtube.com/get_video_info?&video_id=%s&el=detailpage&ps=default&eurl=&gl=US&hl=en";

        var lists = [];

        var id = youtube.getVideoIdFromURL(videoUrl);
        var url = link.replace("%s", id);
        var inText = youtube.clientDownloadString(url);
        var intent = youtube.parseQueryString(inText);
        var title = youtube.formatTitle(intent.title);
        var videoDuration = intent.length_seconds;
        var video = intent.url_encoded_fmt_stream_map.split(",");

        Array.prototype.forEach.call(video, function (item, i) {

            var signature = null;
            var data = youtube.parseQueryString(item);
            var server = data.fallback_host;
            if (!!data.sig) {
                signature = data.sig;
            } else if (!!data.signature) {
                signature = data.signature;
            }

            var urlVideo = decodeURIComponent(data.url + "&fallback_host=" + server);
            if (!!signature) {
                urlVideo += "&signature=" + signature;
            }

            var videoItem = {};
            var tag = new TagFile(data.itag);
            videoItem.videoTitle = title;
            videoItem.videoUrl = decodeURIComponent(urlVideo);
            videoItem.videoSize = youtube.getSizeVideo(decodeURIComponent(urlVideo));
            videoItem.videoTime = youtube.convertTimeUnit(parseInt(videoDuration));
            videoItem.extension = tag.videoExtension;
            videoItem.dimission = tag.videoDimension;
            lists.push(videoItem);

        });

        return lists;
    },
    clientDownloadString: function (url) {

        return http.getSync(url);
    },
    parseQueryString: function (inText) {

        var queryPairs = [];
        var pairs = inText.split("&");

        Array.prototype.forEach.call(pairs, function (pair, i) {
            var idx = pair.indexOf("=");
            queryPairs[decodeURIComponent(pair.substring(0, idx))] = decodeURIComponent(pair.substring(idx + 1));
        });

        return queryPairs;
    },
    formatTitle: function (title) {

    	if(!!title) {

        	return title.replaceAll("&#39;", "'").replaceAll("&quot;", "' ").replaceAll("&lt;", " (").replaceAll("&gt;", " )").replaceAll("+", "").replaceAll("\"", "").replaceAll("|", " ").replaceAll("/", "-");
    	}

    	return "no-title";
    },
    getSizeVideo: function (url) {
        var length = 0;
        var xhr = http.xhrHeadSync(url);
        if (!!xhr) {
            length = http.xhrGetContentLength(xhr);
        }
        return youtube.humanFileSize(length);
    },
    convertTimeUnit: function (second) {
        var time = "";
        var seconds = second % 60;
        var minutes = ((second / 60) % 60);
        var hours = ((second / (60 * 60)) % 24);
        if (hours > 0) {
            time = hours + ":" + minutes + ":" + ((seconds < 10) ? "0" + seconds : seconds);
        } else {
            time = minutes + ":" + ((seconds < 10) ? "0" + seconds : seconds);
        }
        return time;
    },
    humanFileSize: function (size) {

    	if(size > 0) {

        	var i = Math.floor(Math.log(size) / Math.log(1024));
        	return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    	}

    	return "0MB";
    }

};

function TagFile(tag) {

    var extentionsTag = "5=flv,6=flv,17=3gp,18=mp4,22=mp4,34=flv,35=flv,36=3gp,37=mp4,38=mp4,43=webm,44=webm,45=webm,46=webm,82=3D.mp4,83=3D.mp4,84=3D.mp4,85=3D.mp4,100=3D.webm,101=3D.webm,102=3D.webm,120=live.flv";
    var wideDimensionsTag = "5=320x180,6=480x270,17=176x99,18=640x360,22=1280x720,34=640x360,35=854x480,36=320x180,37=1920x1080,38=2048x1152,43=640x360,44=854x480,45=1280x720,46=1920x1080,82=480x270,83=640x360,84=1280x720,85=1920x1080,100=640x360,101=640x360,102=1280x720,120=1280x720";
    var dimensionsTag = "5=320x240,6=480x360,17=176x144,18=640x480,22=1280x960,34=640x480,35=854x640,36=320x240,37=1920x1440,38=2048x1536,43=640x480,44=854x640,45=1280x960,46=1920x1440,82=480x360,83=640x480,84=1280x960,85=1920x1440,100=640x480,101=640x480,102=1280x960,120=1280x960";

    this.videoExtension = null;
    this.videoDimension = null;

    var me = this;

    function init(tag) {
        tag = tag.trim() + "=";
        var start = extentionsTag.substring(extentionsTag.indexOf(tag));
        var ext = start.substring(tag.length, start.indexOf(","));
        me.videoExtension = ext;
        start = wideDimensionsTag.substring(wideDimensionsTag.indexOf(tag));
        var size = start.substring(tag.length, start.indexOf(","));
        me.videoDimension = size;
    }

    init(tag);

}