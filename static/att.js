let imageShow=0;
let img;

function getContent(){
    id = window.location.pathname.split('/')[2]
    fetch(`/api/attraction/${id}`)
      .then(function(response){
          return response.json();
      })
      .then(function(json){
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
      })
}




window.onload = function () {
    getContent();

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

    if(document.querySelector('input[name="time"]')){
        let price_span = document.getElementById('price')
        document.querySelectorAll('input[name="time"]').forEach((elem) => {
            elem.addEventListener("click", function(event){
                let price = (elem.value=='上半天')? '新台幣2000元':'新台幣2500元';
                price_span.textContent = price;
            });
        });
    }
    document.getElementById('right_slider').addEventListener('click',function(){
        let image = document.getElementById('images');
        let btn = document.getElementById('right_btn');
        imageShow++;
        if(imageShow>=img.length){
            imageShow--;
            return
        }
        image.src = img[imageShow];
    })
    document.getElementById('left_slider').addEventListener('click',function(){
        let image = document.getElementById('images');
        let btn = document.getElementById('left_btn');
        if(imageShow<=0){
            return
        }
        imageShow--;
        image.src = img[imageShow];
    })
}



