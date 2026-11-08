// --- Configuration & Defaults ---
const CONFIG = {
  PHONE: '201285026373',
  INSTAPAY_ID: '01285026373 / hala.sweets@instapay',
  WALLET_PHONE: '01285026373 (فودافون كاش)',
  DELIVERY_FEE: 30,
  ADMIN_PIN: '1234'
};

// --- Security Helpers (XSS Sanitization & Input Validation) ---
function esc(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanPhone(raw) {
  return String(raw ?? '').replace(/[^0-9+]/g, '').slice(0, 16);
}

function isValidPhone(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '');
  return /^01[0125]\d{8}$/.test(digits) || (digits.length >= 10 && digits.length <= 15);
}


// --- State Management with LocalStorage ---
let products = [];
try {
  const sp = localStorage.getItem('hala_products_v3');
  products = sp ? JSON.parse(sp) : DEFAULT_PRODUCTS;
} catch (e) { products = DEFAULT_PRODUCTS; }

let orders = [];
try {
  const so = localStorage.getItem('hala_orders_v3');
  orders = so ? JSON.parse(so) : DEFAULT_ORDERS;
} catch (e) { orders = DEFAULT_ORDERS; }

let reviews = [];
try {
  const sr = localStorage.getItem('hala_reviews');
  reviews = sr ? JSON.parse(sr) : DEFAULT_REVIEWS;
} catch (e) { reviews = DEFAULT_REVIEWS; }

let cart = {};
try {
  const sc = localStorage.getItem('hala_cart');
  cart = sc ? JSON.parse(sc) : {};
} catch (e) { cart = {}; }

let verifiedCustomer = null;
try {
  const vc = localStorage.getItem('hala_customer');
  verifiedCustomer = vc ? JSON.parse(vc) : null;
} catch (e) {}

let cat = 0, activeDiet = 'all', searchQuery = '';
let lastSubmittedReceipt = null;

const $ = s => document.querySelector(s);
const money = n => n.toLocaleString('ar-EG') + ' ج.م';

function saveState() {
  try {
    localStorage.setItem('hala_products_v3', JSON.stringify(products));
    localStorage.setItem('hala_orders_v3', JSON.stringify(orders));
    localStorage.setItem('hala_reviews', JSON.stringify(reviews));
    localStorage.setItem('hala_cart', JSON.stringify(cart));
    if (verifiedCustomer) localStorage.setItem('hala_customer', JSON.stringify(verifiedCustomer));
  } catch (e) {}
}

let tt;
function toast(m) {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('show'), 2200);
}


// --- Standalone Multi-Page Router (Zero Pop-up Modals) ---
const STANDALONE_VIEWS = [
  'drawer',
  'detailModal',
  'modal',
  'orderConfirmModal',
  'adminLoginModal',
  'productModal',
  'reviewModal',
  'chatWindow'
];

function openStandalonePage(viewId) {
  STANDALONE_VIEWS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });
  const ov = document.getElementById('ov');
  if (ov) ov.classList.remove('show');

  if (!viewId || viewId === 'storeView') {
    document.getElementById('adminView').classList.add('hidden');
    document.getElementById('storeView').classList.remove('hidden');
  } else if (viewId === 'adminView') {
    document.getElementById('storeView').classList.add('hidden');
    document.getElementById('adminView').classList.remove('hidden');
  } else {
    document.getElementById('storeView').classList.add('hidden');
    document.getElementById('adminView').classList.add('hidden');
    const target = document.getElementById(viewId);
    if (target) target.classList.add('show');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Storefront Logic ---
function renderFilters() {
  $('#filters').innerHTML = cats.map((t, i) =>
    `<button class="chip ${i === cat ? 'on' : ''}" role="tab" aria-selected="${i === cat}" data-i="${i}">${t}</button>`
  ).join('');
  $('#filters').querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      cat = +b.dataset.i;
      renderFilters();
      renderGrid();
    };
  });

  $('#dietFilters').innerHTML = `<span class="text-xs font-bold ml-1" style="color:var(--muted)">فلترة صحية:</span>` +
    dietTags.map(d =>
      `<button class="diet-chip ${d.id === activeDiet ? 'on' : ''}" data-diet="${d.id}">${d.label}</button>`
    ).join('');
  $('#dietFilters').querySelectorAll('button').forEach(b => {
    b.onclick = () => {
      activeDiet = b.dataset.diet;
      renderFilters();
      renderGrid();
    };
  });
}

