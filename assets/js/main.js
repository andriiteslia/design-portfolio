/* Andrii Teslia portfolio: horizontal film strip, reveals, parallax, cursor */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small=matchMedia('(max-width:760px)');
  var scroller=document.getElementById('scroller'),stage=document.getElementById('stage'),track=document.getElementById('track'),ghost=document.getElementById('ghost'),fore=document.getElementById('fore');
  var panels=[].slice.call(track.querySelectorAll('.panel'));
  var ticks=document.getElementById('ticks'),fill=document.getElementById('fill');
  var fnum=document.getElementById('fnum'),flabel=document.getElementById('flabel'),pct=document.getElementById('pct');
  document.getElementById('ftotal').textContent=String(panels.length).padStart(2,'0');

  // name letters
  var k=0;
  document.querySelectorAll('[data-split]').forEach(function(row){
    var t=row.textContent;row.textContent='';
    t.split('').forEach(function(c){var s=document.createElement('span');s.className='ch';s.style.setProperty('--i',k++);s.textContent=c;row.appendChild(s);});
  });
  // word reveals for headings
  document.querySelectorAll('[data-words]').forEach(function(el){
    var ws=el.textContent.trim().split(/\s+/);el.textContent='';
    ws.forEach(function(w,i){var o=document.createElement('span');o.className='rv';var n=document.createElement('span');n.textContent=w;n.style.setProperty('--d',i);o.appendChild(n);el.appendChild(o);if(i<ws.length-1)el.appendChild(document.createTextNode(' '));});
  });
  // manifesto words
  var man=document.getElementById('manifesto'),hot=['AI','design','systems','every','person,'];
  var words=man.textContent.trim().split(/\s+/);man.textContent='';
  var wEls=words.map(function(w,i){var s=document.createElement('span');s.className='w'+(hot.indexOf(w)>-1?' hot':'');s.textContent=w;man.appendChild(s);if(i<words.length-1)man.appendChild(document.createTextNode(' '));return s;});

  // rotating role line
  var rollEl=document.getElementById('roll').firstElementChild,roles=['AI Experience Designer','Design Systems Lead','Mobile & Web Designer'],ri=0;
  if(!reduce)setInterval(function(){
    rollEl.classList.add('out');
    setTimeout(function(){
      ri=(ri+1)%roles.length;rollEl.textContent=roles[ri];
      rollEl.classList.remove('out');rollEl.classList.add('pre');
      void rollEl.offsetWidth;rollEl.classList.remove('pre');
    },450);
  },2600);

  // ticks
  var tickEls=panels.map(function(p,i){
    var b=document.createElement('button');b.className='tick';b.type='button';
    b.setAttribute('aria-label','Go to '+p.dataset.label);
    b.innerHTML='<span>'+String(i+1).padStart(2,'0')+' '+p.dataset.label+'</span>';
    b.addEventListener('click',function(){go(i);});ticks.appendChild(b);return b;
  });

  var max=0,vw=innerWidth,offs=[],layers=[],mw1=1,mw2=1;
  var m1=document.getElementById('m1'),m2=document.getElementById('m2'),mo1=0,mo2=0;
  function layout(){
    if(small.matches)panels.forEach(function(p){p.style.transform='';});
    vw=innerWidth;
    max=Math.max(0,track.scrollWidth-vw);
    scroller.style.height=(max+stage.offsetHeight)+'px';
    offs=panels.map(function(p){return {l:p.offsetLeft,w:p.offsetWidth};});
    if(!fore.dataset.built){fore.dataset.built=1;
      var span=(max+vw)*1.35,n=Math.round(span/900),H=stage.offsetHeight,seed=7;
      function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
      for(var fi=0;fi<n;fi++){var el=document.createElement('i');var x=rnd()*span,band=rnd()<.5?rnd()*0.16+0.13:rnd()*0.14+0.7;
        el.className='x';el.textContent='+';
        el.style.left=x.toFixed(0)+'px';el.style.top=(band*100).toFixed(1)+'%';fore.appendChild(el);}
    }
    mw1=m1.firstElementChild.offsetWidth||1;mw2=m2.firstElementChild.offsetWidth||1;
    layers=[].slice.call(track.querySelectorAll('[data-depth]')).map(function(el){return {el:el,d:+el.dataset.depth,i:panels.indexOf(el.closest('.panel'))};});
  }
  function go(i){scrollTo({top:Math.min(max,offs[i].l)+scroller.offsetTop,behavior:reduce?'auto':'smooth'});}
  

  // marquees driven by time + scroll velocity
  

  var cur=0,last=0,skew=0,active=-1,counted={};
  function target(){return Math.min(max,Math.max(0,scrollY-scroller.offsetTop));}
  function fmt(n,el){var s=el.dataset.fmt?n.toLocaleString('en-US'):String(n);return s+(el.dataset.suffix||'');}
  function countUp(scope){
    scope.querySelectorAll('[data-count]').forEach(function(el){
      var end=+el.dataset.count;
      if(reduce){el.textContent=fmt(end,el);return;}
      var t0=performance.now(),dur=1500;
      (function step(now){var q=Math.min(1,(now-t0)/dur);q=1-Math.pow(1-q,4);el.textContent=fmt(Math.round(end*q),el);if(q<1)requestAnimationFrame(step);})(t0);
    });
  }
  var plates=[].slice.call(track.querySelectorAll('.plate')).map(function(el){return {el:el,i:panels.indexOf(el.closest('.panel'))};});
  var kitI=panels.findIndex(function(p){return p.classList.contains('kit');});
  var applied=-1,lastSkew=0,lastLit=-1,lastPct=-1;
  function frame(){
    var t=target();
    cur=reduce?t:cur+(t-cur)*0.09;
    if(Math.abs(t-cur)<0.1)cur=t;
    var v=cur-last;last=cur;
    skew=(reduce||small.matches)?0:skew+(Math.max(-6,Math.min(6,-v*0.12))-skew)*0.15;
    if(Math.abs(skew)<0.01)skew=0;
    var moving=Math.abs(cur-applied)>0.05;

    if(moving){
      applied=cur;
      track.style.transform='translate3d('+(-cur)+'px,0,0)';
      ghost.style.transform='translate3d('+(-cur*0.3)+'px,-50%,0)';
      fore.style.transform='translate3d('+(-cur*1.35)+'px,0,0)';
      if(!reduce&&!small.matches)for(var pi=0;pi<offs.length;pi++){
        var po2=offs[pi],c2=(po2.l+po2.w/2-cur-vw/2)/((po2.w+vw)/2);
        if(c2>-1.2&&c2<1.2){var sc=1-0.07*Math.min(1,Math.abs(c2));panels[pi].style.transform='scale('+sc.toFixed(4)+')';}
      }
      for(var j=0;j<layers.length;j++){
        var L=layers[j],o=offs[L.i],rel=(o.l+o.w/2-cur-vw/2)/vw;
        if(rel>-1.6&&rel<1.6)L.el.style.transform='translate3d('+(rel*L.d*-1.4).toFixed(1)+'px,'+(rel*L.d*0.3).toFixed(1)+'px,0)';
      }
      for(var i=0;i<offs.length;i++){
        var left=offs[i].l-cur;
        if(!counted[i]&&left<vw*0.72&&left+offs[i].w>0){counted[i]=1;panels[i].classList.add('in');countUp(panels[i]);}
      }
      var mid=cur+vw*0.5,a=0;
      for(i=0;i<offs.length;i++){if(offs[i].l<=mid)a=i;}
      if(a!==active){
        active=a;
        fnum.textContent=String(a+1).padStart(2,'0');flabel.textContent=panels[a].dataset.label;
        tickEls.forEach(function(b,n){b.classList.toggle('on',n===a);});
      }
      var p=max?cur/max:0;
      fill.style.transform='scaleX('+p.toFixed(4)+')';
      var pr=Math.round(p*100);if(pr!==lastPct){lastPct=pr;pct.textContent=pr+'%';}
      var mo=offs[1];if(mo){
        var mp=(cur+vw-mo.l)/(mo.w+vw*0.3),lit=reduce?wEls.length:Math.floor(Math.max(0,Math.min(1,mp*1.25))*wEls.length);
        if(lit!==lastLit){lastLit=lit;for(var w=0;w<wEls.length;w++)wEls[w].classList.toggle('lit',w<lit);}
      }
    }
    // skew only on plates that are on screen, only when it changes
    if(Math.abs(skew-lastSkew)>0.02||(skew===0&&lastSkew!==0)){
      lastSkew=skew;var sv=skew.toFixed(2)+'deg';
      for(var q=0;q<plates.length;q++){var po=offs[plates[q].i],pl=po.l-cur;if(pl<vw&&pl+po.w>0)plates[q].el.style.setProperty('--skew',sv);}
    }
    // marquees only while the toolkit frame is on screen; widths cached in layout()
    if(!reduce&&kitI>-1){
      var ko=offs[kitI],kl=ko.l-cur;
      if(kl<vw&&kl+ko.w>0){
        var sp=0.6+Math.abs(v)*0.35;mo1-=sp;mo2+=sp;
        if(mo1<=-mw1)mo1+=mw1;if(mo2>=0)mo2-=mw2;
        m1.style.transform='translate3d('+mo1.toFixed(1)+'px,0,0)';m2.style.transform='translate3d('+mo2.toFixed(1)+'px,0,0)';
      }
    }
    requestAnimationFrame(frame);
  }

  addEventListener('wheel',function(e){if(Math.abs(e.deltaX)>Math.abs(e.deltaY))scrollBy(0,e.deltaX);},{passive:true});
  addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'){e.preventDefault();go(Math.min(panels.length-1,active+1));}
    if(e.key==='ArrowLeft'){e.preventDefault();go(Math.max(0,active-1));}
  });
  // touch: a sideways swipe moves the strip too (vertical swipes already do)
  var tx=0,ty=0,tAxis='';
  addEventListener('touchstart',function(e){var t=e.touches[0];tx=t.clientX;ty=t.clientY;tAxis='';},{passive:true});
  addEventListener('touchmove',function(e){
    var t=e.touches[0],dx=t.clientX-tx,dy=t.clientY-ty;
    if(!tAxis&&Math.abs(dx)+Math.abs(dy)>8)tAxis=Math.abs(dx)>Math.abs(dy)?'x':'y';
    if(tAxis==='x'){scrollBy(0,-dx*1.3);tx=t.clientX;ty=t.clientY;}
  },{passive:true});
  // drag
  var down=false,sx=0,sy=0,moved=false;
  stage.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;sx=e.clientX;sy=scrollY;});
  addEventListener('pointermove',function(e){
    if(!down)return;var dx=e.clientX-sx;
    if(!moved&&Math.abs(dx)>5){moved=true;stage.classList.add('drag');}
    if(moved)scrollTo(0,sy-dx*1.4);
  });
  addEventListener('pointerup',function(){down=false;stage.classList.remove('drag');});
  stage.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
  stage.addEventListener('dragstart',function(e){e.preventDefault();});

  // cursor, plate tilt, magnetic buttons
  var c=document.getElementById('cur'),ct=document.getElementById('curtxt'),mx=-100,my=-100,cx=-100,cy=-100;
  if(matchMedia('(pointer:fine)').matches){
    addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;
      var pl=e.target.closest&&e.target.closest('.plate');
      var ln=e.target.closest&&e.target.closest('a,button');
      if(pl){c.classList.add('big');ct.textContent=pl.dataset.cursor;}
      else if(ln){c.classList.add('big');ct.textContent='Click';}
      else c.classList.remove('big');
    });
    (function loop(){cx+=(mx-cx)*(reduce?1:.2);cy+=(my-cy)*(reduce?1:.2);c.style.transform='translate3d('+cx+'px,'+cy+'px,0)';requestAnimationFrame(loop);})();
    if(!reduce){
      document.querySelectorAll('.plate').forEach(function(pl){
        pl.addEventListener('pointermove',function(e){var r=pl.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;pl.style.setProperty('--ry',(x*10).toFixed(2)+'deg');pl.style.setProperty('--rx',(-y*10).toFixed(2)+'deg');});
        pl.addEventListener('pointerleave',function(){pl.style.setProperty('--ry','0deg');pl.style.setProperty('--rx','0deg');});
      });
      document.querySelectorAll('.mag,.cta,.open').forEach(function(b){
        b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.3)+'px,'+((e.clientY-r.top-r.height/2)*.4)+'px)';});
        b.addEventListener('pointerleave',function(){b.style.transform='';});
      });
    }
  }

  document.getElementById('home').addEventListener('click',function(e){e.preventDefault();go(0);});
  document.getElementById('restart').addEventListener('click',function(){go(0);});
  var copy=document.getElementById('copy'),addr=document.getElementById('addr');
  copy.addEventListener('click',function(){
    function done(){copy.textContent='Copied';copy.classList.add('done');setTimeout(function(){copy.textContent='Copy email';copy.classList.remove('done');},1800);}
    function fb(){var r=document.createRange();r.selectNodeContents(addr);var s=getSelection();s.removeAllRanges();s.addRange(r);copy.textContent='Selected, press Ctrl+C';}
    try{navigator.clipboard.writeText(addr.textContent).then(done,fb);}catch(err){fb();}
  });




  // name: same word-rise as project titles, played once on load
  (function(){
    var n=document.getElementById('name');if(!n||reduce)return;
    n.classList.add('pre');
    function go(){requestAnimationFrame(function(){requestAnimationFrame(function(){n.classList.remove('pre');});});}
    var done=false;function once(){if(!done){done=true;go();}}
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(once);
    setTimeout(once,1200);
  })();

  // intro logos escape from the cursor (spring physics, only while the intro is on screen)
  (function(){
    if(reduce||small.matches)return;
    var items=[].slice.call(document.querySelectorAll('.floaters .flw')).map(function(w){return {w:w,el:w.firstElementChild,x:0,y:0,vx:0,vy:0};});
    if(!items.length)return;
    var px=-1e4,py=-1e4,running=false;
    function onMove(e){px=e.clientX;py=e.clientY;if(!running&&cur<vw){running=true;requestAnimationFrame(step);}}
    addEventListener('pointermove',onMove,{passive:true});
    addEventListener('pointerdown',onMove,{passive:true});
    document.addEventListener('pointerleave',function(){px=py=-1e4;});
    function step(){
      var R=Math.max(110,vw*0.085),active=false;
      for(var i=0;i<items.length;i++){
        var it=items[i],r=it.w.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
        var dx=cx+it.x-px,dy=cy+it.y-py,d=Math.sqrt(dx*dx+dy*dy)||1,tx=0,ty=0;
        if(d<R){var f=(R-d)/R;f=f*f*(3-2*f);tx=dx/d*f*R*0.42;ty=dy/d*f*R*0.42;}
        it.vx+=(tx-it.x)*0.05;it.vy+=(ty-it.y)*0.05;it.vx*=0.8;it.vy*=0.8;
        it.x+=it.vx;it.y+=it.vy;
        it.el.style.transform='translate3d('+it.x.toFixed(1)+'px,'+it.y.toFixed(1)+'px,0) rotate('+(it.vx*0.6).toFixed(1)+'deg)';
        if(Math.abs(it.x)>.3||Math.abs(it.y)>.3||Math.abs(it.vx)>.05||Math.abs(it.vy)>.05||d<R)active=true;
      }
      if(active&&cur<vw)requestAnimationFrame(step);else running=false;
    }
  })();

  // deep links from case pages: index.html#medpal opens the strip at that project
  function jump(){
    var h=location.hash.slice(1);if(!h)return;
    var i=panels.findIndex(function(p){return p.dataset.anchor===h||p.dataset.anchor2===h;});
    if(i<0)return;
    layout();scrollTo(0,Math.min(max,offs[i].l)+scroller.offsetTop);cur=last=target();
  }
  addEventListener('hashchange',jump);
  addEventListener('resize',layout);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){layout();if(location.hash)jump();});
  layout();jump();requestAnimationFrame(frame);
  addEventListener('load',jump);
})();
