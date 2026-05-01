var apiUrl = Common.server.API_URL

var request = {
    pageNumber: 1,
    lastPageNumber: 1,
    withTags: 1,
}


var detailRequest = {
    pageNumber: 1,
    lastPageNumber: 1,
}

const fileCode = null;
//document.getElementById("code").value = "pixiv"
Fancybox.bind("[data-fancybox]", {
    // Custom options for all galleries
});

var danger_ok_btn = document.getElementById("danger_ok");
var pageSizeInputList = Array.from(document.getElementsByClassName("page-size-input"));
var keywordInput = document.getElementById("keyword");
var totalInfo = "totalInfo";
var windowInfo = "windowInfo";
var screenInfo = "screenInfo"
var page_select_list = Array.from(document.getElementsByClassName("page-select"));

var pagePrevBtnList = Array.from(document.getElementsByClassName("page-prev-btn"));
var pageNextBtnList = Array.from(document.getElementsByClassName("page-next-btn"));

var select_order_field = document.getElementById('select-order-field');
var orderDirection = document.getElementById('orderDirection');

var contextHtml = document.getElementById('main-context');

// //https://github.com/mattboldt/typed.js
// var totalInfoTyped = new Typed('#totalInfo', {
//     strings: ['0'],
//     typeSpeed: 10,
//     backSpeed: 10,
//     backDelay: 500,
//     startDelay: 10,
//     loop: false,
//     showCursor: false,
// });
// var windowInfoTyped = new Typed('#windowInfo', {
//     strings: [`${window.innerWidth}*${window.innerHeight}`],
//     typeSpeed: 10,
//     backSpeed: 10,
//     backDelay: 500,
//     startDelay: 10,
//     loop: false,
//     showCursor: false,
// });
// var screenInfoTyped = new Typed('#screenInfo', {
//     strings: [`${screen.width}*${screen.height}`],
//     typeSpeed: 10,
//     backSpeed: 10,
//     backDelay: 500,
//     startDelay: 10,
//     loop: false,
//     showCursor: false,
// });
window.addEventListener('resize', function (event) {
    // 在这里编写你的代码来处理窗口大小变化
    requestAnimationFrame(() => {
        if (document.getElementById("pageTitle")) {
            document.getElementById("pageTitle").innerHTML = `${Common.checkBreakpoint()}`;
        }
        if (document.getElementById(windowInfo)) {
            document.getElementById(windowInfo).innerHTML = `${window.innerWidth}*${window.innerHeight}`
        }
        if (document.getElementById(screenInfo)) {
            document.getElementById(screenInfo).innerHTML = `${screen.width}*${screen.height}`
        }
    })
});

function loadData(request) {
    load_data(request)
}