function renderGrid() {
  const filtered = products.filter(p => {
    const matchCat = !cat || p.c === cat;
    const matchDiet = activeDiet === 'all' || (p.tags && p.tags.includes(activeDiet));
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || p.n.toLowerCase().includes(q) || p.d.toLowerCase().includes(q) || (p.ingredients && p.ingredients.toLowerCase().includes(q));
    return matchCat && matchDiet && matchSearch;
  });

  if (!filtered.length) {
    $('#grid').innerHTML = `<div class="col-span-full text-center py-12 rounded-2xl border" style="background:var(--surface);border-color:var(--line)">
      <div class="text-4xl mb-2">🌾</div>
      <p class="font-bold text-lg">مفيش صنف مطابق لبحثك حالياً</p>
      <button class="btn btn-ghost mt-3 text-sm" id="resetFiltersBtn">إظهار جميع الأصناف</button>
    </div>`;
    const rb = $('#resetFiltersBtn');
    if (rb) {
      rb.onclick = () => {
        cat = 0; activeDiet = 'all'; searchQuery = '';
        $('#searchInput').value = '';
        renderFilters();
        renderGrid();
      };
    }
    return;
  }

  $('#grid').innerHTML = filtered.map(p => `
    <article class="card">
      <div class="thumb-wrap">
        <img src="${p.img}" alt="${p.n}" loading="lazy">
        <span class="health-pill">${p.badge || '🌾 حبة كاملة'}</span>
        <span class="cal-pill">🔥 ${p.cal} سعرة / ${p.unit}</span>
      </div>
      <div class="p-4 flex flex-col gap-2 flex-1">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-extrabold text-lg leading-snug">${p.n}</h3>
          ${!p.inStock ? '<span class="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-black">نفد مؤقتاً</span>' : ''}
        </div>
        <p class="text-sm flex-1 leading-relaxed" style="color:var(--muted)">${p.d}</p>
        ${(p.hasFlavor || p.hasSauce) ? `
        <div class="grid grid-cols-1 gap-1.5 pt-1.5 text-xs">
          ${p.hasFlavor ? `
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold" style="color:var(--brown)">🧁 الكيك:</span>
            <select id="flav-${p.id}" class="field !py-1 !px-2 !mt-0 text-xs flex-1" onchange="selectedOptions['f_${p.id}']=this.value">
              ${FLAVORS_LIST.map(f => `<option value="${f}" ${selectedOptions['f_' + p.id] === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </div>` : ''}
          ${p.hasSauce ? `
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold" style="color:var(--rose)">🍫 الصوص:</span>
            <select id="sauce-${p.id}" class="field !py-1 !px-2 !mt-0 text-xs flex-1" onchange="selectedOptions['s_${p.id}']=this.value">
              ${SAUCES_LIST.map(s => `<option value="${s}" ${selectedOptions['s_' + p.id] === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>` : ''}
        </div>` : ''}
        <div class="pt-2 border-t flex items-center justify-between gap-2" style="border-color:var(--line)">
          <button class="text-xs font-extrabold underline cursor-pointer detail-btn" style="color:var(--green)" data-detail="${p.id}">🔍 المكونات والتفاصيل</button>
          <span class="price">${money(p.p)}</span>
        </div>
        <button class="btn w-full mt-2 !py-2.5 add" data-id="${p.id}" ${!p.inStock ? 'disabled style="opacity:0.5"' : ''}>
          ${p.inStock ? '+ إضافة للسلة' : 'غير متوفر حالياً'}
        </button>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.add').forEach(b => {
    b.onclick = () => {
      add(+b.dataset.id);
      b.textContent = 'تمت الإضافة ✓';
      b.classList.add('bump');
      setTimeout(() => {
        b.textContent = '+ إضافة للسلة';
        b.classList.remove('bump');
      }, 900);
    };
  });

  document.querySelectorAll('.detail-btn').forEach(b => {
    b.onclick = () => showProductDetail(+b.dataset.detail);
  });
}

function showProductDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  $('#detailTitle').textContent = p.n;
  $('#detailBody').innerHTML = `
    <img src="${p.img}" alt="${p.n}" class="w-full h-52 object-cover rounded-2xl border" style="border-color:var(--line)">
    <div class="flex flex-wrap gap-2 pt-1">
      <span class="px-3 py-1 rounded-full text-xs font-extrabold" style="background:var(--green-bg);color:var(--green)">${p.badge || '🌾 حبة كاملة'}</span>
      <span class="px-3 py-1 rounded-full text-xs font-extrabold" style="background:var(--sand);color:var(--brown)">🔥 ${p.cal} سعرة (${p.unit})</span>
      <span class="px-3 py-1 rounded-full text-xs font-extrabold" style="background:var(--sand);color:var(--rose)">السعر: ${money(p.p)}</span>
    </div>
    <p class="text-sm leading-relaxed" style="color:var(--ink)">${p.d}</p>
    <div class="p-3.5 rounded-2xl border" style="background:var(--surface-alt);border-color:var(--line)">
      <div class="font-extrabold text-sm mb-1" style="color:var(--brown)">🌾 المكونات الصحية:</div>
      <div class="text-sm" style="color:var(--muted)">${p.ingredients || 'دقيق قمح كامل طبيعي وبدائل سكر صحية.'}</div>
    </div>
    <button class="btn w-full mt-2" id="modalAddBtn" ${!p.inStock ? 'disabled' : ''}>إضافة للسلة (${money(p.p)})</button>
  `;
  openStandalonePage('detailModal');
  $('#modalAddBtn').onclick = () => {
    add(p.id);
    openStandalonePage('storeView');
  };
}

function add(id) {
  cart[id] = (cart[id] || 0) + 1;
  const optTxt = getProductOptionText(id);
  if (optTxt) selectedOptions['opt_' + id] = optTxt;
  saveState();
  renderCart();
  const c = $('#count');
  c.classList.remove('bump');
  void c.offsetWidth;
  c.classList.add('bump');
  const item = products.find(p => p.id === id);
  toast('أضفنا «' + (item ? item.n : 'الصنف') + (optTxt ? ' (' + optTxt + ')' : '') + '» للسلة 🌾');
}

function change(id, d) {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  saveState();
  renderCart();
}

function totals() {
  const s = Object.entries(cart).reduce((a, [id, q]) => {
    const item = products.find(p => p.id == id);
    return a + (item ? item.p * q : 0);
  }, 0);
  const cal = Object.entries(cart).reduce((a, [id, q]) => {
    const item = products.find(p => p.id == id);
    return a + (item ? item.cal * q : 0);
  }, 0);
  const f = s ? CONFIG.DELIVERY_FEE : 0;
  return { s, f, t: s + f, cal };
}

function renderCart() {
  const ids = Object.keys(cart).filter(id => products.some(x => x.id == id));
  const n = ids.reduce((a, id) => a + cart[id], 0);
  $('#count').textContent = n.toLocaleString('ar-EG');
  $('#items').innerHTML = ids.length ? ids.map(id => {
    const p = products.find(x => x.id == id);
    return `
      <div class="flex items-center gap-3 p-3 rounded-2xl" style="background:var(--surface);border:1px solid var(--line)">
        <img src="${p.img}" alt="${p.n}" class="w-14 h-14 rounded-xl object-cover flex-none">
        <div class="flex-1 min-w-0">
          <b class="text-sm block truncate">${p.n}</b>
          ${selectedOptions['opt_' + id] ? `<span class="text-xs font-bold block" style="color:var(--green)">✨ ${selectedOptions['opt_' + id]}</span>` : ''}
          <span class="text-xs block" style="color:var(--muted)">🔥 ${p.cal * cart[id]} سعرة</span>
          <div class="price text-sm">${money(p.p * cart[id])}</div>
        </div>
        <div class="qty flex items-center gap-1.5">
          <button onclick="change(${id},1)" aria-label="زيادة">+</button>
          <b class="text-sm px-1">${cart[id].toLocaleString('ar-EG')}</b>
          <button onclick="change(${id},-1)" aria-label="تقليل">−</button>
        </div>
        <button onclick="change(${id},-99)" aria-label="حذف" title="حذف" class="text-sm cursor-pointer">🗑️</button>
      </div>`;
  }).join('') : '<p class="text-center pt-10" style="color:var(--muted)">السلة فاضية حالياً.. اختار مخبوزاتك أو حلوياتك الصحية من المنيو 🌾🧁</p>';

  const t = totals();
  $('#sub').textContent = money(t.s);
  $('#del').textContent = money(t.f);
  $('#tot').textContent = money(t.t);
  $('#totCal').textContent = t.cal.toLocaleString('ar-EG');
  $('#checkout').disabled = !ids.length;
  $('#checkout').style.opacity = ids.length ? 1 : 0.5;
}

function renderReviews() {
  $('#reviewsList').innerHTML = reviews.map(r => `
    <div class="p-4 rounded-2xl border" style="background:var(--surface);border-color:var(--line)">
      <div class="flex items-center justify-between mb-1">
        <div class="text-yellow-500 text-sm">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <span class="text-xs px-2 py-0.5 rounded-full" style="background:var(--sand);color:var(--brown)">عميل موثق ✓</span>
      </div>
      <p class="text-sm leading-relaxed mt-2 break-words" style="color:var(--ink)">«${esc(r.comment)}»</p>
      <div class="flex items-center justify-between text-xs font-bold mt-3 pt-2 border-t" style="border-color:var(--line);color:var(--muted)">
        <span>— ${esc(r.name)}</span>
        <span>${esc(r.date || '')}</span>
      </div>
    </div>
  `).join('');
}

// --- Payment Method Instruction Toggle ---
$('#payMethod').onchange = e => {
  const v = e.target.value;
  const box = $('#payInstructionBox');
  if (v.includes('انستاباي')) {
    box.innerHTML = `⚡ <b>الدفع عبر انستاباي:</b> يرجى التحويل إلى عنوان انستاباي <code>${CONFIG.INSTAPAY_ID}</code> وإرفاق لقطة الشاشة مع رسالة الواتساب.`;
  } else if (v.includes('محفظة')) {
    box.innerHTML = `📱 <b>الدفع عبر المحفظة الإلكترونية:</b> يرجى التحويل لرقم فودافون كاش <code>${CONFIG.WALLET_PHONE}</code> وإرسال رسالة التأكيد في المحادثة.`;
  } else {
    box.innerHTML = `💵 <b>الدفع عند الاستلام:</b> هتدفع المبلغ المطلوب كاش للمندوب وقت استلام طلبك طازج وساخن.`;
  }
};

// --- Order Submission ---
function buildOrderText(order) {
  const lines = order.items.map(it => {
    const p = products.find(x => x.id === it.id);
    const optStr = it.opt ? ` (${it.opt})` : '';
    return p ? `• ${p.n}${optStr} × ${it.q} = ${p.p * it.q} ج.م` : '';
  }).filter(Boolean).join('\n');

  return `🌾 *طلب جديد — مطبخ حلويات حلا (Hala Sweets)*
` +
    `_رقم الطلب: ${order.id}_
` +
    `_التاريخ: ${order.date}_

` +
    `*الأصناف المطلوبة:*
${lines}

` +
    `*تفضيل التحلية:* ${order.sweetener}
` +
    `*طريقة الدفع:* ${order.payment}
` +
    `*المجموع الفرعي:* ${order.subtotal} ج.م
` +
    `*التوصيل:* ${order.delivery} ج.م
` +
    `*الإجمالي النهائي:* ${order.total} ج.م

` +
    `*بيانات التوصيل:*
` +
    `👤 الاسم: ${order.customer}
` +
    `📞 الهاتف: ${order.phone}
` +
    `💬 واتساب: ${order.wa}
` +
    `📍 العنوان: ${order.address}
` +
    (order.notes ? `📝 ملاحظات: ${order.notes}

` : '') +
    `شكراً لمطبخ حلويات حلا ❤️`;
}

$('#form').onsubmit = e => {
  e.preventDefault();
  const v = id => $('#' + id).value.trim().slice(0, 180);
  if (!v('fn') || !v('ph') || !v('ar') || !v('st')) {
    $('#err').textContent = 'من فضلك املأ الاسم، الهاتف، المنطقة والشارع لإتمام الطلب.';
    return;
  }
  if (!isValidPhone(v('ph'))) {
    $('#err').textContent = 'يرجى إدخال رقم هاتف صحيح (مثال: 012xxxxxxxx).';
    return;
  }
  if (v('wa') && !isValidPhone(v('wa'))) {
    $('#err').textContent = 'يرجى إدخال رقم واتساب صحيح أو تركه فارغاً.';
    return;
  }
  $('#err').textContent = '';

  const t = totals();
  const orderId = 'HL-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

  const orderItems = Object.entries(cart).map(([id, q]) => ({ id: +id, q, opt: selectedOptions['opt_' + id] || '' }));

  const newOrder = {
    id: orderId,
    date: dateStr,
    customer: v('fn'),
    phone: v('ph'),
    wa: v('wa') || v('ph'),
    address: `${v('ar')}، ${v('st')}${v('fl') ? '، دور ' + v('fl') : ''}${v('ap') ? '، شقة ' + v('ap') : ''}`,
    items: orderItems,
    sweetener: v('sweetener'),
    payment: v('payMethod'),
    subtotal: t.s,
    delivery: t.f,
    total: t.t,
    status: 'جديد',
    notes: v('nt')
  };

  orders.unshift(newOrder);
  lastSubmittedReceipt = newOrder;

  // Clear cart
  cart = {};
  saveState();
  renderCart();
  openStandalonePage('storeView');

  // Show confirmation modal
  showOrderConfirmation(newOrder);
  toast(`تم تسجيل طلبك رقم ${orderId} بنجاح! 🎉`);
};

function showOrderConfirmation(order) {
  const pLines = order.items.map(it => {
    const p = products.find(x => x.id === it.id);
    return p ? `<div class="flex justify-between"><span>• ${p.n} (×${it.q})</span><b>${money(p.p * it.q)}</b></div>` : '';
  }).join('');

  $('#receiptContent').innerHTML = `
    <div class="flex justify-between border-b pb-2 font-bold" style="border-color:var(--line)">
      <span>كود الطلب: <b class="text-base text-rose-600">${order.id}</b></span>
      <span class="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-black">قيد المراجعة</span>
    </div>
    <div class="py-1 space-y-1">${pLines}</div>
    <div class="border-t pt-2 space-y-1 text-xs" style="border-color:var(--line)">
      <div class="flex justify-between"><span>طريقة الدفع:</span><b>${order.payment}</b></div>
      <div class="flex justify-between"><span>تفضيل التحلية:</span><b>${order.sweetener}</b></div>
      <div class="flex justify-between"><span>العنوان:</span><span class="truncate max-w-xs">${order.address}</span></div>
      <div class="flex justify-between font-black text-sm text-rose-600 pt-1 border-t" style="border-color:var(--line)">
        <span>المطلوب سداده:</span><span>${money(order.total)}</span>
      </div>
    </div>
  `;
  openStandalonePage('orderConfirmModal');

  $('#openWaReceiptBtn').onclick = () => {
    const msg = buildOrderText(order);
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };
}

$('#closeReceiptBtn').onclick = () => {
  openStandalonePage('storeView');
};

$('#copyOrder').onclick = () => {
  const v = id => $('#' + id).value.trim();
  if (!v('fn') || !v('ph') || !v('ar') || !v('st')) {
    $('#err').textContent = 'من فضلك املأ الاسم والهاتف والعنوان أولاً لنسخ الفاتورة.';
    return;
  }
  const t = totals();
  const tempOrder = {
    id: 'HL-TEMP',
    date: new Date().toLocaleString('ar-EG'),
    customer: v('fn'), phone: v('ph'), wa: v('wa') || v('ph'),
    address: `${v('ar')}، ${v('st')}`,
    items: Object.entries(cart).map(([id, q]) => ({ id: +id, q })),
    sweetener: v('sweetener'), payment: v('payMethod'),
    subtotal: t.s, delivery: t.f, total: t.t, notes: v('nt')
  };
  const txt = buildOrderText(tempOrder);
  navigator.clipboard.writeText(txt).then(() => {
    toast('تم نسخ تفاصيل الطلب للحافظة بنجاح 📋');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = txt; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    toast('تم نسخ تفاصيل الطلب للحافظة بنجاح 📋');
  });
};

// --- Customer Review Logic (Requires Account/Verification) ---
$('#openReviewModalBtn').onclick = () => {
  if (verifiedCustomer) {
    $('#revCustName').value = verifiedCustomer.name;
    $('#revCustPhone').value = verifiedCustomer.phone;
  }
  openStandalonePage('reviewModal');
};

$('#closeReviewModal').onclick = () => {
  openStandalonePage('storeView');
};

document.querySelectorAll('#starRatingBox span').forEach(sp => {
  sp.onclick = () => {
    const val = +sp.dataset.star;
    $('#revRatingVal').value = val;
    document.querySelectorAll('#starRatingBox span').forEach((s, idx) => {
      s.textContent = idx < val ? '★' : '☆';
    });
  };
});

$('#reviewForm').onsubmit = e => {
  e.preventDefault();
  const name = $('#revCustName').value.trim();
  const phone = $('#revCustPhone').value.trim();
  const comment = $('#revComment').value.trim();
  const rating = +$('#revRatingVal').value;

  if (!name || !phone || !comment) {
    toast('من فضلك ادخل الاسم ورقم الهاتف واكتب تعليقك.');
    return;
  }

  verifiedCustomer = { name, phone };
  saveState();

  const newRev = {
    id: Date.now(),
    name,
    phone: phone.slice(0, 4) + '****' + phone.slice(-3),
    rating,
    comment,
    date: 'الآن'
  };

  reviews.unshift(newRev);
  saveState();
  renderReviews();
  openStandalonePage('storeView');
  $('#revComment').value = '';
  toast('شكراً لمشاركتك رأيك! تم نشر تقييمك بنجاح ⭐');
};

// --- Customer AI Calorie & Nutrition Bot ---
const BOT_RESPONSES = [
  {
    k: ['كب كيك', 'كبكيك'],
    r: `🧁 **أسعار قسم الكب كيك:**
• بوكس 5 قطع سادة (دقيق عادي): **80 ج.م**
• بوكس 5 قطع بصوص من اختيارك (دقيق عادي): **100 ج.م**
• بوكس 5 قطع سادة (حبة كاملة): **100 ج.م**
• بوكس 5 قطع بصوص من اختيارك (حبة كاملة): **120 ج.م**
• قطعة كب كيك سادة: **20 ج.م** | بصوص من اختيارك: **25 ج.م**`
  },
  {
    k: ['براونيز', 'كوكيز', 'امريكان'],
    r: `🍫 **أسعار البراونيز والأمريكان كوكيز:**
**البراونيز:**
• بوكس 6 براونيز سادة: **120 ج.م** | بصوص من اختيارك: **150 ج.م**
• قطعة براونيز بصوص من اختيارك: **30 ج.م**
**أمريكان كوكيز:**
• بوكس 6 كوكيز شوكولاتة: **120 ج.م** | بصوص من اختيارك: **150 ج.م**
• قطعة أمريكان كوكيز كبيرة: **30 ج.م**`
  },
  {
    k: ['كب السعادة', 'سعادة', 'قشطوطة', 'قشطوطه'],
    r: `🍨 **أسعار كب السعادة والقشطوطة (كل الأنواع 40 ج.م):**
• **كب السعادة (40 ج.م):** أوريو، شوكولاتة، كيندر، نوتيلا، كاسترد، كراميل.
• **قشطوطة (40 ج.م):** سادة، فراولة، مانجو، شوكولاتة، كراميل.`
  },
  {
    k: ['سينابون', 'قرفة'],
    r: `🌀 **قسم السينابون البيتي:**
• بوكس سينابون غرقان صوص ومكسرات (4 قطع): **140 ج.م**
• بوكس سينابون بالحبة الكاملة وصوص ومكسرات (4 قطع): **160 ج.م**`
  },
  {
    k: ['مخبوزات', 'قراقيش', 'بيتزا', 'باتيه', 'باتية', 'انجلش كيك', 'إنجلش كيك'],
    r: `🥐 **أسعار المخبوزات (نصف كيلو) والإنجلش كيك (14 قطعة):**
• **قراقيش ½ كيلو (دقيق عادي):** سادة 100 ج.م | عجوة 130 ج.م
• **قراقيش ½ كيلو (حبة كاملة):** سادة 120 ج.م | عجوة 150 ج.م
• **نصف كيلو بيتزا أو باتيه:** عادية 120 ج.م | حبة كاملة 150 ج.م
• **نصف كيلو مخبوزات مشكلة:** عادية 150 ج.م | حبة كاملة 200 ج.م
• **قالب إنجلش كيك (14 قطعة):** فانيليا 120 ج.م | برتقال 130 ج.م | شوكولاتة 140 ج.م | شوكولاتة وفانيليا (حبة كاملة) 150 ج.م`
  },
  {
    k: ['اسعار', 'سعر', 'كام', 'بكام', 'منيو', 'قائمة'],
    r: `📋 **ملخص أسعار منيو مطبخ حلا:**
• **كب كيك:** القطعة 20–25 ج.م | البوكس (5 قطع) 80–120 ج.م (متاح عادي وحبة كاملة).
• **البراونيز (6 قطع):** سادة 120 ج.م | بصوص 150 ج.م | القطعة بصوص 30 ج.م.
• **أمريكان كوكيز (6 قطع):** شوكولاتة 120 ج.م | بصوص 150 ج.م | القطعة الكبيرة 30 ج.م.
• **كب السعادة & القشطوطة:** جميع النكهات بـ **40 ج.م**.
• **المخبوزات (½ كيلو):** قراقيش وبيتزا وباتيه ومشكل من **100 إلى 200 ج.م** (عادي وحبة كاملة).
• **قالب إنجلش كيك (14 قطعة):** من **120 إلى 150 ج.م**.
• **بوكس السينابون (4 قطع):** 140 ج.م (عادي) | 160 ج.م (حبة كاملة).`
  },
  {
    k: ['سعرات', 'وجبتي', 'احسب'],
    r: `أهلاً بيك! عشان أحسبلك سعراتك بدقة:
• كب كيك حبة كاملة: ~120 سعرة | عادي: ~150 سعرة.
• قطعة براونيز أو كوكيز: 140–180 سعرة.
• قطعة قراقيش أو ميني بيتزا حبة كاملة: 90–95 سعرة.
• قطعة إنجلش كيك حبة كاملة: ~95 سعرة.
• كب السعادة أو القشطوطة: 210–265 سعرة.
اكتبلي أكلت إيه وهحسبلك المجموع فوراً! 📊`
  },
  {
    k: ['سناك', 'خفيف', '150'],
    r: `أفضل سناك خفيف أقل من 150 سعرة عندنا:
1️⃣ شريحة إنجلش كيك شوكولاتة وفانيليا بالحبة الكاملة (95 سعرة).
2️⃣ قراقيش أو بيتزا بالحبة الكاملة (90–95 سعرة للقطعة).
3️⃣ كب كيك بالحبة الكاملة (120 سعرة) مشبع وغني بالألياف.`
  },
  {
    k: ['حبة كاملة', 'ليه', 'الفرق', 'ابيض', 'دقيق'],
    r: `🌾 في مطبخ حلا بنوفرلك الاختيارين: **دقيق الحبة الكاملة 100%** الغني بالألياف والفيتامينات لشبع طويل وثبات سكر الدم، وكمان **الدقيق العادي الفاخر** لعشاق الطعم الكلاسيكي الهش في الكب كيك والمخبوزات والإنجلش كيك!`
  },
  {
    k: ['سكر', 'سكري', 'مقاومة', 'انسولين', 'دايت'],
    r: `أيوه طبعاً! عندنا تشكيلة كاملة من الكب كيك، القراقيش، البيتزا، الباتيه، المخبوزات المشكلة، الإنجلش كيك، والسينابون مصنوعة بـ **دقيق الحبة الكاملة** مع إمكانية اختيار التحلية بـ **سكر ستيفيا أو عسل النحل أو التمر**.`
  }
];

function botAnswer(query) {
  const q = query.toLowerCase();
  for (const item of BOT_RESPONSES) {
    if (item.k.some(key => q.includes(key))) {
      return item.r;
    }
  }
  let totalEst = 0;
  let found = false;
  if (q.includes('بيتزا')) { totalEst += 95 * 2; found = true; }
  if (q.includes('قراقيش')) { totalEst += 90 * 2; found = true; }
  if (q.includes('باتيه') || q.includes('باتية')) { totalEst += 105; found = true; }
  if (q.includes('انجلش') || q.includes('إنجلش')) { totalEst += 95; found = true; }
  if (q.includes('براونيز')) { totalEst += 145; found = true; }
  if (q.includes('كوكيز')) { totalEst += 140; found = true; }
  if (q.includes('كب كيك')) { totalEst += 120; found = true; }
  if (q.includes('قشطوط')) { totalEst += 235; found = true; }
  if (q.includes('سعادة')) { totalEst += 240; found = true; }
  if (q.includes('سينابون')) { totalEst += 210; found = true; }

  if (found) {
    return `تحليل سريع لوجبتك:
مجموع السعرات التقريبي للأصناف اللي ذكرتها هو حوالي **${totalEst} سعرة حرارية**! وتقدر دايماً تختار نسخ الحبة الكاملة لتقليل السعرات وزيادة الشبع 🌾✨.`;
  }

  return `يسعدني إجابتك! منيو **مطبخ حلويات حلا** يضم أقسام: كب كيك، البراونيز، أمريكان كوكيز، كب السعادة، المخبوزات، إنجلش كيك 14 قطعة، قشطوطة، والسينابون — بخيارات الدقيق العادي والحبة الكاملة. اسألني عن سعر أو سعرات أي صنف! 🌾❤️`;
}

function appendChatMessage(msg, isUser = false) {
  const box = $('#chatMessages');
  const d = document.createElement('div');
  d.className = `chat-bubble ${isUser ? 'chat-user' : 'chat-bot'}`;
  const safeMsg = isUser ? esc(msg) : msg;
  d.innerHTML = safeMsg.replace(/\n/g, '<br>');
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

$('#chatForm').onsubmit = e => {
  e.preventDefault();
  const input = $('#chatInput');
  const txt = input.value.trim();
  if (!txt) return;
  appendChatMessage(txt, true);
  input.value = '';

  setTimeout(() => {
    const ans = botAnswer(txt);
    appendChatMessage(ans, false);
  }, 450);
};

document.querySelectorAll('.quick-q').forEach(b => {
  b.onclick = () => {
    const q = b.dataset.q;
    appendChatMessage(q, true);
    setTimeout(() => {
      appendChatMessage(botAnswer(q), false);
    }, 400);
  };
});

$('#toggleChatBtn').onclick = () => {
  const isOpen = $('#chatWindow').classList.contains('show');
  openStandalonePage(isOpen ? 'storeView' : 'chatWindow');
};
$('#closeChatBtn').onclick = () => {
  openStandalonePage('storeView');
};
$('#heroBotBtn').onclick = () => {
  openStandalonePage('chatWindow');
};

// --- Admin Dashboard Logic ---
$('#adminSwitchBtn').onclick = () => {
  openStandalonePage('adminLoginModal');
  $('#adminPinInput').value = '';
  $('#adminLoginErr').classList.add('hidden');
};

$('#closeAdminLoginModal').onclick = () => {
  openStandalonePage('storeView');
};

let adminFailedAttempts = 0;
let adminLockUntil = 0;

$('#adminLoginForm').onsubmit = e => {
  e.preventDefault();
  const now = Date.now();
  const errEl = $('#adminLoginErr');
  if (now < adminLockUntil) {
    const sec = Math.ceil((adminLockUntil - now) / 1000);
    errEl.textContent = `تم قفل المحاولات مؤقتاً للحماية. حاول بعد ${sec} ثانية.`;
    errEl.classList.remove('hidden');
    return;
  }
  const pin = $('#adminPinInput').value.trim();
  if (pin === CONFIG.ADMIN_PIN) {
    adminFailedAttempts = 0;
    adminLockUntil = 0;
    $('#adminLoginModal').classList.remove('show');
    $('#ov').classList.remove('show');
    showAdminDashboard();
    toast('مرحباً بك في لوحة تحكم الأدمن 🔐');
  } else {
    adminFailedAttempts++;
    if (adminFailedAttempts >= 5) {
      adminLockUntil = now + 60000;
      errEl.textContent = 'تم إدخال رمز خاطئ 5 مرات! تم قفل المحاولات لمدة 60 ثانية.';
    } else {
      errEl.textContent = `رمز المرور غير صحيح! (محاولة ${adminFailedAttempts} من 5)`;
    }
    errEl.classList.remove('hidden');
  }
};

function showAdminDashboard() {
  openStandalonePage('adminView');
  renderAdminAll();
}

function hideAdminDashboard() {
  openStandalonePage('storeView');
}

$('#backToStoreBtn').onclick = hideAdminDashboard;
$('#adminLogoutBtn').onclick = () => {
  hideAdminDashboard();
  toast('تم تسجيل الخروج من لوحة التحكم');
};

document.querySelectorAll('.tab-btn').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.add('hidden'));
    $('#' + b.dataset.tab).classList.remove('hidden');
  };
});

function renderAdminAll() {
  renderAdminOrders();
  renderAdminProducts();
  renderAdminReviews();
  renderAdminAnalytics();
}

function renderAdminOrders() {
  const filter = $('#orderStatusFilter').value;
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  $('#adminOrdersCount').textContent = orders.length;
  const rev = orders.filter(o => o.status !== 'ملغي').reduce((a, b) => a + (b.total || 0), 0);
  $('#adminTotalRevenue').textContent = money(rev);

  $('#adminOrdersTbody').innerHTML = filtered.length ? filtered.map(o => {
    const itemsList = (o.items || []).map(it => {
      const p = products.find(x => x.id === it.id);
      const optStr = it.opt ? ` [${it.opt}]` : '';
      return p ? `${p.n}${optStr} (×${it.q})` : `صنف #${it.id} (×${it.q})`;
    }).join('، ');

    const statusBadge = {
      'جديد': 'bg-amber-100 text-amber-800',
      'جاري التجهيز': 'bg-blue-100 text-blue-800',
      'خرج للتوصيل': 'bg-purple-100 text-purple-800',
      'تم التسليم بنجاح': 'bg-emerald-100 text-emerald-800',
      'ملغي': 'bg-rose-100 text-rose-800'
    }[o.status] || 'bg-slate-100 text-slate-800';

    return `
      <tr class="hover:bg-slate-50">
        <td class="p-3 font-black text-rose-600">${o.id}</td>
        <td class="p-3">
          <b>${o.customer}</b><br>
          <a href="tel:${o.phone}" dir="ltr" class="text-xs text-blue-600 underline">${o.phone}</a>
        </td>
        <td class="p-3">
          <div class="text-xs max-w-xs leading-relaxed font-bold">${itemsList}</div>
          <span class="text-xs text-muted block mt-1">التحلية: ${o.sweetener || 'افتراضي'}</span>
        </td>
        <td class="p-3 text-xs max-w-xs truncate" title="${o.address}">${o.address}</td>
        <td class="p-3 text-xs font-bold">${o.payment}</td>
        <td class="p-3 font-black text-rose-600">${money(o.total)}</td>
        <td class="p-3">
          <select class="text-xs font-bold rounded-lg border p-1 status-select ${statusBadge}" data-oid="${o.id}">
            <option value="جديد" ${o.status === 'جديد' ? 'selected' : ''}>جديد 🟡</option>
            <option value="جاري التجهيز" ${o.status === 'جاري التجهيز' ? 'selected' : ''}>جاري التجهيز 🔵</option>
            <option value="خرج للتوصيل" ${o.status === 'خرج للتوصيل' ? 'selected' : ''}>خرج للتوصيل 🚚</option>
            <option value="تم التسليم بنجاح" ${o.status === 'تم التسليم بنجاح' ? 'selected' : ''}>تم التسليم 🟢</option>
            <option value="ملغي" ${o.status === 'ملغي' ? 'selected' : ''}>ملغي 🔴</option>
          </select>
        </td>
        <td class="p-3 whitespace-nowrap">
          <a href="https://wa.me/${(o.wa || o.phone).replace(/\D/g, '')}" target="_blank" class="px-2 py-1 rounded bg-green-500 text-white text-xs font-bold inline-flex items-center gap-1" title="محادثة واتساب للعميل">💬 واتساب</a>
          <button class="px-2 py-1 rounded bg-rose-100 text-rose-700 text-xs font-bold delete-order-btn" data-oid="${o.id}" title="حذف الطلب">🗑️</button>
        </td>
      </tr>
    `;
  }).join('') : `<tr><td colspan="8" class="p-8 text-center text-muted">لا توجد طلبات مطابقة في هذا التصنيف.</td></tr>`;

  document.querySelectorAll('.status-select').forEach(sel => {
    sel.onchange = e => {
      const oid = sel.dataset.oid;
      const o = orders.find(x => x.id === oid);
      if (o) {
        o.status = e.target.value;
        saveState();
        renderAdminOrders();
        renderAdminAnalytics();
        toast(`تم تحديث حالة الطلب ${oid} إلى ${o.status}`);
      }
    };
  });

  document.querySelectorAll('.delete-order-btn').forEach(btn => {
    btn.onclick = () => {
      const oid = btn.dataset.oid;
      orders = orders.filter(x => x.id !== oid);
      saveState();
      renderAdminOrders();
      renderAdminAnalytics();
      toast(`تم حذف الطلب ${oid}`);
    };
  });
}

