// Market Page
// Current Selections
let selectedMarket = "NIFTY 50";
let selectedTime = "1D";
// Market Data
const marketData =  {
  // NIFTY 50
  "NIFTY 50":  {
    "1D":  {
      percentage: "+0.82%",
      performers: [
      ["Tata Motors", "TATAMOTORS", "+4.21%"],
      ["Infosys", "INFY", "+3.17%"],
      ["HDFC Bank", "HDFCBANK", "+2.84%"]
      ],
      losers: [
      ["Adani Ports", "ADANIPORTS", "-2.84%"],
      ["Asian Paints", "ASIANPAINT", "-2.12%"],
      ["ITC", "ITC", "-1.74%"]
      ]
    }
    ,
    "1W":  {
      percentage: "+1.42%",
      performers: [
      ["Reliance Industries", "RELIANCE", "+5.21%"],
      ["Tata Motors", "TATAMOTORS", "+4.68%"],
      ["Infosys", "INFY", "+3.91%"]
      ],
      losers: [
      ["ITC", "ITC", "-3.12%"],
      ["Asian Paints", "ASIANPAINT", "-2.76%"],
      ["Adani Ports", "ADANIPORTS", "-2.31%"]
      ]
    }
    ,
    "1M":  {
      percentage: "+2.61%",
      performers: [
      ["HDFC Bank", "HDFCBANK", "+8.21%"],
      ["Infosys", "INFY", "+7.42%"],
      ["Tata Motors", "TATAMOTORS", "+6.85%"]
      ],
      losers: [
      ["Asian Paints", "ASIANPAINT", "-4.52%"],
      ["ITC", "ITC", "-3.84%"],
      ["Adani Ports", "ADANIPORTS", "-3.21%"]
      ]
    }
    ,
    "1Y":  {
      percentage: "+16.80%",
      performers: [
      ["Tata Motors", "TATAMOTORS", "+32.41%"],
      ["Infosys", "INFY", "+27.83%"],
      ["HDFC Bank", "HDFCBANK", "+24.62%"]
      ],
      losers: [
      ["Asian Paints", "ASIANPAINT", "-8.42%"],
      ["ITC", "ITC", "-5.72%"],
      ["Adani Ports", "ADANIPORTS", "-4.91%"]
      ]
    }
  }
  ,
  // SENSEX
  "SENSEX":  {
    "1D":  {
      percentage: "+0.61%",
      performers: [
      ["Tata Motors", "TATAMOTORS", "+4.21%"],
      ["Infosys", "INFY", "+3.17%"],
      ["HDFC Bank", "HDFCBANK", "+2.84%"]
      ],
      losers: [
      ["Adani Ports", "ADANIPORTS", "-2.84%"],
      ["Asian Paints", "ASIANPAINT", "-2.12%"],
      ["ITC", "ITC", "-1.74%"]
      ]
    }
    ,
    "1W":  {
      percentage: "+0.91%",
      performers: [
      ["HDFC Bank", "HDFCBANK", "+4.92%"],
      ["Reliance Industries", "RELIANCE", "+4.31%"],
      ["Infosys", "INFY", "+3.72%"]
      ],
      losers: [
      ["ITC", "ITC", "-2.91%"],
      ["Asian Paints", "ASIANPAINT", "-2.41%"],
      ["Adani Ports", "ADANIPORTS", "-1.83%"]
      ]
    }
    ,
    "1M":  {
      percentage: "+2.36%",
      performers: [
      ["Reliance Industries", "RELIANCE", "+7.14%"],
      ["Tata Motors", "TATAMOTORS", "+6.82%"],
      ["HDFC Bank", "HDFCBANK", "+5.94%"]
      ],
      losers: [
      ["Asian Paints", "ASIANPAINT", "-4.12%"],
      ["ITC", "ITC", "-3.52%"],
      ["Adani Ports", "ADANIPORTS", "-2.84%"]
      ]
    }
    ,
    "1Y":  {
      percentage: "+11.53%",
      performers: [
      ["Infosys", "INFY", "+25.12%"],
      ["HDFC Bank", "HDFCBANK", "+21.83%"],
      ["Reliance Industries", "RELIANCE", "+20.47%"]
      ],
      losers: [
      ["Asian Paints", "ASIANPAINT", "-7.21%"],
      ["ITC", "ITC", "-5.43%"],
      ["Adani Ports", "ADANIPORTS", "-3.87%"]
      ]
    }
  }
  ,
  // NIFTY 100
  "NIFTY 100":  {
    "1D":  {
      percentage: "-0.12%",
      performers: [
      ["Tata Motors", "TATAMOTORS", "+3.82%"],
      ["Infosys", "INFY", "+2.71%"],
      ["HDFC Bank", "HDFCBANK", "+2.14%"]
      ],
      losers: [
      ["Adani Ports", "ADANIPORTS", "-3.21%"],
      ["Asian Paints", "ASIANPAINT", "-2.72%"],
      ["ITC", "ITC", "-1.94%"]
      ]
    }
    ,
    "1W":  {
      percentage: "+0.86%",
      performers: [
      ["HDFC Bank", "HDFCBANK", "+5.21%"],
      ["Infosys", "INFY", "+4.18%"],
      ["Reliance Industries", "RELIANCE", "+3.74%"]
      ],
      losers: [
      ["ITC", "ITC", "-3.42%"],
      ["Asian Paints", "ASIANPAINT", "-2.81%"],
      ["Adani Ports", "ADANIPORTS", "-2.17%"]
      ]
    }
    ,
    "1M":  {
      percentage: "+1.79%",
      performers: [
      ["Reliance Industries", "RELIANCE", "+7.42%"],
      ["Tata Motors", "TATAMOTORS", "+6.38%"],
      ["Infosys", "INFY", "+5.92%"]
      ],
      losers: [
      ["Asian Paints", "ASIANPAINT", "-4.82%"],
      ["ITC", "ITC", "-3.91%"],
      ["Adani Ports", "ADANIPORTS", "-3.24%"]
      ]
    }
    ,
    "1Y":  {
      percentage: "+16.19%",
      performers: [
      ["Tata Motors", "TATAMOTORS", "+31.72%"],
      ["Infosys", "INFY", "+26.81%"],
      ["HDFC Bank", "HDFCBANK", "+23.49%"]
      ],
      losers: [
      ["Asian Paints", "ASIANPAINT", "-9.12%"],
      ["ITC", "ITC", "-6.31%"],
      ["Adani Ports", "ADANIPORTS", "-5.21%"]
      ]
    }
  }
  ,
  // NIFTY 500
  "NIFTY 500":  {
    "1D":  {
      percentage: "+0.43%",
      performers: [
      ["Tata Motors", "TATAMOTORS", "+4.52%"],
      ["Infosys", "INFY", "+3.61%"],
      ["HDFC Bank", "HDFCBANK", "+2.91%"]
      ],
      losers: [
      ["Adani Ports", "ADANIPORTS", "-2.91%"],
      ["Asian Paints", "ASIANPAINT", "-2.31%"],
      ["ITC", "ITC", "-1.62%"]
      ]
    }
    ,
    "1W":  {
      percentage: "+1.32%",
      performers: [
      ["Reliance Industries", "RELIANCE", "+5.62%"],
      ["Tata Motors", "TATAMOTORS", "+4.83%"],
      ["Infosys", "INFY", "+4.12%"]
      ],
      losers: [
      ["ITC", "ITC", "-3.51%"],
      ["Asian Paints", "ASIANPAINT", "-2.93%"],
      ["Adani Ports", "ADANIPORTS", "-2.42%"]
      ]
    }
    ,
    "1M":  {
      percentage: "+2.71%",
      performers: [
      ["HDFC Bank", "HDFCBANK", "+8.52%"],
      ["Reliance Industries", "RELIANCE", "+7.82%"],
      ["Tata Motors", "TATAMOTORS", "+6.91%"]
      ],
      losers: [
      ["Asian Paints", "ASIANPAINT", "-4.71%"],
      ["ITC", "ITC", "-3.82%"],
      ["Adani Ports", "ADANIPORTS", "-3.11%"]
      ]
    }
    ,
    "1Y":  {
      percentage: "+16.69%",
      performers: [
      ["Tata Motors", "TATAMOTORS", "+33.12%"],
      ["Infosys", "INFY", "+28.42%"],
      ["HDFC Bank", "HDFCBANK", "+24.91%"]
      ],
      losers: [
      ["Asian Paints", "ASIANPAINT", "-8.71%"],
      ["ITC", "ITC", "-6.12%"],
      ["Adani Ports", "ADANIPORTS", "-4.82%"]
      ]
    }
  }
}
;
// HTML Elements
const marketTitle =
document.getElementById("selected-market");
const marketChange =
document.getElementById("graph-change");
const marketImage =
document.getElementById("market-image");
const marketButtons =
document.querySelectorAll(
".market-selector button"
);
const timeButtons =
document.querySelectorAll(
".time-selector button"
);
const topPerformers =
document.getElementById("top-performers");
const topLosers =
document.getElementById("top-losers");
// Create Stock HTML
function createStockHTML(stock, type)  {
  const name =
  stock[0];
  const symbol =
  stock[1];
  const change =
  stock[2];
  return `
        <article class="stock">
            <section>
                <strong>
                    ${name}
                </strong>
                <small>
                    ${symbol}
                </small>
            </section>
            <span class="${type}">
                ${change}
            </span>
        </article>
    `;
}
// Update Sidebar
function updateSidebar()  {
  const data =
  marketData[selectedMarket][selectedTime];
  // Clear old stocks
  topPerformers.innerHTML = "";
  topLosers.innerHTML = "";
  // Add performers
  data.performers.forEach(stock =>  {
    topPerformers.innerHTML +=
    createStockHTML(
    stock,
    "positive"
    );
  }
  );
  // Add losers
  data.losers.forEach(stock =>  {
    topLosers.innerHTML +=
    createStockHTML(
    stock,
    "negative"
    );
  }
  );
}
// Fake Graph Change Animation
function animateGraph()  {
  // Make the graph fade out
  marketImage.classList.add(
  "graph-changing"
  );
  // Bring the same graph back
  setTimeout(() =>  {
    marketImage.classList.remove(
    "graph-changing"
    );
  }
  , 250);
}
// Update Market
function updateMarket()  {
  const data =
  marketData[selectedMarket][selectedTime];
  // Update market heading
  marketTitle.textContent =
  selectedMarket;
  // Update percentage
  marketChange.textContent =
  data.percentage;
  // Update percentage colour
  if (
  data.percentage.startsWith("-")
  )  {
    marketChange.classList.remove(
    "positive"
    );
    marketChange.classList.add(
    "negative"
    );
  } else  {
    marketChange.classList.remove(
    "negative"
    );
    marketChange.classList.add(
    "positive"
    );
  }
  // Update performers and losers
  updateSidebar();
  // Fake graph change
  animateGraph();
}
// Market Button Clicks
marketButtons.forEach(button =>  {
  button.addEventListener(
  "click",
  function ()  {
    // Get selected market
    selectedMarket =
    this.dataset.market;
    // Remove selected class
    // from every market button
    marketButtons.forEach(btn =>  {
      btn.classList.remove(
      "selected"
      );
    }
    );
    // Add selected class
    // to clicked button
    this.classList.add(
    "selected"
    );
    // Update page
    updateMarket();
  }
  );
}
);
// Time Button Clicks
timeButtons.forEach(button =>  {
  button.addEventListener(
  "click",
  function ()  {
    // Get selected timeframe
    selectedTime =
    this.dataset.time;
    // Remove selected class
    // from every time button
    timeButtons.forEach(btn =>  {
      btn.classList.remove(
      "selected"
      );
    }
    );
    // Add selected class
    // to clicked button
    this.classList.add(
    "selected"
    );
    // Update page
    updateMarket();
  }
  );
}
);
// Initial Page Load
updateMarket();