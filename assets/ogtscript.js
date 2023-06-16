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

    if (!canvas) return;
    
    if (typeof canvas == 'string') this.canvas = document.querySelector(canvas);
    else if (typeof canvas == 'object') this.canvas = canvas;
    else return;

    this.ctx = this.canvas.getContext('2d');

    if (options && typeof options == 'object') this.options = options;
    else {
      this.options = {
        scale: 1,
        autoSize: true
      }
    }

    this.cur_canvas = {
      lines: 0,
      cols: 0,
      rows: 0
    }
  }

  /**
   * Dibuja la imagen en el canvas
   * @param {array} lines Las lineas del archivo que contienen la imagen
   * @param {int} cols El total de columnas
   * @param {int} rows El total de lineas
   */
  drawImage = function() {
    this.clear();
    this.ctx.save();

    if (this.options.autoSize) {
      this.canvas.width = this.options.scale * this.cur_canvas.cols;
      this.canvas.height = this.options.scale * this.cur_canvas.rows;
    }
    
    this.ctx.scale(this.options.scale, this.options.scale);
    let posx, posy = 0;

    for (let row = 0; row < this.cur_canvas.rows; row++) {
      const colors = this.cur_canvas.lines[row].split(';')

      for (let col = 0; col < this.cur_canvas.cols; col++) {
        const color = colors[col];
        this.ctx.fillStyle = color;
        this.ctx.fillRect(posx, posy, 1, 1);
        posx++
      }

      posx = 0;
      posy++
    }

    this.ctx.restore();
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

      this.cur_canvas.lines = lines;
      this.cur_canvas.cols = cols;
      this.cur_canvas.rows = rows;

      this.drawImage();
    };

    reader.readAsText(file);
  }

  openOgtUrl = function(url, cb=null) {
    this.ctx.reset();
    if (!url || typeof url != 'string') return;

    fetch(url).then( resp => {
      if (resp.status != 200) return;
      resp.text().then( data => {
        data = data.split('\n');
        const [format, version, cols, rows, ..._] = data[0].split(';');
        const lines = data.slice(1)
        if (format.toLowerCase() != 'ogt') return;

        this.cur_canvas.lines = lines;
        this.cur_canvas.cols = cols;
        this.cur_canvas.rows = rows;
        this.drawImage();

        if (cb && typeof cb == 'function') cb();
      });
    });
  }

  clear = function() {
    if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  scale = function(scale) {
    this.options.scale = parseInt(scale);
    this.drawImage();
  }
  
  toDataURL = function(url, scale=1) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    document.body.append(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.options = {
      scale: scale,
      autoSize: true
    }

    this.cur_canvas = {
      lines: 0,
      cols: 0,
      rows: 0
    }

    return new Promise( (resolve, reject) => {
      this.openOgtUrl(url, () => {
          const data = this.canvas.toDataURL('image/png');
          this.canvas.remove();
          resolve(data);
        });
    });
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
