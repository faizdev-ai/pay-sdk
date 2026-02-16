import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("close-button")
export class CloseButton extends LitElement {
  static styles = css`
    /* :host {
      display: inline-block;
    } */

    button {
      position: absolute;
      width: 3em;
      height: 3em;
      border: none;
      background: rgba(180, 83, 107, 0.11);
      border-radius: 5px;
      transition: background 0.5s;
      cursor: pointer;
      right: 10px;
      top: 10px;
    }

    .X,
    .Y {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2em;
      height: 1.5px;
      background-color: rgb(255, 255, 255);
    }

    .X {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    .Y {
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    .close {
      position: absolute;
      display: flex;
      padding: 0.8rem 1.5rem;
      align-items: center;
      justify-content: center;
      transform: translateX(-50%);
      top: -70%;
      left: 50%;
      width: 3em;
      height: 1.7em;
      font-size: 12px;
      background-color: rgb(19, 22, 24);
      color: rgb(187, 229, 236);
      border-radius: 3px;
      pointer-events: none;
      opacity: 0;
    }

    button:hover {
      background-color: rgb(211, 21, 21);
    }

    button:active {
      background-color: rgb(130, 0, 0);
    }

    button:hover > .close {
      animation: closeAnim 0.2s forwards 0.25s;
    }

    @keyframes closeAnim {
      100% {
        opacity: 1;
      }
    }
  `;

  render() {
    return html`
      <button>
        <span class="X"></span>
        <span class="Y"></span>
        <!-- <div class="close">Close</div> -->
      </button>
    `;
  }
}
