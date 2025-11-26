// ======================================================
// AMORA INTIMATES - SCRIPT PRINCIPAL
// ======================================================

// telefone da Amora
const AMORA_PHONE = '5515997628023';

// extensões possíveis para tentar carregar imagens
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];


// ======================================================
// 1) CLASSIFICAÇÃO DE TIPO PARA PRECIFICAÇÃO
// ======================================================

function classificarTipoPorSlug(slug) {
  const s = slug.toLowerCase();

  if (s.includes("babydoll8 (2)")) return "babydoll-amora";
  if (s.startsWith("babydoll")) return "babydoll";
  if (s.includes("camisola")) return "camisola";
  if (s.includes("basica")) return "conjunto-basico";
  if (s.includes("s-bojo")) return "conjunto-sem-bojo";

  return "conjunto-com-bojo"; // padrão
}


// ======================================================
// 2) PRECOS POR TIPO
// ======================================================

function obterPrecosPorTipo(tipo) {
  switch (tipo) {
    case "babydoll-amora": return { antigo: 62.90, promo: 54.90 };
    case "babydoll": return { antigo: 84.90, promo: 74.90 };
    case "conjunto-com-bojo": return { antigo: 79.90, promo: 64.90 };
    case "conjunto-basico": return { antigo: 54.90, promo: 49.90 };
    case "conjunto-sem-bojo": return { antigo: 77.90, promo: 64.90 };
    case "camisola": return { antigo: 125.00, promo: 115.00 };
    default: return { antigo: 0, promo: 0 };
  }
}


// ======================================================
// 3) GERA HTML DE PREÇO PROMOCIONAL
// ======================================================

function montarPrecoHtml(tipo) {
  const { antigo, promo } = obterPrecosPorTipo(tipo);
  if (!antigo || !promo) return "";

  return `
    <div class="preco-container">
      <span class="preco-antigo">R$ ${antigo.toFixed(2).replace('.', ',')}</span>
      <span class="preco-promo">R$ ${promo.toFixed(2).replace('.', ',')}</span>
    </div>
  `;
}


// ======================================================
// 4) MAPA DE NOMES FEMININOS POR COR
// ======================================================

const NOME_POR_COR = {
  "preto": "Valentina",
  "preta": "Valentina",
  "pretoflorido": "Clara",
  "florido": "Clara",
  "pretoevermelho": "Alice",
  "vermelhopreto": "Alice",
  "pretaevermelha": "Alice",
  "pretooncinha": "Melissa",
  "oncinha": "Melissa",
  "vermelho": "Isis",
  "vinho": "Helena",
  "verde": "Aurora",
  "verdebranco": "Heloísa",
  "brancoverde": "Heloísa",
  "azul": "Sofia",
  "azulescuro": "Giovanna",
  "rosa": "Lívia",
  "rosapink": "Bela",
  "rosaverde": "Rebeca",
  "brancobege": "Nicole",
  "lilas": "Júlia",
  "marrom": "Ayla",
  "basica": "Natália"
};

// Descrições por cor
const DESCRICAO_POR_COR = {
  "preto": "Clássico, elegante e marcante.",
  "preta": "Clássico, elegante e marcante.",
  "pretoflorido": "Delicado e romântico.",
  "florido": "Delicado e romântico.",
  "pretoevermelho": "Ardente e irresistível.",
  "vermelhopreto": "Ardente e irresistível.",
  "pretaevermelha": "Ardente e irresistível.",
  "pretooncinha": "Ousado e estiloso.",
  "oncinha": "Ousado e estiloso.",
  "vermelho": "Vibrante e poderoso.",
  "vinho": "Intenso e sofisticado.",
  "verde": "Fresco e natural.",
  "verdebranco": "Elegante e feminino.",
  "azul": "Suave e delicado.",
  "azulescuro": "Profundo e sofisticado.",
  "rosa": "Romântico e delicado.",
  "rosapink": "Vibrante e moderno.",
  "rosaverde": "Combinação única e elegante.",
  "brancobege": "Neutro e sofisticado.",
  "lilas": "Suave e angelical.",
  "marrom": "Moderno e aconchegante.",
  "basica": "Confortável e perfeita para o dia a dia."
};

function getNomePorCor(slug) {
  const lower = slug.toLowerCase();
  for (const cor in NOME_POR_COR) {
    if (lower.includes(cor)) return NOME_POR_COR[cor];
  }
  return "Amora";
}

function getDescricaoPorCor(slug) {
  const lower = slug.toLowerCase();
  for (const cor in DESCRICAO_POR_COR) {
    if (lower.includes(cor)) return DESCRICAO_POR_COR[cor];
  }
  return "Peça elegante e confortável.";
}


// ======================================================
// 5) TIPO PARA TAG (páginas: c/ bojo, s/ bojo, babydoll…)
// ======================================================

