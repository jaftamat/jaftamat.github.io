(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {}

      /* Style for the container */
      div {
        margin: 50px auto;
        max-width: 600px;
      }

      /* Style for the input container */
      .input-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      /* Style for the input field */
      #prompt-input {
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 70%;
      }

      /* Style for the button */
      #generate-button {
        padding: 10px;
        font-size: 16px;
        background-color: #3cb6a9;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 25%;
      }

      /* Style for the generated text area */
      #generated-text {
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 96%;
      }
    </style>
    <div id="container">
      <center>
      <div id="container"></div>
        <div class="input-container">
          <button id="generate-button">Fetch data</button>
        </div>
        <textarea id="generated-text" rows="10" cols="50" readonly></textarea>
      </div>
    </div>
  `;

  class Widget extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
    }

    async connectedCallback() {
      this.initMain();
    }

    async initMain() {
      const generatedText = this.shadowRoot.getElementById("generated-text");
      generatedText.value = "";

      const generateButton = this.shadowRoot.getElementById("generate-button");
      generateButton.addEventListener("click", async () => {
        generatedText.value = "Finding result...";

        fetch("https://stats.c-07113c9.kyma.ondemand.com/data")
          .then(function (response) {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then(function (jsonData) {
            console.log("Retrieved data:", jsonData);

            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");
            var headerRow = document.createElement("tr");

            // Create table headers
            for (var key in jsonData[0]) {
              var th = document.createElement("th");
              th.textContent = key;
              headerRow.appendChild(th);
            }

            thead.appendChild(headerRow);
            table.appendChild(thead);
            table.appendChild(tbody);

            // Populate the table with data
            for (var i = 0; i < jsonData.length; i++) {
              var row = document.createElement("tr");

              for (var key in jsonData[i]) {
                var cell = document.createElement("td");
                cell.textContent = jsonData[i][key];
                row.appendChild(cell);
              }

              tbody.appendChild(row);
            }

            // Append the table to the container
            var container = document.getElementById("container");
            if (container) {
              container.appendChild(table);
            } else {
              console.error("Container element not found.");
            }

            generatedText.value = JSON.stringify(table);
          })
          .catch(function (error) {
            console.error("Error:", error);
          });
      });
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = {
        ...this._props,
        ...changedProperties,
      };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      this.initMain();
    }
  }

  customElements.define("com-bcx-sap-statscpiwidget", Widget);
})();