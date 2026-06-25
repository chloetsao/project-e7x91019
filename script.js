const A={normal:'dog_normal.gif',sad:'dog_sad.gif',happy:'dog_happy.gif',hug:'dog_hug.gif',love:'dog_love.gif',run:'dog_run.gif',slap:'dog_slap.gif',spy:'dog_spy.gif',think:'dog_thinking.gif',balloon:'dog_balloon.gif',angry:'dog_angry.gif',angry2:'dog_angry2.gif'};
const $=id=>document.getElementById(id), screen=$('screen'), app=$('app');
const spy=$('spyMusic'), happy=$('happyMusic');
let stage=0, wrong=0, pump=0, escape=0, countdown=30, timer=null, canWin=false, musicOn=true;
const anniversaryQuestions=[
  {q:'第一次認識是哪一天？', a:'2021/09/26', hint:'格式：YYYY/MM/DD'},
  {q:'第一次交往是哪一天？', a:'2022/03/27', hint:'這一天開始正式成為彼此的隊友'},
  {q:'結婚紀念日是哪一天？', a:'2023/10/19', hint:'我們成為家人的日子'},
  {q:'圓山宴客是哪一天？', a:'2024/11/23', hint:'和大家一起慶祝的日子'}
];
function img(name,cls='dog'){return `<img class="${cls}" src="${A[name]}" alt="dog" onerror="this.src='dog_normal.gif'">`}
function hud(n){const names=['PASSWORD','BALLOON','SPACE','STUBBORN','BOMB'];return `<div class="topbar">${names.map((x,i)=>`<div class="chip ${i<n?'done':''}">${i<n?'✓':'□'} ${x}</div>`).join('')}</div>`}
function playSpy(){happy.pause();happy.currentTime=0;spy.volume=.75;if(musicOn)spy.play().catch(()=>{})}
function playHappy(){spy.pause();spy.currentTime=0;happy.volume=.75;if(musicOn)happy.play().catch(()=>{})}
function fadeOutSpy(cb){
  if(!musicOn || spy.paused || spy.volume<=0){spy.pause();spy.currentTime=0;spy.volume=.75;cb&&cb();return}
  const t=setInterval(()=>{
    spy.volume=Math.max(0,spy.volume-.05);
    if(spy.volume<=0){clearInterval(t);spy.pause();spy.currentTime=0;spy.volume=.75;cb&&cb()}
  },80);
}
function stopAllMusic(){spy.pause();happy.pause()}
function ensureSoundButton(){if($('soundToggle'))return;const b=document.createElement('button');b.id='soundToggle';b.className='sound-toggle';b.type='button';b.textContent='🔊 音樂 ON';b.onclick=toggleMusic;app.appendChild(b)}
function toggleMusic(){musicOn=!musicOn;const b=$('soundToggle');if(b)b.textContent=musicOn?'🔊 音樂 ON':'🔇 音樂 OFF';if(!musicOn){stopAllMusic();return}if(stage===6)playHappy();else if(stage>0)playSpy()}
function normalizeDate(v){return v.replace(/[^0-9]/g,'')}
function isDateAnswer(v,a){return normalizeDate(v)===normalizeDate(a)}
function type(el,text,ms=25,cb){let i=0;el.textContent='';const t=setInterval(()=>{el.textContent+=text[i++]||''; if(i>text.length){clearInterval(t);cb&&cb()}},ms)}
function render(html){screen.innerHTML=html;ensureSoundButton()}
function boot(){document.body.classList.remove('ending-mode');render(`<div class="center"><div class="title red glitch">⚠ HACKER MISSION ⚠</div><p>拆除 Chloe 生氣炸彈</p>${img('spy','dog big')}<div class="box"><div id="b1" class="bootline"></div><div id="b2" class="bootline red"></div><div id="b3" class="bootline"></div><div id="b4" class="bootline yellow"></div></div><button class="btn" id="accept">ACCEPT MISSION</button></div>`);setTimeout(()=>type($('b1'),'> SYSTEM BOOTING...',28),300);setTimeout(()=>type($('b2'),'> ANGER MODE DETECTED: CHLOE',28),1200);setTimeout(()=>type($('b3'),'> SEARCHING HUSBAND... FOUND.',28),2300);setTimeout(()=>type($('b4'),'> MISSION DIFFICULTY: IMPOSSIBLE BUT NECESSARY.',22),3300);$('accept').onclick=()=>{playSpy();anniversaryStage(0)}}

