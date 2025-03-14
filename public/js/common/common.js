var server = {
    API_URL: "http://192.168.10.53:8080",
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
            if (obj.hasOwnProperty(key)) { 
                var element = form.elements[key]
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