function getTipoFromSlug(slug) {
  const s = slug.toLowerCase().replace(/\s+/g, '');

  if (s.includes('babydoll')) return 'babydoll';
  if (s.includes('camisola')) return 'camisola';
  if (s.includes('basica')) return 'basica';
  if (s.match(/c[-_]?bojo/)) return 'conjuntos-c-bojo';
  if (s.match(/s[-_]?bojo/)) return 'conjuntos-s-bojo';

  return 'outro';
}

function tagFromTipo(tipo) {
  switch (tipo) {
    case 'conjuntos-c-bojo': return 'Conjunto c/ bojo';
    case 'conjuntos-s-bojo': return 'Conjunto s/ bojo';
    case 'babydoll': return 'Baby doll';
    case 'camisola': return 'Camisola';
    case 'basica': return 'Linha básica';
    default: return 'Coleção Amora';
  }
}


// ======================================================
// 6) CARRINHO — SISTEMA ÚNICO
// ======================================================

function getCart() {
  const data = localStorage.getItem('amoraCart');
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem('amoraCart', JSON.stringify(cart));
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  el.textContent = totalItems;
}

function addToCart(name, price, size, quantity) {
  let cart = getCart();

  const existing = cart.find(item =>
    item.name === name &&
    item.price === price &&
    item.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, size, quantity });
  }

  saveCart(cart);
  updateCartCount();
}


// ======================================================
// 7) MODAL
// ======================================================

let currentProduct = null;

function openProductModal(name, price) {
  currentProduct = { name, price };

  const modal = document.getElementById('product-modal');
  document.getElementById('modal-product-name').textContent = name;
  document.getElementById('modal-product-price').textContent =
    `R$ ${price.toFixed(2).replace('.', ',')}`;

  document.getElementById('modal-size').value = '';
  document.getElementById('modal-qty').value = 1;

  modal.classList.add('open');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('open');
  currentProduct = null;
}

function setupModalEvents() {
  const modal = document.getElementById('product-modal');
  const btnCancel = document.getElementById('modal-cancelar');
  const btnAdd = document.getElementById('modal-add-cart');

  if (!modal) return;

  modal.addEventListener('click', e => {
    if (e.target === modal) closeProductModal();
  });

  btnCancel.addEventListener('click', closeProductModal);

  btnAdd.addEventListener('click', () => {
    if (!currentProduct) return;

    const size = document.getElementById('modal-size').value;
    const qty = parseInt(document.getElementById('modal-qty').value, 10) || 1;

    if (!size) {
      alert('Selecione o tamanho.');
      return;
    }

    addToCart(currentProduct.name, currentProduct.price, size, qty);
    closeProductModal();
    window.location.href = 'carrinho.html';
  });
}


// ======================================================
// 8) CARRINHO.HTML — RENDERIZAÇÃO
// ======================================================

function renderCartPage() {
  const tbody = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total');
  if (!tbody || !totalEl) return;

  const cart = getCart();
  tbody.innerHTML = '';

  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">Seu carrinho está vazio 💗</td></tr>`;
    totalEl.textContent = 'Total: R$ 0,00';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.size}</td>
      <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
      <td>${item.quantity}</td>
      <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
      <td><button class="btn-remover" data-index="${index}">remover</button></td>
    `;

    tbody.appendChild(tr);
  });

  totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

  tbody.querySelectorAll('.btn-remover').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const cart = getCart();
      cart.splice(idx, 1);
      saveCart(cart);
      renderCartPage();
      updateCartCount();
    });
  });
}


// ======================================================
// 9) FINALIZAR PEDIDO (WhatsApp)
// ======================================================

function setupFinalizeButton() {
  const btn = document.getElementById('btn-finalizar');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Carrinho vazio.');
      return;
    }

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    let msg = 'Olá! Gostaria de finalizar meu pedido:%0A%0A';

    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} | Tam: ${item.size} | Qtd: ${item.quantity} | R$ ${item.price.toFixed(2)}%0A`;
    });

    msg += `%0ATotal: R$ ${total.toFixed(2)}%0A`;

    window.location.href = `https://wa.me/${AMORA_PHONE}?text=${msg}`;
  });
}


// ======================================================
// 10) CARREGAMENTO DE IMAGEM AUTOMÁTICO
// ======================================================

function createProductImage(slug, alt) {
  const img = document.createElement('img');
  img.alt = alt;
  img.dataset.slug = slug;
  img.dataset.extIndex = 0;
  img.src = `img/${slug}${IMAGE_EXTENSIONS[0]}`;

  img.onerror = function () {
    let idx = parseInt(img.dataset.extIndex, 10);

    if (idx + 1 < IMAGE_EXTENSIONS.length) {
      idx++;
      img.dataset.extIndex = idx;
      img.src = `img/${slug}${IMAGE_EXTENSIONS[idx]}`;
    } else {
      img.onerror = null;
      const card = img.closest('.product-card, .produto-card');
      if (card) card.remove();
    }
  };

  return img;
}


// ======================================================
// 11) NOME BONITO FINAL
// ======================================================

