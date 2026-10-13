/* Andrii Teslia portfolio: case study pages
   Title reveal, scroll reveals, section index, reading progress, hero parallax,
   result count-up, image lightbox, missing-image placeholders, TIM gallery, cursor. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(pointer:fine)').matches;

  // ── missing images: show a labelled placeholder until the file is added ──
  [].slice.call(document.querySelectorAll('.shot img')).forEach(function(img){
    var fig=img.closest('.shot');
    function miss(){fig.classList.add('missing');fig.setAttribute('data-src',img.getAttribute('src'));}
    if(img.complete&&img.naturalWidth===0&&img.getAttribute('src'))miss();
    img.addEventListener('error',miss);
  });

  // ── title: split into words that rise in (keeps <em> and <br>) ──
  var title=document.querySelector('[data-words]');
  if(title){
    var d=0;
    (function split(node){
      [].slice.call(node.childNodes).forEach(function(ch){
        if(ch.nodeType===3){
          var parts=ch.textContent.split(/(\s+)/),frag=document.createDocumentFragment();
          parts.forEach(function(p){
            if(!p)return;
            if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(' '));return;}
            var o=document.createElement('span');o.className='rv';
            var i=document.createElement('span');i.textContent=p;i.style.setProperty('--d',d++);
            o.appendChild(i);frag.appendChild(o);
          });
          node.replaceChild(frag,ch);
        }else if(ch.nodeType===1&&ch.tagName!=='BR'){split(ch);}
      });
    })(title);
    if(!reduce){
      title.classList.add('pre');
      var go=function(){requestAnimationFrame(function(){requestAnimationFrame(function(){title.classList.remove('pre');});});};
      var done=false,once=function(){if(!done){done=true;go();}};
      if(document.fonts&&document.fonts.ready)document.fonts.ready.then(once);
      setTimeout(once,900);
    }
  }

  // ── count-up for result numbers ──
  function countUp(el){
    var m=el.textContent.match(/^([^\d]*)([\d][\d,]*(?:\.\d+)?)(.*)$/);
    if(!m||reduce)return;
    var pre=m[1],raw=m[2],suf=m[3],end=parseFloat(raw.replace(/,/g,'')),dec=(raw.split('.')[1]||'').length,comma=raw.indexOf(',')>-1;
    if(end<2)return;
    var t0=performance.now(),dur=1300;
    (function step(now){
      var q=Math.min(1,(now-t0)/dur);q=1-Math.pow(1-q,4);
      var v=(end*q).toFixed(dec);if(comma)v=Number(v).toLocaleString('en-US');
      el.textContent=pre+v+suf;
      if(q<1)requestAnimationFrame(step);
    })(t0);
  }

  // ── scroll reveals ──
  var ups=[].slice.call(document.querySelectorAll('.up'));
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        e.target.classList.add('in');
        e.target.querySelectorAll('.result b').forEach(countUp);
        if(e.target.matches('.result'))countUp(e.target.querySelector('b'));
        io.unobserve(e.target);
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:.08});
    ups.forEach(function(el){io.observe(el);});
  }else ups.forEach(function(el){el.classList.add('in');});

  // ── section index ──
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
    var so=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on');});var a=map[e.target.id];if(a)a.classList.add('on');}
      });
    },{rootMargin:'-35% 0px -60% 0px'});
    document.querySelectorAll('.sec[id]').forEach(function(s){so.observe(s);});
  }

  // ── reading progress + hero ghost parallax ──
  var bar=document.querySelector('.progress'),ghost=document.querySelector('.hero-ghost'),ticking=false,lastY=0;
  function onScroll(){
    if(ticking)return;ticking=true;
    requestAnimationFrame(function(){
      var y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
      document.body.classList.toggle('scrolled',y>60);
      if(Math.abs(y-lastY)>6){document.body.classList.toggle('down',y>lastY&&y>240);lastY=y;}
      if(bar)bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0).toFixed(4)+')';
      if(ghost&&!reduce&&y<innerHeight*1.5)ghost.style.transform='translate3d('+(-y*0.35).toFixed(1)+'px,0,0)';
      ticking=false;
    });
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // ── gallery ──
  [].slice.call(document.querySelectorAll('.gallery')).forEach(function(g){
    var track=g.querySelector('.g-track'),items=[].slice.call(track.children),dots=g.querySelector('.g-dots');
    var bs=items.map(function(_,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(i+1));b.addEventListener('click',function(){to(i);});dots.appendChild(b);return b;});
    function idx(){return Math.round(track.scrollLeft/track.clientWidth);}
    function to(i){track.scrollTo({left:i*track.clientWidth,behavior:reduce?'auto':'smooth'});}
    function upd(){var i=idx();bs.forEach(function(b,j){b.classList.toggle('on',i===j);});}
    track.addEventListener('scroll',upd,{passive:true});upd();
    g.querySelector('.g-prev').addEventListener('click',function(){to(Math.max(0,idx()-1));});
    g.querySelector('.g-next').addEventListener('click',function(){to(Math.min(items.length-1,idx()+1));});
    var down=false,sx=0,sl=0;
    track.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;g.dragged=false;sx=e.clientX;sl=track.scrollLeft;track.style.scrollSnapType='none';});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4)g.dragged=true;track.scrollLeft=sl-dx;});
    addEventListener('pointerup',function(){if(!down)return;down=false;track.style.scrollSnapType='';to(idx());});
  });

  // ── lightbox ──
  var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Image preview');
  lb.innerHTML='<img alt=""><button class="pill" type="button">Close</button>';document.body.appendChild(lb);
  var lbImg=lb.querySelector('img'),last=null;
  function openLb(img){last=document.activeElement;lbImg.src=img.currentSrc||img.src;lbImg.alt=img.alt;lb.classList.add('on');lb.querySelector('button').focus({preventScroll:true});}
  function closeLb(){lb.classList.remove('on');if(last&&last.focus)last.focus({preventScroll:true});}
  lb.addEventListener('click',closeLb);
  addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('on'))closeLb();});
  document.addEventListener('click',function(e){
    var fig=e.target.closest&&e.target.closest('.shot');
    if(!fig||fig.classList.contains('missing'))return;
    var g=fig.closest('.gallery');if(g&&g.dragged){g.dragged=false;return;}
    openLb(fig.querySelector('img'));
  });
  [].slice.call(document.querySelectorAll('.shot')).forEach(function(f){f.tabIndex=0;f.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&!f.classList.contains('missing')){e.preventDefault();openLb(f.querySelector('img'));}});});

  // ── back button: return to the previous page (keeps the home strip position); otherwise open the home page at this project ──
  [].slice.call(document.querySelectorAll('[data-back]')).forEach(function(a){
    a.addEventListener('click',function(e){
      var ref='';try{ref=document.referrer?new URL(document.referrer).origin:'';}catch(err){}
      if(ref&&ref===location.origin&&history.length>1){e.preventDefault();history.back();}
    });
  });

  // ── cursor ──
  var c=document.querySelector('.cur');
  if(c&&fine){
    var ct=c.querySelector('span'),mx=-100,my=-100,cx=-100,cy=-100;
    addEventListener('pointermove',function(e){
      mx=e.clientX;my=e.clientY;
      var t=e.target.closest?e.target:null,label='';
      if(t){
        if(lb.classList.contains('on'))label='Close';
        else if(t.closest('.next'))label='Next';
        else if(t.closest('.shot:not(.missing)'))label='Zoom';
        else if(t.closest('a,button'))label='Open';
      }
      c.classList.toggle('big',!!label);if(label)ct.textContent=label;
    });
    (function loop(){cx+=(mx-cx)*(reduce?1:.22);cy+=(my-cy)*(reduce?1:.22);c.style.transform='translate3d('+cx+'px,'+cy+'px,0)';requestAnimationFrame(loop);})();
  }
})();
