// https://github.com/buzcarter/UkeGeeks
/* global ace */
const aceInstance: any = ace

aceInstance.define('ace/snippets/chordpro', ['require', 'exports', 'module'], function (require: any, exports: any, module: any) {
  exports.snippetText = [
		// title tag
		'snippet {t}',
		'	{title: ${1:title}}',
		'snippet title',
		'	{title: ${1:title}}',

		// subtitle tag
		'snippet {st}',
		'	{subtitle: ${1:name}}',
		'snippet {sub}',
		'	{subtitle: ${1:name}}',
		'snippet {subtitle}',
		'	{subtitle: ${1:name}}',

		// artist tag
		'snippet {a}',
		'	{artist: ${1:name}}',
		'snippet {artist}',
		'	{artist: ${1:name}}',

		// key tag
		'snippet {k}',
		'	{key: ${1:name}}',
		'snippet {key}',
		'	{key: ${1:name}}',

		// album tag
		'snippet {al}',
		'	{album: ${1:title}}',
		'snippet {album}',
		'	{album: ${1:title}}',

		// comment tag
		'snippet {c}',
		'	{comment: ${1:description}}',
		'snippet {comment}',
		'	{comment: ${1:description}}',

		// chorus block
		'snippet {soc}',
		'	{start_of_chorus}',
		'snippet {eoc}',
		'	{end_of_chorus}',
    'snippet {verse}',
    ' {start_of_verse}',
    ' ${1:Music}',
    ' {end_of_verse}',
		'snippet {chorus}',
		'	{start_of_chorus}',
		'	${1:Music}',
		'	{end_of_chorus}',

		// tabs block
		'snippet {sot}',
		'	{start_of_tab}',
		'snippet {eot}',
		'	{end_of_tab}',
		'snippet {tab}',
		'	{start_of_tab}',
		' E|-${1:-}--------------------------------|',
    ' B|----------------------------------|',
    ' G|----------------------------------|',
    ' D|----------------------------------|',
    ' A|----------------------------------|',
    ' E|----------------------------------|',
		'	{end_of_tab}',

		// define tag
		'snippet {d}',
		'	{define: ${1:name} frets ${2:E} ${3:A} ${4:D} ${5:G} ${6:B} ${7:E} fingers ${8:E} ${9:A} ${10:D} ${11:G} ${12:B} ${13:E}}',
		'snippet []',
		'	[${1}]',

	].join("\n")
  exports.scope = 'chordpro'
})

export { aceInstance }
