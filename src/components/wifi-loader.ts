import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("wifi-loader")
export class WifiLoader extends LitElement {
  @property({ type: String }) text = "Searching";

  static styles = css`
    :host {
      display: inline-block;
    }

    .wrapper {
      --background: #62abff;
      --front-color: #4f29f0;
      --back-color: #c3c8de;
      --text-color: #414856;

      width: 34px;
      height: 34px;
      border-radius: 30px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    svg {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    circle {
      fill: none;
      stroke-width: 6px;
      stroke-linecap: round;
      stroke-linejoin: round;
      transform: rotate(-100deg);
      transform-origin: center;
    }

    circle.back {
      stroke: var(--back-color);
    }

    circle.front {
      stroke: var(--front-color);
    }

    /* Outer */
    .circle-outer {
      height: 40px;
      width: 40px;
    }

    .circle-outer circle {
      stroke-dasharray: 62.75 188.25;
    }

    .circle-outer circle.back {
      animation: circle-outer135 1.8s ease infinite 0.3s;
    }

    .circle-outer circle.front {
      animation: circle-outer135 1.8s ease infinite 0.15s;
    }

    /* Middle */
    .circle-middle {
      height: 25px;
      width: 25px;
    }

    .circle-middle circle {
      stroke-dasharray: 42.5 127.5;
    }

    .circle-middle circle.back {
      animation: circle-middle6123 1.8s ease infinite 0.25s;
    }

    .circle-middle circle.front {
      animation: circle-middle6123 1.8s ease infinite 0.1s;
    }

    /* Inner */
    .circle-inner {
      height: 14px;
      width: 14px;
    }

    .circle-inner circle {
      stroke-dasharray: 22 66;
    }

    .circle-inner circle.back {
      animation: circle-inner162 1.8s ease infinite 0.2s;
    }

    .circle-inner circle.front {
      animation: circle-inner162 1.8s ease infinite 0.05s;
    }

    /* Text */
    .text {
      position: absolute;
      bottom: -40px;
      text-transform: lowercase;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.2px;
      color: var(--text-color);
    }

    .text::after {
      content: attr(data-text);
      color: var(--front-color);
      animation: text-animation76 3.6s ease infinite;
      position: absolute;
      left: 0;
      top: 0;
    }

    /* Animations */

    @keyframes circle-outer135 {
      0% {
        stroke-dashoffset: 25;
      }
      25% {
        stroke-dashoffset: 0;
      }
      65% {
        stroke-dashoffset: 301;
      }
      80%,
      100% {
        stroke-dashoffset: 276;
      }
    }

    @keyframes circle-middle6123 {
      0% {
        stroke-dashoffset: 17;
      }
      25% {
        stroke-dashoffset: 0;
      }
      65% {
        stroke-dashoffset: 204;
      }
      80%,
      100% {
        stroke-dashoffset: 187;
      }
    }

    @keyframes circle-inner162 {
      0% {
        stroke-dashoffset: 9;
      }
      25% {
        stroke-dashoffset: 0;
      }
      65% {
        stroke-dashoffset: 106;
      }
      80%,
      100% {
        stroke-dashoffset: 97;
      }
    }

    @keyframes text-animation76 {
      0% {
        clip-path: inset(0 100% 0 0);
      }
      50% {
        clip-path: inset(0);
      }
      100% {
        clip-path: inset(0 0 0 100%);
      }
    }
  `;

  render() {
    return html`
      <div class="wrapper">
        <!-- Outer -->
        <svg class="circle-outer" viewBox="0 0 86 86">
          <circle class="back" cx="43" cy="43" r="40"></circle>
          <circle class="front" cx="43" cy="43" r="40"></circle>
        </svg>

        <!-- Middle -->
        <svg class="circle-middle" viewBox="0 0 60 60">
          <circle class="back" cx="30" cy="30" r="27"></circle>
          <circle class="front" cx="30" cy="30" r="27"></circle>
        </svg>

        <!-- Inner -->
        <svg class="circle-inner" viewBox="0 0 34 34">
          <circle class="back" cx="17" cy="17" r="14"></circle>
          <circle class="front" cx="17" cy="17" r="14"></circle>
        </svg>

        <div class="text" data-text=${this.text}>${this.text}</div>
      </div>
    `;
  }
}
