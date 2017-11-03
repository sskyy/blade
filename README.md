# Blade 0.0.2

Blade is a sketch plugin designed to generate **prototype** web pages. Add simple annotation to your sketch layers and blade will get the magic done.

## Installation

 - Copy blade.sketchplugin in dist folder to sketch plugin folder.
 - Create a artboard to group your layers.
 - Run `Blade -> Export Current Artboard` on plugin menu.



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
