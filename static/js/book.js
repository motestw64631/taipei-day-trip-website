let bookInfo = {};
let user;
//tapPay
TPDirect.setupSDK(20422, 'app_7Fi2UXMJtILHGttCgepAdkVADp0PhDv2c4XzeQvl9xFQyZlP7f0ajPyjqpUg', 'sandbox')
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
});

function postOrder(prime) {
    let name = document.getElementById('contract_name').value;
    let mail = document.getElementById('contract_mail').value;
    let phone = document.getElementById('contract_phone').value;
    let price = Number(document.getElementById('bprice').textContent);
    let postBody = {
        "prime": prime,
        "order": {
            "price": price,
            "trip": {
                "attraction": bookInfo['data']['attraction'],
                "date": bookInfo['data']['date'],
                "time": bookInfo['data']['time']
            },
            "contract": {
                "name": name,
                "email": mail,
                "phone": phone
            }
        }
    }
    return fetch('/api/order', {
        method: 'POST',
        body: JSON.stringify(postBody),
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
    }).then((response)=>response.json())
}

function onClick() {
    TPDirect.card.getPrime(function (result) {
        console.log(result)
        if (result.status !== 0) {
            document.getElementById('alt').textContent='請輸入正確卡號及資訊';
            console.log('getPrime 錯誤');
            return
        }
        let prime = result.card.prime;
        console.log('getPrime 成功: ' + prime)
        postOrder(prime).then((myJson)=>{
            if(myJson['payment']['status']==0){
                location.href =`/thankyou?number=${myJson['number']}`
            };
        })
        document.querySelector('main').style.display='none';
        let loading = document.createElement('img');
        loading.src='static/pic/loading.gif';
        let body = document.querySelector('body');
        body.style.textAlign='center';
        body.insertBefore(loading,document.querySelector('footer'));
    })
}

document.getElementById('book_submit').addEventListener('click', () => {
    onClick();
})


//view

function initView() {
    document.getElementById('user_name').textContent = user['name'];
    document.getElementById('photo').src = bookInfo['data']['attraction']['image'];
    document.getElementById('att').textContent = bookInfo['data']['attraction']['name'];
    document.getElementById('bdate').textContent = bookInfo['data']['date'];
    document.getElementById('btime').textContent = (bookInfo['data']['time'] == 'afternoon') ? '下午2點到晚上9點' : '早上9點到下午4點';
    document.getElementById('bprice').textContent = bookInfo['data']['price'];
    document.getElementById('blocate').textContent = bookInfo['data']['attraction']['address'];
    document.getElementById('total_num').textContent = bookInfo['data']['price'];
}

function initViewNoBook() {
    let main = document.querySelector('main');
    while (main.children.length > 1) {
        main.removeChild(main.lastChild);
    }
    document.getElementById('user_name').textContent = user['name'];
    let noinfo = document.createElement('div');
    noinfo.textContent = '目前沒有任何待預定的行程';
    noinfo.className = 'noInfo';
    main.appendChild(noinfo);
    document.querySelector('footer').style.boxShadow = '0 50vh 0 50vh #757575';
    document.querySelector('footer').style.marginTop = '40px';
}

function formNotFillAlert() {
    const message = document.createElement('div');
    message.textContent = '請輸入完表格';
    document.getElementById('book_submit_shell').insertBefore(message, document.getElementById('book_submit'));
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
            bookInfo = myJson;
        })
}

function getFormData() {
    let name = document.getElementById('contract_name').value;
    let mail = document.getElementById('contract_mail').value;
    let phone = document.getElementById('contract_phone').value;
    let card = document.getElementById('pay_number').value;
    let expired = document.getElementById('expired_time').value;
    let cvv = document.getElementById('CVV').value;
    return {
        'name': name,
        'mail': mail,
        'phone': phone,
        'card': card,
        'expired': expired,
        'cvv': cvv
    }
}



//controller
function init() {
    getUser().then(getData).then(function () {
        bookInfo['data'] ? initView() : initViewNoBook();
    })
}
function events() {
    document.getElementById('title').addEventListener('click', function () {
        window.location.href = "/";
    });
    document.getElementById('popbtn').addEventListener('click', function () {
        logOut().then(() => window.location.href = "/");
    })
    document.getElementById('delete').addEventListener('click', function () {
        deleteBooking().then(() => location.reload());
    })
    document.getElementById('toBooking').addEventListener('click', function () {
        window.location.href = "/booking";
    })
    /*
    document.getElementById('book_submit').addEventListener('click', function (action) {
        if (document.forms['contract_form'].checkValidity() && document.forms['pay_form'].checkValidity()) {
            let data = getFormData()
            console.log(data);
        } else {
            document.forms['pay_form'].reportValidity();
            document.forms['contract_form'].reportValidity();
        }
    })
    */
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