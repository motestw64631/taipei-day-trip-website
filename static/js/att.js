let imageShow = 0;
let img;
let bulbNum = 0;
let radioNum = 0;

console.log(bulbNum);

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
            document.getElementById(`bulb0`).checked=true
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
    document.getElementById('title').addEventListener('click', function () {
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

    if (document.querySelector('input[name="time"]')) {
        let price_span = document.getElementById('price')
        document.querySelectorAll('input[name="time"]').forEach((elem) => {
            elem.addEventListener("click", function (event) {
                let price = (elem.value == '上半天') ? '新台幣2000元' : '新台幣2500元';
                price_span.textContent = price;
            });
        });
    }
}



