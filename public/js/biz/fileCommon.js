const apiUrl = Common.server.API_URL


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
    // 鍦ㄨ繖閲岀紪鍐欎綘鐨勪唬鐮佹潵澶勭悊绐楀彛澶у皬鍙樺寲
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

function action(targetId, actionEvent, currentTarget) {
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
        var modal = new bootstrap.Modal(videoModal);

        if (window._videoPlayer) {
            window._videoPlayer.dispose();
            window._videoPlayer = null;
        }

        modal.show();

        videoModal.addEventListener('shown.bs.modal', function() {
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
        // 判断浏览器是否支�?HLS
        if (Hls.isSupported()) {
            var video = document.getElementById('video');
            var hls = new Hls();

            // 绑定到视频播放器
            hls.loadSource(`http://ip:8080/static-file/cache/m3u8/${targetId}/${targetId}.m3u8`);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                console.log('Manifest parsed, starting playback');
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            //  如果浏览器原生支�?HLS (�?Safari)
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
                                <img src="${apiUrl + (item.type?.startsWith("video") ? url + '.jpg' : url)}" class="card-img-top"   >
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
                                            <a class="text-secondary heart-btn" target-id="${item.id}" >
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

    // Destroy old player on modal hidden
    videoModalEl.addEventListener('hidden.bs.modal', function() {
        if (window._videoPlayer) {
            window._videoPlayer.dispose();
            window._videoPlayer = null;
        }
    });

    videoModalEl.addEventListener('shown.bs.modal', function() {
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
                    btn.className = 'vjs-control vjs-button seek-btn';
                    btn.textContent = label;
                    btn.style.cursor = 'pointer';
                    btn.style.display = 'flex';
                    btn.style.alignItems = 'center';
                    btn.style.justifyContent = 'center';
                    btn.style.color = '#fff';
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

                    function makeCtrlBtn(iconSvg, label, onClick) {
                        var b = document.createElement('div');
                        b.className = 'vjs-control vjs-button vjs-ctrl-btn';
                        b.style.cssText = 'display:inline-flex!important;align-items:center;padding:6px 10px!important;font-size:13px!important;color:#fff!important;cursor:pointer!important;border:none!important;border-radius:6px!important;background:rgba(43,51,63,0.85)!important;transition:all 0.15s ease!important;gap:4px!important;user-select:none!important';
                        b.innerHTML = iconSvg + '<span style="font-size:12px;line-height:1">' + label + '</span>';
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
                            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span style="font-size:12px;line-height:1">暂停</span>';
                        });
                        window._videoPlayer.on('pause', function() {
                            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg><span style="font-size:12px;line-height:1">播放</span>';
                        });
                        customControls.appendChild(playBtn);
                    }

                    // --- CurrentTimeDisplay + DurationDisplay ---
                    var ctDiv = document.createElement('div');
                    ctDiv.className = 'vjs-control vjs-button vjs-ctrl-btn';
                    ctDiv.style.cssText = 'display:inline-flex!important;align-items:center;padding:6px 8px!important;font-size:13px!important;color:#fff!important;cursor:default!important;border:none!important;border-radius:6px!important;background:rgba(43,51,63,0.85)!important;user-select:none!important;min-width:52px;justify-content:center';
                    ctDiv.innerHTML = '<span>00:00</span>';
                    customControls.appendChild(ctDiv);

                    var sep1 = document.createElement('span');
                    sep1.textContent = '/';
                    sep1.style.cssText = 'color:#888;font-size:13px;padding:0 2px;user-select:none';
                    customControls.appendChild(sep1);

                    var durDiv = document.createElement('div');
                    durDiv.className = 'vjs-control vjs-button vjs-ctrl-btn';
                    durDiv.style.cssText = 'display:inline-flex!important;align-items:center;padding:6px 8px!important;font-size:13px!important;color:#fff!important;cursor:default!important;border:none!important;border-radius:6px!important;background:rgba(43,51,63,0.85)!important;user-select:none!important;min-width:52px;justify-content:center';
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
                    customControls.appendChild(progWrap);

                    // --- Volume ---
                    var volWrap = document.createElement('div');
                    volWrap.style.cssText = 'display:inline-flex!important;align-items:center;gap:4px;background:rgba(43,51,63,0.85);border-radius:6px;padding:0 8px;height:30px';
                    var volBtn = document.createElement('div');
                    volBtn.className = 'vjs-control vjs-button vjs-ctrl-btn';
                    volBtn.style.cssText = 'display:inline-flex!important;align-items:center;padding:0!important;font-size:13px!important;color:#fff!important;cursor:pointer!important;border:none!important;background:none!important;gap:4px!important;user-select:none!important';
                    volBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" class="vol-path"/></svg><span style="font-size:12px;line-height:1;min-width:24px">音量</span>';
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
                    rateBtn.className = 'vjs-control vjs-button vjs-ctrl-btn';
                    rateBtn.style.cssText = 'display:inline-flex!important;align-items:center;padding:6px 10px!important;font-size:13px!important;color:#fff!important;cursor:pointer!important;border:none!important;border-radius:6px!important;background:rgba(43,51,63,0.85)!important;transition:all 0.15s ease!important;gap:4px!important;user-select:none!important';
                    rateBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span style="font-size:12px;line-height:1">' + currentRate + 'x</span>';
                    rateBtnWrap.appendChild(rateBtn);
                    var rateMenu = document.createElement('div');
                    rateMenu.className = 'vjs-ctrl-rate-menu';
                    rateMenu.style.cssText = 'display:none;position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:6px;background:rgba(30,30,30,0.97);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:6px 0;min-width:90px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.5);text-align:center';
                    rates.forEach(function(r) {
                        var item = document.createElement('div');
                        item.className = 'vjs-ctrl-rate-item';
                        item.style.cssText = 'padding:7px 14px;font-size:13px;color:#ccc;cursor:pointer;border-radius:4px;margin:2px 6px;transition:background 0.15s';
                        item.textContent = r + 'x';
                        if (r === currentRate) { item.style.color = '#409fff'; item.style.fontWeight = 'bold'; }
                        item.addEventListener('click', function(e) {
                            e.stopPropagation();
                            window._videoPlayer.playbackRate(r);
                            rateMenu.querySelectorAll('.vjs-ctrl-rate-item').forEach(function(i) { i.style.color = '#ccc'; i.style.fontWeight = 'normal'; });
                            item.style.color = '#409fff';
                            item.style.fontWeight = 'bold';
                            rateBtn.querySelector('span').textContent = r + 'x';
                            rateMenu.style.display = 'none';
                        });
                        item.addEventListener('mouseenter', function() { item.style.background = 'rgba(255,255,255,0.08)'; item.style.color = '#fff'; });
                        item.addEventListener('mouseleave', function() {
                            item.style.background = '';
                            item.style.color = (r === window._videoPlayer.playbackRate()) ? '#409fff' : '#ccc';
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
                    customControls.appendChild(rateBtnWrap);

                    // --- PictureInPicture ---
                    var pipToggle = controlBar.getChild('PictureInPictureToggle');
                    if (pipToggle) {
                        var pipBtn = makeCtrlBtn(
                            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><rect x="12" y="9" width="8" height="6" rx="1"/></svg>',
                            'PiP',
                            function() { pipToggle.handleClick(); }
                        );
                        customControls.appendChild(pipBtn);
                    }

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
                        customControls.appendChild(fsBtn);
                    }

                    // --- 卤10s ---
                    customControls.appendChild(addSeekBtn(-10, '-10'));
                    customControls.appendChild(addSeekBtn(10, '+10'));

                    // --- start/end time capture ---
                    var btnSetStart = document.getElementById('btn-set-start');
                    var btnSetEnd = document.getElementById('btn-set-end');
                    var inputStart = document.getElementById('video-input-1');
                    var inputEnd = document.getElementById('video-input-2');
                    if (inputStart) inputStart.value = '';
                    if (inputEnd) inputEnd.value = '';
                    if (btnSetStart && inputStart) {
                        btnSetStart.addEventListener('click', function() {
                            var t = window._videoPlayer.currentTime() || 0;
                            inputStart.value = formatTime(t, false);
                        });
                    }
                    if (btnSetEnd && inputEnd) {
                        btnSetEnd.addEventListener('click', function() {
                            var t = window._videoPlayer.currentTime() || 0;
                            inputEnd.value = formatTime(t, false);
                        });
                    }

                    console.log('[video] all default control buttons added to footer');
                } else {
                    console.log('[video] customControls NOT found');
                }
            });
            window._videoPlayer.play();
        }
    });
}




