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
        const generatedText = this.shadowRoot.getElementById("generated-text");
        generatedText.value = "";

        const generateButton = this.shadowRoot.getElementById("generate-button");
        generateButton.addEventListener("click", async () => {
          // const promptInput = this.shadowRoot.getElementById("prompt-input");
          // const generatedText = this.shadowRoot.getElementById("generated-text");
          generatedText.value = "Finding result...";
          // const prompt = promptInput;
          /*const response = await fetch("https://stats.c-07113c9.kyma.ondemand.com/data", {
            method: "GET",
            mode: 'cors',
          });
          const {
            choices
          } = await response.json();
          console.log(choices)
          const generatedTextValue = choices;
          generatedText.value = generatedTextValue;*/
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
                  generatedText.value = data;

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
