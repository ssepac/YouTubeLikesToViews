
const axios = require('axios');
const jsdom = require('jsdom').JSDOM
const parse = require('node-html-parser').parse
const yt_urls = {
    "mbrownlee": "https://www.youtube.com/watch?v=CaaJyRvvaq8",
    "yt_update" : 'https://www.youtube.com/watch?v=kxOuG8jMIgI'
}
const yt_url = yt_urls.mbrownlee

// Make a request for a user with a given ID
axios.get(yt_url)
  .then(function (response) {
    // handle success
    const elements = parse(response.data).getElementsByTagName("body")
    const scripts = elements[0].getElementsByTagName("script")

    const script = scripts.find(script => script.rawText.includes("var ytInitialData"))

    const dom = new jsdom(`<script>${script.rawText}</script>`, {runScripts: 'dangerously'})
    const yt_var = dom.window.ytInitialData

    const videoPrimaryInfoRenderer = yt_var.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer
    const unparsedViews = videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer.viewCount.simpleText
    const unparsedLikes = videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer.defaultText.accessibility.accessibilityData.label

    try{

        if(unparsedLikes == undefined || unparsedViews == undefined)throw new Exception("Views and/or likes were undefined.")

        const views = unparsedViews.split(" ")[0].replace(/,/g, '') //split removes suffix words from numbers, regex remove commas from number string
        const likes = unparsedLikes.split(" ")[0].replace(/,/g, '')
        const ratio = parseFloat(likes)/parseFloat(views)
        console.log(`views = ${views}, likes=${likes}, ratio = ${ratio}`)
    }
    catch(err){
        console.log("There was an error getting likes/view ratio:")
        console.log(err.message)
    }

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })