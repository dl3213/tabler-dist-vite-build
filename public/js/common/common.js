var Common = {
    NumberOfDecimal: 2,
    server: {   
        API_URL: "http://192.168.10.62:8080",
    },
    showLoading: (el, msg) => {
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
                        <div class="text-secondary mb-3">`+ (msg ? msg : 'loading......') + `</div>
                        <div class="progress progress-sm">
                            <div class="progress-bar progress-bar-indeterminate"></div>
                        </div>
                    </div>
                </div>
            </div>
   `
        return temp;
    },
    formSetData: (el, obj) => {
        const form = document.getElementById(el);
        if (form && obj) {
            for (let key in obj) {
                console.log(obj.hasOwnProperty(key))
                if (obj.hasOwnProperty(key)) {
                    var element = form.elements[key]
                    console.log(key)
                    console.log(form.elements['key'])
                    console.log(element)
                    if (element) {
                        element.value = obj[key];
                    }
                }
            }
        }
    },
    divideAndRound: (num1, num2) => {
        return Number((num1 / num2).toFixed(Common.NumberOfDecimal));
    },
    alertSuccess: function (msg) {
        element("modal-success-context").textContent = msg
        element("success-btn").click();
    },
    alertDanger: function (msg) {
        element("modal-danger-context").textContent = msg
        element("danger-btn").click();
    },
    elementId: function (id) {
        return document.querySelectorAll(`[element-id="${id}"]`)
    },
    decodeTemplateHtml: function (html) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    },
    templateId: function (id) {
        const element = document.querySelector(`[template-id="${id}"]`);
        if (!element) return '';
        const html = element.outerHTML;
        return Common.decodeTemplateHtml(html);
    },
    element: function (id) {
        return document.getElementById(id)
    },
    htmlElement: function (id) {
        return document.getElementById(id)
    },
    createTemplate: function (template) {
        const keys = [];
        const pattern = /\{(\w+)\}/g;
        let lastIndex = 0;
        let match;
        const parts = [];

        while ((match = pattern.exec(template)) !== null) {
            // 添加普通文本
            if (match.index > lastIndex) {
                parts.push(template.substring(lastIndex, match.index));
            }

            // 添加变量名
            keys.push(match[1]);
            parts.push(null); // 占位符，用 null 标记

            lastIndex = match.index + match[0].length;
        }

        // 添加最后一段文本
        if (lastIndex < template.length) {
            parts.push(template.substring(lastIndex));
        }

        return function (data) {
            const result = [];
            for (let i = 0; i < parts.length; i++) {
                if (parts[i] === null) {
                    const key = keys.shift();
                    result.push(data[key] !== undefined ? data[key] : '');
                } else {
                    result.push(parts[i]);
                }
            }
            return result.join('');
        };
    },
    getFormData: function (formId) {
        var elementsArray = Array.from(document.getElementById("requestForm").querySelectorAll('[name]'));
        var formDataObj = {};
        elementsArray.forEach(function (element) {
            //console.log('element name:', element.getAttribute('name'), ' value:', element.value, ' element nodeName:', element.nodeName, 'element type:', element.type);
            formDataObj[element.getAttribute('name')] = element.type == 'checkbox' ? (element.checked ? "1" : "0") : element.value;
        });
        return formDataObj;
    },
    checkBreakpoint: function () {
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
    },
}


/**
 * 字符串模板引擎 - 支持表达式
 * 将模板字符串编译为渲染函数，并缓存结果，实现快速重复渲染
 */

// 缓存编译后的渲染函数，避免重复解析
const templateCache = new Map();

/**
 * 编译模板字符串
 * @param {string} template - 包含 {expression} 的模板
 * @returns {Function} 渲染函数，接收数据对象并返回字符串
 */
function compile(template) {
  // 先把可能来自 outerHTML 的 HTML 实体解码回来，避免 &amp;&amp; 或 &quot; 等导致 JS 模板语法错误
  const decodedTemplate = Common && typeof Common.decodeTemplateHtml === 'function'
    ? Common.decodeTemplateHtml(template)
    : template;

  // 支持两种占位符语法：{expr} 和 ${expr}
  const convertedTemplate = decodedTemplate.replace(/\{(.*?)\}/g, (match, expr, offset) => {
    if (offset > 0 && decodedTemplate[offset - 1] === '$') {
      return match;
    }
    return `\${${expr.trim()}}`;
  });

  // 转义模板字面量中的特殊字符，避免原始 HTML 内容破坏 JS 模板字符串
  const escapedTemplate = convertedTemplate
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`');

  const body = `with(data) { return \`${escapedTemplate}\`; }`;
  return new Function('data', body);
}

/**
 * 渲染模板
 * @param {string} template - 模板字符串
 * @param {Object} data - 数据对象
 * @returns {string} 渲染结果
 */
function render(template, data) {
  const templateKey = Common && typeof Common.decodeTemplateHtml === 'function'
    ? Common.decodeTemplateHtml(template)
    : template;

  let fn = templateCache.get(templateKey);
  if (!fn) {
    fn = compile(template);
    templateCache.set(templateKey, fn);  // 缓存编译结果
  }
  return fn(data);
}

// 可选：暴露编译函数，便于预编译
render.compile = compile;


function showLoading(el, msg) {
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
                        <div class="text-secondary mb-3">`+ (msg ? msg : 'loading......') + `</div>
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
                if (element) {
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
            //console.log(mutation)
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

function elementId(id) {
    return document.querySelectorAll(`[element-id="${id}"]`)
}
function element(id) {
    return document.getElementById(id)
}
function htmlElement(id) {
    return document.getElementById(id)
}



var tablerCommon = {
    alert: function (msg) {
        element("modal-danger-context").textContent = msg
        element("danger-btn").click();
    },
    alertSuccess: function (msg) {
        element("modal-success-context").textContent = msg
        element("success-btn").click();
    },
    alertDanger: function (msg) {
        element("modal-danger-context").textContent = msg
        element("danger-btn").click();
    }
}