function load_data(request) {
    console.log('load_data request -> ', request)
    const start = new Date().getTime();


    new Promise((resolve, reject) => {
        var temp = Common.showLoading('main-context')
        resolve(temp)
    })
        .then(function (temp) {

            var requestForm = Common.getFormData('requestForm')
            if ("random" == requestForm.optionField && "1" == requestForm.optionValue) {
                var totalInfo = document.getElementById("totalInfo").innerText;
                var pageSize = document.getElementsByClassName("page-size-input")[0].value;
                var min = 1;
                var max = Math.ceil(Number(totalInfo) / Number(pageSize));
                var index = Math.floor(Math.random() * (max - min + 1)) + min
                console.log('random page index -> ' + index)
                request.pageNumber = index
            }
            return axios
                .post(apiUrl + request.entityUrl.page, {
                    ...requestForm,
                    ...request,
                })
        })
        .then(response => {
            var resp = response.data;
            document.getElementById(totalInfo).innerHTML = `${resp.total}`

            pageSizeInputList.forEach(item => {
                item.value = resp.pageSize
            })
            page_select_build(resp)
            page_index_build(resp, "page-index-top");
            page_index_build(resp, "page-index-bottom");
            contextHtml.innerHTML = ""
            var data = resp.data;
            for (var item of data) {
                item.apiUrl = apiUrl
                item.prevUrl = resp.prevUrl
                item.url = apiUrl + item.prevUrl + item.relativePath;
                item.preview = item.type?.startsWith("video") ? apiUrl + item.prevUrl + item.relativePath + '.jpg' : apiUrl + item.prevUrl + item.relativePath;
                item.bookFisrt = apiUrl + ('/api/rest/v1/book/detail/first/' + item.id)
                var video = item.type?.startsWith('video')
                item.video = video
                item.href = video ? 'javascript:void(0)' : item.url
                item.dataUrl = video ? item.url : ''
                item.modal = video ? 'data-bs-toggle="modal" data-bs-target="#video-play"' : ''
                //console.log('item -> ', item)
                //var template = Common.createTemplate(Common.templateId(item.htmlTemplate))

                var divHtml = render(Common.templateId(item.htmlTemplate), item )
                //console.log('divHtml -> ', divHtml)
                const div = document.createElement('div');
                div.innerHTML = divHtml;
                //console.log('div -> ', div)
                //console.log('div.firstChild -> ', div.firstChild)
                Common.htmlElement('main-context').appendChild(div.firstChild)
            }

            // resp.data.forEach(item => {
            //     console.log('item -> ', item.url)
            //     var isPreRender = item.type?.startsWith("image") || item.type?.startsWith("video")
            //     console.log('isPreRender -> ', isPreRender)
            //     var divHtml = isPreRender ? galleryTemplate(item) : cardTemplate(item)
            //     console.log('divHtml-> ', divHtml)
            //     const div = document.createElement('div');
            //     div.innerHTML = divHtml;
            //     Common.htmlElement('main-context').appendChild(div.firstChild)
            //     requestAnimationFrame(() => {
            //         // var url = resp.prevUrl + item.relativePath;
            //         // var divHtml = item.type?.startsWith("text") || item.type?.startsWith("application") ? buildCard(item, url) : buildGallery(item, url);
            //         // const div = document.createElement('div');
            //         // div.innerHTML = divHtml;
            //         // contextHtml.appendChild(div.firstChild)

            //     });
            // })
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => {
            console.log('load_data cost = ' + (new Date().getTime() - start))
        })

    return;
    document.getElementById("top")?.click()

}

function action(targetId, actionEvent, currentTarget, evt) {
    console.log('action -> ', targetId, actionEvent, currentTarget)
    var id = targetId
    var el = currentTarget
    if ('click' === actionEvent) {
        var el = currentTarget;

        // Record click (for both image and video)
        axios.post(apiUrl + request.entityUrl.click + id)
            .then(response => {
                response = response.data
                if (response.code == 200) {
                    currentTarget.parentElement.querySelector('.click-count').innerHTML = `
                                            <!-- Download SVG icon from http://tabler-icons.io/i/eye -->
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                                            `+ response.data.clickCount
                }
            })
            .catch(error => {
                console.log(error)
            });

        var video = el.getAttribute('href') === 'javascript:void(0)';
        if (video) { initVideoPlayer(el, id); }
    }
    if ("move" === actionEvent) {
        return
    }
    if ("delete" === actionEvent) {
        var parentElement = el.parentElement.parentElement.parentElement.parentElement;
        if (id && parentElement) {
            parentElement.innerHTML = `
                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                        <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                                    </div>
                                    `
            axios
                .delete(apiUrl + request.entityUrl.delete + id)
                .then(response => {
                    console.log(response)
                    if (response.data.code == 200) {
                        parentElement.innerHTML = `
                                                <div class="col-xs-12 col-sm-12 col-md-12">
                                                    <div class="alert alert-success" style="margin:0" role="alert">
                                                        <div class="d-flex">
                                                            <div>
                                                                <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                                                                 `+ response.data.msg + `
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                `
                    } else {
                        document.getElementById("modal-danger-context").textContent = response.data.msg
                        document.getElementById("danger-btn").click();
                    }
                })
                .catch(error => {
                    console.log(error)
                    document.getElementById("modal-danger-context").textContent = error.message
                    document.getElementById("danger-btn").click();
                })
                .finally(() => {
                    console.log('deleted')
                    danger_ok_btn.setAttribute("target-id", "")
                })
        }
        return
    }
    if ("delete-pixiv" === actionEvent) {
        var parentElement = el.parentElement.parentElement.parentElement.parentElement;
        parentElement.innerHTML = `
                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                        <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                                    </div>

                                    `
        axios
            .delete(apiUrl + "/api/rest/v1/file/pixiv/delete/all/" + targetId)
            .then(response => {
                console.log(response)
                if (response.data.code == 200) {
                    parentElement.innerHTML = `
                                            <div class="col-xs-12 col-sm-12 col-md-12">
                                                <div class="alert alert-success" style="margin:0" role="alert">
                                                  <div class="d-flex">
                                                    <div>
                                                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                                                         `+ response.data.message + `
                                                      </div>
                                                  </div>
                                                </div>
                                            </div>

                                                `
                } else {
                    document.getElementById("modal-danger-context").textContent = response.data.message
                    document.getElementById("danger-btn").click();
                }
            })
            .catch(error => {
                document.getElementById("modal-danger-context").textContent = error.message
                document.getElementById("danger-btn").click();
            })
            .finally(() => {
                danger_ok_btn.setAttribute("target-id", "")
            })
        return
    }
    if ("restore-pixiv" === actionEvent) {
        var parentElement = el.parentElement.parentElement.parentElement.parentElement;
        parentElement.innerHTML = `
                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                        <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                                    </div>
                                    `
        axios
            .post(apiUrl + "/api/rest/v1/file/pixiv/restore/all/" + targetId)
            .then(response => {
                console.log(response)
                if (response.data.code == 200) {
                    parentElement.innerHTML = `
                                            <div class="col-xs-12 col-sm-12 col-md-12">
                                                <div class="alert alert-success" style="margin:0" role="alert">
                                                  <div class="d-flex">
                                                    <div>
                                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                                                         `+ response.data.message + `
                                                      </div>
                                                  </div>
                                                </div>
                                            </div>
                                                `
                } else {
                    document.getElementById("modal-danger-context").textContent = response.data.message
                    document.getElementById("danger-btn").click();
                }
            })
            .catch(error => {
                document.getElementById("modal-danger-context").textContent = error.message
                document.getElementById("danger-btn").click();
            })
            .finally(() => {
                danger_ok_btn.setAttribute("target-id", "")
            })
        return
    }
    if ("detail" === actionEvent) {
        return
    }
    if ("edit" === actionEvent) {
        return
    }
    if ("copy" === actionEvent) {

    }
    if ("download" === actionEvent) {
        return
    }
    if ("preview" === actionEvent) {
        var id = targetId;
        var el = currentTarget;
        var url = el.dataset.url || el.getAttribute('href');

        var videoModal = document.getElementById('video-play');
        // 使用原生方式显示模态框
        videoModal.style.display = 'block';
        videoModal.classList.add('show');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // 添加背景遮罩
        var backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'video-modal-backdrop';
        document.body.appendChild(backdrop);
        
        // 点击背景关闭模态框
        backdrop.addEventListener('click', function() {
            videoModal.style.display = 'none';
            videoModal.classList.remove('show');
            videoModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            document.body.removeChild(backdrop);
            if (window._videoPlayer) {
                window._videoPlayer.dispose();
                window._videoPlayer = null;
            }
        });
        
        // ESC键关闭模态框
        var escHandler = function(e) {
            if (e.key === 'Escape') {
                videoModal.style.display = 'none';
                videoModal.classList.remove('show');
                videoModal.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('modal-open');
                document.body.removeChild(backdrop);
                if (window._videoPlayer) {
                    window._videoPlayer.dispose();
                    window._videoPlayer = null;
                }
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        if (window._videoPlayer) {
            window._videoPlayer.dispose();
            window._videoPlayer = null;
        }

        // 模拟shown.bs.modal事件
        setTimeout(function() {
            window._videoPlayer = videojs('videojs-player', {
                controls: true,
                autoplay: true,
                preload: 'auto',
                fluid: true,
                playbackRates: [0.5, 1, 1.5, 2],
            });
            window._videoPlayer.src({ src: url, type: 'video/mp4' });
            window._videoPlayer.play();
        });

        videoModal.addEventListener('hidden.bs.modal', function() {
            if (window._videoPlayer) {
                window._videoPlayer.dispose();
                window._videoPlayer = null;
            }
        });

        // Record click
        axios.post(apiUrl + request.entityUrl.click + id).catch(function(err) { console.log(err); });
        return
    }
    if ("heart" === actionEvent) {
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        
        // 切换爱心状态：发送 POST 请求到后端
        axios
            .post(apiUrl + request.entityUrl.heart + id)
            .then(response => {
                response = response.data
                if (response.code == 200) {
                    // 根据后端返回的状态更新爱心样式
                    // 如果后端返回已经被点赞(isDeleted == '0')，则显示红色实心
                    // 如果后端返回取消点赞(isDeleted == '1')，则不显示红色
                    const isHearted = response.data.t1.isDeleted == '0';
                    const heartCount = response.data.t2;
                    
                    currentTarget.innerHTML = `
                                <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon ${isHearted ? 'icon-filled text-red' : ''}" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
                                ${heartCount}
                            `;
                }
            })
            .catch(error => {
                console.log(error)
            });
        return
    }
    if ("convert2vtf" === actionEvent) {
        var card = currentTarget.closest('.card');
        var previewImg = card ? card.querySelector('img') : null;
        if (previewImg && previewImg.src) {
            // 获取原始文件名
            // 获取原始文件名
            var realName = '';
            var titleEl = card ? card.querySelector('.card-title') : null;
            if (titleEl) realName = titleEl.textContent.trim();
            else {
                // 修复：Gallery 模板中使用的是 disabled 属性的 input
                var nameInput = card ? card.querySelector('input[disabled], input[readonly]') : null;
                if (nameInput) realName = nameInput.value.trim().replace(/"/g, '');
            }

            var rawSrc = previewImg.src;
            
            // 如果没取到名称，尝试从 URL 截取
            if (!realName) {
                try {
                    var pathParts = rawSrc.split('?')[0].split('/');
                    var fname = pathParts[pathParts.length - 1];
                    fname = fname.split('#')[0]; // 移除片段 ID
                    if (fname && fname.length > 0) {
                        realName = fname;
                    }
                } catch(e) {}
            }

            var rawSrc = previewImg.src;

            // 如果 DOM 里没取到，尝试从 URL 提取文件名
            if (!realName) {
                try {
                    var pathParts = rawSrc.split('?')[0].split('/');
                    var fname = pathParts[pathParts.length - 1];
                    if (fname && fname.indexOf('.') !== -1) {
                        realName = fname;
                    }
                } catch(e) {}
            }
            
            // 解决跨域问题：优先使用相对路径，避免跨域
            var u = new URL(rawSrc);
            // 如果图片与当前页面同源，使用相对路径是最佳实践，避免 Tainted Canvas
            if (u.hostname === window.location.hostname || u.hostname === '127.0.0.1' || u.hostname === 'localhost') {
                vtfCurrentImageSrc = u.pathname + u.search;
            } else {
                vtfCurrentImageSrc = rawSrc;
            }

            vtfCurrentFileName = realName || ('file_' + id);

            // 打开 VTF 转换模态框
            showVtfConverterModal(vtfCurrentImageSrc, vtfCurrentFileName);
        }
        return
    }
    if ("add-tag" === actionEvent) {
        var id = targetId;
        var tagForm = document.getElementById('tag-form');
        if (tagForm) {
            tagForm.querySelector('input[name="id"]').value = id;
            tagForm.querySelector('input[name="tag"]').value = '';
        }
        // 璇锋眰鍏ㄩ儴 tag 骞舵覆鏌撳埌寮圭獥
        axios.get(apiUrl + '/api/rest/v1/file/tag/all')
            .then(resp => {
                if (resp.data.code === 200) {
                    var tags = resp.data.data || [];
                    var tagsList = document.querySelector('#tag-info .tags-list');
                    if (tagsList) {
                        tagsList.innerHTML = tags.map(function(t) {
                            return '<span class="tag">' + t.name + '<a href="#" class="btn-close" onclick="return false;"></a></span>';
                        }).join('');
                    }
                }
            })
            .catch(function(err) { console.log(err); });
        return
    }
    if ("restore" === actionEvent) {

        var parentElement = el.parentElement.parentElement.parentElement.parentElement;
        if (id) {
            parentElement.innerHTML = `
                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                        <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                                    </div>

                                    `
            axios
                .post(apiUrl + request.entityUrl.restore + id)
                .then(response => {
                    console.log(response)
                    if (response.data.code == 200) {
                        parentElement.innerHTML = `
                                            <div class="col-xs-12 col-sm-12 col-md-12">
                                                <div class="alert alert-success" style="margin:0" role="alert">
                                                  <div class="d-flex">
                                                    <div>
                                                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                                                         `+ response.data.msg + `
                                                      </div>
                                                  </div>
                                                </div>
                                            </div>

                                                `
                    } else {
                        document.getElementById("modal-danger-context").textContent = response.data.msg
                        document.getElementById("danger-btn").click();
                    }
                })
                .catch(error => {
                    console.log(error)
                    document.getElementById("modal-danger-context").textContent = error.message
                    document.getElementById("danger-btn").click();
                })
                .finally(() => {
                    console.log('deleted')
                    danger_ok_btn.setAttribute("target-id", "")
                })
        }

        return
    }
    if ("share" === actionEvent) {
        return
    }
    if ("info" === actionEvent) {

    }

    if ("book-detail-click" === actionEvent) {
        const start = new Date().getTime();
        var contextElementId = "detail-context"
        var detailContext = document.getElementById(contextElementId);
        if (!targetId) return
        detailRequest.id = targetId
        detailRequest.pageNumber = currentTarget ? 1 : detailRequest.pageNumber

        new Promise((resolve, reject) => {
            var temp = showLoading(contextElementId)
            resolve(temp)
        })
            .then(function (temp) {
                return axios.post(apiUrl + "/api/rest/v1/book/detail/page/" + targetId, {
                    ...detailRequest,
                    //pageSize: Array.from(document.getElementsByClassName("detail-page-size-input"))[0].value,
                })
            })
            .then(response => {
                document.getElementById('entity-title').innerHTML = '';
                var resp = response.data;
                console.log(resp)
                detailContext.innerHTML = ""
                resp.data.forEach(item => {
                    requestAnimationFrame(() => {
                        var url = apiUrl + "/static-file/" + item.relativePath;
                        item.url = url
                        var template = Common.createTemplate(Common.templateId('bookPage'))
                        var divHtml = template(item)
                        const div = document.createElement('div');
                        div.innerHTML = divHtml;
                        detailContext.appendChild(div.firstChild)
                    });
                })

                //resolve(resp)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                console.log('load_data cost = ' + (new Date().getTime() - start))
            })
        return
    }

    return
    if ('find-similar' == actionEvent) {
        var temp = showLoading('list-context')
        axios
            .post(apiUrl + "/api/rest/v1/file/find-similar/" + targetId)
            .then(response => response.data)
            .then(response => {
                if (response.code == 200) {
                    return response.data;
                } else {
                    return Common.alertDanger(response.message)
                }
            })
            .then(data => {
                console.log('finally data -> ', data)
                Common.htmlElement('list-context').innerHTML = ''
                const compiledTemplate = Common.createTemplate(Common.templateId('entity'));
                console.log(compiledTemplate);
                data.forEach(item => {
                    var url = item.prevUrl + item.relativePath;
                    item.apiUrl = apiUrl;
                    item.url = url;
                    var divHtml = compiledTemplate(item)
                    const div = document.createElement('div');
                    div.innerHTML = divHtml;
                    Common.htmlElement('list-context').appendChild(div.firstChild)
                });

            })
            .catch(error => {
                console.log(error)
                tablerCommon.alertDanger(error.response.data.message)
            })
            .finally(() => {

            })
    }
    if ('convert2m3u8' == actionEvent) {
        axios
            .post(apiUrl + "/api/rest/v1/file/convert2m3u8/" + targetId)
            .then(response => response.data)
            .then(response => {
                console.log(response)
                tablerCommon.alert(response.message)
            })
            .catch(error => {
                console.log(error)
                tablerCommon.alert(error.response.data.message)
            })
            .finally(() => {

            })
    }
    if ('play2m3u8' == actionEvent) {
        // 鍒ゆ柇娴忚鍣ㄦ槸鍚︽敮锟?HLS
        if (Hls.isSupported()) {
            var video = document.getElementById('video');
            var hls = new Hls();

            // 缁戝畾鍒拌棰戞挱鏀惧櫒
            hls.loadSource(`http://ip:8080/static-file/cache/m3u8/${targetId}/${targetId}.m3u8`);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                console.log('Manifest parsed, starting playback');
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // 濡傛灉娴忚鍣ㄥ師鐢熸敮锟?HLS (锟?Safari)
            video.src = `http://ip:8080/static-file/cache/m3u8/${targetId}/${targetId}.m3u8`;
        }
    }
}



function upload_build() {
    var upload_btn = document.getElementById('upload-btn')
    upload_btn?.addEventListener('click', (evt) => {
        var input = document.createElement('input')
        input.type = 'file';
        input.setAttribute('multiple', '');
        input.addEventListener('click', (evt1) => {
            console.log('inpput click ......')
            console.log(input.files.length)
        })
        input.addEventListener('change', (evt1) => {
            console.log('inpput change ......')
            var files = input.files;
            console.log(files.length)
            var parent = upload_btn.parentElement;
            console.log(parent)
            var upload_btn_html = parent.innerHTML;
            var uploadedCount = 0
            var uploadedCountPercent = uploadedCount / files.length * 100

            reloadParentHtml(parent, uploadedCount, files.length, uploadedCountPercent, upload_btn_html)

            const processItem = async (item) => {
                console.log(item);
                // 鍦ㄨ繖閲屽鐞嗘瘡涓枃锟?
                const form = new FormData();
                form.append('file', item);
                var requestForm = Common.getFormData('requestForm')
                form.append('json', JSON.stringify(requestForm));
                await axios.post(apiUrl + request.entityUrl.upload, form)
                    .then(response => {
                        console.log('File uploaded successfully:', response.data);
                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);
                    })
                    .finally(() => {
                        uploadedCount += 1
                        reloadParentHtml(parent, uploadedCount, files.length, (uploadedCount / files.length * 100), upload_btn_html)
                    })

            };
            const processItemsInOrder = async () => {
                for (const item of files) {
                    await processItem(item);
                }
                console.log('鎵€鏈夐」鎸夐『搴忓鐞嗗畬?');
            };
            processItemsInOrder();
            function reloadParentHtml(parent, uploadedCount, total, uploadedCountPercent, upload_btn_html) {
                //console.log('reloadParentHtml -> ', uploadedCount)
                if (uploadedCount != total) {
                    parent.innerHTML = `
                    <div class="progress mb-2" id="">
                        <div class="progress-bar" style="width: ${uploadedCountPercent}%" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="${total}" aria-label="${uploadedCountPercent}% Complete">
                            <span class="visually-hidden">${uploadedCountPercent}% Complete</span>
                        </div>
                    </div>
                `
                } else {
                    parent.innerHTML = ``
                    parent.appendChild(upload_btn)
                }

            }
        })
        input.click();
    })

}

function buildGallery(item, url) {
    return `<div class="col-md-4 col-sm-12" id="">
                        <div class="card">
                            <div class="card-body"  >
                              <div class="row row-cards"   >
                                <div class="col-9">
                                  <div class="mb-3">
                                    <input type="text" class="form-control-plaintext" name="example-disabled-input"  value="${(item.code ? item.code : '')} ${item.realName}" disabled>
                                  </div>
                                </div>
                                <div class="col">
                                  <div class="mb-3">
                                    <input type="text" class="form-control-plaintext" name="example-disabled-input"  value="${(item.width && item.height) ? (item.width) + ` * ` + (item.height) : ``}" disabled>
                                  </div>
                                </div>
                              </div>
                            </div>
            <a ${(item.type?.startsWith("video") ? 'data-fancybox="' + item.id + '"' : 'data-fancybox="gallery"')}  href ="${apiUrl + url}" class="d-block card-img-top entity video-js " id="${item.id}" target-id="${item.id}" data-fslightbox="gallery" >
                <img id="preview-img-${item.id}" src="${apiUrl + (item.type?.startsWith("video") ? url + '.jpg' : url)}" class="card-img-top"   >
            </a>
                            <div class="card-body container base-info-div"  >
                              <div class="row row-cards"   >
                                 <div class="col">
                                   <div class="mb-3">
                                        ${item.heartCount > 0 ? `` : `<a target-id="${item.id}" class="btn btn-link delete-btn">delete</a>`}
                                  </div>
                                </div>
                                <div class="col-6">
                                  <div class="mb-3">
                                    <input type="text" class="form-control-plaintext" name="example-disabled-input" placeholder="Readonly..." value="${item.createTime}" readonly="" disabled>
                                  </div>
                                </div>
                                <div class="col">
                                  <div class="mb-3">
                                    <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      Action
                                    </button>
                                    <div class="dropdown-menu">
                                      <a class="dropdown-item edit-btn" action-event='edit' target-id="${item.id}"  data-bs-toggle="modal" data-bs-target="#modal-info-view">
                                        edit
                                      </a>
                                      <a class="dropdown-item move-btn" action-event='move' target-id="${item.id}">
                                        move
                                      </a>
                                      <a class="dropdown-item text-red delete-btn" target-id="${item.id}" >
                                        delete
                                      </a>
                                      <a class="dropdown-item restore-btn" target-id="${item.id}">
                                        restore
                                      </a>
                                        ${item.m3u8Path ? `

                                       <a class="dropdown-item " action-event='play2m3u8' target-id="${item.id}" data-bs-toggle="modal" data-bs-target="#video-play">
                                        play2m3u8
                                      </a>
                                      `: `
                                        <a class="dropdown-item " action-event='convert2m3u8' target-id="${item.id}"  >
                                        convert2m3u8
                                      </a>
                                      `}

                                      ${item.type.startsWith("video") ? `
                                      <a class="dropdown-item convert-format-btn" target-id="${item.id}">
                                        convert format
                                      </a>
                                      `: ``}
                                       ${item.type.startsWith("video") ? `
                                      <a class="dropdown-item copy-btn" target-id="${item.id}" data-bs-toggle="collapse" data-bs-target="#copy-info-view">
                                        copy
                                      </a>
                                      `: ``}
                                      ${item.type.startsWith("image") ? `
                                      <a class="dropdown-item " action-event='find-similar' target-id="${item.id}"  data-bs-toggle="modal" data-bs-target="#list-view">
                                        find similar
                                      </a>
                                      <a class="dropdown-item " action-event='convert2vtf' target-id="${item.id}">
                                        🔧 转换为 VTF
                                      </a>
                                      `: ``}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="container card-body extra-info-div"  >

                              <div class="row row-cards" style=" align-items: center;justify-content: space-between;">

                                    <div class="col">
                                        <div class="mb-3">
                                            <input type="text" class="form-control-plaintext" name="example-disabled-input" placeholder="Readonly..." value="${item.type}" readonly="" disabled>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="mb-3">
                                            <input type="text" class="form-control-plaintext" name="example-disabled-input" placeholder="Readonly..." value="${(item.size / 1024.0 / 1024.0).toFixed(1)}MB" readonly="" disabled>
                                        </div>
                                    </div>
                                    <div class="col" >
                                        <div class="mb-3">
                                            <a class="text-secondary click-count" disabled>
                                                <!-- Download SVG icon from http://tabler-icons.io/i/eye -->
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                                                ${item.clickCount}
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="mb-3">
                                            <a class="text-secondary heart-btn" target-id="${item.id}" action-event="heart">
                                            <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon ${((item.heartByCurrentUserCount == 1) ? 'icon-filled text-red' : '')}" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
                                            ${item.heartCount}
                                            </a>
                                        </div>
                                    </div>
                              </div>

                            </div>
                        </div>
                    </div>`
}

function buildCard(item, url) {
    return `<div class="col-md-4 col-sm-12" >
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">${item.realName}</h3>
                            <p class="text-secondary">${item.createTime}</p>
                        </div>
                        <div class="card-body base-info-div"  >
                            <div class="row row-cards"   >
                                <div class="col">
                                    <input type="text" class="form-control-plaintext" name="example-disabled-input" placeholder="Readonly..." value="${(item.size / 1024.0 / 1024.0).toFixed(1)}MB" readonly="" disabled>
                                </div>
                                <div class="col-6">
                                    <div class="mb-3">
                                        <input type="text" class="form-control" name="example-disabled-input" placeholder="Readonly..." value="${item.realName}" readonly="">
                                    </div>
                                </div>

                                <div class="col">
                                    <div class="mb-3">
                                        <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Action
                                        </button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item detail-btn" target-id="${item.id}" href="${apiUrl + url}" target="_blank">
                                                detail
                                            </a>
                                            <a class="dropdown-item edit-btn" target-id="${item.id}" data-bs-toggle="modal" data-bs-target="#modal-info-view">
                                                edit
                                            </a>
                                            <a class="dropdown-item text-red delete-btn" target-id="${item.id}" >
                                                delete
                                            </a>
                                            <a class="dropdown-item restore-btn" target-id="${item.id}">
                                                restore
                                            </a>
                                            <a class="dropdown-item move-btn" target-id="${item.id}">
                                                search similar
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
}

function delete_btn_build() {
    var delete_btn_list = document.getElementsByClassName("delete-btn");
    for (let el of delete_btn_list) {
        el.addEventListener('click', function (evt) {
            evt.stopPropagation();
            evt.stopImmediatePropagation()
            console.log(el.getAttribute("target-id"))
            danger_ok_btn.setAttribute("target-id", el.getAttribute("target-id"))

            var id = danger_ok_btn.getAttribute("target-id");
            console.log(id)
            var parentElement = el.parentElement.parentElement.parentElement.parentElement;
            if (id && parentElement) {
                parentElement.innerHTML = `
                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                        <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                                    </div>
                                    `
                axios
                    .delete(apiUrl + entityUrl.delete + id)
                    .then(response => {
                        console.log(response)
                        //alert(response.data.msg)
                        if (response.data.code == 200) {
                            //document.getElementById("modal-success-context").textContent = response.data.msg
                            //document.getElementById("success-btn").click();
                            parentElement.innerHTML = `
                                                <div class="col-xs-12 col-sm-12 col-md-12">
                                                    <div class="alert alert-success" style="margin:0" role="alert">
                                                        <div class="d-flex">
                                                            <div>
                                                                <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                                                                 `+ response.data.msg + `
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                `
                            //load_photo(request)
                        } else {
                            document.getElementById("modal-danger-context").textContent = response.data.msg
                            document.getElementById("danger-btn").click();
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        document.getElementById("modal-danger-context").textContent = error.message
                        document.getElementById("danger-btn").click();
                    })
                    .finally(() => {
                        console.log('deleted')
                        danger_ok_btn.setAttribute("target-id", "")
                    })
            }

        }, true)
    }
}

function edit_btn_build() {
    var btn_list = document.getElementsByClassName("edit-btn");
    for (let el of btn_list) {
        el.addEventListener('click', function (evt) {
            evt.stopPropagation();
            evt.stopImmediatePropagation()
            var id = el.getAttribute("target-id");
            console.log(id)
            var temp = showLoading('entity-form')
            axios
                .get(apiUrl + entityUrl.detail + id)
                .then(response => {
                    response = response.data
                    console.log(response)
                    if (response.code == 200) {
                        document.getElementById('entity-form').innerHTML = temp
                        formSetData('entity-form', response.data)
                    } else {
                        showLoading('entity-form', response.msg)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                })
        }, true)
    }
}

function copy_btn_build() {
    console.log('copy_btn_build ......')
    var btn_list = document.getElementsByClassName("copy-btn");
    for (let el of btn_list) {
        el.addEventListener('click', function (evt) {
            evt.stopPropagation();
            evt.stopImmediatePropagation()
            var id = el.getAttribute("target-id");
            console.log(id)
            var temp = showLoading('copy-form')
            axios
                .get(apiUrl + entityUrl.detail + id)
                .then(response => {
                    response = response.data
                    console.log(response)
                    if (response.code == 200) {
                        document.getElementById('copy-form').innerHTML = temp
                        formSetData('copy-form', response.data)
                    } else {
                        showLoading('copy-form', response.msg)
                    }
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                })
        }, true)
    }
}

function click_count() {
    var btn_list = document.getElementsByClassName("entity");
    for (let element of btn_list) {
        element.onclick = handler;
    }

    function handler(evt) {
        var currentTarget = evt.currentTarget;
        var id = currentTarget.getAttribute("target-id");
        axios
            .post(apiUrl + entityUrl.click + id)
            .then(response => {
                response = response.data
                if (response.code == 200) {
                    currentTarget.parentElement.querySelector('.click-count').innerHTML = `
                                <!-- Download SVG icon from http://tabler-icons.io/i/eye -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                                `+ response.data.clickCount
                } else {

                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {

            })
    }
}
function heart_btn_build() {
    var btn_list = document.getElementsByClassName("heart-btn");
    for (let element of btn_list) {
        element.onclick = handler;
    }

    function handler(evt) {
        var currentTarget = evt.currentTarget;
        var id = currentTarget.getAttribute("target-id");
        axios
            .post(apiUrl + entityUrl.heart + id)
            .then(response => {
                response = response.data
                if (response.code == 200) {
                    currentTarget.parentElement.querySelector('.heart-btn').innerHTML =
                        `
                                <!-- Download SVG icon from http://tabler-icons.io/i/heart -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon `+ ((response.data.t1.isDeleted == '0') ? 'icon-filled text-red' : '') + `" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
                                `+ response.data.t2 + ''
                } else {

                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {

            })
    }
}


function restore_btn_build() {
    var btn_list = document.getElementsByClassName("restore-btn");
    for (let el of btn_list) {
        el.addEventListener('click', function (evt) {
            evt.stopPropagation();
            evt.stopImmediatePropagation()
            console.log(el.getAttribute("target-id"))
            danger_ok_btn.setAttribute("target-id", el.getAttribute("target-id"))

            var id = danger_ok_btn.getAttribute("target-id");

            var parentElement = el.parentElement.parentElement.parentElement.parentElement;
            if (id) {
                parentElement.innerHTML = `
                                    <div class="col-xs-12 col-sm-12 col-md-12">
                                        <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                                    </div>

                                    `
                axios
                    .post(apiUrl + entityUrl.restore + id)
                    .then(response => {
                        console.log(response)
                        if (response.data.code == 200) {
                            parentElement.innerHTML = `
                                            <div class="col-xs-12 col-sm-12 col-md-12">
                                                <div class="alert alert-success" style="margin:0" role="alert">
                                                  <div class="d-flex">
                                                    <div>
                                                      <!-- Download SVG icon from http://tabler-icons.io/i/check -->
                                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                                                         `+ response.data.msg + `
                                                      </div>
                                                  </div>
                                                </div>
                                            </div>

                                                `
                            //load_photo(request)
                        } else {
                            document.getElementById("modal-danger-context").textContent = response.data.msg
                            document.getElementById("danger-btn").click();
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        document.getElementById("modal-danger-context").textContent = error.message
                        document.getElementById("danger-btn").click();
                    })
                    .finally(() => {
                        console.log('deleted')
                        danger_ok_btn.setAttribute("target-id", "")
                    })
            }

        })
    }
}

function page_index_build(data, elClass) {
    var page_index_list = document.getElementsByClassName(elClass);
    if (data.pageNumber > (3)) {

    }
    var start = data.pageNumber == 1 || data.pageNumber <= 2 ? 1 : data.pageNumber - 2;
    console.log(start)
    for (let el of page_index_list) {
        el.innerText = start
        start = numberAdd(start, 1)
    }

    for (let el of page_index_list) {
        if (el.innerText == data.pageNumber) {
            el.parentElement.classList.add("active")
        } else {
            el.parentElement.classList.remove("active")
        }

    }
}

function page_select_build(data) {

    var pageIndex_size = (data.total / data.pageSize)
    request.lastPageNumber = pageIndex_size + 1
    page_select_list.forEach(el => el.innerHTML = '')
    pageIndex_size = pageIndex_size == 0 ? 1 : pageIndex_size;
    var selectHtml = ""
    for (let i = 1; i <= (pageIndex_size + 1); i++) {
        selectHtml += `<option ${i == data.pageNumber ? 'selected' : ''} value="` + i + `" >` + i + `</option>`
    }
    page_select_list.forEach(el => {
        el.innerHTML = selectHtml
    })
}

function load_detail() {
    var items = document.getElementsByClassName('detail-btn');

    for (let item of items) {
        item.addEventListener('click', function (evt) {
            evt.preventDefault()
            evt.stopImmediatePropagation()
            evt.stopPropagation()
            var targetId = evt.currentTarget.getAttribute("href")
            document.getElementById("entity-detail-btn").click()
            var detail_iframe = document.getElementById("entity-detail-iframe");
            detail_iframe.src = targetId;
        });
    }

}



pageSizeInputList.forEach(pageSizeInput => {
    pageSizeInput.addEventListener("change", function (evt) {
        console.log('pageSizeInput -> ' + evt.currentTarget.value)
        if (Number(evt.currentTarget.value) < Number(3)) {
            evt.currentTarget.value = 3
        }
        request.pageSize = evt.currentTarget.value
    })
})


page_select_list.forEach(element => {
    element.addEventListener("change", function (event) {
        var selectedValue = event.target.value;
        console.log("Selected value is: " + selectedValue);
        request.pageNumber = selectedValue
        load_data(request, 1)
    })
})

var update = document.getElementById('edit-submit');
update?.addEventListener('click', (e) => {
    console.log("submit onclick...")
    const form = document.querySelector('#entity-form');
    console.log(form)
    const formData = new FormData(form);
    console.log(formData)
    var addForm = Object.fromEntries(formData.entries());
    const formJson = JSON.stringify(addForm);
    console.log(formJson)
    axios
        .post(apiUrl + entityUrl.update, addForm)
        .then(response => {
            console.log(response)
            response = response.data
            if (response.code == 200) {
                load_data(request)
            } else {
                document.getElementById("modal-danger-context").textContent = response.msg
                document.getElementById("danger-btn").click();
            }
        })
        .catch(error => {
            console.log(error)
        })
})


var copy = document.getElementById('copy-submit');
copy?.addEventListener('click', (e) => {
    console.log("submit onclick...")
    const form = document.querySelector('#copy-form');
    console.log(form)
    const formData = new FormData(form);
    console.log(formData)
    var addForm = Object.fromEntries(formData.entries());
    const formJson = JSON.stringify(addForm);
    console.log(formJson)
    axios
        .post(apiUrl + entityUrl.copy, addForm)
        .then(response => {
            console.log(response)
            response = response.data
            if (response.code == 200) {
                document.getElementById("modal-success-context").textContent = response.msg
                document.getElementById("success-btn").click();
            } else {
                document.getElementById("modal-danger-context").textContent = response.msg
                document.getElementById("danger-btn").click();
            }
        })
        .catch(error => {
            console.log(error)
        })
})


var page_index_top_list = document.getElementsByClassName("page-index-top");
for (let el of page_index_top_list) {
    el.addEventListener('click', function (evt) {
        request.pageNumber = el.innerText
        load_data(request, 1)
    })
}
var page_index_bottom_list = document.getElementsByClassName("page-index-bottom");
for (let el of page_index_bottom_list) {
    el.addEventListener('click', function (evt) {
        request.pageNumber = el.innerText
        load_data(request, 1)
    })
}

pagePrevBtnList.forEach(el => {
    el.addEventListener('click', function (evt) {
        request.pageNumber = numberSub(request.pageNumber, 1)
        if (request.pageNumber <= 0) {
            request.pageNumber = 1
        }
        load_data(request, 1)
    })
})
pageNextBtnList.forEach(el => {
    el.addEventListener('click', function (evt) {
        request.pageNumber = numberAdd(request.pageNumber, 1)
        load_data(request, 1)
    })
})

Array.from(document.getElementsByClassName("first-btn")).forEach(el => {
    el.addEventListener('click', function (evt) {
        request.pageNumber = 1
        load_data(request, 1)
    })
})

Array.from(document.getElementsByClassName("last-btn")).forEach(el => {
    el.addEventListener('click', function (evt) {
        request.pageNumber = request.lastPageNumber
        load_data(request, 1)
    })
})

// ==================== video.js player initializer ====================
function initVideoPlayer(el, id) {
    var videoUrl = el.dataset.url;
    var videoModalEl = document.getElementById('video-play');

    var fileDetailData = null;
    axios.get(apiUrl + request.entityUrl.detail + id)
        .then(function(resp) {
            if (resp.data.code === 200) {
                fileDetailData = resp.data.data;
                console.log('[video] file detail:', fileDetailData);
                var titleEl = document.getElementById('video-play-title');
                if (titleEl) titleEl.textContent = fileDetailData.realName || 'Video Player';
                var nameEl = document.getElementById('video-file-name');
                var sizeEl = document.getElementById('video-file-size');
                var urlEl = document.getElementById('video-file-url');
                if (nameEl) nameEl.textContent = fileDetailData.realName || '';
                var sizeBytes = fileDetailData.size || 0;
                var sizeMB = sizeBytes / 1024 / 1024;
                var sizeText = fileDetailData.sizeDescription || (sizeMB >= 1 ? sizeMB.toFixed(1) + ' MB' : (sizeBytes / 1024).toFixed(1) + ' KB');
                if (sizeEl) sizeEl.textContent = sizeText;
                if (urlEl) urlEl.textContent = videoUrl || '';
            }
        });

        // Destroy old player on modal hidden — named functions to avoid listener accumulation
        if (window._videoPlayerHiddenHandler) {
            videoModalEl.removeEventListener('hidden.bs.modal', window._videoPlayerHiddenHandler);
        }
        window._videoPlayerHiddenHandler = function() {
            if (window._videoPlayer) {
                window._videoPlayer.dispose();
                window._videoPlayer = null;
            }
        };
        videoModalEl.addEventListener('hidden.bs.modal', window._videoPlayerHiddenHandler);

        if (window._videoPlayerShownHandler) {
            videoModalEl.removeEventListener('shown.bs.modal', window._videoPlayerShownHandler);
        }
        videoModalEl.addEventListener('shown.bs.modal', window._videoPlayerShownHandler = function videoPlayerShownHandler() {
                var playerEl = document.getElementById('videojs-player');
                if (!playerEl) {
                    var modalBody = videoModalEl.querySelector('.modal-body');
                    if (modalBody) {
                        modalBody.innerHTML = '<video id="videojs-player" class="video-js vjs-big-play-centered vjs-fluid" controls preload="auto" width="100%" height="100%"><p class="vjs-no-js">您的浏览器不支持视频播放<p></video>';
                    }
                    playerEl = document.getElementById('videojs-player');
                }
                if (playerEl) {
                    if (window._videoPlayer) {
                        window._videoPlayer.dispose();
                    }
                    window._videoPlayer = videojs(playerEl, {
                        controls: true,
                        autoplay: true,
                        preload: 'auto',
                        fluid: true,
                        playbackRates: [0.5, 1, 1.5, 2],
                    });
                    window._videoPlayer.src({ src: videoUrl, type: 'video/mp4' });
                    window._videoPlayer.ready(function() {
                        function formatTime(seconds, showSign) {
                    var s = Math.abs(Math.floor(seconds));
                    var h = Math.floor(s / 3600);
                    var m = Math.floor((s % 3600) / 60);
                    var sec = s % 60;
                    var sign = showSign && seconds < 0 ? '-' : '';
                    if (h > 0) {
                        return sign + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
                    }
                    return sign + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
                }

                var style = document.createElement('style');
                style.id = 'video-control-btn-css';
                style.textContent = `
                    #video-custom-controls .seek-btn,#video-custom-controls .vjs-ctrl-btn{display:inline-flex!important;align-items:center;padding:6px 14px!important;font-size:14px!important;color:#fff!important;cursor:pointer!important;border:none!important;border-radius:6px!important;background:rgba(43,51,63,0.85)!important;transition:all 0.15s ease!important;user-select:none!important}
                    #video-custom-controls .seek-btn:hover,#video-custom-controls .vjs-ctrl-btn:hover{background:rgba(63,71,83,0.95)!important;transform:scale(1.05)!important}
                    #video-custom-controls .vjs-ctrl-btn{font-size:13px!important;padding:6px 10px!important;gap:4px!important}
                    #video-custom-controls .vjs-ctrl-btn svg{display:inline-block;vertical-align:middle}
                    #video-custom-controls .vjs-ctrl-loaded{transition:height 0.15s,top 0.15s}
                    #video-custom-controls .vjs-ctrl-played{transition:width 0.1s linear}
                    #video-custom-controls .vjs-ctrl-rate-menu{animation:fadeInUp 0.15s ease}
                    @keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(4px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
                    .video-js .vjs-control-bar{display:none!important}
                    .vjs-time-display{display:flex!important;align-items:center!important;font-size:13px!important;color:#fff!important;opacity:.85!important;line-height:1!important}
                    .vjs-time-display .vjs-current-time{order:1!important}
                    .vjs-time-display .vjs-time-separator{order:2!important;display:none}
                    .vjs-time-display .vjs-duration{order:3!important;display:none}
                    .vjs-time-display .vjs-remaining-time{order:4!important;display:none}
                    .video-time-left{display:inline-flex!important;align-items:center!important;padding:0 6px!important;font-size:13px!important;color:#fff!important;opacity:.85!important}
                    .video-time-right{display:inline-flex!important;align-items:center!important;padding:0 6px!important;font-size:13px!important;color:#fff!important;opacity:.85!important}
                `;
                document.head.appendChild(style);

                document.querySelectorAll('.seek-btn,.video-time-left,.video-time-right').forEach(function(b){ b.remove(); });

                var timeLeft = document.createElement('div');
                timeLeft.className = 'vjs-control vjs-button video-time-left';
                timeLeft.style.cssText = 'display:inline-flex!important;align-items:center;padding:0 6px;font-size:13px;color:#fff;opacity:.85;cursor:default;border:none;background:none;box-shadow:none';
                timeLeft.innerHTML = '<span class="vjs-current-time-display">00:00</span>';

                var timeRight = document.createElement('div');
                timeRight.className = 'vjs-control vjs-button video-time-right';
                timeRight.style.cssText = 'display:inline-flex!important;align-items:center;padding:0 6px;font-size:13px;color:#fff;opacity:.85;cursor:default;border:none;background:none;box-shadow:none';
                timeRight.innerHTML = '<span>-00:00</span>';

                function updateTimeDisplay() {
                    if (!window._videoPlayer) return;
                    var current = window._videoPlayer.currentTime() || 0;
                    var duration = window._videoPlayer.duration() || 0;
                    var remaining = duration - current;
                    var currentEl = timeLeft.querySelector('span');
                    var remainingEl = timeRight.querySelector('span');
                    if (currentEl) currentEl.textContent = formatTime(current, false);
                    if (remainingEl) remainingEl.textContent = '-' + formatTime(remaining, false);
                }

                function addSeekBtn(seconds, label) {
                    var btn = document.createElement('div');
                    btn.className = 'btn btn-primary';
                    btn.textContent = label;
                    btn.addEventListener('click', function() {
                        var newTime = window._videoPlayer.currentTime() + seconds;
                        var duration = window._videoPlayer.duration() || 0;
                        if (newTime < 0) newTime = 0;
                        if (newTime > duration) newTime = duration;
                        window._videoPlayer.currentTime(newTime);
                    });
                    return btn;
                }

                var customControls = document.getElementById('video-custom-controls');
                var row2 = document.getElementById('video-custom-controls-row2');
                var row3 = document.getElementById('video-custom-controls-row3');
                var controlBar = window._videoPlayer.getChild('ControlBar');
                if (customControls) {
                    if (controlBar) {
                        var progressControl = controlBar.getChild('ProgressControl');
                        if (progressControl) {
                            var progressEl = progressControl.el();
                            var currentTimeDisplay = controlBar.getChild('CurrentTimeDisplay');
                            var durationDisplay = controlBar.getChild('DurationDisplay');
                            var remainingDisplay = controlBar.getChild('RemainingTimeDisplay');
                            [currentTimeDisplay, durationDisplay, remainingDisplay].forEach(function(c) {
                                if (c && c.el_) c.el_.style.display = 'none';
                            });
                            progressEl.parentNode.insertBefore(timeLeft, progressEl);
                            progressEl.parentNode.insertBefore(timeRight, progressEl.nextSibling);
                            updateTimeDisplay();
                            window._videoPlayer.on('timeupdate', updateTimeDisplay);
                        }
                    }
                    customControls.innerHTML = '';
                    if (row2) row2.innerHTML = '';
                    if (row3) row3.innerHTML = '';

                    function makeCtrlBtn(iconSvg, label, onClick) {
                        var b = document.createElement('div');
                        b.className = 'btn btn-primary';
                        b.innerHTML = iconSvg + '<span>' + label + '</span>';
                        b.addEventListener('click', onClick);
                        return b;
                    }

                    // --- PlayToggle ---
                    var playToggle = controlBar.getChild('PlayToggle');
                    if (playToggle) {
                        var playBtn = makeCtrlBtn(
                            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
                            '播放',
                            function() { playToggle.handleClick(); }
                        );
                        window._videoPlayer.on('play', function() {
                            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>暂停</span>';
                        });
                        window._videoPlayer.on('pause', function() {
                            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>播放</span>';
                        });
                        row2.insertBefore(playBtn, row2.firstChild);
                    }

                    // --- CurrentTimeDisplay + DurationDisplay ---
                    var ctDiv = document.createElement('div');
                    ctDiv.className = 'btn btn-primary';
                    ctDiv.style.cssText = 'min-width:52px;justify-content:center';
                    ctDiv.innerHTML = '<span>00:00</span>';
                    customControls.appendChild(ctDiv);

                    var sep1 = document.createElement('span');
                    sep1.textContent = '/';
                    sep1.style.cssText = 'padding:0 4px';
                    customControls.appendChild(sep1);

                    var durDiv = document.createElement('div');
                    durDiv.className = 'btn btn-primary';
                    durDiv.style.cssText = 'min-width:52px;justify-content:center';
                    durDiv.innerHTML = '<span>00:00</span>';
                    customControls.appendChild(durDiv);

                    window._videoPlayer.on('timeupdate', function() {
                        var cur = window._videoPlayer.currentTime() || 0;
                        var dur2 = window._videoPlayer.duration() || 0;
                        var curH = Math.floor(cur / 3600);
                        var curM = Math.floor((cur % 3600) / 60);
                        var curS = Math.floor(cur % 60);
                        var durH = Math.floor(dur2 / 3600);
                        var durM = Math.floor((dur2 % 3600) / 60);
                        var durS = Math.floor(dur2 % 60);
                        var fmtTime = function(h, m, s) {
                            return (h > 0 ? String(h).padStart(2,'0')+':' : '') + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
                        };
                        ctDiv.querySelector('span').textContent = fmtTime(curH, curM, curS);
                        durDiv.querySelector('span').textContent = fmtTime(durH, durM, durS);
                    });

                    // --- Progress bar ---
                    var progWrap = document.createElement('div');
                    progWrap.style.cssText = 'flex:1;min-width:120px;max-width:400px;height:20px;display:flex;align-items:center;cursor:pointer;margin:0 8px;position:relative';
                    progWrap.innerHTML = '<div style="position:relative;width:100%;height:6px;background:rgba(255,255,255,0.15);border-radius:3px;overflow:visible"><div class="vjs-ctrl-loaded" style="position:absolute;top:0;left:0;height:100%;background:rgba(255,255,255,0.3);border-radius:3px;width:0;transition:width 0.3s"></div><div class="vjs-ctrl-played" style="position:absolute;top:0;left:0;height:100%;background:#409fff;border-radius:3px;width:0"></div><div class="vjs-ctrl-thumb" style="position:absolute;top:50%;transform:translate(-50%,-50%);width:12px;height:12px;background:#fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.5);opacity:0;transition:opacity 0.15s;pointer-events:none"></div></div>';
                    var loadedEl = progWrap.querySelector('.vjs-ctrl-loaded');
                    var playedEl = progWrap.querySelector('.vjs-ctrl-played');
                    var thumbEl = progWrap.querySelector('.vjs-ctrl-thumb');

                    function updateProgress() {
                        if (!window._videoPlayer) return;
                        var cur = window._videoPlayer.currentTime() || 0;
                        var dur = window._videoPlayer.duration() || 0;
                        if (dur <= 0) return;
                        var pct = (cur / dur * 100).toFixed(2) + '%';
                        playedEl.style.width = pct;
                        thumbEl.style.left = pct;
                    }
                    function updateBuffered() {
                        if (!window._videoPlayer) return;
                        var buf = window._videoPlayer.bufferedPercent() || 0;
                        loadedEl.style.width = (buf * 100).toFixed(2) + '%';
                    }
                    window._videoPlayer.on('timeupdate', updateProgress);
                    window._videoPlayer.on('progress', updateBuffered);
                    window._videoPlayer.on('loadedmetadata', function() { updateProgress(); updateBuffered(); });
                    progWrap.addEventListener('mouseenter', function() { thumbEl.style.opacity = '1'; });
                    progWrap.addEventListener('mouseleave', function() { thumbEl.style.opacity = '0'; });
                    progWrap.addEventListener('click', function(e) {
                        var rect = progWrap.querySelector('div').getBoundingClientRect();
                        var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        window._videoPlayer.currentTime(pct * (window._videoPlayer.duration() || 0));
                    });
                     // 添加进度条到 video-current-time-row
                     var currentTimeRow = document.getElementById('video-current-time-row');
                     if (currentTimeRow) {
                         // 先清空旧内容，避免重复添加
                         currentTimeRow.innerHTML = '';
                         
                         // 创建进度条副本（带独立事件绑定）
                        var progWrapClone = progWrap.cloneNode(true);
                        
                        // 重新获取克隆后的DOM元素
                        var loadedElClone = progWrapClone.querySelector('.vjs-ctrl-loaded');
                        var playedElClone = progWrapClone.querySelector('.vjs-ctrl-played');
                        var thumbElClone = progWrapClone.querySelector('.vjs-ctrl-thumb');
                        
                        // 为克隆的进度条绑定独立的事件处理器
                        progWrapClone.addEventListener('click', function(e) {
                            var rect = progWrapClone.querySelector('div').getBoundingClientRect();
                            var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                            window._videoPlayer.currentTime(pct * (window._videoPlayer.duration() || 0));
                        });
                        
                        progWrapClone.addEventListener('mouseenter', function() { 
                            if (thumbElClone) thumbElClone.style.opacity = '1'; 
                        });
                        progWrapClone.addEventListener('mouseleave', function() { 
                            if (thumbElClone) thumbElClone.style.opacity = '0'; 
                        });
                        
                        // 更新克隆进度条的函数
                        function updateProgressClone() {
                            if (!window._videoPlayer) return;
                            var cur = window._videoPlayer.currentTime() || 0;
                            var dur = window._videoPlayer.duration() || 0;
                            if (dur <= 0) return;
                            var pct = (cur / dur * 100).toFixed(2) + '%';
                            if (playedElClone) playedElClone.style.width = pct;
                            if (thumbElClone) thumbElClone.style.left = pct;
                        }
                        
                        function updateBufferedClone() {
                            if (!window._videoPlayer) return;
                            var buf = window._videoPlayer.bufferedPercent() || 0;
                            if (loadedElClone) loadedElClone.style.width = (buf * 100).toFixed(2) + '%';
                        }
                        
                        // 绑定事件到克隆进度条
                        window._videoPlayer.on('timeupdate', updateProgressClone);
                        window._videoPlayer.on('progress', updateBufferedClone);
                        window._videoPlayer.on('loadedmetadata', function() { 
                            updateProgressClone(); 
                            updateBufferedClone(); 
                        });
                        
                        currentTimeRow.appendChild(progWrapClone);
                    }
                    
                     // --- Close Button ---
                     var closeBtnWrap = document.createElement('div');
                     closeBtnWrap.style.cssText = 'display:inline-flex;align-items:center';
                     var closeBtn = document.createElement('button');
                     closeBtn.type = 'button';
                     closeBtn.className = 'btn-close btn-close-white';
                     closeBtn.setAttribute('data-bs-dismiss', 'modal');
                     closeBtn.setAttribute('aria-label', 'Close');
                     closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="18" y2="6"/></svg>';
                      closeBtnWrap.appendChild(closeBtn);
                      
                      // --- Volume ---
                    var volWrap = document.createElement('div');
                    volWrap.style.cssText = 'display:inline-flex!important;align-items:center;gap:4px';
                    var volBtn = document.createElement('div');
                    volBtn.className = 'btn btn-primary';
                    volBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" class="vol-path"/></svg><span>音量</span>';
                    volBtn.addEventListener('click', function() {
                        var p = window._videoPlayer;
                        if (p.muted()) {
                            p.muted(false);
                            volBtn.querySelector('span').textContent = '音量';
                            volBtn.querySelector('.vol-path').setAttribute('d', 'M15.54 8.46a5 5 0 0 1 0 7.07');
                        } else {
                            p.muted(true);
                            volBtn.querySelector('span').textContent = '静音';
                            volBtn.querySelector('.vol-path').setAttribute('d', 'M11 5 6 9 2 9 2 15 6 15 11 19 11 5');
                        }
                    });
                    volWrap.appendChild(volBtn);
                    var volSlider = document.createElement('div');
                    volSlider.style.cssText = 'position:relative;width:70px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;cursor:pointer';
                    var volFill = document.createElement('div');
                    volFill.className = 'vol-fill';
                    volFill.style.cssText = 'position:absolute;top:0;left:0;height:100%;background:#409fff;border-radius:2px;width:100%';
                    var volThumb = document.createElement('div');
                    volThumb.className = 'vol-thumb';
                    volThumb.style.cssText = 'position:absolute;top:50%;transform:translate(-50%,-50%);width:10px;height:10px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.4)';
                    volSlider.appendChild(volFill);
                    volSlider.appendChild(volThumb);
                    function updateVolSlider() {
                        var p = window._videoPlayer;
                        if (!p) return;
                        var v = p.muted() ? 0 : (p.volume() || 0);
                        var pct = (v * 100).toFixed(2) + '%';
                        volFill.style.width = pct;
                        volThumb.style.left = pct;
                    }
                    volSlider.addEventListener('click', function(e) {
                        var rect = volSlider.getBoundingClientRect();
                        var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        window._videoPlayer.muted(false);
                        window._videoPlayer.volume(pct);
                        updateVolSlider();
                    });
                    volSlider.addEventListener('mousedown', function(e) {
                        function onMove(ev) {
                            var rect = volSlider.getBoundingClientRect();
                            var pct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                            window._videoPlayer.muted(false);
                            window._videoPlayer.volume(pct);
                            updateVolSlider();
                        }
                        function onUp() {
                            document.removeEventListener('mousemove', onMove);
                            document.removeEventListener('mouseup', onUp);
                        }
                        document.addEventListener('mousemove', onMove);
                        document.addEventListener('mouseup', onUp);
                    });
                    volWrap.appendChild(volSlider);
                    customControls.appendChild(volWrap);
                    window._videoPlayer.on('volumechange', updateVolSlider);
                    updateVolSlider();

                    // --- PlaybackRate ---
                    var playbackRate = controlBar.getChild('PlaybackRateMenuButton');
                    var rates = playbackRate && playbackRate.rates_ ? playbackRate.rates_.slice() : [0.5, 1, 1.5, 2];
                    var currentRate = window._videoPlayer.playbackRate ? window._videoPlayer.playbackRate() : 1;
                    var rateBtnWrap = document.createElement('div');
                    rateBtnWrap.style.cssText = 'position:relative;display:inline-flex;align-items:center';
                    var rateBtn = document.createElement('div');
                    rateBtn.className = 'btn btn-primary';
                    rateBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>' + currentRate + 'x</span>';
                    rateBtnWrap.appendChild(rateBtn);
                    var rateMenu = document.createElement('div');
                    rateMenu.className = 'vjs-ctrl-rate-menu';
                    rateMenu.style.cssText = 'display:none;position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:6px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:6px 0;min-width:90px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.5);text-align:center';
                    rates.forEach(function(r) {
                        var item = document.createElement('div');
                        item.className = 'vjs-ctrl-rate-item';
                        item.style.cssText = 'padding:7px 14px;font-size:13px;cursor:pointer;border-radius:4px;margin:2px 6px;transition:background 0.15s';
                        item.textContent = r + 'x';
                        if (r === currentRate) { item.style.fontWeight = 'bold'; }
                        item.addEventListener('click', function(e) {
                            e.stopPropagation();
                            window._videoPlayer.playbackRate(r);
                            rateMenu.querySelectorAll('.vjs-ctrl-rate-item').forEach(function(i) { i.style.fontWeight = 'normal'; });
                            item.style.fontWeight = 'bold';
                            rateBtn.querySelector('span').textContent = r + 'x';
                            rateMenu.style.display = 'none';
                        });
                        item.addEventListener('mouseenter', function() { item.style.background = 'rgba(255,255,255,0.08)'; });
                        item.addEventListener('mouseleave', function() {
                            item.style.background = '';
                            item.style.fontWeight = (r === window._videoPlayer.playbackRate()) ? 'bold' : 'normal';
                        });
                        rateMenu.appendChild(item);
                    });
                    rateBtnWrap.appendChild(rateMenu);
                    rateBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        rateMenu.style.display = (rateMenu.style.display === 'block') ? 'none' : 'block';
                    });
                    document.addEventListener('click', function(e) {
                        if (!rateBtnWrap.contains(e.target)) { rateMenu.style.display = 'none'; }
                    });
                    window._videoPlayer.on('ratechange', function() {
                        rateBtn.querySelector('span').textContent = window._videoPlayer.playbackRate() + 'x';
                    });
                    // --- Row2: 播放, PiP, Fullscreen, -10, +10, 倍速 ---
                    if (row2) {
                        // --- Fullscreen ---
                        var fsToggle = controlBar.getChild('FullscreenToggle');
                        if (fsToggle) {
                            var fsBtn = makeCtrlBtn(
                                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
                                '全屏',
                                function() { fsToggle.handleClick(); }
                            );
                            window._videoPlayer.on('fullscreenchange', function() {
                                fsBtn.querySelector('span').textContent = window._videoPlayer.isFullscreen() ? '退出' : '全屏';
                            });
                            row2.appendChild(fsBtn);
                        }

                        // --- -10s / +10s ---
                        row2.appendChild(addSeekBtn(-10, '-10'));
                        row2.appendChild(addSeekBtn(10, '+10'));
                        row2.appendChild(rateBtnWrap);
                    }

                    // --- Row3: time inputs ---
                    if (row3) {
                        var sep3 = document.createElement('span');
                        sep3.style.cssText = 'margin:0 4px';
                        sep3.textContent = '|';
                        row3.appendChild(sep3);

                        var btnSetStart = document.createElement('button');
                        btnSetStart.type = 'button';
                        btnSetStart.className = 'btn btn-primary';
                        btnSetStart.textContent = '开始';
                        var inputStart = document.createElement('input');
                        inputStart.type = 'text';
                        inputStart.className = 'form-control';
                        inputStart.placeholder = '00:00';
                        inputStart.readOnly = true;
                        inputStart.style.cssText = 'width:80px;height:30px;padding:4px 8px;font-size:13px;text-align:center';

                        var btnSetEnd = document.createElement('button');
                        btnSetEnd.type = 'button';
                        btnSetEnd.className = 'btn btn-primary';
                        btnSetEnd.textContent = '结束';
                        var inputEnd = document.createElement('input');
                        inputEnd.type = 'text';
                        inputEnd.className = 'form-control';
                        inputEnd.placeholder = '00:00';
                        inputEnd.readOnly = true;
                        inputEnd.style.cssText = 'width:80px;height:30px;padding:4px 8px;font-size:13px;text-align:center';

                        row3.appendChild(btnSetStart);
                        row3.appendChild(inputStart);
                        row3.appendChild(btnSetEnd);    
                        row3.appendChild(inputEnd);

                        inputStart.value = '';
                         inputEnd.value = '';
                         btnSetStart.addEventListener('click', function() {
                             var t = window._videoPlayer.currentTime() || 0;
                             inputStart.value = formatTime(t, false);
                         });
                         btnSetEnd.addEventListener('click', function() {
                             var t = window._videoPlayer.currentTime() || 0;
                             inputEnd.value = formatTime(t, false);
                         });
                     }
                     
                     // --- Close Button ---
                     var closeBtnWrap = document.createElement('div');
                     closeBtnWrap.style.cssText = 'display:inline-flex;align-items:center';
                     var closeBtn = document.createElement('button');
                     closeBtn.type = 'button';
                     closeBtn.className = 'btn-close btn-close-white';
                     closeBtn.setAttribute('data-bs-dismiss', 'modal');
                     closeBtn.setAttribute('aria-label', 'Close');
                     closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="18" y2="6"/></svg>';
                     closeBtnWrap.appendChild(closeBtn);
                     row3.insertBefore(closeBtnWrap, row3.firstChild);
                     
                     console.log('[video] all default control buttons added to footer');
                } else {
                    console.log('[video] customControls NOT found');
                }
            });
            window._videoPlayer.play();
        }
 
    });
}

// ===================== VTF/VMT 转换功能 =====================

var vtfCurrentImageSrc = null;
var vtfCurrentFileName = 'texture';
var vtfConvertedData = null;  // 存储转换后的 VTF 数据
var _vtfShimsInitialized = false;

const VTF_FORMAT_MAP = {
    'RGBA8888': 0,
    'ABGR8888': 1,
    'RGB888': 2,
    'BGR888': 3,
    'RGB565': 4,
    'I8': 5,
    'IA88': 6,
    'P8': 7,
    'A8': 8,
    'RGB888_BLUESCREEN': 9,
    'BGR888_BLUESCREEN': 10,
    'ARGB8888': 11,
    'BGRA8888': 12,
    'DXT1': 13,
    'DXT3': 14,
    'DXT5': 15,
    'BGRX8888': 16,
    'BGR565': 17,
    'BGRX5551': 18,
    'BGRA4444': 19,
    'DXT1_ONEBITALPHA': 20,
    'BGRA5551': 21,
    'UV88': 22,
    'UVWQ8888': 23,
    'RGBA16161616F': 24,
    'RGBA16161616': 25,
    'UVLX8888': 26
};

// ==========================================================
// VTF Shim 元素：vtf.js 硬编码了大量原始 DOM ID（format、
// widthSetting、preview 等），我们的模板改了 ID，所以必须
// 在 vtf.js 加载前创建这些 shim 元素，防止 setResolution()
// 在脚本加载时崩溃。
// ==========================================================
(function vtfInitShimElements() {
    // 仅在 vtflist-view 环境下需要这些 shim（vtf-converter 已包含）
    var containerId = '_vtf-shim-container';
    var container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none';
        document.body.appendChild(container);
    }

    function shim(tag, id, props) {
        if (document.getElementById(id)) return;
        var el = document.createElement(tag);
        el.id = id;
        if (props) {
            for (var k in props) {
                if (k === 'style') {
                    for (var sk in props.style) el.style[sk] = props.style[sk];
                } else {
                    el[k] = props[k];
                }
            }
        }
        container.appendChild(el);
    }

    // ---- vtf.js 在 setResolution() 中直接访问的元素 ----
    shim('select', 'format', { value: '15' });                          // 格式选择
    shim('select', 'widthSetting', { value: '512' });                  // 宽度
    shim('select', 'heightSetting', { value: '512' });                 // 高度
    shim('input', 'widthSettingCus', { type: 'text', value: '512' });  // 自定义宽度
    shim('input', 'heightSettingCus', { type: 'text', value: '512' }); // 自定义高度
    shim('canvas', 'preview', { width: 512, height: 512 });            // 预览画布 ★ 必须是 canvas
    shim('div', 'contentWrapper', { style: {width:'512px', height:'512px'} });
    shim('input', 'files', { type: 'file' });
    shim('button', 'convertButton', { disabled: true });
    shim('button', 'saveButton', { disabled: true });
    shim('button', 'saveButtonVMT', { disabled: true });
    shim('input', 'files0', { type: 'file', disabled: true });
    shim('div', 'mipmaps', { style: {display:'none'} });
    shim('div', 'resolutionNotice', { style: {visibility:'hidden'} });

    // ---- convert/convertPixels 中需要的元素 ----
    shim('input', 'sampling', { type: 'hidden', value: '0' });
    shim('input', 'dxtquality', { type: 'hidden', value: '2' });
    shim('input', 'ditherCheck', { type: 'checkbox' });
    shim('div', 'ditherBlock', { style: {display:'none'} });
    shim('div', 'dxtSettings', { style: {display:'block'} });
    shim('input', 'singleFrame', { type: 'checkbox' });
    shim('input', 'mipmapsCheck', { type: 'checkbox', checked: true });
    shim('input', 'rescaleCheck', { type: 'checkbox', checked: true });

    // ---- 输出/下载相关 ----
    shim('input', 'outputFilename', { type: 'text', value: 'spray' });
    shim('span', 'filesizee');
    shim('span', 'progress');

    _vtfShimsInitialized = true;
})();

// 在调用 vtf.js convert() 之前，将我们 UI 的值同步到 shim 元素
function vtfSyncShimValues() {
    var formatSelect = document.getElementById('vtf-format');
    var widthSelect = document.getElementById('vtf-width');
    var heightSelect = document.getElementById('vtf-height');
    var widthCustom = document.getElementById('vtf-width-custom');
    var heightCustom = document.getElementById('vtf-height-custom');
    var sampling = document.getElementById('vtf-sampling');
    var quality = document.getElementById('vtf-quality');
    var dither = document.getElementById('vtf-dither');
    var filename = document.getElementById('vtf-filename');
    var mipmaps = document.getElementById('vtf-mipmaps');
    var rescale = document.getElementById('vtf-rescale');

    // 格式
    var fmtVal = formatSelect ? formatSelect.value : '15';
    var shimFormat = document.getElementById('format');
    if (shimFormat) shimFormat.value = fmtVal;

    // 宽度
    var wVal = vtfGetActualSize('vtf-width', 'vtf-width-custom', 512);
    var shimWidth = document.getElementById('widthSetting');
    var shimWidthCus = document.getElementById('widthSettingCus');
    if (shimWidth) {
        if (widthSelect && widthSelect.value === 'custom') {
            shimWidth.value = 'custom';
            if (shimWidthCus) {
                shimWidthCus.value = isNaN(parseInt(wVal)) ? '512' : String(wVal);
                shimWidthCus.style.display = 'inline';
            }
        } else {
            shimWidth.value = isNaN(parseInt(wVal)) ? '512' : String(wVal);
            if (shimWidthCus) shimWidthCus.style.display = 'none';
        }
    }

    // 高度
    var hVal = vtfGetActualSize('vtf-height', 'vtf-height-custom', 512);
    var shimHeight = document.getElementById('heightSetting');
    var shimHeightCus = document.getElementById('heightSettingCus');
    if (shimHeight) {
        if (heightSelect && heightSelect.value === 'custom') {
            shimHeight.value = 'custom';
            if (shimHeightCus) {
                shimHeightCus.value = isNaN(parseInt(hVal)) ? '512' : String(hVal);
                shimHeightCus.style.display = 'inline';
            }
        } else {
            shimHeight.value = isNaN(parseInt(hVal)) ? '512' : String(hVal);
            if (shimHeightCus) shimHeightCus.style.display = 'none';
        }
    }

    // 抽样方案
    var shimSampling = document.getElementById('sampling');
    if (shimSampling) shimSampling.value = sampling ? sampling.value : '0';

    // 压缩质量
    var shimQuality = document.getElementById('dxtquality');
    if (shimQuality) shimQuality.value = quality ? quality.value : '2';

    // 抖动
    var shimDither = document.getElementById('ditherCheck');
    if (shimDither) shimDither.checked = dither ? dither.checked : false;

    // 文件名
    var shimFilename = document.getElementById('outputFilename');
    if (shimFilename) shimFilename.value = (filename ? filename.value : 'spray') || 'spray';

    // mipmaps
    var shimMipmaps = document.getElementById('mipmapsCheck');
    if (shimMipmaps) shimMipmaps.checked = mipmaps ? mipmaps.checked !== false : true;

    // rescale
    var shimRescale = document.getElementById('rescaleCheck');
    if (shimRescale) shimRescale.checked = rescale ? rescale.checked !== false : true;

    // 确保 dither/dxt 显示选项跟随格式
    var fmtInt = parseInt(fmtVal);
    if (fmtInt !== 0 && fmtInt !== 2 && fmtInt !== 13 && fmtInt !== 15) {
        var db = document.getElementById('ditherBlock');
        if (db) db.style.display = 'block';
    }
    if (fmtInt === 13 || fmtInt === 15) {
        var ds = document.getElementById('dxtSettings');
        if (ds) ds.style.display = 'block';
    }
}

function vtfInitConverter() {
    return window.convert && window.createVTF ? true : false;
}

function vtfIsPowerOf2(n) {
    return n && (n & (n - 1)) === 0;
}

// 获取实际的尺寸值（处理 auto 和 custom）
function vtfGetActualSize(selectId, customId, defaultValue) {
    var select = document.getElementById(selectId);
    var customInput = document.getElementById(customId);
    if (!select) return defaultValue;
    
    var value = select.value;
    if (value === 'auto') return 'auto';
    if (value === 'custom') {
        return customInput && customInput.value ? parseInt(customInput.value) : defaultValue;
    }
    return parseInt(value);
}

// 初始化自定义输入框的显示/隐藏
function vtfInitCustomSizeInputs() {
    var widthSelect = document.getElementById('vtf-width');
    var heightSelect = document.getElementById('vtf-height');
    var widthCustom = document.getElementById('vtf-width-custom');
    var heightCustom = document.getElementById('vtf-height-custom');
    
    if (widthSelect && !widthSelect.dataset.vtfBound) {
        widthSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                widthCustom.classList.remove('d-none');
            } else {
                widthCustom.classList.add('d-none');
            }
            vtfUpdateFileSizeEstimate();
        });
        widthSelect.dataset.vtfBound = true;
    }
    
    if (heightSelect && heightCustom) {
        heightSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                heightCustom.classList.remove('d-none');
            } else {
                heightCustom.classList.add('d-none');
            }
            vtfUpdateFileSizeEstimate();
        });
        heightSelect.dataset.vtfBound = true;
    }
    if (heightCustom && !heightCustom.dataset.vtfBound) {
        heightCustom.addEventListener('input', vtfUpdateFileSizeEstimate);
        heightCustom.dataset.vtfBound = true;
    }
}

