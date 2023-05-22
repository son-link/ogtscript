/**
 * @name OGTScript
 * @description Librería para visualizar y editar imágenes en formato OGT (Open Graphic Text)
 * @author Alfonso Saavedra "Son Link"
 * @license GPL-3.0-or-later
 * @url https://github.com/son-link/ogtcript
 * @param {string|object} selector El selector u objeto HTML del canvas donde se dibujara
 * @example new OGTScript('#mi-canvas')
 */
class OGTScript {
  constructor(canvas=null, options=null) {
    this.canvas = null;
    this.ctx = null;
    this.filename = '';

    if (canvas) {
      if (typeof canvas == 'string') this.canvas = document.querySelector(canvas);
      else if (typeof canvas == 'object') this.canvas = canvas;
    } else this.canvas = document.createElement('canvas');

    if (options && typeof options == 'object') this.options = options;
    else {
      this.options = {
        scale: 1
      }
    }
  }

  /**
   * Dibuja la imagen en el canvas
   * @param {array} lines Las lineas del archivo que contienen la imagen
   * @param {int} cols El total de columnas
   * @param {int} rows El total de lineas
   */
  drawImage = function(lines, cols, rows) {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(this.scale, this.scale);
    let posx, posy = 0;

    for (let row = 0; row < rows; row++) {
      const colors = lines[row].split(';')

      for (let col = 0; col < cols; col++) {
        const color = colors[col];
        this.ctx.fillStyle = color;
        this.ctx.fillRect(posx, posy, 1, 1);
        posx++
      }

      posx = 0;
      posy++
    }
  }

  /**
   * Abre el fichero seleccionado en el selector de fichero e invoca a la función de dibujo
   * @param {object} file
   */
  openOgt = function(file) {
    const reader = new FileReader();
    this.filename = file.name.replace('.ogt', '');

    reader.onload = () => {
      const data = reader.result.split('\n');
      const [format, version, cols, rows, ..._] = data[0].split(';');
      const lines = data.slice(1)
      if (format.toLowerCase() != 'ogt') return;

      this.drawImage(lines, cols, rows);
    };

    reader.readAsText(file);
  }

  openOgtUrl = function(url) {
    this.clear();
    if (!url || typeof url != 'string') return;

    fetch(url).then( resp => {
      if (resp.status != 200) return;
      resp.text().then( data => {
        data = data.split('\n');
        const [format, version, cols, rows, ..._] = data[0].split(';');
        const lines = data.slice(1)
        if (format.toLowerCase() != 'ogt') return;

        this.drawImage(lines, cols, rows);
      })
    });
  }

  clear = function() {
    if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  toPNG() {
    return this.canvas.toDataURL('image/png');
  }
}

/**
 * Convierte un color en hexadecimal (#ffffff) a RGB
 * @param {string} hex
 * @returns Un array con los colores en RGB, en ese orden
 */
function hex2rgb(hex) {
	hex = hex.replace('#', '');
	var aRgbHex = hex.match(/.{1,2}/g);
	return [
		parseInt(aRgbHex[0], 16),
		parseInt(aRgbHex[1], 16),
		parseInt(aRgbHex[2], 16)
	];
}
