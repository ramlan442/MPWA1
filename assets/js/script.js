// service worker
if ('serviceWorker' in navigator) {
  $(window).on('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .then(function () {
        console.log('Pendaftaran ServiceWorker berhasil');
      })
      .catch(function () {
        console.log('Pendaftaran ServiceWorker gagal');
      });
  });
} else {
  console.log('ServiceWorker belum didukung browser ini.');
}

// main scriopt
$(document).ready(() => {
  loadPages();

  //check cache
  caches
    .keys()
    .then((key) => {
      if (key.length > 1) {
        console.log('sudah ada cache dynamic');
      } else {
        $('.modal').modal().modal('open');
      }
    })
    .catch(() => console.log('error'));

  //event material
  $('.sidenav').sidenav();
});

// function load page
function loadPages() {
  // loader
  const loader = document.querySelector('.container-loader');
  loader.style.display = 'table';
  //const page dengan array
  const pages = ['home', 'nav'];

  //melakukan loop
  for (page of pages) {
    // const xhttp
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        loader.style.display = 'none';
      }

      //const cek url
      const cek = xhttp.responseURL.split('/');
      if (cek[cek.length - 1] == 'nav.html') {
        document.querySelectorAll('.homenav, .sidenav').forEach(function (elm) {
          elm.innerHTML = xhttp.responseText;
        });
      } else {
        document.querySelector('.body-content').innerHTML = xhttp.responseText;
      }

      // event klik a
      document.querySelectorAll('.homenav a, .sidenav a').forEach(function (ev) {
        ev.addEventListener('click', function (el) {
          loader.style.display = 'table';
          xhttp.open('GET', 'halaman/' + this.hash.substr(1) + '.html', true);
          xhttp.send();

          // Tutup sidenav
          var sidenav = document.querySelector('.sidenav');
          M.Sidenav.getInstance(sidenav).close();
        });
      });
    };
    xhttp.open('GET', `halaman/${page}.html`, true);
    xhttp.send();
  }
}
