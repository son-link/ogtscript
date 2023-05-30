class VerOGT extends HTMLElement {
  constructor() {
    super();
    this.filename = '';
    this.scale = (this.hasAttribute('scale')) ? parseInt(this.getAttribute('scale')) : 1;
    this.autoSize = (this.hasAttribute('auto-size')) ? !!parseInt(this.getAttribute('auto-size')) : false;

    // El shadow-root es, por así decirlo, el equivalente a document
    let shadowRoot = this.attachShadow({mode: 'open'});

    // Indicamos la plantilla a usar
    shadowRoot.innerHTML = this.template;

    // E inicializamos la clase OGTScript indicando el elemento del canvas
    // donde se dibujara la imagen
    this.ogt = new OGTScript(
      this.shadowRoot.querySelector('#drawer'),
      {
        scale: this.scale,
        autoSize: this.autoSize,
      }
    );
  }

  static get observedAttributes() {
    return ['src', 'scale'];
  }

  // Esta es la función que contiene la plantilla con el visor y en un futuro el editor
  get template() {
    return `<canvas id="drawer" width="256" height="256"></canvas>`
  }

  // Esta función se llama cada vez que se cambia una propiedad de la etiqueta del componente
  attributeChangedCallback(attr, oldVal, newVal) {
    if(attr == 'src' && oldVal != newVal) {
      this.status = newVal;
      this.ogt.openOgtUrl(newVal);
      this.filename = newVal;
    }

    if(attr == 'scale' && oldVal != newVal) {
      this.ogt.scale(newVal);
    }
  }

  // Esta función se dispara al conectarse el elemento
  // Aquí definimos referencias a elementos, así como los listener de ellos
  connectedCallback() {
    // Vacía de momento
  }

  // Esta función se dispara al desconectar el Web Element
  // Elimina el listener del input para evitar posibles problemas
  disconnectedCallback() {
    // Vacía de momento
  }
}

// Y finalmente definimos el nuevo elemento
customElements.define('ver-ogt', VerOGT);
