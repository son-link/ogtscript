const $ = (selector) => document.querySelector(selector);
const ogtView = $('ver-ogt');

document.addEventListener("DOMContentLoaded", function() {
	//const canvas = $('#test');
	//const ogt = new OGTScript(canvas);
	//ogt.openOgtUrl('/minabo.ogt')

	$('#cargar-src').addEventListener('change', (e) => {
		if (e.target.checked) ogtView.setAttribute('src', '/minabo.ogt');
		else ogtView.removeAttribute('src');
	});

	$('#scale').addEventListener('change', (e) => {
		if (e.target.value) ogtView.setAttribute('scale', e.target.value);
	});

	$('#enable-toolbar').addEventListener('change', (e) => {
		if (e.target.checked) ogtView.setAttribute('enable-toolbar', '1');
		else ogtView.setAttribute('enable-toolbar', '0');
	});

	/*$('#openfile')[0].addEventListener('change', function() {
		console.dir(this.files[0]);
		//$('ver-ogt')[0].setAttribute('src', this.files[0].name);
	})*/
});
