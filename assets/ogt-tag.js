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
	}
  
	// Esta es la función que contiene la plantilla con el visor y en un futuro el editor
	get template() {
	  return `
      <p>
        <input type="file" id="openfile" accept=".ogt" />
      </p>
      <p id="nombre-ogt"></p>
      <canvas id="drawer" width="256" height="256"></canvas>
	  `
	}
  
  // Esta función se llama cada vez que se cambia una propiedad de la etiqueta del componente
	attributeChangedCallback(attr, oldVal, newVal) {
	  if(attr == 'src' && oldVal != newVal) {
      this.status = newVal;
      this.shadowRoot.innerHTML = this.template;
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
	}

  // Esta función se dispara al desconectar el Web Element
  // Elimina el listener del input para evitar posibles problemas
  disconnectedCallback() {
    this.inputFile.removeEventListener("change", this.inputFile.bind(this));
  }
}

// Y finalmente definimos el nuevo elemento
customElements.define('ver-ogt', OGTTag);
