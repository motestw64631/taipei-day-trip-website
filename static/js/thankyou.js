let nextPage = 0;
var timeout;
let searchKeyword;
let message;
let user = null;




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




//login check
getUser().then(() => {
    if (user) {
        document.getElementById('logout').style.display = 'inline';
        document.getElementById('toBooking').addEventListener('click',function(){
            window.location.href = "/booking";
        });
        let searchParams = new URLSearchParams(window.location.search);
        let param = searchParams.get('number');
        document.getElementById('number').text=param;
    }else{
        location.href = '/'
    }
})




//event 
document.getElementById('title').addEventListener('click', function () {
    window.location.href = "/";
});
document.getElementById('logout').addEventListener('click', function () {
    logOut().then(() => location.reload());
});

//當登入視窗開啟,偵測點擊到外部的事件已關閉登入視窗




