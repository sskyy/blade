/**
 * Created by jiamiu on 14-5-21.
 */
#import 'blade/binding.js'
#import 'blade/dom.js'


Binding.register_dom_generator('LayerGroup',function(layer, outputRef){
    outputRef.dom =  Dom.create('div')
    Binding.setup_rect_for_dom( outputRef.dom, layer )

})

Binding.register_dom_generator('Text',{
    dom :function(layer, outputRef){
        Util.log("creating tag p")
        var dom = Dom.create('p')
        //TODO browsers has different strategy to calculate the width of space with Sketch.
//        dom.innerHTML = layer.stringValue().replace(/\s/g,'&nbsp;')
        dom.innerHTML = layer.stringValue()

        Binding.setup_rect_for_dom( dom, layer )

        outputRef.dom = dom

    },
    css :function(dom, layer){

        Util.extend( dom.style,{
            "font-size" : layer.fontSize(),
            "letter-spacing" : layer.characterSpacing(),
            "line-height" :  layer.lineSpacing() + 'px'
        })

        dom.style['color'] = 'rgba(' + String(layer.textColor()).replace(/[\(\)]/g,'').split(' ').map(function(v){
            var t = v.split(":"),type = t[0],value=t[1]
            if( type !== 'a' ){
                return Math.round( Number(value) * 256)
            }
            return Number(value)
        }).join(',')+')'


        var align = ['left','right','center','justify']
        dom.style['text-align'] = align[layer.textAlignment()] ? align[layer.textAlignment()] : 'inherit'

        //fix browser and Sketch line-height diffrence
        dom.style['margin-top'] = (parseInt( dom.style['line-height'] ) - parseInt( layer.fontSize() ) )/2-1 + "px"

        dom.style['white-space'] = 'pre'

        //TODO: font-family, font-weight, font-style
    }
})

//Binding.register_dom_generator('Rectangle',function(layer, outputRef){
//    Util.log( layer.className() + layer.hasConvertedToNewRoundCorners )
//    return outputRef.dom = Dom.create('div')
//})

Binding.register_dom_generator('default',function(layer,outputRef){
    var dom = Dom.create('img'),
        filename = Util.uniq( Config.images_folder + "/" + Binding.sanitize_filename(layer.name()) ),
        ext = Config.export_img_ext



    dom.attr('src', filename+ext)
    //export it
    outputRef.exportFiles.push( {layer : layer, target : filename+ext})

    Binding.setup_rect_for_dom( dom, layer )
    outputRef.dom = dom
})


