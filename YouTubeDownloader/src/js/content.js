function YouTubeDownloader() {

    var me = this;

    this.init = function () {

        var found = true;

        var t = setInterval(function () {

            if ($("#watch8-secondary-actions") != null) {

                var downloadBtn = '#download-btn';

                if(document.querySelector(downloadBtn) == null) {
                    found = true;
                }

                if (found && document.querySelector(downloadBtn) == null) {

                    var dropdown = me.loadVideo();

                    $('#watch8-secondary-actions').append(dropdown);

                    $(downloadBtn).change(function () {

                        var video = $(this).val().split("||");

                        if(video[0] != "Download") {

                            var title = video[0];
                            var url = video[1];
                            var ext = video[2];

                            // send to background
                            chrome.runtime.sendMessage(chrome.runtime.id, {
                                action: "download",
                                video: {
                                    title: title,
                                    url: url,
                                    ext: ext
                                }
                            }, function (response) {
                                if (!!response) {

                                    console.log("Response : ", response);

                                }
                            });
                        }
                    });

                    function DropDown(el) {
                        this.ddbtn = el;
                        this.initEvents();
                    }

                    DropDown.prototype = {
                        initEvents: function () {
                            var obj = this;
                            obj.ddbtn.on('click', function (event) {
                                $(this).toggleClass('active');
                                event.stopPropagation();
                            });
                        }
                    };

                    $(function () {

                        new DropDown($(downloadBtn));

                        $(document).click(function () {
                            // all dropdowns
                            $('.wrapper-dropdown').removeClass('active');
                        });

                    });

                    found = false;

                }

            }

        }, 1000);

    };

    this.setDownloadUI = function (dropdown) {

        return '' +
            '<select id="download-btn" class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup yt-uix-videoactionmenu-button">' +
            '<option>Download</option>' +
            dropdown +
            '</select>';

        // return '<div id="download-btn" class="wrapper-dropdown yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay action-panel-trigger" tabindex="1">' +
        //     '<div style="margin-top: -5px;">Download</div>' +
        //     '<div class="dropdown-content">' +
        //     dropdown +
        //     '</div>' +
        //     '</div>';

    };

    this.setDropdownUI = function (video, i) {

        if (!!video.videoSize) {

            var quality = video.extension.toUpperCase() + " " + video.dimission + " (" + video.videoSize + ")";

            // return '<a>' +
            //     '<sapn class="quality" title="' + video.videoTitle + '" url="' + video.videoUrl + '" ext="' + video.extension + '">' + quality + '</sapn>' +
            //     '</a>';

            return '<option value="' + video.videoTitle + '||' + video.videoUrl + '||' + video.extension + '">' + quality + '</option>';
        }

        return "<li><sapn>Not found</sapn></li>";
    };

    this.loadVideo = function () {

        var dropdown = '';

        var youTubeUrl = window.location.href;

        if (youTubeUrl.indexOf("youtube.com") != -1) {

            var video = youtube.getYouTubeVideoFromUrls(youTubeUrl);
            Array.prototype.forEach.call(video, function (v, i) {

                dropdown += me.setDropdownUI(v, i);
            });

        }

        return me.setDownloadUI(dropdown);
    };

    me.init();

}

$(function () {

    new YouTubeDownloader();

});