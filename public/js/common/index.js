function menu_build(apiUrl) {
    var elements = document.querySelectorAll('[target-link]');
    elements.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();

            document.getElementById("user-profile-picture")?.classList.remove("show")
            document.getElementById("navbar-menu-btn")?.click()

            let link = item.getAttribute("target-link")
            console.log(link)
            var main = document.getElementById('index-main-iframe');
            //console.log(main)
            if (main && link) {
                link = link === '/' ? '/templates/index/home.html' : link
                link = link.includes("templates") ? link : "/templates/"+link
                console.log(link)
                main.src = link
                elements.forEach(o => o.parentElement.classList.remove('active'));
                item.parentElement.classList.add("active");
            }

            let layout_link = item.getAttribute("layout-link")
            if (layout_link) {
                console.log(layout_link)
                layout_link = layout_link.includes("templates") ? layout_link : "/templates/index/" + layout_link
                window.location.href = layout_link;
            }

            //dropdown-menu
            var menus = document.querySelectorAll('.dropdown-menu');
            if (menus) {
                menus.forEach(it => {
                    if (it.parentNode.children[0] && (it.parentNode.children[0] != item)) {
                        it.classList.remove("show")
                    }
                })
            }


        }, false)

    })
}
function load_menu(apiUrl) {
    axios
        .get(apiUrl + '/api/rest/v1/menu/tree')
        .then(response => {
            var ret = response.data;
            console.log(ret)
            ret.data.forEach(item => {


                var children = item.children;
                if (children && children.length > 0) {

                    let chunkSize = children.length / item.childrenLine;
                    //console.log(item.name + ' children chunkSize = ' + chunkSize)
                    let chunks = [];
                    for (let i = 0; i < children.length; i += chunkSize) {
                        chunks.push(children.slice(i, i + chunkSize));
                    }
                    //console.log(chunks);

                    var children_html = ``;
                    chunks.forEach(arr => {
                        children_html += `
                                    <div class="dropdown-menu-column">
                                    `
                        arr.forEach(item => {
                            children_html += `
                                        <a class="dropdown-item" href="` + item.linkUrl + `">
                                            ` + item.name + `
                                        </a>
                                    `
                        })
                        children_html += `
                                    </div>
                                `

                    })
                    sys_nav.innerHTML += `
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#navbar-base" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="true">
                                        ` + (item.icon ? item.icon : ``) + `
                                        <span class="nav-link-title"> ` + item.name + ` </span>
                                        <div class="dropdown-menu">
                                            <div class="dropdown-menu-columns">` + children_html + `</div>
                                        </div>
                                    </a>
                                </li>
                            `

                } else {
                    sys_nav.innerHTML += `
                            <li class="nav-item ` + (item.isActive ? ` active ` : ``) + `">
                                <a class="nav-link" target-link="` + item.linkUrl + `" href="#">
                                    ` + (item.icon ? item.icon : ``) + `
                                    <span class="nav-link-title">` + item.name + `</span>
                                </a>
                            </li>
                            `
                }


            })

            menu_build()
        })
        .catch(error => {
            console.log(error)
        })
}

function load_menu_base(apiUrl) {
    axios
        .get(apiUrl + '/api/rest/v1/menu/tree/base')
        .then(response => {
            var ret = response.data;
            console.log(ret)
            ret.data.forEach(item => {
                document.getElementById("base-nav").innerHTML += item.html
            })

            menu_build()
        })
        .catch(error => {
            console.log(error)
        })
}

function load_menu_sys(apiUrl){

}