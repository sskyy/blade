# Blade

[![Version](https://img.shields.io/github/package-json/v/sskyy/blade.svg)](https://github.com/sskyy/blade)
[![Join the chat at https://gitter.im/Sketch-Plugin-Blade/Lobby](https://badges.gitter.im/Sketch-Plugin-Blade/Lobby.svg)](https://gitter.im/Sketch-Plugin-Blade/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Blade is a sketch plugin designed to generate **prototype** web pages. Add simple annotation to your sketch layers and blade will get the magic done.

<iframe src="https://player.vimeo.com/video/243630016" width="640" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
<p><a href="https://vimeo.com/243630016">bladeNewDemo</a> from <a href="https://vimeo.com/sskyy">zhenyu hou</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

## Installation

 - Copy blade.sketchplugin in dist folder to sketch plugin folder.
 - Create a artboard to group your layers.
 - Run `Blade -> Export Current Artboard` on plugin menu.

You can check the example file and its output in the **example** folder.

## Annotation Usage

Blade use layer name annotation to convert layer to certain html component.

### A

Add link to any kind of layer.

```
[A?url=http://www.github.com/sskyy/blade]xxx
```

### Case

Switch between different versions of any layer. Press **Command** key to see selectors.

```
[Case]
  [#caseName=red]xxx
  [#caseName=blue]xxx
```

### Group

Default type of group layer. Can be centered to its container.

[Group?center=true]

### Ignore

Layer will not show in output.

### Img

Export any kind of layer as a Image.

## Roadmap

### Components

 - [x] Group( as default)
 - [x] A
 - [ ] Button
 - [x] Case
 - [x] Ignore
 - [x] Img
 - [ ] Input
 - [x] Text
 - [ ] Textarea

 ### Script support

 Support basic javascript
