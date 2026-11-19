const $ = s => document.querySelector(s),
  $$ = s => [...document.querySelectorAll(s)];
const hdr = $('#top');
$('#yr').textContent = new Date().getFullYear();

// header + mobile menu
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 30), {
  passive: true
});
$('#burger').onclick = () => hdr.classList.toggle('open');
$$('nav a').forEach(a => a.addEventListener('click', () => hdr.classList.remove('open')));

// active nav link
const links = $$('nav a');
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
}), {
  rootMargin: '-45% 0px -50% 0px'
});
$$('main,section[id]').forEach(s => secObs.observe(s));

// scroll reveal
const rvObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    rvObs.unobserve(e.target)
  }
}), {
  threshold: .15
});
$$('.rv').forEach(el => rvObs.observe(el));

// custom cursor
const cur = $('#cursor');
if (matchMedia('(hover:hover)').matches) {
  let x = 0,
    y = 0,
    cx = 0,
    cy = 0;
  addEventListener('mousemove', e => {
    x = e.clientX - 17;
    y = e.clientY - 17;
    cur.classList.add('on')
  });
  (function loop() {
    cx += (x - cx) * .18;
    cy += (y - cy) * .18;
    cur.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(loop)
  })();
  document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a,button')));
}

// hero parallax
const stage = $('#stage');
stage.parentElement.addEventListener('mousemove', e => {
  const r = stage.getBoundingClientRect(),
    nx = (e.clientX - r.left) / r.width - .5,
    ny = (e.clientY - r.top) / r.height - .5;
  $$('[data-depth]').forEach(el => {
    const d = +el.dataset.depth;
    el.style.transform = `translate(${nx*d}px,${ny*d}px)`;
  });
});

// magnetic buttons
$$('.mag').forEach(b => {
  b.addEventListener('mousemove', e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.35}px)`
  });
  b.addEventListener('mouseleave', () => b.style.transform = '');
});

// 3D tilt on cards
$$('.card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - .5,
      y = (e.clientY - r.top) / r.height - .5;
    c.style.transition = 'opacity .4s';
    c.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`
  });
  c.addEventListener('mouseleave', () => {
    c.style.transition = '';
    c.style.transform = ''
  });
});

// filters
$$('#filters button').forEach(b => b.onclick = () => {
  $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
  $$('.card').forEach(c => c.classList.toggle('hide', b.dataset.f !== 'all' && c.dataset.cat !== b.dataset.f));
});

// =====================================================
//  YOUR PROJECTS  (edit this part only)
//  1. Put your images in the folders: images/branding, images/posters, images/packaging, images/social
//  2. Add one line per project inside the matching category.
//     Example:  { src: "images/branding/nexera-logo.jpg", title: "Nexera Prints Logo", text: "Logo and brand kit" },
//  The first image in each category becomes the cover on the card.
// =====================================================
const PROJECTS = {
  "Branding": [{
      src: "Projects/ZV logo 1.png",
      title: "Personal Brand",
      text: "This is a logo for my personal brand."
    },
    {
      src: "Projects/ZV logo 2.png",
      title: "Personal Brand",
      text: "This is a logo for my personal brand."
    },
    {
      src: "Projects/Business Card.png",
      title: "Personal Brand",
      text: "This is a Business Card for my personal brand."
    },
    {
      src: "Projects/Logo 1.png",
      title: "Personal Brand",
      text: "This is a Business Card for my personal brand."
    }
    {
      src: "Projects/LOGO.png",
      title: "Logo for a Printing Business",
      text: "This is a logo i designed for one of my projects while attending a graphic design program."
    }
    {
      src: "Projects/Business card2.png",
      title: "Business Card for a printing business",
      text: "This is a Business Card i designed along with the Nexera logo for one of my projects."
    }
    {
    src: "Projects/Poster.png",
    title: "Personal Poster",
    text: "This is my personal poster for my brand which consists of services I offer."
    }
    {
    src: "Projects/Flyer.png",
    title: "Flyer for a printing Business",
    text: "This is a flyer i created for the Nexera printing business."
    }
  ],
  "Poster Design": [{
    src: "Projects/Poster.png",
    title: "Personal Poster",
    text: "This is my personal poster for my brand which consists of services I offer."
  }, ],
  "Packaging": [
    // { src: "images/packaging/pack-1.jpg", title: "Packaging name", text: "Short description" },
  ],
  "Social Media": [
    // { src: "images/social/post-1.jpg", title: "Post name", text: "Short description" },
  ]
};
const CATS = {
  "Branding": "Logos, brand identities and business cards.",
  "Poster Design": "Posters and flyers for events, brands and campaigns.",
  "Packaging": "Packaging designs made to stand out on the shelf.",
  "Social Media": "Social media posts, covers and campaign graphics."
};

