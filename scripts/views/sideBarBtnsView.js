import DEFAULT_PAGE from "../config.js";

class SideBarBtnView {
  _parentEl = document.querySelector(".movie-sidebar-nav");
  _navBtns = document.querySelectorAll(".nav-btn");
  buttonPage;

  addHandlerEvent(handle) {
    this._parentEl.addEventListener("click", function (event) {
      handle(event);
    });
  }

  _renderActive(event) {
    const btn = event.target.closest(".nav-btn");

    if (!btn) return;

    this.buttonPage = btn.dataset.page;
    console.log(this.buttonPage);

    // Creates the ripple effect for the buttons

    const x = event.clientX - btn.offsetLeft;
    const y = event.clientY - btn.offsetTop;

    this._renderRipple(btn, x, y);

    // Unexpand the sidebar navigation

    this._parentEl.classList.add("unexpand");

    // Scrolls window back to the top

    this._scrollToTop();

    // Removes unexpand class after 500ms

    setTimeout(() => this._parentEl.classList.remove("unexpand"), 500);
  }

  _scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  _renderRipple(parent, x, y) {
    const ripple = document.createElement("span");
    ripple.classList.add("btn-ripple");
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    parent.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
  }
}

export default new SideBarBtnView();
