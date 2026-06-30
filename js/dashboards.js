/**
 * Stackly — Shared Dashboard Interactivity
 * Handles: sidebar toggle, responsive overlay, tab switching,
 * modals/toasts, table sorting/pagination, stat animations.
 */

/* ─── Wait for DOM ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initModalsAndToasts();
    initSidebarAndTabs();
    initTables();
    initActionButtons();
    initCategoryScroll();
});

/* ═══════════════════════════════════════════════════════════
   1. CATEGORY SCROLL — drag-to-scroll for index.html pills
   ═══════════════════════════════════════════════════════════ */
function initCategoryScroll() {
    const scrollEls = document.querySelectorAll('.category-scroll');
    scrollEls.forEach(el => {
        let isDown = false, startX = 0, scrollLeft = 0;

        el.addEventListener('mousedown', e => {
            isDown = true;
            el.classList.add('dragging');
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });
        el.addEventListener('mouseleave', () => { isDown = false; el.classList.remove('dragging'); });
        el.addEventListener('mouseup', () => { isDown = false; el.classList.remove('dragging'); });
        el.addEventListener('mousemove', e => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            el.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });

        // Category pill click → active state
        el.querySelectorAll('.category-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                el.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            });
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   2. MODALS & TOASTS
   ═══════════════════════════════════════════════════════════ */
let modalOverlay;

function initModalsAndToasts() {
    if (document.getElementById('global-modal')) return; // already exists
    const html = `
        <div class="modal-overlay" id="global-modal">
            <div class="modal-container">
                <div class="modal-header">
                    <h3 id="modal-title">Action</h3>
                    <button class="modal-close" id="modal-close">&times;</button>
                </div>
                <div class="modal-body" id="modal-body">Are you sure?</div>
                <div class="modal-footer" id="modal-footer">
                    <button class="btn-sm btn-outline-sm" id="modal-cancel">Cancel</button>
                    <button class="btn-sm btn-primary-sm" id="modal-confirm">Confirm</button>
                </div>
            </div>
        </div>
        <div class="toast-container" id="toast-container"></div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    modalOverlay = document.getElementById('global-modal');
    document.getElementById('modal-close').addEventListener('click', hideModal);
    document.getElementById('modal-cancel').addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) hideModal(); });
}

function showModal(title, body, confirmText = 'Confirm', confirmClass = 'btn-primary-sm', onConfirm = null) {
    if (!modalOverlay) initModalsAndToasts();
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = body;
    const confirmBtn = document.getElementById('modal-confirm');
    confirmBtn.textContent = confirmText;
    confirmBtn.className = `btn-sm ${confirmClass}`;
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.addEventListener('click', () => { if (onConfirm) onConfirm(); hideModal(); });
    modalOverlay.classList.add('active');
}

function hideModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
}

window.showToast = function (message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'check-circle', error: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' };
    toast.innerHTML = `<i class="uil uil-${icons[type] || 'check-circle'}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
};

/* ═══════════════════════════════════════════════════════════
   3. SIDEBAR & TABS
   ═══════════════════════════════════════════════════════════ */
function initSidebarAndTabs() {
    const sidebar   = document.getElementById('dashboard-sidebar');
    if (!sidebar) return; // not a dashboard page

    const overlay           = document.getElementById('sidebar-overlay');
    const openBtn           = document.getElementById('open-sidebar');
    const closeBtn          = document.getElementById('close-sidebar');
    const desktopToggleBtn  = document.getElementById('toggle-desktop-sidebar');
    const mainContent       = document.querySelector('.main-content');

    /* ── Helpers ── */
    function isMobile() { return window.innerWidth <= 1024; }

    function openMobile() {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMobile() {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function desktopCollapse() {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
        if (desktopToggleBtn) desktopToggleBtn.querySelector('i').className = 'uil uil-right-arrow-to-left';
        localStorage.setItem('stackly_sidebar_collapsed', 'true');
    }
    function desktopExpand() {
        sidebar.classList.remove('collapsed');
        document.body.classList.remove('sidebar-collapsed');
        if (desktopToggleBtn) desktopToggleBtn.querySelector('i').className = 'uil uil-left-arrow-to-left';
        localStorage.setItem('stackly_sidebar_collapsed', 'false');
    }
    function desktopToggle() {
        if (sidebar.classList.contains('collapsed')) desktopExpand();
        else desktopCollapse();
    }

    /* ── Restore desktop collapsed state from localStorage ── */
    if (!isMobile() && localStorage.getItem('stackly_sidebar_collapsed') === 'true') {
        desktopCollapse();
    }

    /* ── Event Listeners ── */
    if (openBtn)            openBtn.addEventListener('click', openMobile);
    if (closeBtn)           closeBtn.addEventListener('click', closeMobile);
    if (overlay)            overlay.addEventListener('click', closeMobile);
    if (desktopToggleBtn)   desktopToggleBtn.addEventListener('click', desktopToggle);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { if (isMobile()) closeMobile(); }
    });

    window.addEventListener('resize', () => {
        if (!isMobile()) {
            closeMobile(); // cleanup mobile state when resizing to desktop
        }
    });

    /* ── Tab Titles map ── */
    const titles = {
        // Collector
        'dashboard':     { title: 'Dashboard Overview',        sub: 'Welcome back! Here\'s your collection status.' },
        'activity':      { title: 'Activity Feed',             sub: 'Your recent actions and updates.' },
        'recommended':   { title: 'Recommended For You',       sub: 'Curated picks based on your taste.' },
        'purchased':     { title: 'Purchased Artworks',        sub: 'Your complete collection of owned pieces.' },
        'wishlist':      { title: 'Wishlist',                  sub: 'Artworks you\'ve saved for later.' },
        'orders':        { title: 'Order History',             sub: 'All your past purchases and transactions.' },
        'collections':   { title: 'Collections',               sub: 'Your curated art collections.' },
        'following':     { title: 'Following Artists',         sub: 'Creators you are tracking.' },
        'wallet':        { title: 'Crypto Wallet',             sub: 'Your balances and transaction history.' },
        'messages':      { title: 'Messages',                  sub: 'Direct messages with artists.' },
        'notifications': { title: 'Notifications',             sub: 'Your latest alerts and updates.' },
        'profile':       { title: 'My Profile',                sub: 'Manage your personal details.' },
        'settings':      { title: 'Settings',                  sub: 'Configure your account preferences.' },
        // Admin
        'analytics':     { title: 'Analytics',                 sub: 'Detailed metrics and trends.' },
        'users':         { title: 'User Management',           sub: 'Manage and moderate platform users.' },
        'artists':       { title: 'Manage Artists',            sub: 'Review and manage creators.' },
        'artworks':      { title: 'Artwork Approvals',         sub: 'Review submitted artworks.' },
        'marketplace':   { title: 'Marketplace',               sub: 'Manage listings and fees.' },
        'transactions':  { title: 'Transactions',              sub: 'Platform-wide transaction history.' },
        'reports':       { title: 'Reports',                   sub: 'Review user-generated reports and flags.' },
        'security':      { title: 'Security',                  sub: 'Platform security controls.' },
        // Artist
        'upload':        { title: 'Upload Artwork',            sub: 'Share your new creation with the world.' },
        'earnings':      { title: 'Earnings',                  sub: 'Track your revenue and payouts.' },
        'auctions':      { title: 'Auctions',                  sub: 'Manage your active auctions.' },
        'followers':     { title: 'Followers',                 sub: 'People who follow your work.' },
    };

    const pageTitle    = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const dashLinks    = document.querySelectorAll('.dash-link');
    const tabContents  = document.querySelectorAll('.tab-content');

    /* ── Core: switchTab ── */
    function switchTab(targetId) {
        // 1. Update URL hash silently
        history.replaceState(null, '', `#${targetId}`);

        // 2. Deactivate all links; activate matching ones
        dashLinks.forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`.dash-link[href="#${targetId}"]`).forEach(l => l.classList.add('active'));

        // 3. Hide all tab-content; show target
        tabContents.forEach(c => {
            c.classList.remove('active-tab');
            // Store bar heights before hiding so animation can replay
            c.querySelectorAll('.bar').forEach(b => {
                if (!b.dataset.targetHeight) b.dataset.targetHeight = b.style.height;
                b.style.height = '0%';
            });
        });

        const target = document.getElementById(targetId);
        if (target) {
            target.classList.add('active-tab');
            // Replay bar animations
            setTimeout(() => {
                target.querySelectorAll('.bar').forEach(b => {
                    if (b.dataset.targetHeight) b.style.height = b.dataset.targetHeight;
                });
                // Animate stat numbers
                target.querySelectorAll('.stat-card h2, .stat-card .value').forEach(el => {
                    const text = el.innerText.trim();
                    const numStr = text.replace(/[^0-9.]/g, '');
                    if (numStr && !text.includes('x')) {
                        animateValue(el, 0, parseFloat(numStr), 900, text);
                    }
                });
            }, 100);
        }

        // 4. Update header
        if (titles[targetId]) {
            if (pageTitle)    pageTitle.textContent    = titles[targetId].title;
            if (pageSubtitle) pageSubtitle.textContent = titles[targetId].sub;
        }

        // 5. Close mobile sidebar
        if (isMobile()) closeMobile();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ── Attach click handlers ── */
    dashLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                switchTab(href.substring(1));
            }
        });
    });

    // "View All" triggers inside tab panels
    document.querySelectorAll('.dash-link-trigger').forEach(trigger => {
        trigger.addEventListener('click', e => {
            const href = trigger.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                switchTab(href.substring(1));
            }
        });
    });

    /* ── Initial tab on load ── */
    const hash = window.location.hash ? window.location.hash.substring(1) : '';
    const startId = (hash && document.getElementById(hash)) ? hash : 'dashboard';
    switchTab(startId);
}

