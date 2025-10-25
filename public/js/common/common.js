var server = {
    API_URL: "http://192.168.10.53:8080",
    // API_URL: "http://localhost:8080",

}

function showLoading(el, msg){
   var target = document.getElementById(el)
   var temp = document.getElementById(el).innerHTML
    target.innerHTML = `
            <div class="page page-center loading-div">
                <div class="container container-slim py-4">
                    <div class="text-center">
                        <div class="mb-3">
                            <a href="." class="navbar-brand navbar-brand-autodark"><img src="./static/logo-small.svg" height="36"
                                    alt=""></a>
                        </div>
                        <div class="text-secondary mb-3">`+(msg ? msg : 'loading......')+`</div>
                        <div class="progress progress-sm">
                            <div class="progress-bar progress-bar-indeterminate"></div>
                        </div>
                    </div>
                </div>
            </div>
   `
   return temp;
}

function formSetData(el, obj) {
    const form = document.getElementById(el); 
    if (form && obj) {
        for (let key in obj) {
            console.log(obj.hasOwnProperty(key)) 
            if (obj.hasOwnProperty(key)) { 
                var element = form.elements[key]
                console.log(key)
                console.log(form.elements['key'])
                console.log(element)
                if(element){
                    element.value = obj[key];
                } 
            }
        }
    }

}

function divideAndRound(num1, num2) {
    return Number((num1 / num2).toFixed(2));
}

function numberAdd(num1, num2) {
    return Number(num1) + Number(num2)
}

function numberSub(num1, num2) {
    return Number(num1) - Number(num2)
}

function obj2numeric(obj) {
    if (obj == null) return 0
    if (typeof obj === 'number') return obj;
    if (typeof obj === 'string') {
        obj = obj.replaceAll(',', '')
        if (obj.endsWith('%')) {
            return Number(obj.replaceAll('%', '')) / 100
        } else {
            return Number(obj)
        }
    }
    return Number(obj.toString());
}
function downloadXlsxWithPostRealUrl(url, body, callback) {

    const xhr = new XMLHttpRequest()
    xhr.open('post', url)
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = "blob";
    xhr.send(JSON.stringify(body))
    xhr.onload = function () {
        const blob = new Blob([xhr.response]);
        const a = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载连接
        a.href = href;
        var h = xhr.getAllResponseHeaders
        
        var header = xhr.getResponseHeader('Content-Disposition');
        console.log('header => ', header);
        var split = header.split(";");
        console.log('split => ', split);
        var data = split.filter(e => e.indexOf("filename") >= 0)[0].replaceAll(`"`, ``).trim();
        console.log('data => ', data, typeof data);
        var fileName = data.split("=")[1].trim();
        console.log('fileName:', fileName);
        a.download = fileName; //decodeURI(header.replace(/\s+/g, '').replace("attachment;filename*=utf-8''",""));
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); // 下载完移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
    }

    xhr.onloadend = function () {
        //console.log("end -> " + url);
        callback()
    }
}

function checkBreakpoint() {
    const breakpoints = {
        xs: 0,    // Extra small devices (portrait phones, less than 576px)
        sm: 576,  // Small devices (landscape phones, 576px and up)
        md: 768,  // Medium devices (tablets, 768px and up)
        lg: 992,  // Large devices (desktops, 992px and up)
        xl: 1200, // Extra large devices (large desktops, 1200px and up)
        xxl: 1400 // Extra extra large devices (large desktops, 1400px and up)
    };
    const currentBreakpoint = Object.entries(breakpoints).reduce((r, [key, value]) => {
        if (window.innerWidth >= value) {
            r = key;
        }
        return r;
    }, '');
    return currentBreakpoint;
}

function htmlObserver(htmlElId, callback) {
    var observer = new MutationObserver((mutations) => {
        mutations.forEach(function (mutation) {
            if ('childList' === mutation.type) {
                action_event_build(callback)
            }

        });
    });

    observer.observe(document.getElementById(htmlElId), {
        childList: true,        // 子节点的增减
        attributes: true,       // 属性的变动
        characterData: true,    // 节点内容或节点文本的变动
        subtree: true,          // 是否将观察器应用于该节点的所有后代节点
        attributeOldValue: true, // 记录变动前的属性值（attributes变动时）
        characterDataOldValue: true, // 记录变动前的数据（characterData变动时）
    });

    return observer;
}

function action_event_build(callback) {
    // 获取所有具有特定属性的元素
    var elements = document.querySelectorAll('[action-event]');
    for (let el of elements) {
        el.onclick = (evt) => {
            var currentTarget = (evt.currentTarget)
            var actionEvent = currentTarget.getAttribute("action-event")
            var targetId = currentTarget.getAttribute("target-id")
            if (!actionEvent) return;
            if (!targetId) return;
            console.log(`targetId = ${targetId}, actionEvent = ${actionEvent}`)
            callback(targetId, actionEvent, currentTarget)
        }
    }
}

function htmlContentLoaded() {
    return new Promise(resolve => {
        resolve(document.querySelectorAll('[html-modal]'));
    })
        .then(elList => {
            let arr = Array.from(elList)
                .map(item => {
                    var htmlModalValue = item.getAttribute("html-modal")
                    return fetch('/templates/modal/' + htmlModalValue + '.html')
                        .then(data => data.text())
                        .then(html => {
                            item.innerHTML = html;
                            return item;
                        });
                })
 
            return Promise.allSettled(arr)
        })
}

function elementId(id){
   return document.querySelectorAll(`[element-id="${id}"]`)
}
function element(id){
   return document.getElementById(id)
}

var tablerCommon = {
    alert: function (msg) {
        element("modal-danger-context").textContent = msg
        element("danger-btn").click();
    }
}