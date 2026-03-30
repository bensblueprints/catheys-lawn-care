/* ============================================================
   Cathey's Lawn Care - Admin Dashboard
   Vanilla JS | No frameworks
   ============================================================ */

(function () {
  'use strict';

  // -- Constants ---------------------------------------------
  var API = {
    GET_LEADS: '/.netlify/functions/get-leads',
    UPDATE_LEAD: '/.netlify/functions/update-lead',
    DELETE_LEAD: '/.netlify/functions/delete-lead',
  };

  var TOKEN_KEY = 'catheys_admin_token';
  var REFRESH_INTERVAL = 60000;
  var TOAST_DURATION = 4000;
  var DEBOUNCE_DELAY = 300;
  var MOBILE_BREAKPOINT = 768;

  var STATUS_COLORS = {
    new: '#22c55e',
    contacted: '#3b82f6',
    booked: '#a855f7',
    closed: '#6b7280',
    archived: '#94a3b8',
  };

  var STATUS_LABELS = {
    new: 'New',
    contacted: 'Contacted',
    booked: 'Booked',
    closed: 'Closed',
    archived: 'Archived',
  };

  // -- State -------------------------------------------------
  var allLeads = [];
  var filteredLeads = [];
  var activeFilter = 'all';
  var searchQuery = '';
  var modalOpen = false;
  var refreshTimer = null;
  var isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  // -- DOM helpers -------------------------------------------
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  // -- Token helpers -----------------------------------------
  function getToken() { return sessionStorage.getItem(TOKEN_KEY); }
  function setToken(t) { sessionStorage.setItem(TOKEN_KEY, t); }
  function clearToken() { sessionStorage.removeItem(TOKEN_KEY); }

  function authHeaders() {
    return {
      Authorization: 'Bearer ' + getToken(),
      'Content-Type': 'application/json',
    };
  }

  // ==========================================================
  //  Toast Notification System
  // ==========================================================
  function showToast(message, type) {
    type = type || 'info';

    var container = $('#toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText =
        'position:fixed;top:20px;right:20px;z-index:10000;display:flex;' +
        'flex-direction:column;gap:10px;pointer-events:none;';
      document.body.appendChild(container);
    }

    var icons  = { success: '\u2713', error: '\u2717', warning: '\u26A0', info: '\u2139' };
    var colors = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };

    var toast = document.createElement('div');
    toast.className = 'admin-toast admin-toast--' + type;
    toast.style.cssText =
      'pointer-events:auto;display:flex;align-items:center;gap:10px;padding:14px 20px;' +
      'border-radius:8px;background:rgba(15,15,15,0.95);border:1px solid ' + colors[type] +
      ';color:#fff;font-size:14px;min-width:280px;max-width:420px;' +
      'box-shadow:0 8px 32px rgba(0,0,0,0.4);backdrop-filter:blur(10px);' +
      'transform:translateX(120%);transition:transform 0.3s ease;';

    toast.innerHTML =
      '<span style="font-size:18px;color:' + colors[type] + '">' + icons[type] + '</span>' +
      '<span style="flex:1">' + escapeHtml(message) + '</span>';

    container.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.transform = 'translateX(0)';
      });
    });

    setTimeout(function () {
      toast.style.transform = 'translateX(120%)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, TOAST_DURATION);
  }

  // ==========================================================
  //  Confirm Dialog (returns Promise)
  // ==========================================================
  function confirmAction(message) {
    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.style.cssText =
        'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;' +
        'display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

      var dialog = document.createElement('div');
      dialog.style.cssText =
        'background:#1a1a1a;border:1px solid #f59e0b;border-radius:12px;padding:32px;' +
        'max-width:420px;width:90%;text-align:center;';

      dialog.innerHTML =
        '<div style="font-size:40px;margin-bottom:16px;color:#f59e0b;">\u26A0</div>' +
        '<p style="color:#fff;font-size:16px;margin-bottom:24px;line-height:1.5">' +
          escapeHtml(message) + '</p>' +
        '<div style="display:flex;gap:12px;justify-content:center;">' +
          '<button id="confirm-cancel" style="padding:10px 24px;border-radius:8px;' +
            'border:1px solid #444;background:transparent;color:#ccc;cursor:pointer;font-size:14px;">Cancel</button>' +
          '<button id="confirm-ok" style="padding:10px 24px;border-radius:8px;border:none;' +
            'background:#ef4444;color:#fff;cursor:pointer;font-size:14px;font-weight:600;">Confirm</button>' +
        '</div>';

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      function cleanup(result) {
        document.removeEventListener('keydown', escHandler);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        resolve(result);
      }

      function escHandler(e) {
        if (e.key === 'Escape') cleanup(false);
      }

      dialog.querySelector('#confirm-ok').addEventListener('click', function () { cleanup(true); });
      dialog.querySelector('#confirm-cancel').addEventListener('click', function () { cleanup(false); });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) cleanup(false); });
      document.addEventListener('keydown', escHandler);
    });
  }

  // ==========================================================
  //  Utilities
  // ==========================================================
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
      var d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' at ' +
        d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (_) { return dateStr; }
  }

  function formatPhone(phone) {
    if (!phone) return '';
    var d = phone.replace(/\D/g, '');
    if (d.length === 10)
      return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
    if (d.length === 11 && d[0] === '1')
      return '(' + d.slice(1, 4) + ') ' + d.slice(4, 7) + '-' + d.slice(7);
    return phone;
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  function isCurrentMonth(dateStr) {
    if (!dateStr) return false;
    var d = new Date(dateStr), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }

  function getLeadName(lead) {
    if (lead.name) return lead.name;
    var parts = [];
    if (lead.firstName) parts.push(lead.firstName);
    if (lead.lastName) parts.push(lead.lastName);
    return parts.length ? parts.join(' ') : 'Unknown';
  }

  function findLeadById(id) {
    return allLeads.find(function (l) { return (l.id || l._id) === id; });
  }

  function buildStatusNote(from, to) {
    return '[' + new Date().toISOString() + '] Status changed: ' + (from || 'unknown') + ' -> ' + to;
  }

  function appendNote(lead, note) {
    if (!lead) return note;
    var existing = lead.notes || '';
    return existing ? existing + '\n' + note : note;
  }

  // ==========================================================
  //  Auth / Screen Toggle
  // ==========================================================
  function showLogin() {
    var login = $('#login-screen');
    var dash = $('#dashboard');
    if (login) login.style.display = 'flex';
    if (dash) dash.style.display = 'none';
    stopAutoRefresh();
  }

  function showDashboard() {
    var login = $('#login-screen');
    var dash = $('#dashboard');
    if (login) login.style.display = 'none';
    if (dash) dash.style.display = 'block';
    loadLeads();
    startAutoRefresh();
  }

  // ==========================================================
  //  Login / Logout
  // ==========================================================
  function handleLogin(e) {
    e.preventDefault();
    var input = $('#login-password');
    var btn = $('#login-submit');
    var pw = input ? input.value.trim() : '';

    if (!pw) {
      showToast('Please enter the admin password.', 'warning');
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Verifying...'; }

    fetch(API.GET_LEADS, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + pw, 'Content-Type': 'application/json' },
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Invalid password');
        return res.json();
      })
      .then(function () {
        setToken(pw);
        showToast('Welcome back!', 'success');
        showDashboard();
      })
      .catch(function () {
        showToast('Invalid password. Access denied.', 'error');
        if (input) { input.value = ''; input.focus(); }
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
      });
  }

  function handleLogout() {
    clearToken();
    allLeads = [];
    filteredLeads = [];
    showLogin();
    showToast('Signed out.', 'info');
  }

  // ==========================================================
  //  CRUD Operations
  // ==========================================================
  function fetchLeads(status) {
    var url = API.GET_LEADS;
    if (status && status !== 'all') url += '?status=' + encodeURIComponent(status);

    showRefreshIndicator(true);

    return fetch(url, { method: 'GET', headers: authHeaders() })
      .then(function (res) {
        if (res.status === 401 || res.status === 403) {
          clearToken();
          showLogin();
          showToast('Session expired. Please log in again.', 'error');
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Failed to fetch leads');
        return res.json();
      })
      .finally(function () { showRefreshIndicator(false); });
  }

  function loadLeads() {
    setLoadingState(true);
    fetchLeads()
      .then(function (data) {
        allLeads = Array.isArray(data) ? data : (data.leads || []);
        applyFilters();
        updateStats();
      })
      .catch(function (err) {
        if (err.message !== 'Unauthorized') showToast('Failed to load leads.', 'error');
      })
      .finally(function () { setLoadingState(false); });
  }

  function updateLead(id, data) {
    setLoadingState(true);
    return fetch(API.UPDATE_LEAD, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(Object.assign({ id: id }, data)),
    })
      .then(function (res) {
        if (res.status === 401 || res.status === 403) {
          clearToken();
          showLogin();
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Failed to update lead');
        return res.json();
      })
      .then(function (result) {
        showToast('Lead updated successfully.', 'success');
        loadLeads();
        return result;
      })
      .catch(function (err) {
        if (err.message !== 'Unauthorized') showToast('Failed to update lead.', 'error');
        throw err;
      })
      .finally(function () { setLoadingState(false); });
  }

  function deleteLead(id) {
    setLoadingState(true);
    return fetch(API.DELETE_LEAD, {
      method: 'DELETE',
      headers: authHeaders(),
      body: JSON.stringify({ id: id }),
    })
      .then(function (res) {
        if (res.status === 401 || res.status === 403) {
          clearToken();
          showLogin();
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('Failed to delete lead');
        return res.json();
      })
      .then(function (result) {
        showToast('Lead deleted.', 'success');
        closeModal();
        loadLeads();
        return result;
      })
      .catch(function (err) {
        if (err.message !== 'Unauthorized') showToast('Failed to delete lead.', 'error');
        throw err;
      })
      .finally(function () { setLoadingState(false); });
  }

  // ==========================================================
  //  Dashboard Stats
  // ==========================================================
  function updateStats() {
    var total = allLeads.length;
    var newCount = allLeads.filter(function (l) { return l.status === 'new'; }).length;
    var bookedThisMonth = allLeads.filter(function (l) {
      return l.status === 'booked' && isCurrentMonth(l.bookedDate || l.updatedAt || l.createdAt);
    }).length;
    var bookedTotal = allLeads.filter(function (l) { return l.status === 'booked'; }).length;
    var rate = total > 0 ? Math.round((bookedTotal / total) * 100) : 0;

    var el;
    if ((el = $('#stat-total'))) el.textContent = total;
    if ((el = $('#stat-new'))) el.textContent = newCount;
    if ((el = $('#stat-booked'))) el.textContent = bookedThisMonth;
    if ((el = $('#stat-rate'))) el.textContent = rate + '%';

    // Pulse indicator for new leads
    var pulse = $('#new-pulse');
    if (pulse) pulse.style.display = newCount > 0 ? 'inline-block' : 'none';
  }

  // ==========================================================
  //  Filters & Search
  // ==========================================================
  function setActiveFilter(status) {
    activeFilter = status;
    $$('.filter-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.status === status);
    });
    applyFilters();
  }

  function applyFilters() {
    var leads = allLeads;

    // Status filter
    if (activeFilter && activeFilter !== 'all') {
      leads = leads.filter(function (l) { return l.status === activeFilter; });
    }

    // Search filter
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      leads = leads.filter(function (l) {
        var name = ((l.name || l.firstName || '') + ' ' + (l.lastName || '')).toLowerCase();
        var email = (l.email || '').toLowerCase();
        var phone = (l.phone || '').toLowerCase();
        return name.indexOf(q) !== -1 || email.indexOf(q) !== -1 || phone.indexOf(q) !== -1;
      });
    }

    // Sort newest first
    leads.sort(function (a, b) {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    filteredLeads = leads;
    renderLeads();
  }

  var debouncedSearch = debounce(function (val) {
    searchQuery = val;
    applyFilters();
  }, DEBOUNCE_DELAY);

  // ==========================================================
  //  Status Badge
  // ==========================================================
  function statusBadge(status) {
    var color = STATUS_COLORS[status] || '#6b7280';
    var label = STATUS_LABELS[status] || status || 'Unknown';
    return '<span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;' +
      'font-weight:600;text-transform:uppercase;letter-spacing:0.5px;' +
      'background:' + color + '20;color:' + color + ';border:1px solid ' + color + '40;">' +
      escapeHtml(label) + '</span>';
  }

  // ==========================================================
  //  Render Leads (table vs cards)
  // ==========================================================
  function renderLeads() {
    var container = $('#leads-container');
    if (!container) return;

    if (filteredLeads.length === 0) {
      container.innerHTML =
        '<div style="text-align:center;padding:60px 20px;color:#888;">' +
        '<div style="font-size:48px;margin-bottom:16px;">&#128203;</div>' +
        '<p style="font-size:18px;margin-bottom:8px;">No leads found</p>' +
        '<p style="font-size:14px;color:#666;">Try changing your filters or check back later.</p></div>';
      return;
    }

    if (isMobile) renderCards(container);
    else renderTable(container);
  }

  // -- Action button markup ----------------------------------
  function actionButtons(lead) {
    var id = lead.id || lead._id;
    var s = 'padding:6px 10px;border-radius:6px;border:1px solid #333;background:transparent;' +
      'color:#ccc;cursor:pointer;font-size:11px;white-space:nowrap;transition:all 0.2s;';
    var btns = '';

    if (lead.status === 'new') {
      btns += '<button class="action-btn" data-action="contacted" data-id="' + escapeHtml(id) +
        '" style="' + s + 'border-color:#3b82f640;color:#3b82f6;">Contacted</button>';
    }
    if (lead.status !== 'booked') {
      btns += '<button class="action-btn" data-action="booked" data-id="' + escapeHtml(id) +
        '" style="' + s + 'border-color:#a855f740;color:#a855f7;">Book</button>';
    }
    if (lead.status !== 'archived') {
      btns += '<button class="action-btn" data-action="archived" data-id="' + escapeHtml(id) +
        '" style="' + s + 'border-color:#94a3b840;color:#94a3b8;">Archive</button>';
    }
    btns += '<button class="action-btn" data-action="delete" data-id="' + escapeHtml(id) +
      '" style="' + s + 'border-color:#ef444440;color:#ef4444;">Delete</button>';

    return btns;
  }

  function attachActionListeners(container) {
    container.querySelectorAll('.action-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        handleAction(this.dataset.id, this.dataset.action);
      });
    });
  }

  function handleAction(id, action) {
    if (action === 'delete') {
      confirmAction('Are you sure you want to permanently delete this lead? This cannot be undone.')
        .then(function (ok) { if (ok) deleteLead(id); });
    } else if (action === 'archived') {
      confirmAction('Archive this lead? It will be hidden from default views.')
        .then(function (ok) {
          if (ok) {
            var lead = findLeadById(id);
            var note = buildStatusNote(lead ? lead.status : 'unknown', 'archived');
            updateLead(id, { status: 'archived', notes: appendNote(lead, note) });
          }
        });
    } else {
      var lead = findLeadById(id);
      var note = buildStatusNote(lead ? lead.status : 'unknown', action);
      var data = { status: action, notes: appendNote(lead, note) };
      if (action === 'booked') data.bookedDate = new Date().toISOString();
      updateLead(id, data);
    }
  }

  // -- Desktop table -----------------------------------------
  function renderTable(container) {
    var thStyle = 'padding:12px 16px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;';
    var html =
      '<table style="width:100%;border-collapse:collapse;">' +
      '<thead><tr style="border-bottom:2px solid #333;text-align:left;">' +
      '<th style="' + thStyle + '">Date</th>' +
      '<th style="' + thStyle + '">Name</th>' +
      '<th style="' + thStyle + '">Contact</th>' +
      '<th style="' + thStyle + '">Service</th>' +
      '<th style="' + thStyle + '">Status</th>' +
      '<th style="' + thStyle + '">Actions</th>' +
      '</tr></thead><tbody>';

    filteredLeads.forEach(function (lead) {
      var id = lead.id || lead._id;
      html +=
        '<tr class="lead-row" data-id="' + escapeHtml(id) +
        '" style="border-bottom:1px solid #222;cursor:pointer;transition:background 0.2s;">' +

        '<td style="padding:14px 16px;color:#aaa;font-size:13px;white-space:nowrap;">' +
        escapeHtml(formatDate(lead.createdAt)) + '</td>' +

        '<td style="padding:14px 16px;color:#fff;font-weight:500;">' +
        escapeHtml(getLeadName(lead)) + '</td>' +

        '<td style="padding:14px 16px;">' +
        (lead.phone
          ? '<a href="tel:' + escapeHtml(lead.phone) + '" style="color:#22c55e;text-decoration:none;display:block;font-size:13px;" onclick="event.stopPropagation()">' +
          escapeHtml(formatPhone(lead.phone)) + '</a>'
          : '') +
        (lead.email
          ? '<a href="mailto:' + escapeHtml(lead.email) + '" style="color:#3b82f6;text-decoration:none;display:block;font-size:13px;" onclick="event.stopPropagation()">' +
          escapeHtml(lead.email) + '</a>'
          : '') +
        '</td>' +

        '<td style="padding:14px 16px;color:#ccc;font-size:13px;">' +
        escapeHtml(lead.service || lead.serviceType || 'N/A') + '</td>' +

        '<td style="padding:14px 16px;">' + statusBadge(lead.status) + '</td>' +

        '<td style="padding:14px 16px;" onclick="event.stopPropagation()">' +
        actionButtons(lead) + '</td>' +

        '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    // Row click and hover
    container.querySelectorAll('.lead-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var lead = findLeadById(this.dataset.id);
        if (lead) openModal(lead);
      });
      row.addEventListener('mouseenter', function () { this.style.background = 'rgba(255,255,255,0.03)'; });
      row.addEventListener('mouseleave', function () { this.style.background = 'transparent'; });
    });

    attachActionListeners(container);
  }

  // -- Mobile cards ------------------------------------------
  function renderCards(container) {
    var html = '<div style="display:flex;flex-direction:column;gap:12px;">';

    filteredLeads.forEach(function (lead) {
      var id = lead.id || lead._id;
      html +=
        '<div class="lead-card" data-id="' + escapeHtml(id) +
        '" style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:16px;cursor:pointer;transition:border-color 0.2s;">' +

        '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">' +
        '<div>' +
        '<div style="color:#fff;font-weight:600;font-size:16px;margin-bottom:4px;">' +
        escapeHtml(getLeadName(lead)) + '</div>' +
        '<div style="color:#666;font-size:12px;">' + escapeHtml(formatDate(lead.createdAt)) + '</div>' +
        '</div>' +
        statusBadge(lead.status) +
        '</div>' +

        '<div style="margin-bottom:12px;">' +
        (lead.phone
          ? '<a href="tel:' + escapeHtml(lead.phone) + '" style="color:#22c55e;text-decoration:none;display:block;font-size:14px;margin-bottom:4px;" onclick="event.stopPropagation()">' +
          escapeHtml(formatPhone(lead.phone)) + '</a>'
          : '') +
        (lead.email
          ? '<a href="mailto:' + escapeHtml(lead.email) + '" style="color:#3b82f6;text-decoration:none;display:block;font-size:14px;" onclick="event.stopPropagation()">' +
          escapeHtml(lead.email) + '</a>'
          : '') +
        '</div>' +

        '<div style="color:#888;font-size:13px;margin-bottom:12px;">' +
        escapeHtml(lead.service || lead.serviceType || 'No service specified') + '</div>' +

        '<div style="display:flex;gap:8px;flex-wrap:wrap;" onclick="event.stopPropagation()">' +
        actionButtons(lead) +
        '</div>' +

        '</div>';
    });

    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.lead-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var lead = findLeadById(this.dataset.id);
        if (lead) openModal(lead);
      });
    });

    attachActionListeners(container);
  }

  // ==========================================================
  //  Lead Detail Modal
  // ==========================================================
  function openModal(lead) {
    modalOpen = true;
    var id = lead.id || lead._id;

    var overlay = document.createElement('div');
    overlay.id = 'lead-modal-overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9000;' +
      'display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);' +
      'overflow-y:auto;padding:20px;';

    var modal = document.createElement('div');
    modal.id = 'lead-modal';
    modal.style.cssText =
      'background:#111;border:1px solid #333;border-radius:16px;width:100%;max-width:640px;' +
      'max-height:90vh;overflow-y:auto;position:relative;';

    // --- Header ---
    var html =
      '<div style="padding:24px 24px 0;display:flex;justify-content:space-between;align-items:start;">' +
      '<div>' +
      '<h2 style="color:#fff;font-size:22px;margin:0 0 4px;">' + escapeHtml(getLeadName(lead)) + '</h2>' +
      '<div style="color:#666;font-size:13px;">' + escapeHtml(formatDate(lead.createdAt)) + '</div>' +
      '</div>' +
      '<button id="modal-close" style="background:none;border:none;color:#888;font-size:28px;cursor:pointer;padding:0;line-height:1;">&times;</button>' +
      '</div>';

    // --- Contact buttons ---
    html +=
      '<div style="padding:20px 24px;display:flex;gap:12px;flex-wrap:wrap;">' +
      (lead.phone
        ? '<a href="tel:' + escapeHtml(lead.phone) + '" style="display:inline-flex;align-items:center;gap:8px;' +
        'padding:10px 16px;border-radius:8px;background:#22c55e15;border:1px solid #22c55e40;' +
        'color:#22c55e;text-decoration:none;font-size:14px;">&#9742; ' + escapeHtml(formatPhone(lead.phone)) + '</a>'
        : '') +
      (lead.email
        ? '<a href="mailto:' + escapeHtml(lead.email) + '" style="display:inline-flex;align-items:center;gap:8px;' +
        'padding:10px 16px;border-radius:8px;background:#3b82f615;border:1px solid #3b82f640;' +
        'color:#3b82f6;text-decoration:none;font-size:14px;">&#9993; ' + escapeHtml(lead.email) + '</a>'
        : '') +
      '</div>';

    // --- Details grid ---
    html +=
      '<div style="padding:0 24px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
      detailItem('Service', lead.service || lead.serviceType || 'N/A', false) +
      detailItem('Status', statusBadge(lead.status), true) +
      detailItem('Address', lead.address || 'N/A', false) +
      detailItem('Source', lead.source || lead.referralSource || 'N/A', false) +
      '</div>';

    // --- Message ---
    if (lead.message || lead.description) {
      html +=
        '<div style="padding:20px 24px;">' +
        '<div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div>' +
        '<div style="color:#ccc;font-size:14px;line-height:1.6;background:#0a0a0a;border:1px solid #222;' +
        'border-radius:8px;padding:16px;white-space:pre-wrap;">' +
        escapeHtml(lead.message || lead.description) +
        '</div>' +
        '</div>';
    }

    // --- Status change ---
    html +=
      '<div style="padding:20px 24px;">' +
      '<div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Change Status</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">';

    Object.keys(STATUS_LABELS).forEach(function (s) {
      var active = lead.status === s;
      html +=
        '<button class="modal-status-btn" data-status="' + s + '" style="padding:8px 16px;border-radius:8px;' +
        'border:1px solid ' + STATUS_COLORS[s] + (active ? '' : '40') + ';' +
        'background:' + (active ? STATUS_COLORS[s] + '30' : 'transparent') + ';' +
        'color:' + STATUS_COLORS[s] + ';cursor:pointer;font-size:13px;' +
        'font-weight:' + (active ? '700' : '500') + ';opacity:' + (active ? '1' : '0.7') + ';">' +
        STATUS_LABELS[s] + '</button>';
    });

    html += '</div></div>';

    // --- Notes / Timeline ---
    html +=
      '<div style="padding:20px 24px;">' +
      '<div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Notes &amp; Timeline</div>' +
      '<div id="modal-notes" style="background:#0a0a0a;border:1px solid #222;border-radius:8px;padding:16px;' +
      'max-height:200px;overflow-y:auto;margin-bottom:12px;">' +
      renderNotes(lead.notes) +
      '</div>' +
      '<form id="add-note-form" style="display:flex;gap:8px;">' +
      '<input id="note-input" type="text" placeholder="Add a note..." style="flex:1;padding:10px 14px;' +
      'border-radius:8px;border:1px solid #333;background:#0a0a0a;color:#fff;font-size:14px;outline:none;">' +
      '<button type="submit" style="padding:10px 20px;border-radius:8px;border:none;background:#22c55e;' +
      'color:#fff;cursor:pointer;font-size:14px;font-weight:600;white-space:nowrap;">Add Note</button>' +
      '</form>' +
      '</div>';

    // --- Danger zone ---
    html +=
      '<div style="padding:20px 24px 24px;border-top:1px solid #222;margin-top:8px;">' +
      '<div style="display:flex;gap:8px;justify-content:flex-end;">' +
      '<button id="modal-archive" style="padding:8px 16px;border-radius:8px;border:1px solid #f59e0b40;' +
      'background:transparent;color:#f59e0b;cursor:pointer;font-size:13px;">Archive</button>' +
      '<button id="modal-delete" style="padding:8px 16px;border-radius:8px;border:1px solid #ef444440;' +
      'background:transparent;color:#ef4444;cursor:pointer;font-size:13px;">Delete</button>' +
      '</div>' +
      '</div>';

    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // --- Event listeners ---
    overlay.querySelector('#modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });

    overlay.querySelectorAll('.modal-status-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var newStatus = this.dataset.status;
        if (newStatus === lead.status) return;
        var note = buildStatusNote(lead.status, newStatus);
        var data = { status: newStatus, notes: appendNote(lead, note) };
        if (newStatus === 'booked') data.bookedDate = new Date().toISOString();
        updateLead(id, data).then(closeModal).catch(function () {});
      });
    });

    overlay.querySelector('#add-note-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = overlay.querySelector('#note-input');
      var text = input.value.trim();
      if (!text) return;
      var timestamped = '[' + new Date().toISOString() + '] ' + text;
      updateLead(id, { notes: appendNote(lead, timestamped) }).then(closeModal).catch(function () {});
    });

    overlay.querySelector('#modal-archive').addEventListener('click', function () { handleAction(id, 'archived'); });
    overlay.querySelector('#modal-delete').addEventListener('click', function () { handleAction(id, 'delete'); });
  }

  function detailItem(label, value, isHtml) {
    return '<div>' +
      '<div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">' +
      escapeHtml(label) + '</div>' +
      '<div style="color:#ddd;font-size:14px;">' + (isHtml ? value : escapeHtml(value)) + '</div>' +
      '</div>';
  }

  function renderNotes(notes) {
    if (!notes || !notes.trim()) {
      return '<div style="color:#555;font-size:13px;font-style:italic;">No notes yet.</div>';
    }

    var lines = notes.split('\n').filter(function (l) { return l.trim(); });
    var html = '';

    lines.forEach(function (line) {
      var isStatus = line.indexOf('Status changed:') !== -1;
      var match = line.match(/^\[(\d{4}-\d{2}-\d{2}T[^\]]+)\]\s*/);
      var timestamp = '';
      var content = line;

      if (match) {
        timestamp = formatDate(match[1]);
        content = line.substring(match[0].length);
      }

      var dot = isStatus ? '#a855f7' : '#22c55e';
      html +=
        '<div style="display:flex;gap:10px;align-items:start;padding:8px 0;border-bottom:1px solid #1a1a1a;">' +
        '<div style="width:8px;height:8px;border-radius:50%;background:' + dot + ';flex-shrink:0;margin-top:5px;"></div>' +
        '<div>' +
        (timestamp ? '<div style="color:#555;font-size:11px;margin-bottom:2px;">' + escapeHtml(timestamp) + '</div>' : '') +
        '<div style="color:#ccc;font-size:13px;">' + escapeHtml(content) + '</div>' +
        '</div>' +
        '</div>';
    });

    return html;
  }

  function closeModal() {
    modalOpen = false;
    var overlay = $('#lead-modal-overlay');
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  // ==========================================================
  //  Loading / Refresh Indicator
  // ==========================================================
  function setLoadingState(loading) {
    var el = $('#loading-spinner');
    if (el) el.style.display = loading ? 'flex' : 'none';
  }

  function showRefreshIndicator(show) {
    var el = $('#refresh-indicator');
    if (el) el.style.opacity = show ? '1' : '0';
  }

  // ==========================================================
  //  Auto-Refresh
  // ==========================================================
  function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(function () {
      if (!modalOpen) {
        fetchLeads()
          .then(function (data) {
            allLeads = Array.isArray(data) ? data : (data.leads || []);
            applyFilters();
            updateStats();
          })
          .catch(function () {});
      }
    }, REFRESH_INTERVAL);
  }

  function stopAutoRefresh() {
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  }

  // ==========================================================
  //  CSV Export
  // ==========================================================
  function exportCSV() {
    var leads = filteredLeads.length > 0 ? filteredLeads : allLeads;

    if (leads.length === 0) {
      showToast('No leads to export.', 'warning');
      return;
    }

    var headers = ['Date', 'Name', 'Email', 'Phone', 'Service', 'Status', 'Notes'];
    var rows = leads.map(function (l) {
      return [
        l.createdAt || '',
        getLeadName(l),
        l.email || '',
        l.phone || '',
        l.service || l.serviceType || '',
        l.status || '',
        (l.notes || '').replace(/"/g, '""'),
      ];
    });

    var csv = headers.join(',') + '\n';
    rows.forEach(function (row) {
      csv += row.map(function (cell) { return '"' + cell + '"'; }).join(',') + '\n';
    });

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'catheys-leads-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('CSV exported (' + leads.length + ' leads).', 'success');
  }

  // ==========================================================
  //  Responsive
  // ==========================================================
  var debouncedResize = debounce(function () {
    var was = isMobile;
    isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    if (was !== isMobile) renderLeads();
  }, DEBOUNCE_DELAY);

  // ==========================================================
  //  Keyboard Shortcuts
  // ==========================================================
  function handleKeyboard(e) {
    // Escape closes modal
    if (e.key === 'Escape' && modalOpen) {
      closeModal();
      return;
    }

    // / focuses search (unless already in an input)
    if (e.key === '/' && !modalOpen &&
      document.activeElement.tagName !== 'INPUT' &&
      document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      var search = $('#search-input');
      if (search) search.focus();
    }
  }

  // ==========================================================
  //  Initialization
  // ==========================================================
  function init() {
    // Login form
    var loginForm = $('#login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Logout
    var logoutBtn = $('#logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Filter buttons
    $$('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { setActiveFilter(this.dataset.status); });
    });

    // Search
    var searchInput = $('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function () { debouncedSearch(this.value); });
    }

    // Export
    var exportBtn = $('#export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportCSV);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Responsive resize
    window.addEventListener('resize', debouncedResize);

    // Check existing session
    var token = getToken();
    if (token) {
      setLoadingState(true);
      fetch(API.GET_LEADS, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Invalid session');
          return res.json();
        })
        .then(function (data) {
          allLeads = Array.isArray(data) ? data : (data.leads || []);
          showDashboard();
        })
        .catch(function () {
          clearToken();
          showLogin();
        })
        .finally(function () { setLoadingState(false); });
    } else {
      showLogin();
    }
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
