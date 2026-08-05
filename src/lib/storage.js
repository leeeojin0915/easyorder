/**
 * Claude.ai 아티팩트 안에서만 쓸 수 있는 window.storage API를
 * 일반 브라우저(localStorage)에서도 동작하도록 대체한 유틸.
 *
 * 인터페이스는 window.storage와 최대한 비슷하게 맞췄다:
 *   await storage.get(key)    -> { key, value } | null
 *   await storage.set(key, value)
 *   await storage.delete(key)
 *
 * 실제 React Native(Expo) 이식 시에는 이 파일만 AsyncStorage 기반으로
 * 교체하면 되고, App.jsx의 나머지 코드는 그대로 재사용할 수 있다.
 * (기술스택 문서 4장 "로컬 저장" 참고)
 */
const STORE_KEY = 'easyorder:local-store';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}
function writeAll(obj) {
  localStorage.setItem(STORE_KEY, JSON.stringify(obj));
}

export const storage = {
  async get(key) {
    const all = readAll();
    if (!(key in all)) return null;
    return { key, value: all[key] };
  },
  async set(key, value) {
    const all = readAll();
    all[key] = value;
    writeAll(all);
    return { key, value };
  },
  async delete(key) {
    const all = readAll();
    const existed = key in all;
    delete all[key];
    writeAll(all);
    return { key, deleted: existed };
  },
};
