(() => {
  'use strict';

  const MAX_PDF_MB = 25;
  const API = window.boardAPI;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const ICON = (id, cls = 'ic sm') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;

  /* ================== i18n ================== */
  const I18N = {
    bn: {
      brandName: 'টাস্কবোর্ড', logout: 'লগ-আউট',
      heroTitle: 'আপনার ক্লাসরুম টাস্ক, এক জায়গায়',
      heroSub: 'টাস্ক দিন, PDF জমা নিন, নম্বর দিন — সবকিছু সহজে।',
      pickRole: 'আপনি কে হিসেবে ঢুকছেন?',
      roleTeacher: 'শিক্ষক', roleTeacherDesc: 'টাস্ক তৈরি করুন ও মূল্যায়ন করুন',
      roleStudent: 'শিক্ষার্থী', roleStudentDesc: 'টাস্ক দেখুন ও PDF জমা দিন',
      back: 'পেছনে',
      loginTitleTeacher: 'শিক্ষক লগইন', loginTitleStudent: 'শিক্ষার্থী লগইন',
      phone: 'ফোন নম্বর', password: 'পাসওয়ার্ড', loginBtn: 'প্রবেশ করুন',
      forgotPass: 'পাসওয়ার্ড ভুলে গেছেন?', createProfile: 'নতুন প্রোফাইল তৈরি করুন',
      signupTitleTeacher: 'শিক্ষক প্রোফাইল তৈরি করুন', signupTitleStudent: 'শিক্ষার্থী প্রোফাইল তৈরি করুন',
      fullName: 'পুরো নাম', namePh: 'যেমন: রহিমা আক্তার',
      classSection: 'শ্রেণি / সেকশন', classPh: 'যেমন: 9-A',
      subjectOpt: 'বিষয় (ঐচ্ছিক)', subjectPh: 'যেমন: গণিত',
      confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন', createProfileBtn: 'প্রোফাইল তৈরি করুন',
      haveAccount: 'আগে থেকেই প্রোফাইল আছে? লগইন করুন',
      forgotTitle: 'পাসওয়ার্ড রিসেট করুন',
      forgotPhoneSub: 'আপনার রেজিস্টার করা ফোন নম্বর দিন',
      sendOtpBtn: 'পিন পাঠান',
      otpTitle: 'পিন যাচাই করুন',
      otpSubText: (p) => `${p} নম্বরের জন্য পিন তৈরি হয়েছে`,
      demoOtpLabel: 'ডেমো পিন:',
      enterOtp: '৪-সংখ্যার পিন লিখুন', verifyBtn: 'যাচাই করুন',
      resendOtp: 'পিন আবার পাঠান',
      newPassTitle: 'নতুন পাসওয়ার্ড দিন', newPassword: 'নতুন পাসওয়ার্ড', resetBtn: 'পাসওয়ার্ড পরিবর্তন করুন',
      newTask: 'নতুন টাস্ক', myTasks: 'আমার টাস্কসমূহ',
      allTasks: 'আমার টাস্ক বোর্ড', mySubmissions: 'আমার জমা ও ফলাফল',
      createTaskTitle: 'নতুন টাস্ক তৈরি করুন', createTaskSub: 'নির্দিষ্ট শ্রেণির শিক্ষার্থীদের জন্য টাস্ক দিন',
      taskTitleLabel: 'টাস্কের শিরোনাম', taskTitlePh: 'যেমন: অধ্যায় ৫ — অনুশীলনী',
      subject: 'বিষয়', subjectPh2: 'যেমন: বাংলা',
      targetClassLabel: 'শ্রেণি / সেকশন', targetClassPh: 'all অথবা 9-A, 10-B',
      targetClassHint: 'সবার জন্য "all" লিখুন, একাধিক হলে কমা দিয়ে আলাদা করুন',
      maxMarksLabel: 'মোট নম্বর',
      instructions: 'বিস্তারিত নির্দেশনা', instructionsPh: 'টাস্কটি কী করতে হবে লিখুন...',
      deadline: 'জমা দেওয়ার শেষ সময়', pinTaskBtn: 'টাস্ক প্রকাশ করুন',
      taskPdfLabel: 'টাস্ক PDF ফাইল (ঐচ্ছিক)',
      taskDzText: 'প্রশ্ন বা নির্দেশনার PDF সংযুক্ত করতে ক্লিক করুন',
      taskHasPdf: 'PDF সংযুক্ত',
      downloadTaskPdf: 'টাস্কের PDF ডাউনলোড',
      downloadQuestionPdf: 'প্রশ্ন PDF ডাউনলোড',
      myTasksTitle: 'আমার টাস্কসমূহ',
      allTasksTitle: 'আমার টাস্ক বোর্ড',
      mySubmissionsTitle: 'আমার জমা ও ফলাফল', mySubmissionsSub: 'জমাকৃত ফাইল এবং শিক্ষকের নম্বর ও মন্তব্য দেখুন',
      dzText: 'এখানে ক্লিক করে PDF বেছে নিন', submitBtn: 'জমা দিন',
      resubmitBtn: 'ফাইল পরিবর্তন করুন',
      resubmitHeader: 'ফাইল প্রতিস্থাপন করুন',
      noTasksTeacher: 'এখনো কোনো টাস্ক দেওয়া হয়নি।',
      noTasksStudent: 'আপনার শ্রেণির জন্য এখনো কোনো টাস্ক নেই।',
      noSubmissionsYet: 'এখনো কেউ জমা দেয়নি।', noMySubmissions: 'এখনো কোনো টাস্ক জমা দেননি।',
      submissionsCount: (n) => `${n}টি জমা`, download: 'ডাউনলোড',
      statusSubmitted: 'জমা দেওয়া হয়েছে', statusOverdue: 'সময় শেষ', statusPending: 'বাকি আছে', statusGraded: 'মূল্যায়িত',
      statusNotGraded: 'মূল্যায়ন বাকি', locked: 'লক',
      submitFor: (t) => `"${t}" জমা দিন`, viewFor: (t) => `"${t}" — জমা ও মূল্যায়ন`,
      existingSubHint: 'আপনি আগেই একটি ফাইল জমা দিয়েছেন। ডেডলাইনের আগে নতুন ফাইল দিয়ে প্রতিস্থাপন করতে পারবেন।',
      existingGradedHint: ' নতুন ফাইল দিলে আগের নম্বর মুছে যাবে।',
      deadlineIs: (d) => `শেষ সময়: ${d}`,
      deletedTask: 'মুছে ফেলা টাস্ক',
      editTaskBtn: 'এডিট', deleteTaskBtn: 'মুছুন',
      editTaskTitle: 'টাস্ক পরিবর্তন করুন', editTaskSub: 'টাস্কের বিবরণ ও শেষ সময় আপডেট করুন', updateTaskBtn: 'সংরক্ষণ করুন',
      gradeBtn: 'সংরক্ষণ', marksPh: (m) => `নম্বর / ${m}`, feedbackPh: 'শিক্ষকের মন্তব্য লিখুন...',
      teacherFeedback: 'শিক্ষকের মন্তব্য:',
      classTag: (c) => `শ্রেণি: ${c}`, allClasses: 'সকল শ্রেণি', marksTag: (m) => `${m} নম্বর`,
      deleteTitle: 'টাস্ক মুছে ফেলবেন?',
      deleteConfirm: 'টাস্ক এবং এর সব জমা দেওয়া ফাইল স্থায়ীভাবে মুছে যাবে।',
      cancel: 'বাতিল', confirmDelete: 'মুছে ফেলুন',
      helloTeacher: (n) => `স্বাগতম, ${n}`, helloStudent: (n) => `হ্যালো, ${n}`,
      teacherHeroSub: 'আপনার ক্লাসের টাস্ক ও জমার সারসংক্ষেপ',
      studentHeroSub: (c) => c ? `শ্রেণি ${c} — আপনার টাস্কগুলো এখানে` : 'আপনার টাস্কগুলো এখানে',
      statTasks: 'মোট টাস্ক', statSubs: 'মোট জমা', statToCheck: 'মূল্যায়ন বাকি',
      statPending: 'জমা বাকি', statMissing: 'সময় শেষ', statDone: 'জমা দিয়েছি', statGraded: 'মূল্যায়িত',
      emptyCreate: 'প্রথম টাস্ক তৈরি করুন',
      teacherCommentLabel: 'শিক্ষকের মন্তব্য',
      toastTaskDeleted: 'টাস্ক মুছে ফেলা হয়েছে',
      toastTaskUpdated: 'টাস্ক আপডেট হয়েছে',
      toastPinned: 'টাস্ক প্রকাশ করা হয়েছে',
      toastPdfOnly: 'শুধুমাত্র PDF ফাইল আপলোড করা যাবে',
      toastTooBig: (mb) => `ফাইলের আকার ${mb}MB-এর বেশি হতে পারবে না`,
      toastSubmitted: 'PDF সফলভাবে জমা হয়েছে',
      toastSaveFail: 'সংরক্ষণ করা যায়নি। ব্রাউজারের স্টোরেজ ভরে গেছে কিনা দেখুন।',
      toastDownloadFail: 'ফাইলটি খুঁজে পাওয়া যায়নি',
      toastDeadlineOver: 'জমা দেওয়ার সময় শেষ। ফাইল জমা বা পরিবর্তন করা যাবে না।',
      toastDeadlinePast: 'শেষ সময় ভবিষ্যতের হতে হবে',
      toastPhoneExists: 'এই ফোন নম্বরে ইতিমধ্যে একটি প্রোফাইল আছে',
      toastPhoneInvalid: 'সঠিক ফোন নম্বর দিন',
      toastNameRequired: 'নাম লিখুন',
      toastPassShort: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে',
      toastPassMismatch: 'পাসওয়ার্ড দুটি মিলছে না',
      toastAccountCreated: 'প্রোফাইল তৈরি হয়েছে! স্বাগতম।',
      toastLoginFail: 'ফোন নম্বর অথবা পাসওয়ার্ড ভুল',
      toastNoAccount: 'এই নম্বরে কোনো প্রোফাইল খুঁজে পাওয়া যায়নি',
      toastOtpSent: 'ডেমো পিন তৈরি হয়েছে (নিচে দেখুন)',
      toastOtpWrong: 'পিনটি সঠিক নয়',
      toastPassChanged: 'পাসওয়ার্ড পরিবর্তন হয়েছে, এখন লগইন করুন',
      toastMarksRange: (m) => `নম্বর ০ থেকে ${m}-এর মধ্যে হতে হবে`,
      toastGradeSaved: 'মূল্যায়ন সংরক্ষিত হয়েছে',
      toastFillAll: 'সব তথ্য পূরণ করুন',
      toastMarksInvalid: 'মোট নম্বর ১ বা তার বেশি হতে হবে',
    },
    en: {
      brandName: 'TaskBoard', logout: 'Log out',
      heroTitle: 'Your classroom tasks, in one place',
      heroSub: 'Assign tasks, collect PDFs and give marks — all made simple.',
      pickRole: 'Who are you signing in as?',
      roleTeacher: 'Teacher', roleTeacherDesc: 'Create tasks, grade and evaluate',
      roleStudent: 'Student', roleStudentDesc: 'View tasks and submit PDFs',
      back: 'Back',
      loginTitleTeacher: 'Teacher login', loginTitleStudent: 'Student login',
      phone: 'Phone number', password: 'Password', loginBtn: 'Log in',
      forgotPass: 'Forgot password?', createProfile: 'Create a new profile',
      signupTitleTeacher: 'Create teacher profile', signupTitleStudent: 'Create student profile',
      fullName: 'Full name', namePh: 'e.g. Rahima Akter',
      classSection: 'Class / Section', classPh: 'e.g. 9-A',
      subjectOpt: 'Subject (optional)', subjectPh: 'e.g. Mathematics',
      confirmPassword: 'Confirm password', createProfileBtn: 'Create profile',
      haveAccount: 'Already have a profile? Log in',
      forgotTitle: 'Reset your password',
      forgotPhoneSub: 'Enter your registered phone number',
      sendOtpBtn: 'Send PIN',
      otpTitle: 'Verify PIN',
      otpSubText: (p) => `A PIN was generated for ${p}`,
      demoOtpLabel: 'Demo PIN:',
      enterOtp: 'Enter the 4-digit PIN', verifyBtn: 'Verify',
      resendOtp: 'Resend PIN',
      newPassTitle: 'Set a new password', newPassword: 'New password', resetBtn: 'Change password',
      newTask: 'New task', myTasks: 'My tasks',
      allTasks: 'My task board', mySubmissions: 'My submissions & scores',
      createTaskTitle: 'Create a new task', createTaskSub: 'Assign a task to specific classes',
      taskTitleLabel: 'Task title', taskTitlePh: 'e.g. Chapter 5 — Exercises',
      subject: 'Subject', subjectPh2: 'e.g. Bangla',
      targetClassLabel: 'Class / Section', targetClassPh: 'all or 9-A, 10-B',
      targetClassHint: 'Type "all" for everyone, or separate classes with commas',
      maxMarksLabel: 'Max marks',
      instructions: 'Instructions', instructionsPh: 'Describe what students need to do...',
      deadline: 'Submission deadline', pinTaskBtn: 'Publish task',
      taskPdfLabel: 'Task PDF file (optional)',
      taskDzText: 'Click to attach a questions or instructions PDF',
      taskHasPdf: 'PDF attached',
      downloadTaskPdf: 'Download task PDF',
      downloadQuestionPdf: 'Download question PDF',
      myTasksTitle: 'My tasks',
      allTasksTitle: 'My task board',
      mySubmissionsTitle: 'My submissions & scores', mySubmissionsSub: 'See your files, marks and teacher feedback',
      dzText: 'Click here to choose a PDF', submitBtn: 'Submit',
      resubmitBtn: 'Replace file',
      resubmitHeader: 'Replace submitted file',
      noTasksTeacher: 'No tasks assigned yet.',
      noTasksStudent: 'There are no tasks for your class yet.',
      noSubmissionsYet: 'No one has submitted yet.', noMySubmissions: "You haven't submitted any task yet.",
      submissionsCount: (n) => `${n} submitted`, download: 'Download',
      statusSubmitted: 'Submitted', statusOverdue: 'Missing', statusPending: 'Assigned', statusGraded: 'Graded',
      statusNotGraded: 'Not graded', locked: 'Locked',
      submitFor: (t) => `Submit "${t}"`, viewFor: (t) => `"${t}" — submissions & grading`,
      existingSubHint: 'You already submitted a file. You can replace it any time before the deadline.',
      existingGradedHint: ' Replacing it will clear your previous marks.',
      deadlineIs: (d) => `Due: ${d}`,
      deletedTask: 'Deleted task',
      editTaskBtn: 'Edit', deleteTaskBtn: 'Delete',
      editTaskTitle: 'Edit task', editTaskSub: 'Update the task details and deadline', updateTaskBtn: 'Save changes',
      gradeBtn: 'Save', marksPh: (m) => `Marks / ${m}`, feedbackPh: 'Write feedback for the student...',
      teacherFeedback: 'Teacher feedback:',
      classTag: (c) => `Class: ${c}`, allClasses: 'All classes', marksTag: (m) => `${m} marks`,
      deleteTitle: 'Delete this task?',
      deleteConfirm: 'The task and all its submitted files will be permanently deleted.',
      cancel: 'Cancel', confirmDelete: 'Delete',
      helloTeacher: (n) => `Welcome, ${n}`, helloStudent: (n) => `Hello, ${n}`,
      teacherHeroSub: 'A summary of your class tasks and submissions',
      studentHeroSub: (c) => c ? `Class ${c} — your tasks are here` : 'Your tasks are here',
      statTasks: 'Total tasks', statSubs: 'Submissions', statToCheck: 'To grade',
      statPending: 'To do', statMissing: 'Missing', statDone: 'Handed in', statGraded: 'Graded',
      emptyCreate: 'Create your first task',
      teacherCommentLabel: 'Teacher feedback',
      toastTaskDeleted: 'Task deleted',
      toastTaskUpdated: 'Task updated',
      toastPinned: 'Task published',
      toastPdfOnly: 'Only PDF files can be uploaded',
      toastTooBig: (mb) => `File size can't exceed ${mb}MB`,
      toastSubmitted: 'PDF submitted successfully',
      toastSaveFail: "Couldn't save. Your browser storage may be full.",
      toastDownloadFail: 'File not found',
      toastDeadlineOver: 'The deadline has passed. Submissions are locked.',
      toastDeadlinePast: 'Deadline must be in the future',
      toastPhoneExists: 'A profile already exists with this phone number',
      toastPhoneInvalid: 'Enter a valid phone number',
      toastNameRequired: 'Please enter your name',
      toastPassShort: 'Password must be at least 4 characters',
      toastPassMismatch: "Passwords don't match",
      toastAccountCreated: 'Profile created! Welcome.',
      toastLoginFail: 'Wrong phone number or password',
      toastNoAccount: 'No profile found with this number',
      toastOtpSent: 'Demo PIN generated (see below)',
      toastOtpWrong: 'Incorrect PIN',
      toastPassChanged: 'Password changed, please log in',
      toastMarksRange: (m) => `Marks must be between 0 and ${m}`,
      toastGradeSaved: 'Evaluation saved',
      toastFillAll: 'Please fill in all fields',
      toastMarksInvalid: 'Max marks must be 1 or more',
    }
  };

  let currentLang = localStorage.getItem('tb_lang') || 'bn';
  function t(key, ...args) {
    const v = I18N[currentLang][key] ?? I18N.bn[key];
    return typeof v === 'function' ? v(...args) : v;
  }

  function applyLanguage() {
    document.body.classList.toggle('lang-en', currentLang === 'en');
    document.body.classList.toggle('lang-bn', currentLang === 'bn');
    document.documentElement.lang = currentLang;
    $$('#langBn, #langEn').forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
    refreshDynamicLabels();
  }
  function setLang(l) {
    currentLang = l;
    try { localStorage.setItem('tb_lang', l); } catch (_) {}
    applyLanguage();
  }
  $('#langBn').addEventListener('click', () => setLang('bn'));
  $('#langEn').addEventListener('click', () => setLang('en'));

  function refreshDynamicLabels() {
    if (pendingRole) {
      $('#loginStepLabel').textContent = pendingRole === 'teacher' ? t('loginTitleTeacher') : t('loginTitleStudent');
      $('#signupStepLabel').textContent = pendingRole === 'teacher' ? t('signupTitleTeacher') : t('signupTitleStudent');
    }
    if (forgotUser && currentOtp) $('#otpSubText').textContent = t('otpSubText', forgotUser.phone);
    if (currentUser) {
      $('#userRoleLabel').textContent = roleLabelFor(currentUser);
      if (!$('#appShell').hidden) renderCurrentView();
    }
  }

  /* ================== helpers ================== */
  const uid = API.uid;

  function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return '—';
    const locale = currentLang === 'en' ? 'en-GB' : 'bn-BD';
    return d.toLocaleString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  // Bengali digit, +88 prefix, space, dash handle kore
  function normPhone(p) {
    let s = String(p || '').replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d)).replace(/[\s\-()]/g, '');
    s = s.replace(/^\+?88(?=01\d{9}$)/, '');
    return s;
  }
  const validPhone = (p) => /^\+?\d{6,15}$/.test(p);

  // class compare: "9-A", "9 a", "9–A" sob ek dhoron e dhora hobe
  const normClass = (c) => String(c || '').toLowerCase().replace(/[\s\u2010-\u2015_]/g, '').replace(/-/g, '');
  function classMatches(target, studentClass) {
    const tgt = String(target || 'all').trim().toLowerCase();
    if (tgt === 'all' || tgt === 'সব' || tgt === '') return true;
    const sc = normClass(studentClass);
    if (!sc) return false;
    return tgt.split(',').map(normClass).filter(Boolean).includes(sc);
  }

  function roleLabelFor(u) {
    if (u.role === 'teacher') return `${t('roleTeacher')}${u.subject ? ' · ' + u.subject : ''}`;
    return `${t('roleStudent')}${u.classInfo ? ' · ' + u.classInfo : ''}`;
  }

  const PALETTE = ['#1e8e3e', '#1a73e8', '#e37400', '#a142f4', '#d93025', '#129eaf', '#c2185b', '#5f6368'];
  function colorFor(str) {
    let h = 0;
    const s = String(str || '').toLowerCase();
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
  }
  const firstChar = (s) => ([...String(s || '').trim()][0] || '?').toUpperCase();

  function isPdf(file) {
    return file && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name));
  }
  function checkPdf(file) {
    if (!isPdf(file)) { toast(t('toastPdfOnly')); return false; }
    if (file.size > MAX_PDF_MB * 1024 * 1024) { toast(t('toastTooBig', MAX_PDF_MB)); return false; }
    return true;
  }

  function nowLocalInput() {
    const d = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 16);
  }

  async function downloadFile(key, name) {
    const res = await API.downloadFile(key, name);
    if (!res.success) toast(t('toastDownloadFail'));
  }

  /* ================== state ================== */
  let currentUser = null;
  let pendingRole = null;
  let forgotUser = null;
  let currentOtp = null;
  let currentView = null;

  /* ================== auth ================== */
  function gotoStep(step) {
    $$('.auth-step').forEach(s => { s.hidden = s.dataset.step !== step; });
  }
  $$('.back-link').forEach(b => b.addEventListener('click', () => gotoStep(b.dataset.back)));
  $$('[data-goto]').forEach(b => b.addEventListener('click', () => gotoStep(b.dataset.goto)));

  $$('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pendingRole = btn.dataset.role;
      $('#signupClassField').hidden = pendingRole !== 'student';
      $('#signupSubjectField').hidden = pendingRole !== 'teacher';
      $('#loginStepLabel').textContent = pendingRole === 'teacher' ? t('loginTitleTeacher') : t('loginTitleStudent');
      $('#signupStepLabel').textContent = pendingRole === 'teacher' ? t('signupTitleTeacher') : t('signupTitleStudent');
      gotoStep('login');
    });
  });

  $$('.eye-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.eye);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = ICON(show ? 'eye-off' : 'eye');
    });
  });

  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = normPhone($('#loginPhone').value);
    const pass = $('#loginPassword').value;
    if (!phone || !pass) { toast(t('toastFillAll')); return; }
    const { users = [] } = await API.getUsers();
    const user = users.find(u => u.phone === phone && u.role === pendingRole);
    if (!user || user.password !== await API.hashPassword(pass, phone)) { toast(t('toastLoginFail')); return; }
    $('#loginForm').reset();
    loginAs(user);
  });

  function loginAs(user) {
    currentUser = user;
    API.setSession(user.id);
    enterApp();
  }

  $('#signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#signupName').value.trim();
    const phone = normPhone($('#signupPhone').value);
    const pass = $('#signupPassword').value;
    const pass2 = $('#signupPassword2').value;
    if (!name) { toast(t('toastNameRequired')); return; }
    if (!validPhone(phone)) { toast(t('toastPhoneInvalid')); return; }
    if (pass.length < 4) { toast(t('toastPassShort')); return; }
    if (pass !== pass2) { toast(t('toastPassMismatch')); return; }

    const { users = [] } = await API.getUsers();
    if (users.some(u => u.phone === phone && u.role === pendingRole)) { toast(t('toastPhoneExists')); return; }

    const newUser = {
      id: uid(), name, phone,
      password: await API.hashPassword(pass, phone),
      role: pendingRole,
      classInfo: pendingRole === 'student' ? $('#signupClass').value.trim() : '',
      subject: pendingRole === 'teacher' ? $('#signupSubject').value.trim() : '',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    const res = await API.saveUsers(users);
    if (!res.success) { toast(t('toastSaveFail')); return; }
    $('#signupForm').reset();
    toast(t('toastAccountCreated'));
    loginAs(newUser);
  });

  $('#forgotPhoneForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = normPhone($('#forgotPhone').value);
    const { users = [] } = await API.getUsers();
    const user = users.find(u => u.phone === phone && u.role === pendingRole);
    if (!user) { toast(t('toastNoAccount')); return; }
    forgotUser = user;
    sendOtp();
    gotoStep('forgotOtp');
  });

  function sendOtp() {
    currentOtp = String(Math.floor(1000 + Math.random() * 9000));
    $('#demoOtpDisplay').textContent = currentOtp;
    $('#otpSubText').textContent = t('otpSubText', forgotUser.phone);
    $('#otpInput').value = '';
    toast(t('toastOtpSent'));
  }
  $('#resendOtpBtn').addEventListener('click', () => { if (forgotUser) sendOtp(); });

  $('#forgotOtpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = normPhone($('#otpInput').value);
    if (!currentOtp || entered !== currentOtp) { toast(t('toastOtpWrong')); return; }
    gotoStep('forgotReset');
  });

  $('#forgotResetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const p1 = $('#resetPassword').value, p2 = $('#resetPassword2').value;
    if (p1.length < 4) { toast(t('toastPassShort')); return; }
    if (p1 !== p2) { toast(t('toastPassMismatch')); return; }
    if (!forgotUser) { gotoStep('forgotPhone'); return; }
    const { users = [] } = await API.getUsers();
    const u = users.find(x => x.id === forgotUser.id);
    if (u) {
      u.password = await API.hashPassword(p1, u.phone);
      await API.saveUsers(users);
    }
    $('#forgotResetForm').reset();
    toast(t('toastPassChanged'));
    forgotUser = null; currentOtp = null;
    gotoStep('login');
  });

  $('#logoutBtn').addEventListener('click', () => {
    currentUser = null;
    currentView = null;
    API.clearSession();
    document.body.classList.remove('drawer-open');
    $('#appShell').hidden = true;
    $('#headerUserChip').hidden = true;
    $('#menuBtn').hidden = true;
    $('#teacherNav').hidden = true;
    $('#studentNav').hidden = true;
    $('#authScreen').hidden = false;
    gotoStep('role');
  });

  function enterApp() {
    $('#authScreen').hidden = true;
    $('#appShell').hidden = false;
    $('#headerUserChip').hidden = false;
    $('#menuBtn').hidden = false;

    $('#userNameLabel').textContent = currentUser.name;
    $('#userAvatar').textContent = firstChar(currentUser.name);
    $('#userRoleLabel').textContent = roleLabelFor(currentUser);

    const isTeacher = currentUser.role === 'teacher';
    $('#teacherNav').hidden = !isTeacher;
    $('#studentNav').hidden = isTeacher;
    showView(isTeacher ? 'teacherTasks' : 'studentTasks');
  }

  /* ================== navigation ================== */
  function showView(name) {
    currentView = name;
    $$('.view').forEach(v => { v.hidden = true; });
    $(`#view-${name}`).hidden = false;
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    document.body.classList.remove('drawer-open');
    if (name === 'teacherCreate') $('#taskDeadline').min = nowLocalInput();
    renderCurrentView();
    window.scrollTo(0, 0);
  }

  function renderCurrentView() {
    if (!currentUser || !currentView) return;
    if (currentView === 'teacherTasks') renderTeacherBoard();
    else if (currentView === 'studentTasks') renderStudentBoard();
    else if (currentView === 'studentSubmissions') renderMySubmissions();
  }

  $$('.nav-item').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
  $('#toolbarNewTask').addEventListener('click', () => showView('teacherCreate'));
  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('drawer-open'));
  $('#drawerScrim').addEventListener('click', () => document.body.classList.remove('drawer-open'));

  /* ================== shared UI builders ================== */
  function heroHtml(variant, title, sub, stats) {
    return `
      <div class="hero ${variant}">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(sub)}</p>
        </div>
        <div class="hero-stats">
          ${stats.map(s => `<div class="stat"><b>${s.n}</b><span>${escapeHtml(s.l)}</span></div>`).join('')}
        </div>
      </div>`;
  }

  function emptyHtml(text, withCta) {
    return `
      <div class="empty-state">
        <svg viewBox="0 0 24 24"><use href="#i-task"/></svg>
        <p>${escapeHtml(text)}</p>
        ${withCta ? `<button class="btn primary" data-empty-cta>${ICON('add')}<span>${escapeHtml(t('emptyCreate'))}</span></button>` : ''}
      </div>`;
  }

  function courseCard(task, { avatarText, footer, late }) {
    const color = colorFor(task.subject);
    const cls = task.targetClass && task.targetClass.trim().toLowerCase() !== 'all'
      ? t('classTag', task.targetClass) : t('allClasses');
    return `
      <article class="course" role="button" tabindex="0" data-task="${escapeHtml(task.id)}" style="--c:${color}">
        <div class="course-head">
          <div class="course-subject">${escapeHtml(task.subject)} · ${escapeHtml(cls)}</div>
          <div class="course-title">${escapeHtml(task.title)}</div>
          <div class="course-avatar">${escapeHtml(avatarText)}</div>
        </div>
        <div class="course-body">
          <div class="course-desc">${escapeHtml(task.description)}</div>
          <div class="course-due ${late ? 'late' : ''}">${ICON('clock')}<span>${escapeHtml(fmtDate(task.deadline))}</span></div>
        </div>
        <div class="course-foot">${footer}</div>
      </article>`;
  }

  function bindCards(board, handler) {
    $$('.course', board).forEach(el => {
      el.addEventListener('click', () => handler(el.dataset.task));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(el.dataset.task); }
      });
    });
  }

  /* ================== TEACHER ================== */
  let pendingTaskFile = null;

  const taskDz = $('#taskDropzone');
  taskDz.addEventListener('click', () => $('#taskPdfInput').click());
  taskDz.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#taskPdfInput').click(); } });
  $('#taskPdfInput').addEventListener('click', (e) => e.stopPropagation()); // dropzone e click loop ruke
  $('#taskPdfInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!checkPdf(file)) return;
    pendingTaskFile = file;
    $('#taskDzFileName').textContent = file.name;
    taskDz.classList.add('has-file');
  });

  $('#taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = $('#taskTitle').value.trim();
    const subject = $('#taskSubject').value.trim();
    const targetClass = $('#taskTargetClass').value.trim() || 'all';
    const maxMarks = Number($('#taskMaxMarks').value);
    const description = $('#taskDesc').value.trim();
    const deadline = $('#taskDeadline').value;

    if (!title || !subject || !description || !deadline) { toast(t('toastFillAll')); return; }
    if (!(maxMarks >= 1)) { toast(t('toastMarksInvalid')); return; }
    if (new Date(deadline) <= new Date()) { toast(t('toastDeadlinePast')); return; }

    const btn = $('#taskSubmitBtn');
    btn.disabled = true;
    const res = await API.saveTask({
      id: uid(), title, subject, targetClass, maxMarks, description, deadline,
      teacherId: currentUser.id, teacherName: currentUser.name, createdAt: new Date().toISOString()
    }, pendingTaskFile);
    btn.disabled = false;

    if (!res.success) { toast(t('toastSaveFail')); return; }

    $('#taskForm').reset();
    $('#taskTargetClass').value = 'all';
    $('#taskMaxMarks').value = 100;
    pendingTaskFile = null;
    $('#taskDzFileName').textContent = '';
    taskDz.classList.remove('has-file');
    toast(t('toastPinned'));
    showView('teacherTasks');
  });

  async function renderTeacherBoard() {
    const board = $('#teacherBoard');
    const [{ tasks = [] }, { submissions = [] }] = await Promise.all([API.getTasks(), API.getSubmissions()]);
    const myTasks = tasks.filter(x => x.teacherId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const myIds = new Set(myTasks.map(x => x.id));
    const mySubs = submissions.filter(s => myIds.has(s.taskId));
    const toCheck = mySubs.filter(s => s.marks === null || s.marks === undefined).length;

    $('#teacherHero').innerHTML = heroHtml('', t('helloTeacher', currentUser.name), t('teacherHeroSub'), [
      { n: myTasks.length, l: t('statTasks') },
      { n: mySubs.length, l: t('statSubs') },
      { n: toCheck, l: t('statToCheck') }
    ]);

    if (!myTasks.length) {
      board.innerHTML = emptyHtml(t('noTasksTeacher'), true);
      const cta = $('[data-empty-cta]', board);
      if (cta) cta.addEventListener('click', () => showView('teacherCreate'));
      return;
    }

    board.innerHTML = myTasks.map(x => {
      const subs = submissions.filter(s => s.taskId === x.id);
      const pending = subs.filter(s => s.marks === null || s.marks === undefined).length;
      const footer = `
        <span class="chip submitted">${escapeHtml(t('submissionsCount', subs.length))}</span>
        ${pending ? `<span class="chip tocheck">${escapeHtml(t('statToCheck'))}: ${pending}</span>` : ''}
        <span class="chip blue">${escapeHtml(t('marksTag', x.maxMarks || 100))}</span>
        ${x.fileKey ? `<span class="chip">${ICON('pdf', 'ic')}${escapeHtml(t('taskHasPdf'))}</span>` : ''}`;
      return courseCard(x, { avatarText: firstChar(x.subject), footer, late: new Date(x.deadline) < new Date() });
    }).join('');

    bindCards(board, openSubmissionsModal);
  }

  async function openSubmissionsModal(taskId) {
    const { tasks = [] } = await API.getTasks();
    const task = tasks.find(x => x.id === taskId);
    if (!task) return;
    const { submissions = [] } = await API.getSubmissions();
    const subs = submissions.filter(s => s.taskId === taskId)
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    const max = task.maxMarks || 100;

    $('#viewSubTitle').textContent = t('viewFor', task.title);

    const pdfArea = $('#teacherTaskPdfDownloadArea');
    if (task.fileKey) {
      pdfArea.hidden = false;
      $('#teacherDownloadTaskPdfBtn').onclick = () => downloadFile(task.fileKey, task.fileName || `${task.title}.pdf`);
    } else {
      pdfArea.hidden = true;
    }

    $('#editTaskBtn').onclick = () => openEditTaskModal(task);
    $('#deleteTaskBtn').onclick = () => {
      askConfirm(t('deleteTitle'), t('deleteConfirm'), async () => {
        const res = await API.deleteTask(task.id);
        closeModal('#viewSubmissionsModal');
        if (res.success) toast(t('toastTaskDeleted')); else toast(t('toastSaveFail'));
        renderTeacherBoard();
      });
    };

    const body = $('#subTableBody');
    if (!subs.length) {
      body.innerHTML = `<div class="sub-table-empty">${escapeHtml(t('noSubmissionsYet'))}</div>`;
    } else {
      body.innerHTML = subs.map(s => {
        const marksVal = s.marks !== null && s.marks !== undefined ? s.marks : '';
        return `
        <div class="sub-table-card">
          <div class="sub-table-header">
            <div class="sub-table-person">
              <span class="avatar">${escapeHtml(firstChar(s.studentName))}</span>
              <div style="min-width:0">
                <div class="sub-table-name">${escapeHtml(s.studentName)} ${s.studentClass ? `<small>(${escapeHtml(s.studentClass)})</small>` : ''}</div>
                <div class="sub-table-time">${escapeHtml(fmtDate(s.submittedAt))} · ${escapeHtml(s.fileName)}</div>
              </div>
            </div>
            <button class="btn secondary dl-btn" data-key="${escapeHtml(s.fileKey)}" data-name="${escapeHtml(s.fileName)}">${ICON('download')}<span>${escapeHtml(t('download'))}</span></button>
          </div>
          <div class="grade-row">
            <input type="number" class="grade-input" id="marks-${escapeHtml(s.id)}" placeholder="${escapeHtml(t('marksPh', max))}" value="${marksVal}" min="0" max="${max}" step="any">
            <input type="text" class="feedback-input" id="feedback-${escapeHtml(s.id)}" placeholder="${escapeHtml(t('feedbackPh'))}" value="${escapeHtml(s.feedback || '')}">
            <button class="btn primary save-grade-btn" data-sub="${escapeHtml(s.id)}">${escapeHtml(t('gradeBtn'))}</button>
          </div>
        </div>`;
      }).join('');

      $$('.dl-btn', body).forEach(b => b.addEventListener('click', () => downloadFile(b.dataset.key, b.dataset.name)));

      $$('.save-grade-btn', body).forEach(b => {
        b.addEventListener('click', async () => {
          const subId = b.dataset.sub;
          const marksRaw = document.getElementById(`marks-${subId}`).value.trim();
          const feedback = document.getElementById(`feedback-${subId}`).value.trim();
          if (marksRaw !== '') {
            const m = Number(marksRaw);
            if (isNaN(m) || m < 0 || m > max) { toast(t('toastMarksRange', max)); return; }
          }
          const res = await API.gradeSubmission({ submissionId: subId, marks: marksRaw, feedback });
          toast(res.success ? t('toastGradeSaved') : t('toastSaveFail'));
          if (res.success) renderTeacherBoard();
        });
      });
    }
    openModal('#viewSubmissionsModal');
  }

  function openEditTaskModal(task) {
    closeModal('#viewSubmissionsModal');
    $('#editTaskTitle').value = task.title;
    $('#editTaskSubject').value = task.subject;
    $('#editTaskTargetClass').value = task.targetClass || 'all';
    $('#editTaskMaxMarks').value = task.maxMarks || 100;
    $('#editTaskDeadline').value = task.deadline;
    $('#editTaskDesc').value = task.description;

    $('#editTaskForm').onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        id: task.id,
        title: $('#editTaskTitle').value.trim(),
        subject: $('#editTaskSubject').value.trim(),
        targetClass: $('#editTaskTargetClass').value.trim() || 'all',
        maxMarks: Number($('#editTaskMaxMarks').value),
        deadline: $('#editTaskDeadline').value,
        description: $('#editTaskDesc').value.trim()
      };
      if (!data.title || !data.subject || !data.description || !data.deadline) { toast(t('toastFillAll')); return; }
      if (!(data.maxMarks >= 1)) { toast(t('toastMarksInvalid')); return; }
      const res = await API.updateTask(data);
      if (!res.success) { toast(t('toastSaveFail')); return; }
      closeModal('#editTaskModal');
      toast(t('toastTaskUpdated'));
      renderTeacherBoard();
    };
    openModal('#editTaskModal');
  }

  /* ================== STUDENT ================== */
  function studentStatus(task, mine) {
    if (mine) return (mine.marks !== null && mine.marks !== undefined) ? 'graded' : 'submitted';
    return new Date(task.deadline) < new Date() ? 'overdue' : 'pending';
  }

  async function renderStudentBoard() {
    const board = $('#studentBoard');
    const [{ tasks = [] }, { submissions = [] }] = await Promise.all([API.getTasks(), API.getSubmissions()]);
    const mySubs = submissions.filter(s => s.studentId === currentUser.id);

    const applicable = tasks.filter(task => classMatches(task.targetClass, currentUser.classInfo))
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const counts = { pending: 0, overdue: 0, submitted: 0, graded: 0 };
    applicable.forEach(x => { counts[studentStatus(x, mySubs.find(s => s.taskId === x.id))]++; });

    $('#studentHero').innerHTML = heroHtml('blue', t('helloStudent', currentUser.name), t('studentHeroSub', currentUser.classInfo), [
      { n: counts.pending, l: t('statPending') },
      { n: counts.overdue, l: t('statMissing') },
      { n: counts.submitted + counts.graded, l: t('statDone') },
      { n: counts.graded, l: t('statGraded') }
    ]);

    if (!applicable.length) {
      board.innerHTML = emptyHtml(t('noTasksStudent'), false);
      return;
    }

    board.innerHTML = applicable.map(x => {
      const mine = mySubs.find(s => s.taskId === x.id);
      const status = studentStatus(x, mine);
      const label = {
        submitted: t('statusSubmitted'),
        graded: `${t('statusGraded')} · ${mine && mine.marks}/${x.maxMarks || 100}`,
        overdue: t('statusOverdue'),
        pending: t('statusPending')
      }[status];
      const footer = `
        <span class="chip ${status}">${escapeHtml(label)}</span>
        <span class="chip blue">${escapeHtml(t('marksTag', x.maxMarks || 100))}</span>
        ${x.fileKey ? `<span class="chip">${ICON('pdf', 'ic')}${escapeHtml(t('taskHasPdf'))}</span>` : ''}`;
      return courseCard(x, { avatarText: firstChar(x.teacherName), footer, late: status === 'overdue' });
    }).join('');

    bindCards(board, openSubmitModal);
  }

  let activeTaskId = null, pendingFile = null;
  const dz = $('#dropzone');

  async function openSubmitModal(taskId) {
    const { tasks = [] } = await API.getTasks();
    const task = tasks.find(x => x.id === taskId);
    if (!task) return;
    const { submissions = [] } = await API.getSubmissions();
    const existing = submissions.find(s => s.taskId === taskId && s.studentId === currentUser.id);
    const overdue = new Date(task.deadline) < new Date();

    activeTaskId = taskId;
    pendingFile = null;
    $('#dzFileName').textContent = '';
    dz.classList.remove('has-file');
    $('#confirmSubmitBtn').disabled = true;
    $('#pdfInput').value = '';

    $('#submitModalTitle').textContent = existing ? t('resubmitHeader') : t('submitFor', task.title);
    $('#submitModalBody').textContent = task.description || '';

    if (overdue) {
      $('#submitModalDesc').textContent = t('toastDeadlineOver');
    } else if (existing) {
      const gradedHint = existing.marks !== null && existing.marks !== undefined ? t('existingGradedHint') : '';
      $('#submitModalDesc').textContent = `${t('deadlineIs', fmtDate(task.deadline))} · ${t('existingSubHint')}${gradedHint}`;
    } else {
      $('#submitModalDesc').textContent = t('deadlineIs', fmtDate(task.deadline));
    }
    dz.classList.toggle('locked', overdue);

    const pdfSection = $('#taskPdfSection');
    if (task.fileKey) {
      pdfSection.hidden = false;
      $('#modalDownloadTaskPdfLabel').textContent = `${t('downloadTaskPdf')} (${task.fileName || 'task.pdf'})`;
      $('#modalDownloadTaskPdfBtn').onclick = () => downloadFile(task.fileKey, task.fileName || `${task.title}.pdf`);
    } else {
      pdfSection.hidden = true;
    }
    openModal('#submitModal');
  }

  dz.addEventListener('click', () => $('#pdfInput').click());
  dz.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#pdfInput').click(); } });
  $('#pdfInput').addEventListener('click', (e) => e.stopPropagation());
  $('#pdfInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!checkPdf(file)) return;
    pendingFile = file;
    $('#dzFileName').textContent = file.name;
    dz.classList.add('has-file');
    $('#confirmSubmitBtn').disabled = false;
  });

  $('#confirmSubmitBtn').addEventListener('click', async () => {
    if (!pendingFile || !activeTaskId) return;
    const { tasks = [] } = await API.getTasks();
    const task = tasks.find(x => x.id === activeTaskId);
    if (!task) { closeModal('#submitModal'); renderStudentBoard(); return; }
    if (new Date(task.deadline) < new Date()) {
      toast(t('toastDeadlineOver'));
      closeModal('#submitModal');
      renderCurrentView();
      return;
    }

    const btn = $('#confirmSubmitBtn');
    btn.disabled = true;
    const res = await API.saveSubmission({
      id: uid(), taskId: activeTaskId,
      studentId: currentUser.id, studentName: currentUser.name,
      studentClass: currentUser.classInfo || '', submittedAt: new Date().toISOString()
    }, pendingFile);

    if (res && res.success) {
      toast(t('toastSubmitted'));
      closeModal('#submitModal');
      renderCurrentView();
    } else {
      btn.disabled = false;
      toast(t('toastSaveFail'));
    }
  });

  async function renderMySubmissions() {
    const list = $('#mySubmissionsList');
    const [{ submissions = [] }, { tasks = [] }] = await Promise.all([API.getSubmissions(), API.getTasks()]);
    const subs = submissions.filter(s => s.studentId === currentUser.id)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    if (!subs.length) {
      list.innerHTML = emptyHtml(t('noMySubmissions'), false);
      return;
    }

    list.innerHTML = subs.map(s => {
      const task = tasks.find(x => x.id === s.taskId);
      const overdue = task ? new Date(task.deadline) < new Date() : true;
      const graded = s.marks !== null && s.marks !== undefined;
      const scoreBadge = graded
        ? `<span class="chip graded">${ICON('star', 'ic')}${s.marks} / ${(task && task.maxMarks) || 100}</span>`
        : `<span class="chip pending">${escapeHtml(t('statusNotGraded'))}</span>`;
      const feedback = s.feedback
        ? `<div class="sub-feedback-box"><strong>${escapeHtml(t('teacherFeedback'))}</strong> ${escapeHtml(s.feedback)}</div>` : '';
      const replace = (!overdue && task)
        ? `<button class="btn secondary resub-btn" data-task="${escapeHtml(s.taskId)}">${ICON('upload')}<span>${escapeHtml(t('resubmitBtn'))}</span></button>`
        : `<span class="chip overdue">${escapeHtml(t('locked'))}</span>`;

      return `
      <div class="sub-row">
        <div class="sub-row-main">
          <div class="sub-row-top">
            <div class="sub-row-title">${escapeHtml(task ? task.title : t('deletedTask'))}</div>
            ${scoreBadge}
          </div>
          <div class="sub-row-sub">${escapeHtml(fmtDate(s.submittedAt))} · ${escapeHtml(s.fileName)}</div>
          ${feedback}
        </div>
        <div class="sub-row-actions">
          <button class="btn text dl-btn" data-key="${escapeHtml(s.fileKey)}" data-name="${escapeHtml(s.fileName)}">${ICON('download')}<span>${escapeHtml(t('download'))}</span></button>
          ${replace}
        </div>
      </div>`;
    }).join('');

    $$('.dl-btn', list).forEach(b => b.addEventListener('click', () => downloadFile(b.dataset.key, b.dataset.name)));
    $$('.resub-btn', list).forEach(b => b.addEventListener('click', () => openSubmitModal(b.dataset.task)));
  }

  /* ================== modals ================== */
  function openModal(sel) { $(sel).hidden = false; }
  function closeModal(sel) { $(sel).hidden = true; }

  $$('[data-close]').forEach(btn => btn.addEventListener('click', () => {
    closeModal('#' + btn.closest('.modal-overlay').id);
  }));
  $$('.modal-overlay').forEach(ov => ov.addEventListener('mousedown', (e) => {
    if (e.target === ov) closeModal('#' + ov.id);
  }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.modal-overlay').forEach(ov => { ov.hidden = true; });
      document.body.classList.remove('drawer-open');
    }
  });

  let confirmCb = null;
  function askConfirm(title, text, cb) {
    $('#confirmTitle').textContent = title;
    $('#confirmText').textContent = text;
    confirmCb = cb;
    openModal('#confirmModal');
  }
  $('#confirmNo').addEventListener('click', () => { confirmCb = null; closeModal('#confirmModal'); });
  $('#confirmYes').addEventListener('click', async () => {
    const cb = confirmCb; confirmCb = null;
    closeModal('#confirmModal');
    if (cb) await cb();
  });

  /* ================== boot ================== */
  async function restoreSession() {
    const id = API.getSession();
    if (!id) return;
    const { users = [] } = await API.getUsers();
    const user = users.find(u => u.id === id);
    if (user) { currentUser = user; pendingRole = user.role; enterApp(); }
    else API.clearSession();
  }

  applyLanguage();
  restoreSession();
})();
