import {LitElement, html, css} from 'lit';

export class YoutubeSearch extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        max-width: 800px;
        margin:20px auto;
        text-align:center;
      }
      .youTubeSearch {
        text-align:left;
      }
    `;
  }

  static get properties() {
    return {
        searchString: {type: String},
        resultCount: {type: Number},
        searchResults: {type: Object},
        searchData: {type: Object},
        youtubeApiKey: {type: String},
        youtubeVideoResults: {type: Array},
        order: {type: String},
    };
  }

  constructor() {
    super();
    this.searchString = '';
    this.resultCount = 0;
    this.searchResults = {};
    this.searchData;
    this.youtubeApiKey = 'AIzaSyCEQqCYoQjj9RIAnJKUQGHFCGC8M27L200';
    this.youtubeVideoResults = [];
    this.order = 'relevance';
  }

  render() {
     
    if(!this.searchData){
        return html`
        <div class="youTubeSearch">
            <h1>Search YouTube - Waste Some Time!</h1>
            <input type="text" id="keyword" name="keyword" @keyup=${this._checkSearch} />
            <button @click=${this._doSearch} type="submit">Search</button>
        </div>
    `;
    }
    else
    {
        return html`
        <div class="youTubeSearch">
            <h1>Search YouTube - Waste Some Time!</h1>
            <input type="text" id="keyword" name="keyword" value="${this.searchString}" @keyup=${this._checkSearch} />
            <button @click=${this._doSearch} type="submit">Search</button>
            <div class="searchResults">
                <h2>Showing ${this.searchData.items.length} Results for ${this.searchString}</h2>
                <div class="sort">
                    <select name="order" @change=${this._doSort} id="order">
                        <option ?selected=${this.order =="relevance"} value="relevance">Relevance</option>
                        <option ?selected=${this.order =="date"} value="date">Date</option>
                        <option ?selected=${this.order =="rating"} value="rating">Rating</option>
                    </select>
                </div>
                <div class="results">
                    ${this.youtubeVideoResults.map((item) => html`<youtube-videoresult title="${item.title}" 
                                                                                videoId="${item.videoId}" 
                                                                                description="${item.description}"
                                                                                thumbnailUrl="${item.thumbnail.url}"
                                                                                thumbnailHeight="${item.thumbnail.height}"
                                                                                thumbnailWidth="${item.thumbnail.width}"
                                                                                commentCount="${item.commentCount}"></youtube-videoresult>`)}
                </div>
            </div>
        </div>
    `;
    }
  }

  get keywordInput() {
    return this.renderRoot?.querySelector('#keyword') ?? null;
  }

  get sortInput() {
    return this.renderRoot?.querySelector('#order') ?? null;
  }

  _checkSearch(e) {
    if(e.key === 'NumpadEnter' || e.key === 'Enter'){
        this._doSearch();
    }
  }

  _doSort() {
    if(this.sortInput == null || this.sortInput.value == '')
    {
        this.order = 'relevance';
    }
    else
    {
        this.order = this.sortInput.value
    }

    this._doSearch();
  }

  _doSearch() {
    if(this.keywordInput.value == ''){
        this.searchData = null;
        return;
    }

    this.searchString = this.keywordInput.value;

    let queryString = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.searchString}&maxResults=25&type=video&order=${this.order}&key=${this.youtubeApiKey}`;
    
    fetch(queryString)
        .then(response => response.json())
        .then(response => {
            this.searchData = response;
            this._getCommentCounts();
            this.requestUpdate();
        });
  }

  _getCommentCounts() {
    let ids = this.searchData.items.map((item) => item.id.videoId);
    let queryString = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids.toString()}&fields=items%2Fid%2Citems%2Fstatistics%2FcommentCount&key=${this.youtubeApiKey}`;
    
    fetch(queryString)
        .then(response => response.json())
        .then(response => {
            let commentCounts = response;
            
            this.youtubeVideoResults = [];

            this.searchData.items.forEach(item => {
                let commentCount = commentCounts.items.find(commentCount => { return commentCount.id == item.id.videoId}).statistics.commentCount;
                commentCount = (Number.isInteger(+commentCount)) ? +commentCount : 0;

                let video = new Object();
                video.title = item.snippet.title;
                video.description = item.snippet.description;
                video.videoId = item.id.videoId;
                video.thumbnail = new Object();
                video.thumbnail.url = item.snippet.thumbnails.medium.url;
                video.thumbnail.height = item.snippet.thumbnails.medium.height;
                video.thumbnail.width = item.snippet.thumbnails.medium.width;
                video.commentCount = commentCount;
                this.youtubeVideoResults.push(video);
            });
        });
  }
}

window.customElements.define('youtube-search', YoutubeSearch);