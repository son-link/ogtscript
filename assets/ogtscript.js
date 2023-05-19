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
  constructor(canvas=null) {
    this.canvas = null;

    if (canvas) {
      if (typeof canvas == 'string') this.canvas = document.querySelector(canvas);
      else if (typeof canvas == 'object') this.canvas = canvas;
    }
  }

  /**
   * Dibuja la imagen en el canvas
   * @param {array} lines Las lineas del archivo que contienen la imagen
   * @param {int} cols El total de columnas
   * @param {int} rows El total de lineas
   */
  drawImage = function(lines, cols, rows) {
    const ctx = this.canvas.getContext('2d');
    let scale = 8
    ctx.scale(scale, scale)
    let posx, posy = 0;

    for (let row = 0; row < rows; row++) {
      const pixels = lines[row].split(';')

      for (let col = 0; col < cols; col++) {
        const pixel = pixels[col];
        const [red, green, blue] = hex2rgb(pixel)
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.fillRect(posx, posy, 1, 1);
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

    reader.onload = () => {
      const data = reader.result.split('\n');
      const [format, version, cols, rows, ..._] = data[0].split(';');
      const lines = data.slice(1)
      if (format.toLowerCase() != 'ogt') return;

      this.drawImage(lines, cols, rows);
    };

    reader.readAsText(file);
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
