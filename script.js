let items = [
  {id:1, name:"Coke",    quantity:5,  unit:"ขวด",   threshold:10},
  {id:2, name:"Sprite", quantity:42, unit:"ขวด",  threshold:20},
  {id:3, name:"น้ำส้ม",   quantity:8,  unit:"ขวด",   threshold:15},
  {id:4, name:"น้ำเปล่า",      quantity:3,  unit:"ขวด",  threshold:10},
  {id:5, name:"น้ำแดง โซดา",       quantity:25, unit:"ขวด",   threshold:5 },
];

let removeTarget = null;

// ---- Storage ----
function save() {
  try { localStorage.setItem('wms_items', JSON.stringify(items)); } catch(e){}
}
function load() {
  try {
    const d = localStorage.getItem('wms_items');
    if (d) items = JSON.parse(d);
  } catch(e){}
}

// ---- Render ----
function renderAll() {
  renderStats();
  renderTable();
  renderDatalist();
  renderAlert();
}

function renderStats() {
  const low  = items.filter(i => i.quantity > 0 && i.quantity <= i.threshold);
  const empty = items.filter(i => i.quantity === 0);
  const total = items.reduce((s,i) => s + i.quantity, 0);

  document.getElementById('statTotal').innerHTML = items.length + '<span class="stat-unit">รายการ</span>';
  document.getElementById('statUnits').innerHTML = total.toLocaleString() + '<span class="stat-unit">หน่วย</span>';
  document.getElementById('statLow').innerHTML   = low.length + '<span class="stat-unit">รายการ</span>';
  document.getElementById('statEmpty').innerHTML = empty.length + '<span class="stat-unit">รายการ</span>';

  document.getElementById('statLowCard').className  = 'stat-card' + (low.length > 0 ? ' warn' : '');
  document.getElementById('statEmptyCard').className = 'stat-card' + (empty.length > 0 ? ' danger' : '');
}

function renderAlert() {
  const low   = items.filter(i => i.quantity <= i.threshold).length;
  const empty = items.filter(i => i.quantity === 0).length;
  const el    = document.getElementById('headerAlert');
  const txt   = document.getElementById('headerAlertText');

  if (low > 0) {
    el.classList.remove('hidden');
    txt.textContent = `สินค้าใกล้หมด ${low} รายการ` + (empty > 0 ? ` (หมด ${empty})` : '');
  } else {
    el.classList.add('hidden');
  }
}

function renderDatalist() {
  const dl = document.getElementById('nameList');
  dl.innerHTML = items.map(i => `<option value="${i.name}">`).join('');
}

function renderTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = q ? items.filter(i => i.name.toLowerCase().includes(q)) : items;

  document.getElementById('itemCount').textContent =
    q ? `${filtered.length} / ${items.length} รายการ` : `${items.length} รายการ`;

  const tbody = document.getElementById('tableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">${q ? 'ไม่พบสินค้าที่ค้นหา' : 'ยังไม่มีสินค้าในคลัง'}</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const isEmpty = item.quantity === 0;
    const isLow   = item.quantity <= item.threshold;
    const badgeCls = isEmpty ? 'badge-empty' : isLow ? 'badge-low' : 'badge-ok';
    const badgeTxt = isEmpty ? 'หมด' : isLow ? 'ใกล้หมด' : 'ปกติ';
    const barCls   = isEmpty ? 'progress-empty' : isLow ? 'progress-low' : 'progress-ok';
    const pct      = Math.min(100, Math.round((item.quantity / Math.max(item.quantity, item.threshold * 3)) * 100));

    return `
      <tr>
        <td>
          <div class="item-name">${esc(item.name)}</div>
          <div class="item-unit">
            แจ้งเตือน ≤ <span class="thr-link" onclick="editThr(${item.id})" title="คลิกเพื่อแก้ไข" id="thr-${item.id}">${item.threshold}</span> ${esc(item.unit)}
          </div>
        </td>
        <td>
          <div class="qty-value">${item.quantity.toLocaleString()}</div>
          <div class="item-unit">${esc(item.unit)}</div>
        </td>
        <td><span class="badge ${badgeCls}"><span class="badge-dot"></span>${badgeTxt}</span></td>
        <td style="min-width:80px">
          <div class="progress-wrap">
            <div class="progress-bar ${barCls}" style="width:${pct}%"></div>
          </div>
        </td>
        <td>
          <div class="actions">
            <button class="btn btn-sm btn-danger" onclick="openRemove(${item.id})">นำออก</button>
            <button class="btn btn-sm btn-ghost"  onclick="deleteItem(${item.id})">ลบ</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ---- Add ----
document.getElementById('inputName').addEventListener('input', function() {
  const name = this.value.trim().toLowerCase();
  const match = items.find(i => i.name.toLowerCase() === name);
  const hint  = document.getElementById('mergeHint');
  const ug    = document.getElementById('unitGroup');
  const tg    = document.getElementById('thrGroup');

  if (match) {
    hint.textContent = `สินค้านี้มีอยู่แล้ว (${match.quantity} ${match.unit}) — จำนวนจะบวกเพิ่มให้อัตโนมัติ`;
    hint.classList.add('show');
    ug.style.display = 'none';
    tg.style.display = 'none';
  } else {
    hint.classList.remove('show');
    ug.style.display = '';
    tg.style.display = '';
  }
});

function addItem() {
  const name = document.getElementById('inputName').value.trim();
  const qty  = parseInt(document.getElementById('inputQty').value);
  const unit = document.getElementById('inputUnit').value.trim() || 'ชิ้น';
  const thr  = parseInt(document.getElementById('inputThr').value) || 10;

  if (!name) { showToast('กรุณาใส่ชื่อสินค้า', 'error'); return; }
  if (isNaN(qty) || qty <= 0) { showToast('กรุณาใส่จำนวนที่ถูกต้อง', 'error'); return; }

  const existing = items.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.quantity += qty;
    showToast(`เพิ่ม "${existing.name}" +${qty} (รวม ${existing.quantity} ${existing.unit})`);
  } else {
    items.push({ id: Date.now(), name, quantity: qty, unit, threshold: thr });
    showToast(`เพิ่มสินค้าใหม่ "${name}" จำนวน ${qty} ${unit}`);
  }

  document.getElementById('inputName').value = '';
  document.getElementById('inputQty').value  = '';
  document.getElementById('inputUnit').value  = '';
  document.getElementById('inputThr').value   = '10';
  document.getElementById('mergeHint').classList.remove('show');
  document.getElementById('unitGroup').style.display = '';
  document.getElementById('thrGroup').style.display  = '';

  save(); renderAll();
}

// Enter key on qty
document.getElementById('inputQty').addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });

// ---- Remove ----
function openRemove(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  removeTarget = id;
  document.getElementById('modalTitle').textContent = 'นำออก: ' + item.name;
  document.getElementById('modalSub').textContent   = `มีอยู่ ${item.quantity} ${item.unit}`;
  document.getElementById('modalQty').value = '';
  document.getElementById('modalQty').max   = item.quantity;
  document.getElementById('removeModal').classList.add('show');
  setTimeout(() => document.getElementById('modalQty').focus(), 50);
}

function closeModal() {
  document.getElementById('removeModal').classList.remove('show');
  removeTarget = null;
}

document.getElementById('removeModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function confirmRemove() {
  const qty  = parseInt(document.getElementById('modalQty').value);
  const item = items.find(i => i.id === removeTarget);
  if (!item) return;

  if (isNaN(qty) || qty <= 0) { showToast('กรุณาใส่จำนวนที่ถูกต้อง', 'error'); return; }
  if (qty > item.quantity) { showToast(`จำนวนเกิน stock ที่มีอยู่ (${item.quantity} ${item.unit})`, 'error'); return; }

  item.quantity -= qty;
  showToast(`นำออก "${item.name}" -${qty} ${item.unit} (เหลือ ${item.quantity})`);
  closeModal(); save(); renderAll();
}

// ---- Delete ----
function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  if (!confirm(`ลบ "${item.name}" ออกจากคลังสินค้า?`)) return;
  items = items.filter(i => i.id !== id);
  showToast(`ลบ "${item.name}" ออกแล้ว`, 'info');
  save(); renderAll();
}

// ---- Edit threshold ----
function editThr(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  const span = document.getElementById(`thr-${id}`);
  if (!span) return;

  const inp = document.createElement('input');
  inp.type  = 'number';
  inp.min   = '1';
  inp.value = item.threshold;
  inp.className = 'thr-edit';

  const save_ = () => {
    const v = parseInt(inp.value);
    if (!isNaN(v) && v > 0) { item.threshold = v; save(); renderAll(); }
    else renderTable();
  };

  inp.addEventListener('blur', save_);
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') inp.blur();
    if (e.key === 'Escape') { item.threshold = item.threshold; renderTable(); }
  });

  span.replaceWith(inp);
  inp.focus(); inp.select();
}

// ---- Toast ----
function showToast(msg, type = 'success') {
  const wrap = document.getElementById('toastWrap');
  const el   = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 2900);
}

// ---- Escape ----
function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- Init ----
load();
renderAll();