// Mipmap 文件加载
function vtfSetupMipmapFileInput() {
    var mipmapFileInput = document.getElementById('vtf-mipmap-file');
    if (!mipmapFileInput || mipmapFileInput.dataset.vtfBound) return;
    
    mipmapFileInput.addEventListener('change', function(e) {
        var files = e.target.files;
        var previewContainer = document.getElementById('vtf-mipmap-preview');
        if (!previewContainer) return;
        
        previewContainer.innerHTML = '';
        
        for (var i = 0; i < files.length; i++) {
            if (files[i] && files[i].type.match('image.*')) {
                var reader = new FileReader();
                reader.onload = (function(index) {
                    return function(e) {
                        var div = document.createElement('div');
                        div.className = 'mb-2';
                        div.innerHTML = '<small class="text-muted">Mipmap ' + (index + 1) + ':</small>';
                        var img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'img-fluid rounded border';
                        img.style.maxHeight = '80px';
                        img.style.objectFit = 'contain';
                        div.appendChild(img);
                        previewContainer.appendChild(div);
                    };
                })(i);
                reader.readAsDataURL(files[i]);
            }
        }
    });
    mipmapFileInput.dataset.vtfBound = true;
}

function vtfGenerateVmtContent(shader, textureName) {
    var templates = {
        'UnlitGeneric': '"UnlitGeneric"\n' +
            '{\n' +
            '    "$basetexture" "vgui/logos/' + textureName + '"\n' +
            '    "$translucent" "1"\n' +
            '    "$ignorez" "1"\n' +
            '    "$vertexcolor" "1"\n' +
            '    "$vertexalpha" "1"\n' +
            '}',
        'LightmappedGeneric': '"LightmappedGeneric"\n' +
            '{\n' +
            '    "$basetexture" "vgui/logos/' + textureName + '"\n' +
            '    "$translucent" "1"\n' +
            '    "$vertexalpha" "1"\n' +
            '}',
        'VertexLitGeneric': '"VertexLitGeneric"\n' +
            '{\n' +
            '    "$basetexture" "vgui/logos/' + textureName + '"\n' +
            '    "$translucent" "1"\n' +
            '    "$vertexalpha" "1"\n' +
            '}',
        'Spectacle': '"UnlitGeneric"\n' +
            '{\n' +
            '    "$basetexture" "vgui/logos/' + textureName + '"\n' +
            '    "$translucent" "1"\n' +
            '    "$vertexalpha" "1"\n' +
            '    "$nocull" "1"\n' +
            '}'
    };
    return templates[shader] || templates['UnlitGeneric'];
}

