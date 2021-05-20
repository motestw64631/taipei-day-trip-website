let nextPage = 0;
var timeout;
let searchKeyword;
let message;
let user = null;

function gp_signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    fetch('/google_login', {
      method: 'POST',
      body: JSON.stringify({ 'id_token': id_token }),
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
    })
    .then((response)=>gp_signOut())
    .then(()=>location.reload())
  }

function logOut() {
    return fetch('api/user', {
        method: 'DELETE'
    })
}


function getUser() {
    return fetch('/api/user')
        .then(response => response.json())
        .then((myjson) => {
            user = myjson['data'];
        })
}

function loginUser(email, password) {
    fetch('api/user', {
        body: JSON.stringify({
            'email': email,
            'password': password
        }),
        method: 'PATCH',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (myjson) {
            let mesDiv = document.getElementById('login_message');
            mesDiv.style.paddingBottom = '10px';
            if (myjson['error']) {
                mesDiv.textContent = 'Email 或密碼錯誤';
            } else if (myjson['ok']) {
                window.location.reload();
            }
        });
}

function postUser(name, email, password) {
    fetch('api/user', {
        body: JSON.stringify({
            'name': name,
            'email': email,
            'password': password
        }),
        method: 'POST',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (myjson) {
            let mesDiv = document.getElementById('signup_message');
            mesDiv.style.paddingBottom = '10px';
            if (myjson['error']) {
                mesDiv.textContent = '已存在重複email';
            } else if (myjson['ok']) {
                mesDiv.textContent = '註冊成功';
                document.getElementById('sign_name').value='';
                document.getElementById('sign_email').value='';
                document.getElementById('sign_password').value='';
            }
        });
}


function loadImages(page, keyword = searchKeyword) {
    let contentBox = document.getElementById('contentBox');
    let url = (keyword == undefined) ? `/api/attractions?page=${page}` : `/api/attractions?page=${page}&keyword=${keyword}`;
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
                content.addEventListener('click', function () {
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
    //load main content
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
    //login check
    getUser().then(() => {
        if (user) {
            document.getElementById('logout').style.display = 'inline';
            document.getElementById('toBooking').addEventListener('click',function(){
                window.location.href = "/booking";
            })
        } else {
            document.getElementById('popbtn').style.display = 'inline';
            document.getElementById('toBooking').addEventListener('click',function(ev){
                document.getElementById('popup').style.display = 'flex';
                ev.stopPropagation(); //防止觸發點及外部事件
            })
        }
    })


    //event 
    document.getElementById('title').addEventListener('click', function () {
        window.location.href = "/";
    });
    document.getElementById('logout').addEventListener('click', function () {
        logOut();
        window.location.reload();
    });
    document.getElementById('popbtn').addEventListener('click', function (ev) {
        document.getElementById('popup').style.display = 'flex';
        ev.stopPropagation(); //防止觸發點及外部事件
    });
    document.getElementById('close').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'none';
    });
    document.getElementById('close_2').addEventListener('click', function () {
        document.getElementById('popup_2').style.display = 'none';
    });
    document.getElementById('switchTosign').addEventListener('click', function (e) {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('popup_2').style.display = 'flex';
        e.stopPropagation();
    });
    document.getElementById('switchTologin').addEventListener('click', function (e) {
        document.getElementById('popup').style.display = 'flex';
        document.getElementById('popup_2').style.display = 'none';
        e.stopPropagation();
    });
    document.getElementById('login_form').addEventListener('submit', function (evt) {
        evt.preventDefault();
        let email = document.getElementById('login_email').value;
        let password = document.getElementById('login_password').value;
        loginUser(email, password);
    });
    document.getElementById('signup_form').addEventListener('submit', function (evt) {
        evt.preventDefault();
        let name = document.getElementById('sign_name').value;
        let email = document.getElementById('sign_email').value;
        let password = document.getElementById('sign_password').value;
        postUser(name, email, password);
    });

    //當登入視窗開啟,偵測點擊到外部的事件已關閉登入視窗
    window.addEventListener('click', function (e) {
        if (document.getElementById('popup').style.display == 'flex') {
            if (!document.getElementById('popupcontent').contains(e.target)) {
                document.getElementById('popup').style.display = 'none';
            }
        } else if(document.getElementById('popup_2').style.display == 'flex'){
            if (!document.getElementById('popupcontent_2').contains(e.target)) {
                document.getElementById('popup_2').style.display = 'none';
            }
        }
    });
}



