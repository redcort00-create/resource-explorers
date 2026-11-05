(() => {
  'use strict';
  const topicIds = ['water','forest','mineral','energy'];
  const prefix = 'resource-explorers:v1:';
  const fields = ['method1','reason1','method2','reason2','practice','discovery'];
  let toastTimer;
  function notify(message) {
    const status = document.getElementById('status');
    if (!status) return;
    status.textContent = message;
    status.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => status.classList.remove('visible'), 3500);
  }
  function read(id) {
    try {
      const data = JSON.parse(localStorage.getItem(prefix+id) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch { return {}; }
  }
  function updateHome() {
    let complete = 0;
    topicIds.forEach(id => {
      const saved = read(id);
      const badge = document.querySelector(`[data-record="${id}"]`);
      if (saved.complete === true) complete++;
      if (badge) {
        badge.textContent = saved.complete === true ? '기록 완료 ✓' : fields.some(f => typeof saved[f] === 'string' && saved[f].trim()) ? '기록 중 ✎' : '아직 기록 전';
        badge.classList.toggle('done',saved.complete === true);
      }
    });
    const progress = document.getElementById('home-progress');
    if (progress) progress.textContent = `기록 완료 ${complete} / 4`;
  }
  updateHome();
  window.addEventListener('pageshow', updateHome);
  window.addEventListener('storage', updateHome);
  const topic = document.body.dataset.topic;
  const form = document.getElementById('notes-form');
  if (!form || !topicIds.includes(topic)) return;
  form.addEventListener('submit',event=>event.preventDefault());
  const completeBox = document.getElementById('complete');
  const saveInfo = document.getElementById('save-info');
  function resize(field) {
    field.style.height = 'auto';
    field.style.height = Math.max(116,field.scrollHeight+2)+'px';
  }
  const initial = read(topic);
  fields.forEach(id => {
    const field = document.getElementById(id);
    field.value = typeof initial[id] === 'string' ? initial[id].slice(0,3000) : '';
    resize(field);
  });
  completeBox.checked = initial.complete === true;
  function getNotes() {
    const data = {};
    fields.forEach(id => data[id]=document.getElementById(id).value);
    data.complete = completeBox.checked;
    return data;
  }
  function save() {
    try {
      localStorage.setItem(prefix+topic,JSON.stringify(getNotes()));
      saveInfo.textContent='지금 이 기기에 저장했어요. 선생님께 자동 제출되지는 않아요.';
      return true;
    } catch {
      saveInfo.textContent='이 브라우저에는 저장할 수 없어요. 페이지를 닫기 전에 기록을 내려받아 주세요.';
      return false;
    }
  }
  // Detect blocked storage without replacing a student's existing record.
  try { const k=prefix+'storage-check';localStorage.setItem(k,'1');localStorage.removeItem(k); }
  catch { saveInfo.textContent='이 브라우저에는 저장할 수 없어요. 페이지를 닫기 전에 기록을 내려받아 주세요.'; }
  form.addEventListener('input', event => {
    if (event.target.tagName==='TEXTAREA') resize(event.target);
    save();
  });
  completeBox.addEventListener('change', () => {
    const stored = save();
    notify(stored ? completeBox.checked ? '정리를 마쳤어요. 홈 화면에 완료 표시가 생겨요.' : '완료 표시를 해제했어요.' : '완료 상태를 저장할 수 없어요. 기록을 내려받아 주세요.');
  });
  function exportText() {
    const title=document.querySelector('.article-hero .eyebrow').textContent;
    const parts=[`지구를 잇는 탐구실 · ${title}`,''];
    fields.forEach(id=>parts.push(document.querySelector(`label[for="${id}"]`).textContent,document.getElementById(id).value.trim() || '(아직 작성하지 않았어요)',''));
    parts.push('출처',document.querySelector('.source-record p').textContent);
    document.querySelectorAll('.sources li a').forEach(a=>parts.push(`${a.textContent.replace(' ↗','')} — ${a.href}`));
    if (location.protocol==='https:' || location.protocol==='http:') parts.push('읽기 페이지: '+location.href.split('#')[0]);
    return parts.join('\n');
  }
  document.getElementById('download-notes').addEventListener('click', () => {
    const blob=new Blob(['\uFEFF'+exportText()],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`${document.querySelector('.breadcrumb span:last-child').textContent}_탐구기록.txt`;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    notify('탐구 기록 파일을 내려받았어요.');
  });
  document.getElementById('copy-notes').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(exportText());
      notify('기록을 복사했어요. 제출할 곳에 붙여 넣으세요.');
    } catch { notify('복사 기능을 사용할 수 없어요. 기록 내려받기를 이용해 주세요.'); }
  });
  document.getElementById('clear-notes').addEventListener('click', () => {
    if (!window.confirm('이 주제에 적은 기록을 비울까요? 필요한 기록은 먼저 내려받아 주세요.')) return;
    fields.forEach(id=>{const field=document.getElementById(id);field.value='';resize(field);});
    completeBox.checked=false;
    const stored=save();
    notify(stored ? '이 주제의 기록을 비웠어요.' : '화면의 기록을 비웠어요. 저장 공간은 확인할 수 없어요.');
  });
  function preparePrint() {
    fields.forEach(id=>{
      const field=document.getElementById(id);
      let answer=field.parentElement.querySelector('.print-answer');
      if(!answer){answer=document.createElement('div');answer.className='print-answer';field.after(answer);}
      answer.textContent=field.value || ' ';
    });
  }
  window.addEventListener('beforeprint',preparePrint);
  document.getElementById('print-page').addEventListener('click',()=>{preparePrint();window.print();});
  if ('IntersectionObserver' in window) {
    const links=[...document.querySelectorAll('.article-sidebar nav a')];
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
      if(visible) links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+visible.target.id));
    },{rootMargin:'-8% 0px -62% 0px',threshold:0});
    document.querySelectorAll('.reading-section,#notebook,#sources,#video').forEach(s=>observer.observe(s));
  }
})();
