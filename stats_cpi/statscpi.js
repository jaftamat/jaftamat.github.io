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
    width:96%;
    }
        </style>
       <div>
    <center>
      <div id="container"></div>
      <div class="input-container">
        <button id="generate-button">Fetch data</button>
      </div>
      <textarea id="generated-text" rows="10" cols="50" readonly></ textarea>
          
      </div>
    
      `;
    class Widget extends HTMLElement {
      constructor() {
        super();
        let shadowRoot = this.attachShadow({
          mode: "open"
        });
        shadowRoot.appendChild(template.content.cloneNode(true));
        this._props = {};
      }
      async connectedCallback() {
        this.initMain();
      }
      async initMain() {

        const container = this.shadowRoot.getElementById('container');

        const generatedText = this.shadowRoot.getElementById("generated-text");
        generatedText.value = "";

        const generateButton = this.shadowRoot.getElementById("generate-button");
        generateButton.addEventListener("click", async () => {
          // const promptInput = this.shadowRoot.getElementById("prompt-input");
          // const generatedText = this.shadowRoot.getElementById("generated-text");
          generatedText.value = "Finding result...";
          // const prompt = promptInput;
        fetch('https://stats.c-07113c9.kyma.ondemand.com/data')
              .then(function(response) {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response.json();
              })
              .then(function(data) {
                // Process the retrieved data
                  console.log("I am here.......")
                  console.log(data);

                  // Retrieving data fron the generated text
                  const jsonData = generatedText.value;
                  // Create table structure
                  console.log('Creating table structure')
                  var table = document.createElement('table');
                  var thead = document.createElement('thead');
                  var tbody = document.createElement('tbody');
                  var headerRow = document.createElement('tr');

                  var container = document.createElement('container');
              
                  // Create table headers
                  console.log('Creating table headers')
                  for (var key in jsonData[0]) {
                    var th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                  }
              
                  thead.appendChild(headerRow);
                  table.appendChild(thead);
                  table.appendChild(tbody);
              
                  // Populate the table with data
                  console.log('Populating table with data')
                  for (var i = 0; i < jsonData.length; i++) {
                    var row = document.createElement('tr');
              
                    for (var key in jsonData[i]) {
                      var cell = document.createElement('td');
                      cell.textContent = jsonData[i][key];
                      row.appendChild(cell);
                    }
              
                    tbody.appendChild(row);
                  }
              
                  // Append the table to a container
                  var container = document.getElementById('container');
                  if (container) {
                    // Append the table element to the container
                    container.appendChild(table);
                  } else {
                    console.error('Container element not found.');
                  }

                  console.log('last step')



                  console.log("Stringfy the data to the output")
                  generatedText.value = JSON.stringify(table);

              })
              .catch(function(error) {
                // Handle any error that occurred during the request
                  console.error('Error: fixer ndoda', error);
              })
        
        });
      }
      onCustomWidgetBeforeUpdate(changedProperties) {
        this._props = {
          ...this._props,
          ...changedProperties
        };
      }
      onCustomWidgetAfterUpdate(changedProperties) {
        this.initMain();
      }
    }
    customElements.define("com-bcx-sap-statscpiwidget", Widget);
  })();
