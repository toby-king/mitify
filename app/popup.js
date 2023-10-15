// Menu Functions
window.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("showTextAnalysis").addEventListener("click", showTextAnalysis);
  document.getElementById("showBias").addEventListener("click", showBias);
});
function showTextAnalysis() {
  var x = document.getElementById("textAnalysisPage");
  var y = document.getElementById("biasPage");
  var i = document.getElementById("textAnalysis")
  var j = document.getElementById("bias")

  x.style.display = "block";
  y.style.display = "none";
  i.classList.add("active");
  j.classList.remove("active");
}
function showBias() {
  var x = document.getElementById("biasPage");
  var y = document.getElementById("textAnalysisPage");
  var i = document.getElementById("textAnalysis")
  var j = document.getElementById("bias")

  x.style.display = "block";
  y.style.display = "none";
  j.classList.add("active");
  i.classList.remove("active");
}

// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/
function displayFKScore(score) {
  var bar = new ProgressBar.SemiCircle('#fk-container', {
    strokeWidth: 6,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
      value: '',
      alignToBottom: false
    },
    from: {color: '#ED6A5A'},
    to: {color: '#5aed6a'},
    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = (bar.value() * 100).toFixed(2);
      if (value === 0) {
        bar.setText('');
      } else {
        bar.setText(value);
      }
  
      bar.text.style.color = '#000';
    }
  });
  bar.text.style.fontFamily = '"Oswald", Helvetica, sans-serif';
  bar.text.style.fontSize = '2rem';
  
  bar.animate(score);  // Number from 0.0 to 1.0
}
function displayBias(score) {
  var bar = new ProgressBar.SemiCircle('#bias-container', {
    strokeWidth: 6,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
      value: '',
      alignToBottom: false
    },
    from: {color: '#5aed6a'},
    to: {color: '#e22f19'},
    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = (bar.value() * 100).toFixed(2);
      if (value === 0) {
        bar.setText('');
      } else {
        bar.setText(value);
      }
  
      bar.text.style.color = '#000';
    }
  });
  bar.text.style.fontFamily = '"Oswald", Helvetica, sans-serif';
  bar.text.style.fontSize = '2rem';
  
  bar.animate(score);  // Number from 0.0 to 1.0

  if (score > 0.5) {
    if (score > 0.75) {
      document.getElementById("bias-conclusion").innerHTML = "This article is very likely to contain bias";
    }
    else {
      document.getElementById("bias-conclusion").innerHTML= "This article is likely to contain bias.";
    }
  }
  else {
    document.getElementById("bias-conclusion").innerHTML = "This article is unlikely to contain bias.";
  }
}

function displayPoliticalBias(res_poli) {
  const left = res_poli[0];
  const right = res_poli[1];
  const center = res_poli[2];

  var chart = new CanvasJS.Chart("poli-container",
    {
      toolTip: {
        enabled: false
      },
      legend: {
        fontFamily: "Oswald",
        fontWeight: "normal"
      },
      data: [
      {
        type: "doughnut",
        innerRadius: 52,
        showInLegend: true,
        indexLabelFontFamily: "Oswald",
        dataPoints: [
          {  y: left, name: "Left", color: "#c94426", label: (left * 100).toFixed(1) + "%" },
          {  y: right, name: "Right", color: "#4084ea", label: (right * 100).toFixed(1) + "%" },
          {  y: center, name: "Center", color: "#c6c8c9", label: (center * 100).toFixed(1) + "%" },
        ]
      }
     ]
   });

    chart.render();

    if (left > right && left > center) {
      document.getElementById("poli-conclusion").innerHTML = "This article leans to the left.";
    }
    else if (right > left && right > center) {
      document.getElementById("poli-conclusion").innerHTML = "This article leans to the right.";
    }
    else if (center > right && center > left) {
      document.getElementById("poli-conclusion").innerHTML = "This article leans to the center.";
    }
}

// Get active browser tab
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let url = tabs[0].url;
  // Inject content script into the active tab
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      function: getContent,
      args: [url]
    },
    async function (results) {
      function readingTime(text) {
        const wpm = 225;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        
        return time;
      }

      function calculateFleschKincaidReadability(text) {
        // Calculate the average number of syllables per word
        const words = text.match(/\b\w+\b/g);
        const totalSyllables = words.reduce((total, word) => total + countSyllables(word), 0);
      
        // Calculate the average number of words per sentence
        const sentences = text.match(/[.!?]+/g);
        const totalWords = words.length;
      
        // Calculate the Flesch-Kincaid readability score
        const readabilityScore =
          206.835 - 1.015 * (totalWords / sentences.length) - 84.6 * (totalSyllables / totalWords);
      
        return readabilityScore.toFixed(2) / 100; // Return the score rounded to 2 decimal places
      }
      
      // Helper function to count the number of syllables in a word
      function countSyllables(word) {
        // Very basic syllable counting algorithm
        // Adjust or replace with a more accurate implementation if needed
        const syllables = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
          .match(/[aeiouy]{1,2}/g);
        return syllables ? syllables.length : 0;
      }

      //document.getElementById("url").innerHTML = url;
      if (results[0].result == null) {
        document.getElementById("main").style.display = "none";
        document.getElementById("noContent").style.display = "block";
      }
      else {
        document.getElementById("count").innerHTML = results[0].result.trim().split(/\s+/).length;
        document.getElementById("readtime").innerHTML = readingTime(results[0].result);
        displayFKScore(calculateFleschKincaidReadability(results[0].result));
        let [res_bias, res_poli] = await getBias(results[0].result);
        displayBias(res_bias);
        displayPoliticalBias(res_poli);
      }
    }
  );
});

//Get content
function getContent(url) {
  let paragraphs;
  if (url.includes("foxnews.com")) {
    paragraphs = document.getElementsByClassName("article-body");
  }
  else if (url.includes("breitbart.com")) {
    paragraphs = document.getElementsByClassName("entry-content");
  }
  else if (url.includes("bbc.co.uk")) {
    paragraphs = document.getElementsByClassName("ssrcss-1q0x1qg-Paragraph");
  }
  else if (url.includes("theguardian.com")) {
    paragraphs = document.getElementsByClassName("article-body-commercial-selector");
  }
  else if (url.includes("edition.cnn.com")) {
    paragraphs = document.getElementsByClassName("article__content");
  }
  const text = Array.from(paragraphs).map((p) => p.innerText).join("\n");
  return text;
}

async function getBias(text) {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "text_list": [text]
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  try {
    const response = await fetch("http://192.168.1.103:8000/article_whole/", requestOptions)
    const data = await response.json();
    const result_bias = data.bias.__ndarray__[0]; //Get the first Bias number
    const result_poli = data.type.__ndarray__;
    
    return [result_bias, result_poli];
  } 
  catch (error) {
    console.error(error);
  }
}

/* 
Fox News - .article-body
Breitbart - .entry-content
BBC - #main-content
Guardian - #maincontent
CNN - .article__content
*/