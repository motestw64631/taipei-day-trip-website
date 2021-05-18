let bookInfo={}; 
let user;
//view

function initView(){
    console.log(bookInfo);
    document.getElementById('user_name').textContent=user['name'];
    document.getElementById('photo').src=bookInfo['data']['attraction']['image'];
    document.getElementById('att').textContent=bookInfo['data']['attraction']['name'];
    document.getElementById('bdate').textContent=bookInfo['data']['date'];
    document.getElementById('btime').textContent=(bookInfo['data']['time']=='afternoon')?'下午2點到晚上9點':'早上9點到下午4點';
    document.getElementById('bprice').textContent=bookInfo['data']['price'];
    document.getElementById('blocate').textContent=bookInfo['data']['attraction']['address'];
    document.getElementById('total_num').textContent=bookInfo['data']['price'];
}

function initViewNoBook(){
    let main = document.querySelector('main');
    while (main.children.length > 1) {
        main.removeChild(main.lastChild);
    }
    document.getElementById('user_name').textContent=user['name'];
    let noinfo=document.createElement('div');
    noinfo.textContent='目前沒有任何待預定的行程';
    noinfo.className='noInfo';
    main.appendChild(noinfo);
    document.querySelector('footer').style.boxShadow='0 50vh 0 50vh #757575';
    document.querySelector('footer').style.marginTop='40px';
}

//model
function getUser() {
    return fetch('/api/user')
        .then(response => response.json())
        .then((myjson) => {
            user = myjson['data'];
        })
}

function getData() {
    return fetch('/api/booking')
        .then(response => response.json())
        .then((myJson) => {
            bookInfo=myJson;
        })
}


//controller
function init() {
    getUser().then(getData).then(function(){
        bookInfo['data']?initView():initViewNoBook();
    })
}
function events(){
    document.getElementById('title').addEventListener('click', function () {
        window.location.href = "/";
    });
    document.getElementById('popbtn').addEventListener('click',function(){
        logOut();
        window.location.href = "/";
    })
    document.getElementById('delete').addEventListener('click',function(){
        deleteBooking();
        window.location.reload();
    })
    document.getElementById('toBooking').addEventListener('click',function(){
        window.location.href = "/booking";
    })
}
function logOut() {
    return fetch('/api/user', {
        method: 'DELETE'
    })
}

function deleteBooking() {
    return fetch('/api/booking', {
        method: 'DELETE'
    })
}

init()
events()