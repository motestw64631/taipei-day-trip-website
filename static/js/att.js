let imageShow = 0;
let img;
let bulbNum = 0;
let radioNum = 0;


function postBooking(date,time,price){
    id = window.location.pathname.split('/')[2]
    return fetch('/api/booking',{
        body:JSON.stringify({
            "attractionId": Number(id),
            "date": date,
            "time": time,
            "price": Number(price)
        }),
        method:'POST',
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        }
    })
    .then(response=>response.json())
    .then(function(myJson){
        console.log(myJson)
    })
}

function logOut() {
    return fetch('/api/user', {
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
    fetch('/api/user', {
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
    fetch('/api/user', {
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

function getContent() {
    id = window.location.pathname.split('/')[2]
    fetch(`/api/attraction/${id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            let address = json['data']['address'];
            let mrt = json['data']['mrt'];
            let name = json['data']['name'];
            document.title = name;
            let transport = json['data']['transport'];
            let description = json['data']['description'];
            img = json['data']['img'];
            let category = json['data']['category'];
            let nameHolder = document.getElementById('att_title');
            nameHolder.textContent = name;
            let attMRT = document.getElementById('att_mrt');
            attMRT.textContent = `${category} at ${mrt}`
            let descriptionHolder = document.getElementById('att_desc_in');
            descriptionHolder.textContent = description;
            let locationHolder = document.getElementById('att_locate');
            locationHolder.textContent = address;
            let transportHolder = document.getElementById('att_transport');
            transportHolder.textContent = transport;
            let imageShell = document.getElementById('shell');
            let image = document.createElement('img');
            image.className = 'attImage';
            image.id = 'images';
            image.src = img[0];
            imageShell.appendChild(image);
            let light = document.getElementById('light');
            //圖片下面的燈
            img.forEach(function () {
                let bulb = document.createElement('input');
                bulb.type = 'radio';
                bulb.name = 'w';
                bulb.id = 'bulb' + bulbNum;
                bulb.disabled = true;
                bulbNum++;
                light.appendChild(bulb);
            })
        })
        .then(function () {
            document.getElementById(`bulb0`).checked = true
            document.getElementById('right_btn').addEventListener('click', function () {
                let image = document.getElementById('images');
                let btn = document.getElementById('right_btn');
                radioNum++;
                let blb = document.getElementById(`bulb${radioNum}`)
                imageShow++;
                if (imageShow >= img.length) {
                    imageShow--;
                    radioNum--;
                    return
                }
                image.src = img[imageShow];
                blb.checked = true;
                console.log(radioNum)
            })
            document.getElementById('left_btn').addEventListener('click', function () {
                let image = document.getElementById('images');
                let btn = document.getElementById('left_btn');
                if (imageShow <= 0) {
                    return
                }
                imageShow--;
                radioNum--;
                let blb = document.getElementById(`bulb${radioNum}`)
                image.src = img[imageShow];
                blb.checked = true;
                console.log(radioNum)
            })
        })
}



window.onload = function () {
    getContent();

    //login check
    getUser().then(() => {
        if (user) {
            document.getElementById('logout').style.display = 'inline';

            document.getElementById('toBooking').addEventListener('click',function(){
                window.location.href = "/booking";
            });
            document.getElementById('book_form').addEventListener('submit',function(e){
                e.preventDefault()
                let date=document.getElementById('date').value;
                let time=document.querySelector('input[name="time"]:checked').value;
                let price=document.getElementById('price').textContent.replace(/\D/g,'');
                postBooking(date,time,price);
                location.href='/booking';
            })
        } else {
            document.getElementById('popbtn').style.display = 'inline';
            document.getElementsByName('time')[0].required=false;
            document.getElementById('date').required=false;
            document.getElementById('toBooking').addEventListener('click',function(ev){
                document.getElementById('popup').style.display = 'flex';
                ev.stopPropagation(); //防止觸發點及外部事件
            })
            document.getElementById('book_form').addEventListener('submit',function(e){
                e.preventDefault()
                document.getElementById('popup').style.display = 'flex';
                e.stopPropagation();
            })
        }
    })


    document.getElementById('title').addEventListener('click', function () {
        window.location.href = "/";
    })
    document.getElementById('popbtn').addEventListener('click', function (e) {
        document.getElementById('popup').style.display = 'flex';
        e.stopPropagation();
    });
    document.getElementById('logout').addEventListener('click',function(){
        logOut();
        window.location.reload();
    });
    document.getElementById('close').addEventListener('click', function () {
        document.getElementById('popup').style.display = 'none';
    })
    document.getElementById('close_2').addEventListener('click', function () {
        document.getElementById('popup_2').style.display = 'none';
    })
    document.getElementById('switchTosign').addEventListener('click', function (e) {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('popup_2').style.display = 'flex';
        e.stopPropagation();
    })
    document.getElementById('switchTologin').addEventListener('click', function (e) {
        document.getElementById('popup').style.display = 'flex';
        document.getElementById('popup_2').style.display = 'none';
        e.stopPropagation();
    })

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



    if (document.querySelector('input[name="time"]')) {
        let price_span = document.getElementById('price')
        document.querySelectorAll('input[name="time"]').forEach((elem) => {
            elem.addEventListener("click", function (event) {
                let price = (elem.value == 'afternoon') ? '新台幣2500元' : '新台幣2000元';
                price_span.textContent = price;
            });
        });
    }

    //當登入視窗開啟,偵測點擊到外部的事件已關閉登入視窗
    window.addEventListener('mouseup', function (e) {
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



