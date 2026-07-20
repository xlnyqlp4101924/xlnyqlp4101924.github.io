(function initLoader() {
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.getElementById("progress-bar");
  const percentText = document.getElementById("percent-text");

  if (!loadingScreen || !progressBar) return;

  let width = 12;
  progressBar.style.width = `${width}%`;
  if (percentText) percentText.innerText = `${width}%`;

  const interval = setInterval(() => {
    if (width < 100) {
      let increment = Math.random() * 3;
      if (width > 60) increment = Math.random() * 1;
      if (width > 82) increment = Math.random() * 0.35;

      width += increment;
      if (width >= 95 && !window.pageLoaded) width = 95;

      const displayWidth = Math.min(width, 99);
      progressBar.style.width = `${displayWidth}%`;
      if (percentText) percentText.innerText = `${Math.floor(displayWidth)}%`;
      return;
    }

    clearInterval(interval);
    progressBar.style.width = "100%";
    if (percentText) percentText.innerText = "100%";

    setTimeout(() => {
      loadingScreen.classList.add("fade-out");
      document.body.style.overflow = "auto";

      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }, 180);
  }, 28);

  window.addEventListener("load", () => {
    window.pageLoaded = true;
    width = 100;
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const CONFIG = {
    PASSWORD_B64: "ODYxMQ==",
    AUTH_KEY: "appleid_share_auth_v1",
    EXPIRE_HOURS: 24,
  };

  const loginSection = document.getElementById("login-section");
  const mainSection = document.getElementById("main-section");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById("login-btn");
  const errorMsg = document.getElementById("error-msg");
  let lastFocusedElement = null;

  checkLogin();

  function checkLogin() {
    const authData = localStorage.getItem(CONFIG.AUTH_KEY);
    if (authData) {
      try {
        const { timestamp } = JSON.parse(authData);
        if (Date.now() - timestamp < CONFIG.EXPIRE_HOURS * 60 * 60 * 1000) {
          showMain();
          return;
        }
      } catch (error) {
        localStorage.removeItem(CONFIG.AUTH_KEY);
      }
    }
    showLogin();
  }

  function handleLogin() {
    if (!passwordInput || !errorMsg) return;

    const inputPwd = passwordInput.value.trim();
    if (btoa(inputPwd) === CONFIG.PASSWORD_B64) {
      localStorage.setItem(CONFIG.AUTH_KEY, JSON.stringify({ timestamp: Date.now() }));
      errorMsg.style.display = "none";
      showMain();
      return;
    }

    errorMsg.style.display = "block";
    passwordInput.classList.add("shake");
    setTimeout(() => passwordInput.classList.remove("shake"), 500);
  }

  if (loginBtn) loginBtn.addEventListener("click", handleLogin);
  if (passwordInput) {
    passwordInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") handleLogin();
    });
    passwordInput.addEventListener("input", () => {
      if (errorMsg) errorMsg.style.display = "none";
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

  window.logout = function logout() {
    localStorage.removeItem(CONFIG.AUTH_KEY);
    if (passwordInput) passwordInput.value = "";
    showLogin();
  };

  window.copyText = function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => showToast("复制成功"),
        () => fallbackCopy(text)
      );
      return;
    }

    fallbackCopy(text);
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
      showToast("复制成功");
    } catch (error) {
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

    if (window.toastTimer) clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  window.toggleModal = function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const shouldClose = window.getComputedStyle(modal).display === "flex";
    if (shouldClose) {
      closeModal(modal);
      return;
    }

    openModal(modal);
  };

  window.openTutorial = function openTutorial() {
    const modal = document.getElementById("tutorial-modal");
    if (modal) openModal(modal);
  };

  function openModal(modal) {
    lastFocusedElement = document.activeElement;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    const closeButton = modal.querySelector(".close-modal");
    if (closeButton) closeButton.focus();
  }

  function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function closeModalOnOutside(event) {
    if (event.target.classList.contains("modal")) {
      closeModal(event.target);
      event.preventDefault();
    }
  }

  window.addEventListener("click", closeModalOnOutside);
  window.addEventListener("touchend", closeModalOnOutside);
  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openModalElement = [...document.querySelectorAll(".modal")].find(
      (modal) => window.getComputedStyle(modal).display === "flex"
    );
    if (openModalElement) closeModal(openModalElement);
  });
});
