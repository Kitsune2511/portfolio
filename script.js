// ===== Responsive scale-to-fit for the fixed 1440px Figma stage =====
function fitStage(){
  document.querySelectorAll('.stage-outer').forEach(outer=>{
    const stage = outer.querySelector('.stage');
    if(!stage) return;
    stage.style.transform = 'scale(1)';
    const naturalH = stage.scrollHeight;
    const scale = Math.min(1, window.innerWidth / 1440);
    stage.style.transform = `scale(${scale})`;
    outer.style.height = (naturalH * scale) + 'px';
  });
}
window.addEventListener('load', fitStage);
window.addEventListener('resize', fitStage);
setTimeout(fitStage, 300); // after fonts/images settle

// ===== Marquee content (home page ribbons) =====
function buildMarquee(el, words){
  const track = document.createElement('div');
  track.className = 'ribbon-track';
  const chunk = words.map(w=>`<span>${w}</span>`).join('');
  track.innerHTML = chunk + chunk; // duplicate for seamless loop
  el.appendChild(track);
}

// ===== Toolkit: wiggling pills + bouncing ball that never touches heading =====
function initToolkit(){
  const zone = document.querySelector('.toolkit-zone');
  const heading = document.querySelector('.toolkit h2');
  const ball = document.querySelector('.tool-ball');
  if(!zone || !ball) return;

  const zoneRect = () => zone.getBoundingClientRect();
  const headRect = () => heading.getBoundingClientRect();

  let x = 700, y = 40, vx = 3.4, vy = 2.8;
  const r = 17;

  function step(){
    const zr = zoneRect();
    const hr = headRect();
    // move
    x += vx; y += vy;

    // bounds of the zone (local coords)
    const maxX = zr.width - r*2;
    const maxY = zr.height - r*2;
    if(x <= 0){ x = 0; vx *= -1; }
    if(x >= maxX){ x = maxX; vx *= -1; }
    if(y <= 0){ y = 0; vy *= -1; }
    if(y >= maxY){ y = maxY; vy *= -1; }

    // keep ball out of the heading area (invisible ceiling wall)
    const ballTopAbs = zr.top + y;
    const ballBottomAbs = zr.top + y + r*2;
    const ballLeftAbs = zr.left + x;
    const ballRightAbs = zr.left + x + r*2;
    if (ballBottomAbs > hr.top && ballTopAbs < hr.bottom &&
        ballRightAbs > hr.left && ballLeftAbs < hr.right){
      // push ball back down/away from heading, reverse vertical velocity
      y = hr.bottom - zr.top + 2;
      vy = Math.abs(vy);
    }

    // collide with each tool pill
    document.querySelectorAll('.tool-pill').forEach(p=>{
      const pr = p.getBoundingClientRect();
      const bx = zr.left + x + r, by = zr.top + y + r;
      if (bx > pr.left - r && bx < pr.right + r && by > pr.top - r && by < pr.bottom + r){
        // determine which side we hit
        const overlapLeft = Math.abs(bx - pr.left);
        const overlapRight = Math.abs(pr.right - bx);
        const overlapTop = Math.abs(by - pr.top);
        const overlapBottom = Math.abs(pr.bottom - by);
        const min = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        if(min === overlapTop || min === overlapBottom){ vy *= -1; }
        else { vx *= -1; }
        // nudge away to avoid sticking
        x += vx*3; y += vy*3;
      }
    });

    ball.style.left = x + 'px';
    ball.style.top = y + 'px';
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ===== Certificate modal (marketplace page) =====
function initCertModal(){
  const modal = document.getElementById('certModal');
  if(!modal) return;
  const img = modal.querySelector('img');
  document.querySelectorAll('.cert-thumb').forEach(el=>{
    el.addEventListener('click', ()=>{
      img.src = el.dataset.full;
      modal.classList.add('open');
    });
  });
  modal.addEventListener('click', (e)=>{
    if(e.target === modal || e.target.classList.contains('cert-close')) modal.classList.remove('open');
  });
}

// ===== Yearbook page-turn (creator page) =====
function initYearbook(){
  const pages = document.querySelectorAll('.yearbook-page');
  if(!pages.length) return;
  let current = 0;
  const counter = document.getElementById('ybCounter');
  function render(){
    pages.forEach((p,i)=>{
      p.classList.toggle('flipped', i < current);
      p.style.zIndex = pages.length - Math.abs(i-current);
    });
    if(counter) counter.textContent = `${current+1} / ${pages.length}`;
  }
  document.getElementById('ybNext')?.addEventListener('click', ()=>{
    if(current < pages.length-1){ current++; render(); }
  });
  document.getElementById('ybPrev')?.addEventListener('click', ()=>{
    if(current > 0){ current--; render(); }
  });
  render();
}

// ===== Phone social-post carousel (creator page) =====
function initPhoneCarousel(){
  const slides = document.querySelectorAll('.phone-slide');
  const dots = document.querySelectorAll('.phone-dots span');
  if(!slides.length) return;
  let i = 0;
  setInterval(()=>{
    slides[i].classList.remove('active');
    dots[i]?.classList.remove('active');
    i = (i+1) % slides.length;
    slides[i].classList.add('active');
    dots[i]?.classList.add('active');
  }, 2600);
}

document.addEventListener('DOMContentLoaded', ()=>{
  initToolkit();
  initCertModal();
  initYearbook();
  initPhoneCarousel();
});
