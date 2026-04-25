// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX=0,mouseY=0,ringX=0,ringY=0;

document.addEventListener('mousemove',e=>{
  mouseX=e.clientX; mouseY=e.clientY;
  cursor.style.left=mouseX+'px';
  cursor.style.top=mouseY+'px';
});

function animCursor(){
  ringX+=(mouseX-ringX)*0.12;
  ringY+=(mouseY-ringY)*0.12;
  cursorRing.style.left=ringX+'px';
  cursorRing.style.top=ringY+'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a,button,.product-card,.sensory-word').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cursor.style.width='20px';cursor.style.height='20px';
    cursor.style.background='transparent';
    cursor.style.border='1px solid var(--gold)';
    cursorRing.style.width='60px';cursorRing.style.height='60px';
  });
  el.addEventListener('mouseleave',()=>{
    cursor.style.width='12px';cursor.style.height='12px';
    cursor.style.background='var(--gold)';
    cursor.style.border='none';
    cursorRing.style.width='36px';cursorRing.style.height='36px';
  });
});

// ===== PARTICLES =====
const canvas=document.getElementById('particle-canvas');
const ctx=canvas.getContext('2d');
let particles=[];

function resizeCanvas(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);

class Particle{
  constructor(){
    this.reset();
  }
  reset(){
    this.x=Math.random()*canvas.width;
    this.y=canvas.height+20;
    this.size=Math.random()*2.5+0.5;
    this.speedY=-(Math.random()*0.6+0.2);
    this.speedX=(Math.random()-0.5)*0.3;
    this.opacity=Math.random()*0.4+0.1;
    this.life=0;
    this.maxLife=Math.random()*300+200;
    this.hue=Math.random()*20+35;
  }
  update(){
    this.x+=this.speedX+Math.sin(this.life*0.02)*0.2;
    this.y+=this.speedY;
    this.life++;
    if(this.life>this.maxLife||this.y<-20)this.reset();
  }
  draw(){
    const fade=this.life<30?this.life/30:this.life>this.maxLife-50?(this.maxLife-this.life)/50:1;
    ctx.globalAlpha=this.opacity*fade;
    ctx.fillStyle=`hsl(${this.hue},60%,70%)`;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
  }
}

for(let i=0;i<120;i++){
  const p=new Particle();
  p.y=Math.random()*canvas.height;
  p.life=Math.random()*p.maxLife;
  particles.push(p);
}

function animParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{p.update();p.draw();});
  requestAnimationFrame(animParticles);
}
animParticles();

// ===== GSAP ANIMATIONS =====
gsap.registerPlugin(ScrollTrigger);

// Hero entrance
const tl=gsap.timeline({defaults:{ease:'power3.out'}});
tl.to('.hero-tagline-top',{opacity:1,y:0,duration:1.2,delay:0.5})
  .to('.hero-title',{opacity:1,y:0,filter:'blur(0px)',duration:1.4},'-=0.6')
  .to('.hero-line',{opacity:1,scaleX:1,duration:1},'-=0.8')
  .to('.hero-subtitle',{opacity:1,y:0,duration:1},'-=0.7')
  .to('.hero-cta',{opacity:1,y:0,duration:0.8},'-=0.5')
  .to('.scroll-hint',{opacity:1,duration:0.8},'-=0.3');

// Scroll animations
gsap.utils.toArray('.anim-up').forEach(el=>{
  gsap.fromTo(el,{opacity:0,y:50},{
    opacity:1,y:0,duration:1,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}
  });
});
gsap.utils.toArray('.anim-scale').forEach((el,i)=>{
  gsap.fromTo(el,{opacity:0,scale:0.88,y:30},{
    opacity:1,scale:1,y:0,duration:1,ease:'power3.out',delay:i*0.08%0.4,
    scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}
  });
});

// Parallax hero
gsap.to('.hero-content',{
  yPercent:-15,ease:'none',
  scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}
});
gsap.to('.hero-fog',{
  yPercent:-25,ease:'none',
  scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:true}
});

// About logo rotation
gsap.to('.about-logo-big',{
  rotation:5,ease:'none',
  scrollTrigger:{trigger:'#about',start:'top bottom',end:'bottom top',scrub:1}
});

// Section reveals
['#about','#sensory','#contact'].forEach(id=>{
  gsap.fromTo(id,{opacity:0.7},{
    opacity:1,duration:0.5,
    scrollTrigger:{trigger:id,start:'top 80%'}
  });
});

// Products stagger
gsap.utils.toArray('.product-card').forEach((card,i)=>{
  gsap.fromTo(card,{opacity:0,y:60,scale:0.9},{
    opacity:1,y:0,scale:1,duration:0.9,ease:'power3.out',delay:(i%3)*0.12,
    scrollTrigger:{trigger:card,start:'top 90%',toggleActions:'play none none none'}
  });
});

// Sensory words stagger
gsap.utils.toArray('.sensory-word').forEach((w,i)=>{
  gsap.fromTo(w,{opacity:0,y:20},{
    opacity:0.25,y:0,duration:0.6,delay:i*0.07,
    scrollTrigger:{trigger:'#sensory',start:'top 70%'}
  });
});

// Counter animation
function animateCounter(el,target){
  gsap.fromTo(el,{innerText:0},{
    innerText:target,duration:2,ease:'power2.out',
    snap:{innerText:1},
    scrollTrigger:{trigger:el,start:'top 80%'},
    onUpdate:function(){ el.innerText=Math.round(el._gsap.innerText); }
  });
}
document.querySelectorAll('.stat-num').forEach(el=>{
  animateCounter(el,parseInt(el.dataset.count));
});

// Nav background on scroll
ScrollTrigger.create({
  start:'top -80',
  onUpdate:self=>{
    document.getElementById('main-nav').style.backdropFilter=
      self.progress>0?'blur(20px)':'blur(0px)';
  }
});

// ===== LANGUAGE TOGGLE =====
let lang='pt';
const btn=document.getElementById('lang-toggle');
btn.addEventListener('click',()=>{
  lang=lang==='pt'?'en':'pt';
  btn.textContent=lang==='pt'?'EN':'PT';
  document.querySelectorAll('[data-pt]').forEach(el=>{
    const val=el.getAttribute('data-'+lang);
    if(val!==null)el.innerHTML=val;
  });
});

// ===== WA LINK (placeholder - update number) =====
// document.getElementById('wa-link').href='https://wa.me/5511999999999';