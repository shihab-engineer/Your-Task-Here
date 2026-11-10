/* TaskBoard storage layer
 * Netlify (static hosting) e Node/Electron backend nai, tai data browser er
 * localStorage (users/tasks/submissions) ar IndexedDB (PDF file) e thake.
 * Ei file ta window.boardAPI expose kore — pore Firebase/Supabase lagale
 * shudhu ei file ta replace korlei hobe.
 */
(function () {
  'use strict';

  const KEYS = { users: 'tb_users_v1', tasks: 'tb_tasks_v1', subs: 'tb_subs_v1', session: 'tb_session_v1' };

  /* ---------- localStorage helpers ---------- */
  function read(key) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return Array.isArray(v) ? v : [];
    } catch (_) { return []; }
  }
  function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data)); // quota error hole throw korbe, caller catch korbe
  }

  /* ---------- IndexedDB (PDF blobs) ---------- */
  let dbPromise = null;
  function openDb() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open('taskboard-files', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('files');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }
  async function idb(mode, fn) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', mode);
      let out;
      try { out = fn(tx.objectStore('files')); } catch (e) { reject(e); return; }
      tx.oncomplete = () => resolve(out && 'result' in out ? out.result : undefined);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Storage aborted'));
    });
  }
  const putFile = (key, blob) => idb('readwrite', s => s.put(blob, key));
  const getFile = (key) => idb('readonly', s => s.get(key));
  const delFile = (key) => idb('readwrite', s => s.delete(key)).catch(() => {});

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const fail = (err) => ({ success: false, error: (err && err.message) || String(err) });

  /* ---------- password hashing ---------- */
  async function hashPassword(password, phone) {
    const text = `taskboard|${phone}|${password}`;
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return 'h1:' + [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return 'b1:' + btoa(unescape(encodeURIComponent(text)));
  }

  window.boardAPI = {
    hashPassword,
    uid,

    /* users */
    async getUsers() { return { success: true, users: read(KEYS.users) }; },
    async saveUsers(users) {
      try { write(KEYS.users, users); return { success: true }; } catch (e) { return fail(e); }
    },

    /* session (login thakbe refresh er pore-o) */
    getSession() { try { return localStorage.getItem(KEYS.session); } catch (_) { return null; } },
    setSession(id) { try { localStorage.setItem(KEYS.session, id); } catch (_) {} },
    clearSession() { try { localStorage.removeItem(KEYS.session); } catch (_) {} },

    /* tasks */
    async getTasks() { return { success: true, tasks: read(KEYS.tasks) }; },
    async saveTask(task, file) {
      try {
        const tasks = read(KEYS.tasks);
        let fileKey = null;
        if (file) {
          fileKey = 'task_' + task.id;
          await putFile(fileKey, file);
        }
        tasks.push({
          id: task.id, title: task.title, subject: task.subject,
          targetClass: task.targetClass || 'all', description: task.description,
          deadline: task.deadline, maxMarks: task.maxMarks ? Number(task.maxMarks) : 100,
          teacherId: task.teacherId, teacherName: task.teacherName, createdAt: task.createdAt,
          fileName: file ? file.name : null, fileKey
        });
        write(KEYS.tasks, tasks);
        return { success: true };
      } catch (e) { return fail(e); }
    },
    async updateTask(task) {
      try {
        const tasks = read(KEYS.tasks);
        const t = tasks.find(x => x.id === task.id);
        if (!t) return fail('Task not found');
        Object.assign(t, {
          title: task.title, subject: task.subject, targetClass: task.targetClass || 'all',
          description: task.description, deadline: task.deadline,
          maxMarks: task.maxMarks ? Number(task.maxMarks) : 100
        });
        write(KEYS.tasks, tasks);
        return { success: true };
      } catch (e) { return fail(e); }
    },
    async deleteTask(taskId) {
      try {
        const tasks = read(KEYS.tasks);
        const task = tasks.find(x => x.id === taskId);
        const subs = read(KEYS.subs);
        // task delete hole tar submission + file-o muche jabe (age leftover thakto)
        subs.filter(s => s.taskId === taskId).forEach(s => s.fileKey && delFile(s.fileKey));
        if (task && task.fileKey) await delFile(task.fileKey);
        write(KEYS.subs, subs.filter(s => s.taskId !== taskId));
        write(KEYS.tasks, tasks.filter(x => x.id !== taskId));
        return { success: true };
      } catch (e) { return fail(e); }
    },

    /* submissions */
    async getSubmissions() { return { success: true, submissions: read(KEYS.subs) }; },
    async saveSubmission(data, file) {
      try {
        const subs = read(KEYS.subs);
        const old = subs.find(s => s.taskId === data.taskId && s.studentId === data.studentId);
        const fileKey = 'sub_' + data.id;
        await putFile(fileKey, file);
        if (old && old.fileKey) await delFile(old.fileKey);
        const rest = subs.filter(s => s !== old);
        rest.push({
          id: data.id, taskId: data.taskId, studentId: data.studentId,
          studentName: data.studentName, studentClass: data.studentClass || '',
          fileName: file.name, fileKey, submittedAt: data.submittedAt,
          marks: null, feedback: '' // notun file hole age er number reset hobe
        });
        write(KEYS.subs, rest);
        return { success: true, hadGrade: !!(old && old.marks !== null && old.marks !== undefined) };
      } catch (e) { return fail(e); }
    },
    async gradeSubmission({ submissionId, marks, feedback }) {
      try {
        const subs = read(KEYS.subs);
        const s = subs.find(x => x.id === submissionId);
        if (!s) return fail('Submission not found');
        s.marks = marks !== null && marks !== '' && marks !== undefined ? Number(marks) : null;
        s.feedback = feedback || '';
        s.gradedAt = new Date().toISOString();
        write(KEYS.subs, subs);
        return { success: true };
      } catch (e) { return fail(e); }
    },

    /* file download (browser e save hobe) */
    async downloadFile(fileKey, name) {
      try {
        const blob = await getFile(fileKey);
        if (!blob) return fail('File not found');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name || 'file.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        return { success: true };
      } catch (e) { return fail(e); }
    }
  };
})();
