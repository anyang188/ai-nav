/* ============================================
   AI 导航 — 核心交互逻辑
   ============================================ */

(function() {
  'use strict';

  // ===== DOM 引用 =====
  const headerTabs = document.getElementById('headerTabs');
  const searchInput = document.getElementById('searchInput');
  const searchBar = document.getElementById('searchBar');
  const navContainer = document.getElementById('navContainer');
  const promptsGrid = document.getElementById('promptsGrid');
  const promptsEmpty = document.getElementById('promptsEmpty');
  const promptCategories = document.getElementById('promptCategories');
  const promptCount = document.getElementById('promptCount');
  const rebateGrid = document.getElementById('rebateGrid');
  const downloadsGrid = document.getElementById('downloadsGrid');
  const toast = document.getElementById('toast');
  const backTop = document.getElementById('backTop');
  const tabContents = document.querySelectorAll('.tab-content');

  let currentTab = 'nav';
  let currentPromptCat = 'all';
  let toastTimer = null;

  // ===== 初始化 =====
  function init() {
    renderNav();
    renderPrompts(promptsData);
    renderRebate();
    renderDownloads();
    bindEvents();
  }

  // ===== 渲染导航 =====
  function renderNav() {
    let html = '';
    navData.forEach(section => {
      html += '<div class="nav-section">';
      html += '<h2 class="nav-section-title">' + section.category + '</h2>';
      html += '<div class="nav-grid">';
      section.sites.forEach(site => {
        html += '<a href="' + site.url + '" target="_blank" class="nav-card" data-search-text="' +
          site.name + ' ' + site.desc + ' ' + site.category + '">';
        html += '<div class="nav-card-icon">' + site.icon + '</div>';
        html += '<div class="nav-card-info">';
        html += '<div class="nav-card-name">' + site.name + '</div>';
        html += '<div class="nav-card-desc">' + site.desc + '</div>';
        html += '</div>';
        if (site.tag) {
          html += '<span class="nav-card-tag">' + site.tag + '</span>';
        }
        html += '</a>';
      });
      html += '</div></div>';
    });
    navContainer.innerHTML = html;
  }

  // ===== 渲染提示词 =====
  function renderPrompts(data) {
    if (data.length === 0) {
      promptsGrid.innerHTML = '';
      promptsEmpty.style.display = 'block';
      promptCount.textContent = '0 条结果';
      return;
    }
    promptsEmpty.style.display = 'none';
    promptCount.textContent = data.length + ' 条提示词';

    let html = '';
    data.forEach((p, i) => {
      let badgeClass = '';
      switch (p.category) {
        case '行政': badgeClass = 'badge-admin'; break;
        case '销售': badgeClass = 'badge-sales'; break;
        case '新媒体': badgeClass = 'badge-media'; break;
        case '文案': badgeClass = 'badge-copy'; break;
      }
      html += '<div class="prompt-card" data-id="' + p.id + '" style="animation-delay:' + (i * 0.03) + 's">';
      html += '<div class="prompt-card-top">';
      html += '<span class="prompt-card-title">' + p.title + '</span>';
      html += '<span class="prompt-card-badge ' + badgeClass + '">' + p.category + '</span>';
      html += '</div>';
      html += '<div class="prompt-card-body">' + escapeHTML(p.prompt) + '</div>';
      html += '<div class="prompt-card-actions">';
      html += '<button class="btn-copy" data-prompt="' + escapeAttr(p.prompt) + '">📋 复制提示词</button>';
      html += '<button class="btn-expand" data-expand="true">展开</button>';
      html += '</div>';
      html += '</div>';
    });
    promptsGrid.innerHTML = html;
  }

  // ===== 渲染资源下载 =====
  function renderRebate() {
    let html = '';
    resourceLinks.forEach(link => {
      html += '<div class="rebate-card">';
      html += '<div class="rebate-card-icon">' + link.icon + '</div>';
      html += '<div class="rebate-card-info">';
      html += '<div class="rebate-card-name">' + link.name + (link.size ? ' <span class="size-badge">' + link.size + '</span>' : '') + '</div>';
      html += '<div class="rebate-card-desc">' + link.desc + '</div>';
      if (link.framework) {
        html += '<div class="rebate-card-desc" style="color:#4F6EF7;font-size:12px;">🔧 框架: ' + link.framework + '</div>';
      }
      if (link.ram) {
        html += '<div class="rebate-card-desc" style="color:#D97706;font-size:12px;">💾 内存要求: ' + link.ram + '</div>';
      }
      html += '</div>';
      html += '<a href="' + link.url + '" target="_blank" class="rebate-card-btn">' + (link.framework ? '获取' : '下载') + '</a>';
      html += '</div>';
    });
    rebateGrid.innerHTML = html;
  }

  // ===== 渲染好物推荐 =====
  function renderDownloads() {
    let html = '';
    downloadLinks.forEach(link => {
      html += '<div class="download-card">';
      html += '<div class="download-card-icon">' + link.icon + '</div>';
      html += '<div class="download-card-info">';
      html += '<div class="download-card-name">' + link.name + '</div>';
      html += '<div class="download-card-desc">' + link.desc + '</div>';
      html += '<div class="download-card-price">'
        + '<span class="price-label">' + link.platform + '</span>'
        + '<span class="price-original">¥' + link.price + '</span>';
      if (link.couponPrice && link.couponPrice !== link.price) {
        html += '<span class="price-coupon">券后 ¥' + link.couponPrice + '</span>';
      }
      if (link.reason) {
        html += '<span class="price-reason">' + link.reason + '</span>';
      }
      html += '</div>';
      html += '</div>';
      if (link.placeholder) {
        html += '<span class="download-card-btn" style="background:#94A3B8;cursor:default;" title="占位链接">待配置</span>';
      } else {
        html += '<a href="' + link.url + '" target="_blank" class="download-card-btn">立即购买</a>';
      }
      html += '</div>';
    });
    downloadsGrid.innerHTML = html;
  }

  // ===== 事件绑定 =====
  function bindEvents() {
    // Tab 切换
    headerTabs.addEventListener('click', function(e) {
      const tab = e.target.closest('.header-tab');
      if (!tab) return;
      currentTab = tab.dataset.tab;
      document.querySelectorAll('.header-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      tabContents.forEach(tc => tc.classList.remove('active'));
      const targetContent = document.getElementById('tab-' + currentTab);
      if (targetContent) targetContent.classList.add('active');
      searchInput.value = '';
      if (currentTab === 'prompts') {
        filterPrompts('all', '');
      }
    });

    // 提示词分类筛选
    promptCategories.addEventListener('click', function(e) {
      const cat = e.target.closest('.prompt-cat');
      if (!cat) return;
      currentPromptCat = cat.dataset.cat;
      document.querySelectorAll('.prompt-cat').forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      filterPrompts(currentPromptCat, searchInput.value);
    });

    // 搜索
    searchInput.addEventListener('input', function() {
      const query = this.value.trim().toLowerCase();
      if (currentTab === 'prompts') {
        filterPrompts(currentPromptCat, query);
      } else if (currentTab === 'nav') {
        filterNav(query);
      } else if (currentTab === 'rebate') {
        filterRebate(query);
      } else if (currentTab === 'downloads') {
        filterDownloads(query);
      }
    });

    // 复制 & 展开
    promptsGrid.addEventListener('click', function(e) {
      const copyBtn = e.target.closest('.btn-copy');
      if (copyBtn) {
        copyToClipboard(copyBtn.dataset.prompt, copyBtn);
        return;
      }
      const expandBtn = e.target.closest('.btn-expand');
      if (expandBtn) {
        const card = expandBtn.closest('.prompt-card');
        const body = card.querySelector('.prompt-card-body');
        if (card.classList.contains('expanded')) {
          card.classList.remove('expanded');
          expandBtn.textContent = '展开';
          body.scrollTop = 0;
        } else {
          card.classList.add('expanded');
          expandBtn.textContent = '收起';
        }
      }
    });

    // 返回顶部
    window.addEventListener('scroll', function() {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 键盘快捷键 Ctrl+K 聚焦搜索
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  // ===== 提示词筛选 =====
  function filterPrompts(cat, query) {
    let filtered = promptsData;
    if (cat && cat !== 'all') {
      filtered = filtered.filter(p => p.category === cat);
    }
    if (query) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.prompt.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    renderPrompts(filtered);
  }

  // ===== 导航筛选 =====
  function filterNav(query) {
    const cards = navContainer.querySelectorAll('.nav-card');
    let visibleCount = 0;
    cards.forEach(card => {
      const text = (card.dataset.searchText || '').toLowerCase();
      if (!query || text.includes(query)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    // 隐藏空的 section
    const sections = navContainer.querySelectorAll('.nav-section');
    sections.forEach(section => {
      const visibleCards = section.querySelectorAll('.nav-card[style*="display: none"]').length;
      const totalCards = section.querySelectorAll('.nav-card').length;
      section.style.display = visibleCards === totalCards ? 'none' : '';
    });
  }

  // ===== 返利链接筛选 =====
  function filterRebate(query) {
    const cards = rebateGrid.querySelectorAll('.rebate-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!query || text.includes(query)) ? '' : 'none';
    });
  }

  // ===== 下载筛选 =====
  function filterDownloads(query) {
    const cards = downloadsGrid.querySelectorAll('.download-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!query || text.includes(query)) ? '' : 'none';
    });
  }

  // ===== 复制到剪贴板 =====
  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(function() {
      btn.classList.add('copied');
      btn.innerHTML = '✅ 已复制';
      showToast('提示词已复制到剪贴板');
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = '📋 复制提示词';
      }, 2000);
    }).catch(function() {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      btn.classList.add('copied');
      btn.innerHTML = '✅ 已复制';
      showToast('提示词已复制到剪贴板');
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = '📋 复制提示词';
      }, 2000);
    });
  }

  // ===== Toast 提示 =====
  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(function() {
      toast.classList.remove('show');
    }, 2000);
  }

  // ===== HTML 转义 =====
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ===== 启动 =====
  init();

})();
