const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const fileInput = document.querySelector('#cadFile');
const fileName = document.querySelector('#fileName');
const fileStatus = document.querySelector('#fileStatus');
const runButton = document.querySelector('#runDemo');
const progressPanel = document.querySelector('#progressPanel');
const progressText = document.querySelector('#progressText');
const progressValue = document.querySelector('#progressValue');
const progressTrack = document.querySelector('[role="progressbar"]');
const progressBar = document.querySelector('#progressBar');
const toast = document.querySelector('#toast');
const groupFilter = document.querySelector('#groupFilter');

function activateTab(tab) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    activateTab(tabs[nextIndex]);
  });
});

fileInput.addEventListener('change', () => {
  const selected = fileInput.files[0];
  if (!selected) return;
  fileName.textContent = selected.name;
  fileStatus.textContent = '檔案只在本機選取。這個展示版不會上傳或實際解析新案件。';
  showToast('已選擇圖檔。請用友愛街範例展示目前已驗證的結果。', false);
});

const progressStages = [
  { value: 18, text: '正在檢查圖層與圖框' },
  { value: 46, text: '正在辨識樓層、梁版與柱牆' },
  { value: 74, text: '正在計算長度、數量與單位重' },
  { value: 100, text: '正在與開發標準答案核對' }
];

runButton.addEventListener('click', async () => {
  runButton.disabled = true;
  progressPanel.hidden = false;
  for (const stage of progressStages) {
    progressText.textContent = stage.text;
    progressValue.textContent = `${stage.value}%`;
    progressTrack.setAttribute('aria-valuenow', String(stage.value));
    progressBar.style.width = `${stage.value}%`;
    await wait(420);
  }
  fileName.textContent = '友愛街 3F梁版以上 114.08.28.dwg';
  fileStatus.textContent = '範例已載入。正式流程只需要建築師交付的 AutoCAD 圖檔。';
  runButton.disabled = false;
  showToast('友愛街範例已完成辨識展示，總量符合標準答案。', true);
  setTimeout(() => { progressPanel.hidden = true; }, 900);
});

groupFilter.addEventListener('change', () => {
  document.querySelectorAll('#summaryRows tr').forEach((row) => {
    row.hidden = groupFilter.value !== 'all' && row.dataset.group !== groupFilter.value;
  });
});

function wait(ms) { return new Promise((resolve) => window.setTimeout(resolve, ms)); }

function showToast(message, success) {
  toast.textContent = message;
  toast.style.borderLeftColor = success ? 'var(--success)' : 'var(--primary)';
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 3800);
}
