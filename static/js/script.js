let nextPage = 0;
var timeout;
let searchKeyword;


function loadImages(page, keyword = searchKeyword) {
    let contentBox = document.getElementById('contentBox');
    let url = (keyword == undefined) ? `/api/attractions?page=${page}` : `http://localhost:3000/api/attractions?page=${page}&keyword=${keyword}`;
    fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (myJson) {
            if (myJson['data'].length == 0) {
                contentBox.textContent = '搜尋無結果'
                return
            }
            for (let i = 0; i < myJson['data'].length; i++) {
                let content = document.createElement('div');
                content.className = 'imgOut';
                let img = document.createElement('img');
                let text = document.createElement('div');
                let desc = document.createElement('div');
                let desc_l = document.createElement('div');
                let desc_r = document.createElement('div');
                img.className = 'attImage';
                desc.className = 'desc';
                desc_l.className = 'desc_l';
                desc_r.className = 'desc_r';
                let hId = myJson['data'][i]['id'];
                desc_l.textContent = myJson['data'][i]['mrt'];
                desc_r.textContent = myJson['data'][i]['category'];
                text.textContent = myJson['data'][i]['name'];
                desc.appendChild(desc_l);
                desc.appendChild(desc_r);
                text.className = 'attName';
                img.src = myJson['data'][i]['img'][0];
                img.setAttribute('width', 268);
                img.setAttribute('height', 160);
                content.appendChild(img);
                content.appendChild(text);
                content.appendChild(desc);
                contentBox.appendChild(content);
                nextPage = myJson['nextPage'];
                content.addEventListener('click',function(){
                    window.location.href = `/attraction/${hId}`
                })
            }
            let childCount = document.getElementById("contentBox").childElementCount;
            if ((childCount % 4) != 0) {
                for (i = 0; i < 4 - (childCount % 4); i++) {
                    let content = document.createElement('div');
                    content.className = 'imgOut_psu';
                    contentBox.appendChild(content);
                }
            };
        })
}


function loadImagesbysearch() {
    searchKeyword = document.getElementById('search').value;
    var div = document.getElementById('contentBox');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    loadImages(0, keyword = searchKeyword);
}


window.onload = function () {
    clearTimeout(timeout)
    timeout = setTimeout(function () {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight * 0.95) {
            loadImages(0);;
        };
    }, 150)
    let loginDiv = document.getElementById('popupcontent');
    let clone = loginDiv.cloneNode(true);
    window.addEventListener('scroll', function () {
        if (nextPage != null) {
            clearTimeout(timeout)
            timeout = setTimeout(function () {
                if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight * 0.95) {
                    loadImages(nextPage);
                };
            }, 150);
        }
    })
    document.getElementById('title').addEventListener('click',function(){
        window.location.href = "/";
    })
    document.getElementById('popbtn').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'flex';
    });
    document.getElementById('close').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'none';
    })
    document.getElementById('close_2').addEventListener('click', function () {
        document.getElementById('popup_2').style.display = 'none';
    })
    document.getElementById('switchTosign').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('popup_2').style.display = 'flex';
    })
    document.getElementById('switchTologin').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'flex';
        document.getElementById('popup_2').style.display = 'none';
    })
    document.getElementById('login_button').addEventListener('click', function () {
        let email = document.getElementById('login_email').value;
        let password = document.getElementById('login_password').value;
        console.log(`${email},${password}`)
    })
    document.getElementById('sign_button').addEventListener('click', function () {
        let name = document.getElementById('sign_name').value;
        let email = document.getElementById('sign_email').value;
        let password = document.getElementById('sign_password').value;
        console.log(`${name},${email},${password}`)
    })
}



