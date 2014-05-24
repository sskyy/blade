/**
 * Created by jiamiu on 14-5-21.
 */
#import 'blade/binding.js'
#import 'blade/dom.js'


Binding.register_dom_generator('LayerGroup',function(layer, outputRef){
    outputRef.dom =  Dom.create('div')
})

Binding.register_dom_generator('Text',{
    dom :function(layer, outputRef){
        var dom = Dom.create('p')
        //TODO browsers has different strategy to calculate the width of space with Sketch.
//        dom.innerHTML = layer.stringValue().replace(/\s/g,'&nbsp;')
        dom.innerHTML = layer.stringValue()

        outputRef.dom = dom
    },
    css :function(dom, layer){
        var align = ['left','right','center','justify']
        dom.style['text-align'] = align[layer.textAlignment()] ? align[layer.textAlignment()] : 'auto'
        dom.style['white-space'] = 'pre'
        //fix browser and Sketch line-height diffrence
        if( dom.style['line-height']){
            dom.style['margin-top'] = (parseInt( dom.style['line-height'] ) - parseInt( layer.fontSize() ) )/2-1 + "px"
        }
    }
})

Binding.register_dom_generator('Rectangle',function(layer, outputRef){
    Util.log( layer.className() + layer.hasConvertedToNewRoundCorners )
    return outputRef.dom = Dom.create('div')
})

Binding.register_dom_generator('default',(function(){
    var fileNameCache = {}
    return function(layer,outputRef){
        var dom = Dom.create('img'),
            filename = Config.images_folder + "/" + Binding.sanitize_filename(layer.name()),
            ext = Config.export_img_ext

        if( fileNameCache[filename] ){
            fileNameCache[filename] = fileNameCache[filename]+1
            filename = filename + '-' + fileNameCache[filename]
        }else{
            fileNameCache[filename] = 1
        }

        dom.attr('src', filename+ext)
        //export it
        outputRef.exportFiles.push( {layer : layer, target : filename+ext})
        outputRef.dom = dom
    }

})())