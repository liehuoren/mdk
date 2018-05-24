var Upload = {
    accessid: '',
    callback: '',
    dir: '',
    expire: '',
    host: '',
    policy: '',
    signature: '',
}

function set_upload_param(up, filename, ret) {
    var new_multipart_params = {
        'key': Upload.dir,
        'policy': Upload.policy,
        'OSSAccessKeyId': Upload.accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'signature': Upload.signature,
        'callback': Upload.callback,
        'expire': Upload.expire,
    };

    up.setOption({
        'url': Upload.host,
        'multipart_params': new_multipart_params
    });

    up.refresh();
    up.start();
}

var uploader = new plupload.Uploader({
    runtimes: 'html5,flash,silverlight,html4',
    browse_button: 'selectfiles',
    //multi_selection: false,
    container: document.getElementById('container'),
    // flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
    // silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
    url: 'http://oss.aliyuncs.com',

    init: {
        PostInit: function () {
            document.getElementById('ossfile').innerHTML = '';
            document.getElementById('postfiles').onclick = function () {
                set_upload_param(uploader, '', false);
                return false;
            };
        },

        FilesAdded: function (up, files) {
            plupload.each(files, function (file) {
                document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
                    + '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                    + '</div>';
            });
        },

        BeforeUpload: function (up, file) {
            set_upload_param(up, file.name, true);
        },

        UploadProgress: function (up, file) {
            var d = document.getElementById(file.id);
            d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            var prog = d.getElementsByTagName('div')[0];
            var progBar = prog.getElementsByTagName('div')[0]
            progBar.style.width = 2 * file.percent + 'px';
            progBar.setAttribute('aria-valuenow', file.percent);
        },

        FileUploaded: function (up, file, info) {
            if (info.status == 200) {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success';


//                                layer.alert(data.task);

                //Fp8fMt5lf7uEe5WCJ9Q7od2PNE29Gn6X
            }
            else {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            }
        },

        Error: function (up, err) {
            document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
        }
    }
});

uploader.init();
