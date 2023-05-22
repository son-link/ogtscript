class OGTTag extends HTMLElement {
  constructor() {
    super();
    this.filename = '';

    // El shadow-root es, por así decirlo, el equivalente a document
    let shadowRoot = this.attachShadow({mode: 'open'});

    // Indicamos la plantilla a usar
    shadowRoot.innerHTML = this.template;

    // E inicializamos la clase OGTScript indicando el elemento del canvas
    // donde se dibujara la imagen
    this.ogt = new OGTScript(this.shadowRoot.querySelector('#drawer'));

    if (this.hasAttribute('src')) this.ogt.openOgtUrl(this.getAttribute('src'))
  }

  // Esta es la función que contiene la plantilla con el visor y en un futuro el editor
  get template() {
    return `
      <style>
        #toolbar {
          display: flex;
          flex-wrap: wrap;
          aling-items: center;
        }

        button {
          background-color: transparent;
          border: 0;
        }

        label[for=openfile] > input {
          display: none;
        }

        label[for=openfile],
        #clear {
          width: 24px;
          height: 24px;
          display: inline-block;
          background-position: center;
          background-size: cover;
        }

        label[for=openfile] {
          background-image: url('assets/img/file-upload.svg');
        }

        #clear {
          background-image: url('assets/img/image-remove.svg');
        }
      </style>
      <div id="toolbar">
        <label for="openfile" title="Abrir OGT">
          <input type="file" id="openfile" accept=".ogt" />
        </label>
        <button id="clear" title="Limpiar"></button>
        <button id="export" title="Exportar a PNG"></button>
      </div>
      <p id="nombre-ogt"></p>
      <canvas id="drawer" width="256" height="256"></canvas>
    `
  }

  // Esta función se llama cada vez que se cambia una propiedad de la etiqueta del componente
  attributeChangedCallback(attr, oldVal, newVal) {
    if(attr == 'src' && oldVal != newVal) {
      this.status = newVal;
      this.shadowRoot.innerHTML = this.template;
      this.ogt.openOgtUrl(newVal);
    }
  }

  // Esta función se llama cuando se selecciona un archivo y llama al método
  // de la clase OGTScript que abre el archivo.
  openOgt(file) {
    this.filename = file.target.files[0].name;
    this.shadowRoot.querySelector('#nombre-ogt').innerHTML = `Estas viendo mi OGT: ${this.filename}`
    this.ogt.openOgt(file.target.files[0])
  }

  // Esta función se dispara al conectarse el elemento
  // Aquí definimos referencias a elementos, así como los listener de ellos
  connectedCallback() {
    // El selector de fichero
    this.inputFile = this.shadowRoot.querySelector("#openfile");
    this.inputFile.addEventListener("change", this.openOgt.bind(this));

    this.clearBtn = this.shadowRoot.querySelector("#clear");
    this.clearBtn.addEventListener("click", () => this.ogt.clear());
  }

  // Esta función se dispara al desconectar el Web Element
  // Elimina el listener del input para evitar posibles problemas
  disconnectedCallback() {
    this.inputFile.removeEventListener("change", this.inputFile.bind(this));
  }
}

// Y finalmente definimos el nuevo elemento
customElements.define('ver-ogt', OGTTag);