/* ═══════════════════════════════════════════════════════════
   4. STAT NUMBER ANIMATION
   ═══════════════════════════════════════════════════════════ */
function animateValue(el, start, end, duration, originalText) {
    let startTs = null;
    const step = ts => {
        if (!startTs) startTs = ts;
        const progress = Math.min((ts - startTs) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const cur = (ease * (end - start)).toFixed(end % 1 !== 0 ? 1 : 0);
        el.innerHTML = originalText.replace(/[\d,]+(\.\d+)?/, originalText.includes(',') ? Number(cur).toLocaleString() : cur);
        if (progress < 1) requestAnimationFrame(step);
        else el.innerHTML = originalText;
    };
    requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════
   5. TABLE SORTING & PAGINATION
   ═══════════════════════════════════════════════════════════ */
function initTables() {
    document.querySelectorAll('.table-card').forEach(card => {
        const table = card.querySelector('table');
        if (!table) return;
        const tbody = table.querySelector('tbody');
        const thead = table.querySelector('thead');
        if (!tbody || !thead) return;

        let rows = Array.from(tbody.querySelectorAll('tr'));
        let filtered = [...rows];
        let currentPage = 1;
        const perPage = 5;
        let sortCol = -1, sortAsc = true;

        // Search bar
        if (!card.querySelector('.table-controls')) {
            const ctrl = document.createElement('div');
            ctrl.className = 'table-controls';
            ctrl.innerHTML = `<input type="text" class="table-search" placeholder="Search…">`;
            card.insertBefore(ctrl, table);
            ctrl.querySelector('.table-search').addEventListener('input', e => {
                const q = e.target.value.toLowerCase();
                filtered = rows.filter(r => r.innerText.toLowerCase().includes(q));
                currentPage = 1;
                render();
            });
        }

        // Pagination container
        if (!card.querySelector('.pagination')) {
            const pg = document.createElement('div');
            pg.className = 'pagination';
            card.appendChild(pg);
        }

        // Sortable headers
        thead.querySelectorAll('th').forEach((th, i) => {
            if (!['Actions', ''].includes(th.innerText.trim())) {
                th.classList.add('sortable');
                th.addEventListener('click', () => {
                    thead.querySelectorAll('th').forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
                    sortAsc = sortCol === i ? !sortAsc : true;
                    sortCol = i;
                    th.classList.add(sortAsc ? 'sort-asc' : 'sort-desc');
                    filtered.sort((a, b) => {
                        const av = a.cells[i]?.innerText.trim() || '';
                        const bv = b.cells[i]?.innerText.trim() || '';
                        const an = parseFloat(av.replace(/[^0-9.-]/g, ''));
                        const bn = parseFloat(bv.replace(/[^0-9.-]/g, ''));
                        if (!isNaN(an) && !isNaN(bn)) return sortAsc ? an - bn : bn - an;
                        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
                    });
                    render();
                });
            }
        });

        const pg = card.querySelector('.pagination');
        const hLen = thead.querySelectorAll('th').length;

        function render() {
            tbody.innerHTML = '';
            const total = Math.ceil(filtered.length / perPage) || 1;
            if (currentPage > total) currentPage = total;
            const s = (currentPage - 1) * perPage;
            const pageRows = filtered.slice(s, s + perPage);
            if (!pageRows.length) {
                tbody.innerHTML = `<tr><td colspan="${hLen}" style="text-align:center;padding:2rem;color:var(--text-muted)">No data found</td></tr>`;
            } else {
                pageRows.forEach(r => tbody.appendChild(r));
            }

            pg.innerHTML = `<div class="pagination-info">Showing ${filtered.length ? s + 1 : 0}–${Math.min(s + perPage, filtered.length)} of ${filtered.length}</div>`;
            const prev = document.createElement('button');
            prev.className = 'page-btn'; prev.innerHTML = '&lt;'; prev.disabled = currentPage === 1;
            prev.addEventListener('click', () => { currentPage--; render(); });
            pg.appendChild(prev);

            for (let i = 1; i <= total; i++) {
                if (i === 1 || i === total || Math.abs(i - currentPage) <= 1) {
                    const b = document.createElement('button');
                    b.className = `page-btn${i === currentPage ? ' active' : ''}`;
                    b.innerText = i;
                    b.addEventListener('click', () => { currentPage = i; render(); });
                    pg.appendChild(b);
                } else if (Math.abs(i - currentPage) === 2) {
                    const sp = document.createElement('span');
                    sp.innerText = '…'; sp.style.color = 'var(--text-muted)';
                    pg.appendChild(sp);
                }
            }
            const next = document.createElement('button');
            next.className = 'page-btn'; next.innerHTML = '&gt;'; next.disabled = currentPage >= total;
            next.addEventListener('click', () => { currentPage++; render(); });
            pg.appendChild(next);
        }
        render();
    });
}

/* ═══════════════════════════════════════════════════════════
   6. GENERIC BUTTON ACTIONS
   ═══════════════════════════════════════════════════════════ */
function initActionButtons() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('button, .btn, .btn-sm');
        if (!btn) return;
        if (['open-sidebar', 'close-sidebar', 'toggle-desktop-sidebar', 'modal-close', 'modal-cancel', 'modal-confirm'].includes(btn.id)) return;
        if (btn.classList.contains('page-btn') || btn.classList.contains('hamburger-btn')) return;

        const text = btn.innerText.trim().toLowerCase();

        if (text.includes('export') || btn.innerHTML.toLowerCase().includes('export')) {
            showToast('Exporting data… A download will start shortly.', 'info');

        } else if (text.includes('save')) {
            const orig = btn.innerHTML;
            btn.innerHTML = `<i class="uil uil-spinner-alt"></i> Saving…`;
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.disabled = false;
                showToast('Settings saved successfully.', 'success');
            }, 1200);

        } else if (btn.classList.contains('action-btn')) {
            const row = btn.closest('tr');
            const name = row && row.cells.length > 1 ? (row.cells[1]?.innerText.trim() || 'this item') : 'this item';

            if (btn.classList.contains('approve') || btn.innerHTML.includes('check')) {
                showModal('Approve Item', `<p>Approve <strong>${name}</strong>?</p>`, 'Approve', 'btn-success-sm', () => {
                    showToast(`${name} approved.`, 'success');
                    const badge = row?.querySelector('.badge-pending');
                    if (badge) { badge.className = 'status-badge badge-success'; badge.innerText = 'Active'; }
                });
            } else if (btn.classList.contains('reject') || btn.innerHTML.includes('ban') || btn.innerHTML.includes('trash')) {
                showModal('Delete / Reject', `<p>Are you sure you want to remove <strong>${name}</strong>? This cannot be undone.</p>`, 'Delete', 'btn-danger-sm', () => {
                    showToast(`${name} removed.`, 'warning');
                    if (row) row.style.opacity = '0.3';
                });
            } else if (btn.classList.contains('view') || btn.innerHTML.includes('eye')) {
                showModal('Item Details', `<p>Detailed view for <strong>${name}</strong> will load here.</p>`, 'Close', 'btn-outline-sm');
            }

        } else if (text.includes('add content') || text.includes('upload') || btn.innerHTML.includes('uil-plus')) {
            showModal('Upload Content', `<div class="form-group"><label class="form-label">Select File</label><input type="file" class="form-input"></div>`, 'Upload', 'btn-primary-sm', () => {
                showToast('Content uploaded successfully.', 'success');
            });

        } else if (text.includes('backup') || text.includes('cache') || text.includes('cdn')) {
            showModal('System Operation', `<p>Run <strong>${btn.innerText.trim()}</strong>? This may take a moment.</p>`, 'Proceed', 'btn-outline-sm', () => {
                showToast(`${btn.innerText.trim()} completed.`, 'info');
            });
        }
    });
}