function nomeBonitoFromSlug(slug) {
  const tipo = getTipoFromSlug(slug);
  const nomeMulher = getNomePorCor(slug);

  let corFinal = "";
  const palavras = slug.toLowerCase().split('-');

  const mapaCor = {
    'preto': 'Preto',
    'pretoflorido': 'Preto Florido',
    'florido': 'Florido',
    'pretoevermelho': 'Preto & Vermelho',
    'vermelhopreto': 'Vermelho & Preto',
    'pretooncinha': 'Oncinha',
    'vermelho': 'Vermelho',
    'vinho': 'Vinho',
    'verde': 'Verde',
    'verdebranco': 'Verde & Branco',
    'azul': 'Azul',
    'azulescuro': 'Azul Escuro',
    'rosa': 'Rosa',
    'rosapink': 'Rosa Pink',
    'rosaverde': 'Rosa & Verde',
    'brancobege': 'Branco & Bege',
    'lilas': 'Lilás',
    'marrom': 'Marrom'
  };

  for (const p of palavras) {
    if (mapaCor[p]) {
      corFinal = mapaCor[p];
      break;
    }
  }

  if (!corFinal) corFinal = 'Cor Especial';

  if (tipo === 'babydoll')
    return `Baby Doll ${nomeMulher} – ${corFinal}`;
  if (tipo === 'camisola')
    return `Camisola ${nomeMulher} – ${corFinal}`;
  if (tipo === 'basica')
    return `Conjunto ${nomeMulher} – Linha Básica – ${corFinal}`;
  if (tipo === 'conjuntos-c-bojo')
    return `Conjunto ${nomeMulher} – ${corFinal} (c/ bojo)`;
  if (tipo === 'conjuntos-s-bojo')
    return `Conjunto ${nomeMulher} – ${corFinal} (s/ bojo)`;

  return `${nomeMulher} – ${corFinal}`;
}


// ======================================================
// 12) PÁGINAS AUTOMÁTICAS DE CATEGORIA
// ======================================================

function renderCategoriaAuto() {
  const container = document.getElementById('product-list-auto');
  if (!container) return;

  if (typeof PRODUTOS_FOTOS === 'undefined') {
    container.innerHTML = `<p>Erro: carregue produtos-data.js primeiro.</p>`;
    return;
  }

  const tipoPagina = container.getAttribute('data-tipo');

  const filtrados = PRODUTOS_FOTOS
    .map(slug => ({ slug, tipo: getTipoFromSlug(slug) }))
    .filter(p => {
      if (tipoPagina === 'conjuntos-c-bojo')
        return p.tipo === 'conjuntos-c-bojo' || p.tipo === 'basica' || p.tipo === 'outro';

      return p.tipo === tipoPagina || p.tipo === 'outro';
    });

  if (filtrados.length === 0) {
    container.innerHTML = '<p>Em breve peças nesta categoria 💗</p>';
    return;
  }

  container.innerHTML = '';

  filtrados.forEach(p => {
    const nome = nomeBonitoFromSlug(p.slug);
    const desc = getDescricaoPorCor(p.slug);
    const tipoPreco = classificarTipoPorSlug(p.slug);
    const { promo } = obterPrecosPorTipo(tipoPreco);
    const precoHtml = montarPrecoHtml(tipoPreco);

    const article = document.createElement('article');
    article.className = 'product-card';

    article.innerHTML = `
      <div class="product-img"></div>
      <div class="product-body">
        <span class="product-tag">${tagFromTipo(p.tipo)}</span>
        <h3>${nome}</h3>
        <p class="product-desc">${desc}</p>
        <div class="product-footer">
          <div>
            ${precoHtml}
            <div class="prazo">Sob encomenda: 15–20 dias</div>
          </div>

          <button class="btn-comprar"
            data-product-name="${nome}"
            data-product-price="${promo.toFixed(2)}">
            Comprar <span>+</span>
          </button>
        </div>
      </div>
    `;

    const imgContainer = article.querySelector('.product-img');
    imgContainer.appendChild(createProductImage(p.slug, nome));

    container.appendChild(article);
  });

  // liga botões de compra
  container.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.productName;
      const price = parseFloat(btn.dataset.productPrice);
      openProductModal(name, price);
    });
  });
}


// ======================================================
// 13) ATIVAR BOTÕES DA HOME (DESTAQUES)
// ======================================================

function ativarComprarDestaques() {
  const botoes = document.querySelectorAll('.produto-card .btn-comprar[data-product-name]');

  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.productName;
      const price = parseFloat(btn.dataset.productPrice.replace(',', '.'));
      openProductModal(name, price);
    });
  });
}


// ======================================================
// 14) INICIALIZAÇÃO GERAL
// ======================================================

document.addEventListener('DOMContentLoaded', () => {

  // ano do footer
  document.querySelectorAll('#ano-atual').forEach(el =>
    el.textContent = new Date().getFullYear()
  );

  updateCartCount();
  renderCartPage();
  setupFinalizeButton();
  setupModalEvents();
  renderCategoriaAuto();
  ativarComprarDestaques();
});
