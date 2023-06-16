const $ = (selector) => document.querySelector(selector);
const ogtView = $('ver-ogt');

document.addEventListener("DOMContentLoaded", function() {
	$('#scale').value = 1;

	document.querySelectorAll('.cambiar-src').forEach( (ele) => {
		if (ele.checked) {
			const src = ele.value;
			ogtView.setAttribute('src', src);
		}
	})

	document.querySelectorAll('.cambiar-src').forEach( (ele) => {
		ele.addEventListener('change', (e) => {
			const src = e.target.value;
			if (e.target.checked) ogtView.setAttribute('src', src);
		});
	})

	$('#scale').addEventListener('input', (e) => {
		const scale = e.target.value
		ogtView.setAttribute('scale', scale);
		$('#scale-value').innerText = scale;
	});
	
	$('#dataURL').addEventListener('click', async (e) => {
		const ogtscript = new OGTScript();
		const url = ogtView.getAttribute('src');
		ogtscript.toDataURL(url, 4).then( data => $('#img').setAttribute('src', data));
	});

	/*$('#openfile')[0].addEventListener('change', function() {
		console.dir(this.files[0]);
		//$('ver-ogt')[0].setAttribute('src', this.files[0].name);
	})*/
});