// card covers: show the first project image and a project count
$$('.card').forEach(c => {
  const list = PROJECTS[c.dataset.cat] || [];
  if (!list.length) return;
  c.classList.add('has-cover');
  const img = document.createElement('img');
  img.className = 'cover';
  img.src = list[0].src;
  img.alt = list[0].title || c.dataset.cat;
  img.loading = 'lazy';
  const n = document.createElement('span');
  n.className = 'count';
  n.textContent = list.length + (list.length === 1 ? ' project' : ' projects');
  c.append(img, n);
});

// gallery
const gal = $('#gal'),
  gGrid = $('#gGrid'),
  lb = $('#lb');
let items = [],
  idx = 0;

function openGallery(cat) {
  items = PROJECTS[cat] || [];
  $('#gTitle').textContent = cat;
  $('#gDesc').textContent = CATS[cat] || '';
  $('#gCount').textContent = items.length ? items.length + (items.length === 1 ? ' project' : ' projects') : '';
  gGrid.innerHTML = '';
  if (!items.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'New work is on the way. Check back soon.';
    gGrid.append(p);
  }
  items.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'it';
    b.style.setProperty('--i', i);
    const im = document.createElement('img');
    im.src = p.src;
    im.alt = p.title || cat;
    im.loading = 'lazy';
    const cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = p.title || '';
    b.append(im, cap);
    b.onclick = () => showItem(i);
    gGrid.append(b);
  });
  gal.scrollTop = 0;
  gal.classList.add('show');
  gal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
}

function closeGallery() {
  gal.classList.remove('show');
  gal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
}

function showItem(i) {
  idx = (i + items.length) % items.length;
  const p = items[idx];
  const img = $('#lbImg');
  img.style.opacity = 0;
  img.onload = () => img.style.opacity = 1;
  img.src = p.src;
  img.alt = p.title || '';
  $('#lbTitle').textContent = p.title || '';
  $('#lbText').textContent = p.text || '';
  lb.classList.toggle('one', items.length < 2);
  lb.classList.add('show');
}
const closeLb = () => lb.classList.remove('show');

$$('.card').forEach(c => c.onclick = () => openGallery(c.dataset.cat));
$('#gClose').onclick = closeGallery;
$('#lbClose').onclick = closeLb;
$('#lbPrev').onclick = () => showItem(idx - 1);
$('#lbNext').onclick = () => showItem(idx + 1);
lb.onclick = e => {
  if (e.target === lb) closeLb();
};
addEventListener('keydown', e => {
  if (lb.classList.contains('show')) {
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showItem(idx - 1);
    if (e.key === 'ArrowRight') showItem(idx + 1);
  } else if (e.key === 'Escape') closeGallery();
});
let tx = 0;
lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, {
  passive: true
});
lb.addEventListener('touchend', e => {
  const d = e.changedTouches[0].clientX - tx;
  if (Math.abs(d) > 50) showItem(idx + (d < 0 ? 1 : -1));
});
