document.addEventListener("DOMContentLoaded", () => {
  // --- 1. 资源加载动画逻辑 ---
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.getElementById("progress-bar");

  // 模拟加载进度
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.visibility = "hidden";
      }, 300);
    } else {
      width += Math.random() * 10;
      if (width > 100) width = 100;
      progressBar.style.width = width + "%";
    }
  }, 100);

  // --- 2. 配置与密码逻辑 ---
  const CONFIG = {
    // 密码: 123456
    PASSWORD_B64: "MDg3MQ==",
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
      const { timestamp } = JSON.parse(authData);
      const now = new Date().getTime();
      if (now - timestamp < CONFIG.EXPIRE_HOURS * 60 * 60 * 1000) {
        showMain();
        return;
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

  loginBtn.addEventListener("click", handleLogin);
  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleLogin();
  });

  // 输入框获得焦点时隐藏错误
  passwordInput.addEventListener("input", () => {
    errorMsg.style.display = "none";
  });

  function showMain() {
    loginSection.classList.remove("active-section");
    loginSection.classList.add("hidden-section");
    mainSection.classList.remove("hidden-section");
    mainSection.classList.add("active-section");
    window.scrollTo(0, 0);
  }

  function showLogin() {
    mainSection.classList.remove("active-section");
    mainSection.classList.add("hidden-section");
    loginSection.classList.remove("hidden-section");
    loginSection.classList.add("active-section");
  }

  window.logout = function () {
    if (confirm("确定要退出登录吗？")) {
      localStorage.removeItem(CONFIG.AUTH_KEY);
      passwordInput.value = "";
      showLogin();
    }
  };

  // --- 3. 复制功能 ---
  window.copyText = function (text) {
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
  };

  function showToast(msg) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    toastMsg.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // --- 4. 弹窗控制 (通用) ---
  window.toggleModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === "flex") {
      modal.style.display = "none";
    } else {
      modal.style.display = "flex";
    }
  };

  // 专门打开教程
  window.openTutorial = function () {
    const modal = document.getElementById("tutorial-modal");
    modal.style.display = "flex";
  };

  window.onclick = function (event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  };
});