function anniversaryStage(i){
  stage=.5;
  window.onkeydown=null;
  const item=anniversaryQuestions[i];
  render(`<div class="memory-wrap"><div class="title">LOVE MEMORY CHECK</div>${img('love','dog big')}<div class="box memory-box"><p class="yellow">紀念日考核 ${i+1} / ${anniversaryQuestions.length}</p><p>${item.q}</p><p class="hint">${item.hint}</p></div><input id="memoryInput" class="input" placeholder="例如：2023/10/19"><br><button class="btn" id="memoryGo">確認答案</button><p id="msg" class="center red"></p></div>`);
  const submit=()=>checkAnniversary(i);
  $('memoryGo').onclick=submit;
  $('memoryInput').onkeydown=e=>{if(e.key==='Enter')submit()};
  $('memoryInput').focus();
}
function checkAnniversary(i){
  const v=$('memoryInput').value.trim();
  const item=anniversaryQuestions[i];
  if(isDateAnswer(v,item.a)){
    $('msg').className='center yellow';
    $('msg').textContent=i===anniversaryQuestions.length-1?'全部答對！准許進入正式任務。':'答對！記憶認證通過。';
    setTimeout(()=>i+1<anniversaryQuestions.length?anniversaryStage(i+1):stage1(),850);
    return;
  }
  wrong++;
  app.classList.add('shake');
  $('msg').innerHTML=`不對喔！Chloe 小本本記一筆。<br><span class="hint">請用 YYYY/MM/DD，例如：2023/10/19</span>`;
  setTimeout(()=>app.classList.remove('shake'),400);
}

