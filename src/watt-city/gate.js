(() => {
  'use strict';
  const form = document.getElementById('entry-form');
  const input = document.getElementById('access-code');
  const button = document.getElementById('enter-button');
  const message = document.getElementById('entry-message');
  const reveal = document.getElementById('reveal');
  const link = document.getElementById('game-link');
  const from64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
  let activated = false;
  reveal.addEventListener('click', () => {
    const showing = input.type === 'password';
    input.type = showing ? 'text' : 'password';
    reveal.textContent = showing ? '숨기기' : '보기';
    reveal.setAttribute('aria-label', showing ? '비밀번호 숨기기' : '비밀번호 보이기');
    reveal.setAttribute('aria-pressed', String(showing));
  });
  link.addEventListener('click', event => {
    if (!activated) event.preventDefault();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || activated) return;
    if (!window.crypto?.subtle) {
      message.textContent = '최신 Chrome, Edge 또는 Safari에서 다시 열어 주세요.';
      return;
    }
    const code = input.value.trim();
    if (!/^[0-9]{6}$/.test(code)) {
      message.textContent = '숫자 6자리 비밀번호를 입력해 주세요.';
      input.focus();
      return;
    }
    button.disabled = true;
    button.textContent = '확인 중…';
    message.textContent = '';
    try {
      const response = await fetch('assets/watt-city-sealed-link.json');
      if (!response.ok) throw new Error('Link unavailable');
      const sealed = await response.json();
      const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:from64(sealed.salt),iterations:sealed.iterations}, material, {name:'AES-GCM',length:256}, false, ['decrypt']);
      let decrypted;
      try {
        decrypted = await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(sealed.iv)}, key, from64(sealed.data));
      } catch {
        message.textContent = '비밀번호가 맞지 않아요. 다시 확인해 주세요.';
        input.focus();
        input.select();
        return;
      }
      const url = new URL(new TextDecoder().decode(decrypted));
      if (url.protocol !== 'https:' || !url.hostname.endsWith('.chatgpt.site')) throw new Error('Invalid destination');
      link.href = url.href;
      link.removeAttribute('aria-disabled');
      link.tabIndex = 0;
      activated = true;
      input.value = '';
      input.disabled = true;
      reveal.disabled = true;
      message.classList.add('success');
      message.textContent = '링크가 활성화됐어요. 아래 버튼으로 출발해요!';
      link.focus();
    } catch {
      message.textContent = '링크를 불러오지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.';
    } finally {
      button.disabled = activated;
      button.textContent = activated ? '링크 활성화 완료' : '게임 링크 활성화하기';
    }
  });
})();
