import {LitElement, html, css} from 'lit';

export class YoutubeVideoResult extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }
    `;
  }

  static get properties() {
    return {
      title: {type: String},
      videoId: {type: String},
      thumbnailUrl: {type: String},
      thumbnailHeight: {type: Number},
      thumbnailWidth: {type: Number},
      description: {type: String},
      commentCount: {type: Number},
      date: {type: String},
    };
  }

  constructor() {
    super();
    this.videoId = '';
    this.title = '';
    this.thumbnailUrl = '';
    this.thumbnailHeight = 0;
    this.thumbnailWidth = 0;
    this.description = '';
    this.commentCount = 0;
    this.date = null;
  }

  render() {
    return html`
        <div class="videoResult">
            <img src="${this.thumbnailUrl}" height="${this.thumbnailHeight}" width="${this.thumbnailWidth}" alt="${this.title}" />
            <div class="videoResultContent">
                <h2><a href="https://www.youtube.com/watch?v=${this.videoId}" target="_blank">${this.title}</a></h2>
                <p>${this.description}</p>
                <a title="Comment Count: ${this.commentCount}">${this.commentCount} Comments</a>
            </div>
        </div>
    `;
  }
}

window.customElements.define('youtube-videoresult', YoutubeVideoResult);