function stage1(){stage=1;render(`${hud(0)}<div class="title">STAGE 1：密碼破解</div><div class="row">${img('think','dog big')}<div><div class="box"><p>請輸入宇宙最高通行密語。</p><p class="hint">提示：老婆＿＿是＿＿。</p></div><input id="pw" class="input" placeholder="輸入密碼"><br><button class="btn" id="go">DECRYPT</button><p id="msg" class="red"></p></div></div>`);$('go').onclick=checkPw;$('pw').onkeydown=e=>{if(e.key==='Enter')checkPw()}}
function checkPw(){const v=$('pw').value.trim(); if(v==='老婆永遠是對的'){ $('msg').className='yellow'; $('msg').textContent='ACCESS GRANTED. 宇宙真理確認。'; setTimeout(stage2,900)}else{wrong++;app.classList.add('shake');$('msg').textContent='ACCESS DENIED：先生，這題不能錯。'; setTimeout(()=>app.classList.remove('shake'),400)}}
function stage2(){stage=2;render(`${hud(1)}<div class="title">STAGE 2：補償氣球</div><div class="center">${img('balloon','dog')}<p>點到正確補償方案，其他都會爆炸。</p></div><div class="balloon-stage"><div class="balloon" onclick="balloon(this,false)">繼續<br>講道理</div><div class="balloon" onclick="balloon(this,false)">裝沒事<br>當沒發生</div><div class="balloon" onclick="balloon(this,true)">好好聽<br>Chloe 說話</div></div><p id="msg" class="center"></p>`)}
function balloon(el,ok){if(!ok){wrong++;el.classList.add('pop');$('msg').innerHTML=`<span class="red">POP！錯誤補償。怒氣 +${wrong*5}%</span> ${img(wrong>2?'angry2':'angry','dog')}`;app.classList.add('shake');setTimeout(()=>app.classList.remove('shake'),350);return} el.classList.add('pop');$('msg').innerHTML='<span class="yellow">正確！態度認證通過。</span>';setTimeout(stage3,850)}
function stage3(){stage=3;pump=0;render(`${hud(2)}<div class="title">STAGE 3：SPACE 充氣消氣</div><div class="pump-area">${img('balloon','dog')}<div id="mega" class="mega-balloon">🎈</div><button id="space" class="btn space-btn">PRESS SPACE / 點我：0 / 8</button><div class="angerbar"><div id="anger" class="angerfill"></div></div><p class="hint">電腦按 SPACE；手機直接點按鈕。</p></div>`);window.onkeydown=spaceKey;$('space').onclick=pumpIt; $('space').focus()}
function spaceKey(e){if(stage===3 && e.code==='Space'){e.preventDefault();pumpIt()}}
function pumpIt(){if(stage!==3)return;pump++;$('space').textContent=`PRESS SPACE / 點我：${pump} / 8`;const size=110+pump*22;$('mega').style.width=size+'px';$('mega').style.height=size*1.15+'px';$('mega').style.fontSize=(28+pump*5)+'px';$('anger').style.width=Math.max(0,100-pump*12.5)+'%'; if(pump>=8){window.onkeydown=null;$('mega').textContent='BOOM!';$('space').textContent='消氣成功';setTimeout(stage4,900)}}
function stage4(){stage=4;render(`${hud(3)}<div class="title">STAGE 4：嘴硬測試</div><div class="row"><div>${img('slap','dog big')}<p class="center">執法小狗</p></div><div id="mark" class="slapmark"></div><svg class="face" viewBox="0 0 120 150"><circle cx="60" cy="42" r="34" fill="none" stroke="#00ff66" stroke-width="3"/><circle cx="47" cy="36" r="4" fill="#00ff66"/><circle cx="73" cy="36" r="4" fill="#00ff66"/><path d="M45 58 Q60 70 75 58" stroke="#00ff66" fill="none" stroke-width="3"/><rect x="35" y="78" width="50" height="55" rx="14" fill="none" stroke="#00ff66" stroke-width="3"/></svg></div><div class="choices"><button class="btn red" onclick="stubborn(false)">我沒有錯</button><button class="btn red" onclick="stubborn(false)">妳想太多了</button><button class="btn" onclick="stubborn(true)">我願意好好說</button></div><p id="msg" class="center"></p>`)}
function stubborn(ok){if(!ok){wrong++;$('mark').textContent='啪！';$('msg').innerHTML=`<span class="red">嘴硬值上升。${wrong>=5?'SYSTEM ERROR：你是不是還沒學會？':''}</span>`;app.classList.add('shake');setTimeout(()=>{app.classList.remove('shake');$('mark').textContent=''},650);return}$('mark').textContent='✓';$('msg').innerHTML='<span class="yellow">小狗收爪。正確回應通過。</span>';setTimeout(stage5,900)}
function stage5(){stage=5;escape=0;countdown=30;canWin=false;render(`${hud(4)}<div class="title red">STAGE 5：拆除冷戰炸彈</div><div class="timer" id="time">00:30</div><div class="bomb-area warning" id="bomb"><div class="center bomb-title">💣</div>${img('run','dog')}<button id="peace" class="peace">和好</button></div><p id="msg" class="center hint">滑鼠靠近會瞬移。第 9 次後才會乖乖停下。</p>`);const b=$('peace');placePeace();b.onclick=finishTry;b.onmouseenter=runAway;b.ontouchstart=(e)=>{e.preventDefault();runAway()};timer=setInterval(()=>{countdown--;$('time').textContent='00:'+String(countdown).padStart(2,'0'); if(countdown<=3){canWin=true;b.textContent='現在可以和好了 ❤️';b.style.left='50%';b.style.top='50%'} if(countdown<=0){clearInterval(timer);stage5()}},1000)}
function placePeace(){const area=$('bomb'), b=$('peace');const x=Math.random()*(area.clientWidth-130), y=80+Math.random()*(area.clientHeight-150);b.style.left=x+'px';b.style.top=y+'px'}
function runAway(){if(stage!==5||canWin)return;escape++;$('msg').innerHTML=`<span class="red">逃跑 ${escape}/8</span>`; if(escape>=8){canWin=true;$('peace').textContent='現在可以和好了 ❤️';$('peace').style.left='50%';$('peace').style.top='50%';return}placePeace()}
function finishTry(){if(!canWin){runAway();return}clearInterval(timer);$('msg').innerHTML='<span class="yellow">BOMB DEFUSED...</span>';setTimeout(ending,1000)}
function ending(){
  stage=6;
  fadeOutSpy(()=>playHappy());
  document.body.classList.add('ending-mode');
  render(`<div class="center ending-content"><div class="title">MISSION COMPLETE</div>${img('hug','dog big')} ${img('love','dog big')}<div class="progress"><div id="heart" class="fill"></div></div><div class="letter" id="letter"></div><div id="achievement" class="achievement hidden"><div class="badge-title">🎖 Achievement Unlocked</div><div class="badge-main">Best Husband</div><div class="badge-sub">❤️ Chloe Approved</div></div><button class="btn replay-btn" onclick="boot()">REPLAY</button></div>`);
  confetti();
  let p=0;
  const t=setInterval(()=>{p+=10;$('heart').style.width=p+'%';if(p>=100){clearInterval(t);writeLetter()}},120);
}
function writeLetter(){const text='Dear Agent Eno,\n\nMission Complete.\n\n昨天我們都不開心。\n\n但比起分出誰對誰錯，\n\n我更希望我們能一起解決問題。\n\n謝謝你願意完成這次任務。\n\n恭喜重新取得：\n\n❤️ Chloe 抱抱權限\n❤️ 一起吃好吃的權限\n❤️ 一起牽手散步權限\n\nWelcome Home.\n\nLove,\n\nChloe ❤️';let i=0;const el=$('letter');el.textContent='';const t=setInterval(()=>{el.textContent+=text[i++]||'';if(i>text.length){clearInterval(t);setTimeout(()=>{$('achievement').classList.remove('hidden');confetti()},350)}},32)}
function confetti(){const icons=['🎆','🎇','✨','❤️','💛'];for(let i=0;i<70;i++){setTimeout(()=>{const s=document.createElement('div');s.className='confetti';s.textContent=icons[Math.floor(Math.random()*icons.length)];s.style.left=Math.random()*100+'%';s.style.animationDuration=(2+Math.random()*2.5)+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),4500)},i*45)}}
boot();
