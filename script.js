// --- 1. 资源加载动画逻辑 (立即执行，不等页面加载完) ---
(function initLoader() {
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.getElementById("progress-bar");
  const percentText = document.getElementById("percent-text");

  // 如果找不到元素（极少情况），直接跳过
  if (!loadingScreen || !progressBar) return;

  let width = 0;

  // 启动定时器，模拟加载
  const interval = setInterval(() => {
    // 如果页面还没加载完，进度条最多跑到 90%
    if (width < 90) {
      // 随机增加一点进度
      width += Math.random() * 5;
      if (width > 90) width = 90;

      progressBar.style.width = width + "%";
      if (percentText) percentText.innerText = Math.floor(width) + "%";
    }
  }, 50); // 每50ms更新一次

  // 监听真正的页面加载完成事件 (图片、样式都好了)
  window.addEventListener("load", () => {
    clearInterval(interval);

    // 直接拉满到 100%
    progressBar.style.width = "100%";
    if (percentText) percentText.innerText = "100%";

    // 稍微停顿一下，让用户看到 100%，然后消失
    setTimeout(() => {
      loadingScreen.classList.add("fade-out"); // 使用 CSS 类来渐隐

      // 恢复页面滚动
      document.body.style.overflow = "auto";

      // 动画结束后彻底移除，释放内存
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 600); // 对应 CSS transition 时间
    }, 200);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  // --- 2. 配置与密码逻辑 (保持在 DOMContentLoaded 内) ---
  const CONFIG = {
    // 密码: 123456
    PASSWORD_B64: "NjIxNw==",
    AUTH_KEY: "appleid_share_auth_v1",
    EXPIRE_HOURS: 24,
  };

  const loginSection = document.getElementById("login-section");
  const mainSection = document.getElementById("main-section");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById("login-btn");
  const errorMsg = document.getElementById("error-msg");

  // 检查登录
  checkLogin();

  function checkLogin() {
    const authData = localStorage.getItem(CONFIG.AUTH_KEY);
    if (authData) {
      try {
        const { timestamp } = JSON.parse(authData);
        const now = new Date().getTime();
        if (now - timestamp < CONFIG.EXPIRE_HOURS * 60 * 60 * 1000) {
          showMain();
          return;
        }
      } catch (e) {
        localStorage.removeItem(CONFIG.AUTH_KEY);
      }
    }
    showLogin();
  }

  function handleLogin() {
    const inputPwd = passwordInput.value.trim();
    // 简单混淆比对
    if (btoa(inputPwd) === CONFIG.PASSWORD_B64) {
      const data = { timestamp: new Date().getTime() };
      localStorage.setItem(CONFIG.AUTH_KEY, JSON.stringify(data));
      errorMsg.style.display = "none";
      showMain();
    } else {
      errorMsg.style.display = "block";
      passwordInput.classList.add("shake");
      setTimeout(() => passwordInput.classList.remove("shake"), 500);
    }
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }

  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
    // 输入框获得焦点时隐藏错误
    passwordInput.addEventListener("input", () => {
      errorMsg.style.display = "none";
    });
  }

  function showMain() {
    if (!loginSection || !mainSection) return;
    loginSection.classList.remove("active-section");
    loginSection.classList.add("hidden-section");
    mainSection.classList.remove("hidden-section");
    mainSection.classList.add("active-section");
    window.scrollTo(0, 0);
  }

  function showLogin() {
    if (!loginSection || !mainSection) return;
    mainSection.classList.remove("active-section");
    mainSection.classList.add("hidden-section");
    loginSection.classList.remove("hidden-section");
    loginSection.classList.add("active-section");
  }

  window.logout = function () {
    if (confirm("确定要退出登录吗？")) {
      localStorage.removeItem(CONFIG.AUTH_KEY);
      if (passwordInput) passwordInput.value = "";
      showLogin();
    }
  };

  // --- 3. 复制功能 ---
  window.copyText = function (text) {
    // 优先使用新版 API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast("复制成功！");
        })
        .catch(() => {
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      showToast("复制成功！");
    } catch (err) {
      showToast("复制失败，请手动复制");
    }
    document.body.removeChild(textArea);
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.add("show");

    // 清除之前的定时器防止闪烁
    if (window.toastTimer) clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // --- 4. 弹窗控制 (通用) ---
  window.toggleModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const style = window.getComputedStyle(modal);
    if (style.display === "flex") {
      modal.style.display = "none";
    } else {
      modal.style.display = "flex";
    }
  };

  // 专门打开教程
  window.openTutorial = function () {
    const modal = document.getElementById("tutorial-modal");
    if (modal) modal.style.display = "flex";
  };

  // 点击空白关闭弹窗
  window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });
});