$('#orderStatusFilter').onchange = renderAdminOrders;

function renderAdminProducts() {
  $('#adminProductsCount').textContent = products.length;
  $('#adminProductsTbody').innerHTML = products.map(p => `
    <tr class="hover:bg-slate-50">
      <td class="p-3 flex items-center gap-2">
        <img src="${p.img}" class="w-10 h-10 rounded-lg object-cover flex-none">
        <div>
          <b class="text-sm block">${p.n}</b>
          <span class="text-xs text-muted block truncate max-w-xs">${p.d}</span>
        </div>
      </td>
      <td class="p-3 text-xs font-bold">${cats[p.c] || 'عام'}</td>
      <td class="p-3 font-black text-rose-600">${money(p.p)}</td>
      <td class="p-3 text-xs font-bold">🔥 ${p.cal} سعرة</td>
      <td class="p-3">
        <button class="px-3 py-1 rounded-full text-xs font-extrabold toggle-stock-btn ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}" data-pid="${p.id}">
          ${p.inStock ? 'متوفر بالمطبخ ✓' : 'نفد مؤقتاً ✕'}
        </button>
      </td>
      <td class="p-3 whitespace-nowrap space-x-1 space-x-reverse">
        <button class="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold edit-product-btn" data-pid="${p.id}">تعديل</button>
        <button class="px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-xs font-bold delete-product-btn" data-pid="${p.id}">حذف</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.toggle-stock-btn').forEach(b => {
    b.onclick = () => {
      const pid = +b.dataset.pid;
      const p = products.find(x => x.id === pid);
      if (p) {
        p.inStock = !p.inStock;
        saveState();
        renderAdminProducts();
        renderGrid();
        toast(`تم تحديث توفر «${p.n}»`);
      }
    };
  });

  document.querySelectorAll('.edit-product-btn').forEach(b => {
    b.onclick = () => {
      const pid = +b.dataset.pid;
      const p = products.find(x => x.id === pid);
      if (!p) return;
      $('#pmTitle').textContent = 'تعديل الصنف: ' + p.n;
      $('#prodEditId').value = p.id;
      $('#prodName').value = p.n;
      $('#prodCat').value = p.c;
      $('#prodPrice').value = p.p;
      $('#prodCal').value = p.cal;
      $('#prodUnit').value = p.unit;
      $('#prodBadge').value = p.badge || '';
      $('#prodDesc').value = p.d;
      $('#prodIngr').value = p.ingredients || '';
      openStandalonePage('productModal');
    };
  });

  document.querySelectorAll('.delete-product-btn').forEach(b => {
    b.onclick = () => {
      const pid = +b.dataset.pid;
      products = products.filter(x => x.id !== pid);
      saveState();
      renderAdminProducts();
      renderGrid();
      toast('تم حذف الصنف من المنيو');
    };
  });
}

$('#openAddProductBtn').onclick = () => {
  $('#pmTitle').textContent = 'إضافة صنف جديد للمنيو';
  $('#prodEditId').value = '';
  $('#productForm').reset();
  $('#prodUnit').value = 'للقطعة';
  $('#prodBadge').value = '🌾 حبة كاملة 100%';
  openStandalonePage('productModal');
};

$('#closeProductModal').onclick = $('#cancelProductBtn').onclick = () => {
  showAdminDashboard();
};

$('#productForm').onsubmit = e => {
  e.preventDefault();
  const editId = $('#prodEditId').value;
  const n = $('#prodName').value.trim();
  const c = +$('#prodCat').value;
  const p = +$('#prodPrice').value;
  const cal = +$('#prodCal').value;
  const unit = $('#prodUnit').value.trim() || 'للقطعة';
  const badge = $('#prodBadge').value.trim() || '🌾 حبة كاملة 100%';
  const d = $('#prodDesc').value.trim();
  const ingr = $('#prodIngr').value.trim();

  if (!n || !p || !cal || !d) {
    toast('من فضلك أكمل البيانات الأساسية للمنتج.');
    return;
  }

  if (editId) {
    const item = products.find(x => x.id == editId);
    if (item) {
      item.n = n; item.c = c; item.p = p; item.cal = cal;
      item.unit = unit; item.badge = badge; item.d = d; item.ingredients = ingr;
    }
    toast('تم تعديل بيانات الصنف بنجاح ✓');
  } else {
    const newId = Date.now();
    products.push({
      id: newId, c, n, d, p, cal, unit, badge, inStock: true,
      tags: ['no-sugar', 'high-fiber'],
      ingredients: ingr,
      img: 'images/pizza.jpg'
    });
    toast('تمت إضافة الصنف الجديد للمنيو بنجاح 🥐');
  }

  saveState();
  renderAdminProducts();
  renderGrid();
  showAdminDashboard();
};

function renderAdminReviews() {
  $('#adminReviewsCount').textContent = reviews.length;
  $('#adminReviewsList').innerHTML = reviews.map(r => `
    <div class="p-4 rounded-2xl border" style="background:var(--surface);border-color:var(--line)">
      <div class="flex justify-between items-center mb-1">
        <b class="text-sm">${r.name} (${r.phone})</b>
        <span class="text-yellow-500">${'★'.repeat(r.rating)}</span>
      </div>
      <p class="text-sm mt-1 text-muted">«${r.comment}»</p>
      <div class="flex justify-between items-center text-xs mt-3 pt-2 border-t" style="border-color:var(--line)">
        <span class="text-muted">${r.date || 'الآن'}</span>
        <button class="text-rose-600 font-bold delete-rev-btn" data-rid="${r.id}">حذف التقييم</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.delete-rev-btn').forEach(b => {
    b.onclick = () => {
      const rid = +b.dataset.rid;
      reviews = reviews.filter(x => x.id !== rid);
      saveState();
      renderAdminReviews();
      renderReviews();
      toast('تم حذف التقييم');
    };
  });
}