function vtfUpdatePreview() {
    var shader = document.getElementById('vmt-shader')?.value || 'UnlitGeneric';
    var filename = document.getElementById('vtf-filename')?.value || 'texture';
    var el = document.getElementById('vmt-preview');
    if (el) el.textContent = vtfGenerateVmtContent(shader, filename);
    
    // 更新文件大小估算
    vtfUpdateFileSizeEstimate();
}

function vtfUpdateFileSizeEstimate() {
    if (typeof getEstFileSize !== 'function') return;

    var previewImg = document.getElementById('vtf-preview-img');
    var formatValue = parseInt(document.getElementById('vtf-format')?.value || '15');
    var widthValue = vtfGetActualSize('vtf-width', 'vtf-width-custom', 512);
    var heightValue = vtfGetActualSize('vtf-height', 'vtf-height-custom', 512);
    var mipmapsEnabled = document.getElementById('vtf-mipmaps')?.checked !== false;

    if (!previewImg || !previewImg.naturalWidth) return;

    var imgWidth = previewImg.naturalWidth;
    var imgHeight = previewImg.naturalHeight;

    // 保存当前全局状态（避免估算污染实际转换）
    var savedOutputType = outputType;
    var savedWidth = width;
    var savedHeight = height;
    var savedHasMipmaps = hasMipmaps;
    var savedFrameCount = frameCount;
    var savedShortened = shortened;

    // 临时设置全局变量用于估算
    outputType = formatValue;
    width = widthValue === 'auto' ? imgWidth : widthValue;
    height = heightValue === 'auto' ? imgHeight : heightValue;
    hasMipmaps = mipmapsEnabled;
    frameCount = 1;
    shortened = false;

    // 同步 shim 中的 mipmaps 状态，确保 getEstFileSize 能读到正确值
    var shimMipCheck = document.getElementById('mipmapsCheck');
    if (shimMipCheck) shimMipCheck.checked = mipmapsEnabled;

    var estimatedSize = getEstFileSize(mipmapsEnabled);

    // 恢复全局状态
    outputType = savedOutputType;
    width = savedWidth;
    height = savedHeight;
    hasMipmaps = savedHasMipmaps;
    frameCount = savedFrameCount;
    shortened = savedShortened;

    // 显示估算大小
    var sizeEl = document.getElementById('vtf-file-size');
    if (sizeEl) {
        var sizeKB = (estimatedSize / 1024).toFixed(1);
        var sizeMB = (estimatedSize / (1024 * 1024)).toFixed(2);
        var colorClass = estimatedSize / 1024 <= 512 ? 'text-success' : 'text-danger';
        sizeEl.innerHTML = '<strong>估算大小:</strong> <span class="' + colorClass + '">' + sizeKB + ' KB</span> (' + sizeMB + ' MB)';
        sizeEl.className = 'alert alert-info small';
        
        // 显示分辨率信息
        if (estimatedSize / 1024 > 512) {
            sizeEl.innerHTML += '<br><span class="text-warning">⚠ 超过 512KB 限制，建议减小尺寸或使用压缩格式</span>';
        }
    }
}

