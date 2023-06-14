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
  var bar = new ProgressBar.SemiCircle(container, {
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

// Get active browser tab
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let url = tabs[0].url;
  // Inject content script into the active tab
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      function: () => {
        const paragraphs = document.querySelectorAll('[class*="main"], [id*="main"]');
        const text = Array.from(paragraphs).map((p) => p.innerText).join("\n");
        return text;
      },
    },
    function (results) {
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
      if (results[0].result.trim().split(/\s+/).length <= 1) {
        document.getElementById("main").style.display = "none";
        document.getElementById("noContent").style.display = "block";
      }
      else {
        document.getElementById("count").innerHTML = results[0].result.trim().split(/\s+/).length;
        document.getElementById("readtime").innerHTML = readingTime(results[0].result);
        displayFKScore(calculateFleschKincaidReadability(results[0].result));
        // Display the text in popup
        //document.getElementById("content").innerHTML = results[0].result;
      }
    }
  );
});