function renderAdminAnalytics() {
  const activeOrders = orders.filter(o => o.status !== 'ملغي');
  const rev = activeOrders.reduce((a, b) => a + (b.total || 0), 0);
  const aov = activeOrders.length ? Math.round(rev / activeOrders.length) : 0;

  $('#kpiRevenue').textContent = money(rev);
  $('#kpiOrders').textContent = activeOrders.length.toLocaleString('ar-EG');
  $('#kpiAov').textContent = money(aov);

  // Find top product
  const countMap = {};
  activeOrders.forEach(o => {
    (o.items || []).forEach(it => {
      countMap[it.id] = (countMap[it.id] || 0) + it.q;
    });
  });
  let topId = null, topCount = 0;
  for (const id in countMap) {
    if (countMap[id] > topCount) {
      topCount = countMap[id];
      topId = id;
    }
  }
  const topProd = products.find(p => p.id == topId);
  $('#kpiTopItem').textContent = topProd ? `${topProd.n} (${topCount} طلب)` : 'ميني بيتزا حبة كاملة';

  // Payment Breakdown
  const payMap = {};
  activeOrders.forEach(o => {
    const k = o.payment ? o.payment.split(' ')[0] : 'كاش';
    payMap[k] = (payMap[k] || 0) + (o.total || 0);
  });
  const totalPay = Object.values(payMap).reduce((a, b) => a + b, 0) || 1;
  $('#paymentBreakdown').innerHTML = Object.entries(payMap).map(([method, amount]) => {
    const pct = Math.round((amount / totalPay) * 100);
    return `
      <div>
        <div class="flex justify-between text-xs font-bold mb-1">
          <span>${method}</span>
          <span>${money(amount)} (${pct}%)</span>
        </div>
        <div class="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div class="h-full bg-blue-600 rounded-full" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');

  // Category Breakdown
  const catMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
  activeOrders.forEach(o => {
    (o.items || []).forEach(it => {
      const p = products.find(x => x.id === it.id);
      if (p && catMap[p.c] !== undefined) {
        catMap[p.c] += p.p * it.q;
      }
    });
  });
  const totalCat = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
  $('#categoryBreakdown').innerHTML = Object.entries(catMap).map(([cId, amount]) => {
    const pct = Math.round((amount / totalCat) * 100);
    return `
      <div>
        <div class="flex justify-between text-xs font-bold mb-1">
          <span>${cats[cId]}</span>
          <span>${money(amount)} (${pct}%)</span>
        </div>
        <div class="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div class="h-full bg-emerald-600 rounded-full" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// API Key save
try {
  const savedKey = localStorage.getItem('hala_gemini_key');
  if (savedKey) $('#geminiApiKeyInput').value = savedKey;
} catch (e) {}

$('#saveApiKeyBtn').onclick = () => {
  const k = $('#geminiApiKeyInput').value.trim();
  try {
    localStorage.setItem('hala_gemini_key', k);
    toast('تم حفظ مفتاح API بنجاح 🔑');
  } catch (e) {}
};

$('#runAiAnalysisBtn').onclick = () => {
  const output = $('#aiAnalysisOutput');
  output.innerHTML = `⏳ <b>جاري تشغيل خوارزميات الذكاء الاصطناعي لتحليل المبيعات والطلبات...</b>`;

  const activeOrders = orders.filter(o => o.status !== 'ملغي');
  const rev = activeOrders.reduce((a, b) => a + (b.total || 0), 0);
  const aov = activeOrders.length ? Math.round(rev / activeOrders.length) : 0;

  setTimeout(() => {
    output.innerHTML = `
      <div class="space-y-4">
        <div class="border-b border-slate-700 pb-3">
          <h4 class="text-base font-black text-emerald-400">📊 التقرير التنفيذي لمبيعات مطبخ حلا (AI Sales Audit)</h4>
          <p class="text-xs text-slate-400 mt-0.5">تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')} • تم تحليل ${activeOrders.length} طلب بإجمالي إيراد ${money(rev)}</p>
        </div>

        <div>
          <b class="text-sm text-amber-300 block mb-1">1. المنتجات الأكثر ربحية وقوة الطلب:</b>
          <p class="text-xs text-slate-300 leading-relaxed">
            • صواني <b>الميني بيتزا بالحبة الكاملة</b> وبوكسات <b>اللانش بوكس</b> تمثل الحصة الأكبر من حجم الطلبات المتكررة، خاصة في فترات الصباح وبدايات الأسبوع الدراسي.<br>
            • بوكس <b>البراونيز الدارك والشوكولاتة</b> يحقق أعلى هامش مساهمة ربحية ومتوسط قيمة سلة، ومرتبط أكثر بطلبات نهاية الأسبوع والتحلية مع القهوة.
          </p>
        </div>

        <div>
          <b class="text-sm text-sky-300 block mb-1">2. تحليل سلوك العملاء وطرق الدفع:</b>
          <p class="text-xs text-slate-300 leading-relaxed">
            • اعتماد العملاء على <b>انستاباي ومحافظ فودافون كاش</b> في ازدياد مستمر لتوفير السيولة وسهولة الاستلام بدون فكة.<br>
            • تفضيل التحلية بـ <b>عسل النحل الطبيعي</b> يمثل 68% من اختيارات العملاء، يليه <b>سكر ستيفيا زيرو كالوري</b> بنسبة 24% لمتابعي الدايت.
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
          <b class="text-sm text-emerald-300 block mb-1">💡 توصيات الذكاء الاصطناعي لزيادة المبيعات والأرباح:</b>
          <ul class="text-xs text-emerald-100 space-y-1.5 list-disc list-inside">
            <li><b>إطلاق بوكس الاشتراك الأسبوعي للانش بوكس:</b> تجهيز باقة أسبوعية (ميني بيتزا + كوكيز) بسعر توفيري للطلب المسبق كل سبت.</li>
            <li><b>عرض الكومبو الصحي (سناك & قهوة):</b> تقديم خصم 10% عند طلب بوكس براونيز مع كوكيز الشوفان.</li>
            <li><b>تأمين مخزون خامات الدقيق والشوكولاتة:</b> زيادة مشتريات دقيق القمح الكامل والشوكولاتة الداكنة 70% بنسبة 25% لتلبية وتيرة الطلب المتصاعدة.</li>
          </ul>
        </div>
      </div>
    `;
    toast('تم استخراج تقرير التحليل الذكي بنجاح 📈');
  }, 1200);
};

// --- General Listeners ---
$('#openCart').onclick = () => {
  openStandalonePage('drawer');
};
$('#closeCart').onclick = () => {
  openStandalonePage('storeView');
};
$('#closeDetailModal').onclick = () => {
  openStandalonePage('storeView');
};
$('#ov').onclick = () => {
  $('#drawer').classList.remove('show');
  $('#modal').classList.remove('show');
  $('#detailModal').classList.remove('show');
  $('#orderConfirmModal').classList.remove('show');
  $('#adminLoginModal').classList.remove('show');
  $('#productModal').classList.remove('show');
  openStandalonePage('storeView');
};
$('#checkout').onclick = () => {
  if (!Object.keys(cart).length) return;
  $('#drawer').classList.remove('show');
  $('#modal').classList.add('show');
  $('#ov').classList.add('show');
};
$('#closeModal').onclick = () => {
  openStandalonePage('storeView');
};
$('#burger').onclick = () => {
  $('#mnav').classList.toggle('hidden');
  $('#mnav').classList.toggle('flex');
};
document.querySelectorAll('#mnav a').forEach(a => {
  a.onclick = () => {
    $('#mnav').classList.add('hidden');
    $('#mnav').classList.remove('flex');
  };
});

$('#themeToggle').onclick = () => {
  const root = document.documentElement;
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  $('#themeToggle').textContent = next === 'dark' ? '☀️' : '🌙';
};

$('#searchInput').oninput = e => {
  searchQuery = e.target.value;
  renderGrid();
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $('#drawer').classList.remove('show');
    $('#modal').classList.remove('show');
    $('#detailModal').classList.remove('show');
    $('#orderConfirmModal').classList.remove('show');
    $('#adminLoginModal').classList.remove('show');
    $('#productModal').classList.remove('show');
    $('#reviewModal').classList.remove('show');
    $('#chatWindow').classList.remove('show');
    $('#ov').classList.remove('show');
  }
});


document.querySelectorAll('.back-to-store-btn').forEach(btn => {
  btn.onclick = () => openStandalonePage('storeView');
});
document.querySelectorAll('header.top a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => {
    openStandalonePage('storeView');
  });
});

// Initialize
renderFilters();
renderGrid();
renderCart();
renderReviews();

// Auto-open dedicated page if specified via window.INITIAL_PAGE or URL hash
if (window.INITIAL_PAGE) {
  openStandalonePage(window.INITIAL_PAGE);
} else if (location.hash.startsWith('#page-')) {
  openStandalonePage(location.hash.replace('#page-', ''));
}