function vtfResizeImage(img, targetWidth, targetHeight) {
    return new Promise(function(resolve) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        
        var w = targetWidth === 'auto' ? (img.naturalWidth || img.width) : parseInt(targetWidth);
        var h = targetHeight === 'auto' ? (img.naturalHeight || img.height) : parseInt(targetHeight);
        
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas);
    });
}

// 核心转换函数 - 只做转换，不下载
function vtfConvertToVTF() {
    return new Promise(function(resolve, reject) {
        // 检查必要的库是否已加载
        if (typeof convert === 'undefined' || typeof createVTFData === 'undefined') {
            reject(new Error('VTF 转换器未加载，请刷新页面'));
            return;
        }

        var previewImg = document.getElementById('vtf-preview-img');
        var formatStr = document.getElementById('vtf-format')?.value || '15';
        var targetWidth = vtfGetActualSize('vtf-width', 'vtf-width-custom', 512);
        var targetHeight = vtfGetActualSize('vtf-height', 'vtf-height-custom', 512);
        var enableMipmaps = document.getElementById('vtf-mipmaps')?.checked !== false;
        var filename = document.getElementById('vtf-filename')?.value || 'spray';

        // ★ 同步我们 UI 的值到 vtf.js 期望的原始 DOM shim 元素
        vtfSyncShimValues();

        // 设置格式 (vtf.js 使用 outputType 全局变量)
        outputType = parseInt(formatStr) || 15;

        // 读取用户选择的实际值（用于确认同步后的值）
        var samplingVal = document.getElementById('sampling').value;
        var qualityVal = document.getElementById('dxtquality').value;
        var ditherVal = document.getElementById('ditherCheck').checked;

        // 创建图像并加载
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            try {
                // 计算实际尺寸
                var w = targetWidth === 'auto' ? (img.naturalWidth || img.width) : parseInt(targetWidth);
                var h = targetHeight === 'auto' ? (img.naturalHeight || img.height) : parseInt(targetHeight);
                
                // 更新全局变量
                width = w;
                height = h;
                frameCount = 1;
                currFrame = 0;

                // 创建主画布并绘制图像
                var canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                var ctx = canvas.getContext('2d');

                // 获取 rescale 选项
                var rescale = document.getElementById('vtf-rescale')?.checked !== false;
                
                if (rescale) {
                    var scale = Math.min(w / img.width, h / img.height);
                    var drawW = img.width * scale;
                    var drawH = img.height * scale;
                    var offsetX = (w - drawW) / 2;
                    var offsetY = (h - drawH) / 2;
                    ctx.clearRect(0, 0, w, h);
                    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
                } else {
                    ctx.drawImage(img, 0, 0, w, h);
                }

                // 设置 frames 数组（模拟 vtf.js 文件加载后的状态）
                frames = [[]];
                frames[0] = [canvas];

                // 创建 mipmap canvas 并绑定到全局
                window.mipmaps = [document.createElement('canvas')];
                mipmaps = window.mipmaps;
                window.mipmaps[0].width = w;
                window.mipmaps[0].height = h;
                var mipCtx = window.mipmaps[0].getContext('2d');
                mipCtx.drawImage(canvas, 0, 0);

                // ★ 设置 shim preview canvas 的尺寸（vtf.js 的 generatePreview 需要）
                var shimPreview = document.getElementById('preview');
                if (shimPreview) {
                    shimPreview.width = w;
                    shimPreview.height = h;
                }

                // ★ 设置 shim contentWrapper 的尺寸
                var shimCW = document.getElementById('contentWrapper');
                if (shimCW) {
                    shimCW.style.width = w + 'px';
                    shimCW.style.height = h + 'px';
                }

                // ★ 清空 shim mipmaps div（上次转换的残留）
                var shimMipDiv = document.getElementById('mipmaps');
                if (shimMipDiv) shimMipDiv.innerHTML = '';

                // 重置所有全局变量（避免上次转换的残留值）
                valueTable = [];
                alphaValueTable = [];
                alphaLookupTable = [];
                outputImage = [];
                blockCount = 0;
                blockPosition = 0;
                converted = false;
                shortened = false;
                autores = false;
                colorTable = [];
                pixelTable = [];
                mipmapCount = 0;
                hasMipmaps = enableMipmaps;

                // ★ 同步 shim 中的 mipmaps 复选框状态
                var shimMipCheck = document.getElementById('mipmapsCheck');
                if (shimMipCheck) shimMipCheck.checked = enableMipmaps;

                // ★ 同步 shim 中的 rescale 复选框状态
                var shimRescale = document.getElementById('rescaleCheck');
                if (shimRescale) shimRescale.checked = rescale;

                // ★ 调用 vtf.js 的 convert() 进行实际转换
                convert();

                // 检查转换是否成功
                if (converted) {
                    var vtfData = createVTFData();
                    resolve({
                        vtfData: vtfData,
                        filename: filename
                    });
                } else {
                    reject(new Error('VTF转换失败：未知错误'));
                }
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = function() {
            reject(new Error('图片加载失败，请检查图片地址是否可访问'));
        };
        img.src = previewImg.src;
    });
}

function vtfDownloadFile(data, filename) {
    var blob = new Blob([data], { type: 'application/octet-stream' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showVtfConverterModal(imageSrc, fileName) {
    vtfCurrentImageSrc = imageSrc;
    vtfCurrentFileName = fileName || 'texture';
    vtfConvertedData = null;  // 重置转换状态

    var filenameInput = document.getElementById('vtf-filename');
    if (filenameInput) filenameInput.value = vtfCurrentFileName.replace(/\.[^/.]+$/, '');

    var previewImg = document.getElementById('vtf-preview-img');
    if (previewImg) {
        previewImg.src = imageSrc;
        previewImg.onload = function() {
            var infoEl = document.getElementById('vtf-image-info');
            if (infoEl) {
                var w = this.naturalWidth || this.width;
                var h = this.naturalHeight || this.height;
                var pow2Info = '';
                if (vtfIsPowerOf2(w) && vtfIsPowerOf2(h)) {
                    pow2Info = '<br><span class="text-success">✓ 符合 2 的幂次方要求</span>';
                } else {
                    pow2Info = '<br><span class="text-warning">⚠ 建议调整为 2 的幂次方尺寸 (如 512x512, 1024x1024)</span>';
                }
                infoEl.innerHTML = '尺寸: ' + w + ' x ' + h + pow2Info;
            }
            // 图片加载完成后更新文件大小估算
            vtfUpdateFileSizeEstimate();
        };
    }

    // 重置下载按钮状态
    var downloadBtn = document.getElementById('btn-download-vtf');
    if (downloadBtn) downloadBtn.disabled = true;

    // 重置状态显示
    var statusEl = document.getElementById('vtf-conversion-status');
    if (statusEl) statusEl.textContent = '就绪';

    vtfUpdatePreview();

    var modalEl = document.getElementById('modal-vtf-converter');
    if (modalEl) {
        // 使用原生方式显示模态框，避免依赖bootstrap对象
        modalEl.style.display = 'block';
        modalEl.classList.add('show');
        modalEl.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        // 添加背景遮罩
        var backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'vtf-modal-backdrop';
        document.body.appendChild(backdrop);
        
        // 点击背景关闭模态框
        backdrop.addEventListener('click', function() {
            modalEl.style.display = 'none';
            modalEl.classList.remove('show');
            modalEl.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
            document.body.removeChild(backdrop);
        });
        
        // ESC键关闭模态框
        var escHandler = function(e) {
            if (e.key === 'Escape') {
                modalEl.style.display = 'none';
                modalEl.classList.remove('show');
                modalEl.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('modal-open');
                document.body.removeChild(backdrop);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
}

function vtfSetupEventListeners() {
    // 初始化自定义尺寸输入框
    vtfInitCustomSizeInputs();
    
    // 初始化 mipmap 文件输入
    vtfSetupMipmapFileInput();

    // 转换按钮 - 先转换，不下载
    var convertBtn = document.getElementById('btn-convert-vtf');
    if (convertBtn && !convertBtn.dataset.vtfBound) {
        convertBtn.addEventListener('click', function() {
            var progressEl = document.getElementById('vtf-progress');
            var statusEl = document.getElementById('vtf-conversion-status');
            var downloadBtn = document.getElementById('btn-download-vtf');
            
            if (progressEl) progressEl.classList.remove('d-none');
            if (statusEl) statusEl.textContent = '正在转换...';
            if (downloadBtn) downloadBtn.disabled = true;

            vtfConvertToVTF().then(function(result) {
                vtfConvertedData = result;  // 存储转换结果
            if (statusEl) statusEl.textContent = '✓ 转换完成，可以保存';
                if (statusEl) statusEl.className = 'text-end text-success small me-auto';
                if (downloadBtn) downloadBtn.disabled = false;
            }).catch(function(e) {
                console.error('VTF 转换失败:', e);
                if (statusEl) statusEl.textContent = '✗ 转换失败: ' + e.message;
                if (statusEl) statusEl.className = 'text-end text-danger small me-auto';
                if (typeof tablerCommon !== 'undefined') {
                    tablerCommon.alertDanger('VTF 转换失败: ' + e.message);
                }
            }).finally(function() {
                if (progressEl) progressEl.classList.add('d-none');
            });
        });
        convertBtn.dataset.vtfBound = true;
    }

    // 保存 VTF 按钮 - 使用已转换的数据
    var vtfDownloadBtn = document.getElementById('btn-download-vtf');
    if (vtfDownloadBtn && !vtfDownloadBtn.dataset.vtfBound) {
        vtfDownloadBtn.addEventListener('click', function() {
            if (vtfConvertedData && vtfConvertedData.vtfData) {
                // 已经有转换好的数据，直接下载
                vtfDownloadFile(vtfConvertedData.vtfData, vtfConvertedData.filename + '.vtf');
            } else {
                // 没有转换数据，先转换再下载
                var progressEl = document.getElementById('vtf-progress');
                var statusEl = document.getElementById('vtf-conversion-status');
                
                if (progressEl) progressEl.classList.remove('d-none');
                if (statusEl) statusEl.textContent = '正在转换...';

                vtfConvertToVTF().then(function(result) {
                    vtfConvertedData = result;
                    vtfDownloadFile(result.vtfData, result.filename + '.vtf');
                    if (statusEl) statusEl.textContent = '✓ 已保存';
                    if (statusEl) statusEl.className = 'text-end text-success small me-auto';
                }).catch(function(e) {
                    console.error('VTF 转换失败:', e);
                    if (statusEl) statusEl.textContent = '✗ 转换失败';
                    if (typeof tablerCommon !== 'undefined') {
                        tablerCommon.alertDanger('VTF 转换失败: ' + e.message);
                    }
                }).finally(function() {
                    if (progressEl) progressEl.classList.add('d-none');
                });
            }
        });
        vtfDownloadBtn.dataset.vtfBound = true;
    }

    // 保存 VMT 按钮
    var vmtDownloadBtn = document.getElementById('btn-download-vmt');
    if (vmtDownloadBtn && !vmtDownloadBtn.dataset.vtfBound) {
        vmtDownloadBtn.addEventListener('click', function() {
            var shader = document.getElementById('vmt-shader')?.value || 'UnlitGeneric';
            var filename = document.getElementById('vtf-filename')?.value || 'texture';
            var vmtContent = vtfGenerateVmtContent(shader, filename);
            vtfDownloadFile(new TextEncoder().encode(vmtContent), filename + '.vmt');
        });
        vmtDownloadBtn.dataset.vtfBound = true;
    }

    // shader 和 filename 变化时更新预览
    var shaderSelect = document.getElementById('vmt-shader');
    if (shaderSelect && !shaderSelect.dataset.vtfBound) {
        shaderSelect.addEventListener('change', vtfUpdatePreview);
        shaderSelect.dataset.vtfBound = true;
    }

    var filenameInput = document.getElementById('vtf-filename');
    if (filenameInput && !filenameInput.dataset.vtfBound) {
        filenameInput.addEventListener('input', vtfUpdatePreview);
        filenameInput.dataset.vtfBound = true;
    }

    // 格式变化时更新文件大小估算
    var formatSelect = document.getElementById('vtf-format');
    if (formatSelect && !formatSelect.dataset.vtfBound) {
        formatSelect.addEventListener('change', function() {
            // 更新 outputType 全局变量（select value 是数字字符串）
            outputType = parseInt(this.value) || 15;
            vtfUpdateFileSizeEstimate();
        });
        formatSelect.dataset.vtfBound = true;
    }

    // mipmaps 变化时更新
    var mipmapsCheckbox = document.getElementById('vtf-mipmaps');
    if (mipmapsCheckbox && !mipmapsCheckbox.dataset.vtfBound) {
        mipmapsCheckbox.addEventListener('change', vtfUpdateFileSizeEstimate);
        mipmapsCheckbox.dataset.vtfBound = true;
    }

    // rescale 变化时更新
    var rescaleCheckbox = document.getElementById('vtf-rescale');
    if (rescaleCheckbox && !rescaleCheckbox.dataset.vtfBound) {
        rescaleCheckbox.addEventListener('change', vtfUpdateFileSizeEstimate);
    }
}

// 在 DOMContentLoaded 后初始化 VTF 事件监听
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        vtfSetupEventListeners();
    }, 500);
});


