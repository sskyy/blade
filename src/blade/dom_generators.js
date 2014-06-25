/**
 * Created by jiamiu on 14-5-21.
 */

function handler_export( layer, outputRef){
    var dom = Dom.create('img'),
        filename = Config.images_folder + "/" + Util.uniq( Binding.sanitize_filename(layer.name()) ),
        ext = Config.export_img_ext,
        src = filename.replace(Config.target_folder+"/",'') + ext


    dom.attr('src', src)
    outputRef.exportFiles.push( {layer : layer, target : filename+ext})
    return dom
}

Binding.register_dom_generator('LayerGroup',function(layer, outputRef){
    outputRef.dom =  Dom.create('div')
    Binding.setup_rect_for_dom( outputRef.dom, layer )

})

Binding.register_dom_generator('Text',{
    dom :function(layer, outputRef){

        var needExport = false
        if( layer.style().borders().array().count() !== 0
            || layer.style().fills().array().count()
            ){
            needExport = true
        }


        if( !needExport ){
            var dom = Dom.create('p')
            //TODO browsers has different strategy to calculate the width of space with Sketch.
            dom.innerHTML = layer.stringValue()
        }else{
            var dom = handler_export(layer, outputRef)
        }

        Binding.setup_rect_for_dom( dom, layer )
        outputRef.dom = dom



    },
    css :function(dom, layer){
        if( dom.tagName == 'img' ) return

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
        dom.style['margin-top'] = (parseInt( dom.style['line-height'] ) - parseInt( layer.fontSize() ) ) + "px"

        dom.style['white-space'] = 'pre'
        dom.style['word-break'] = 'break-word'

        //NOT SUPPORT font-style NOW
        var font = layer.font()
        dom.style['font-family'] = "'"+font.familyName()+"'"
        dom.style['font-weight'] = Number(Util.fontWeight( font) ) *100

        //TODO: deal with font fill

    }
})

//due to Sketch api issue, we can not generate div for every Rectangle
Binding.register_dom_generator('Rect',{
    dom:function(layer, outputRef){
        //Rectangle is the shape which will not export as a image but generate a div.

        var needExport = false,
            borders = layer.style().borders().array(),
            fills = layer.style().fills().array(),
            i= 0,fillsCount = fills.count(),
            dom

        if( borders.count() > 1 ){
            Util.log("borders count > 1")
            needExport = true
        }

        for( ;i<fillsCount; i++){
            if( fills[i].fillType == 4  ){
                Util.log("fillType == 4")

                needExport= true;
                break;
            }
        }

        if( needExport ){
            dom = handler_export(layer, outputRef)

        }else{
            dom = Dom.create('div')
        }

        Binding.setup_rect_for_dom( dom, layer )
        outputRef.dom = dom
    },
    css : function(dom, layer) {
        if( dom.tagName == "img") return

        var borders = layer.style().borders().array(),
            fills = layer.style().fills().array(),
            shadows = layer.style().shadows(),
            innerShadows = layer.style().innerShadows()

        if( borders.count() == 1 && borders.objectAtIndex(0).isEnabled()){
            dom.style['border'] = borders.objectAtIndex(0).thickness() +"px solid " + Util.toRGBA( borders.objectAtIndex(0).color() )
        }
        if( fills.count() > 0 ){
            var backgrounds = []
            Util.each( fills, function(fill){
                if( fill.isEnabled() == 1 ){
                    backgrounds.push( Util.toRGBA( fill.color()))
                }
            })
            backgrounds.length && ( dom.style['background'] = backgrounds.join(',') )
        }

        if( shadows.count() + innerShadows.count() > 0 ){
            var shadowStyles = []
            Util.each( shadows, function( shadow){
                if( !shadow.isEnabled() ) return

                shadowStyles.push(
                        [shadow.offsetX(),shadow.offsetY(),shadow.blurRadius(),shadow.spread()].map(function(i){
                            return i+"px"
                        }).join(' ') + " " + Util.toRGBA( shadow.color())
                )
            })

            Util.each( innerShadows, function( innerShadow){
                if( !innerShadow.isEnabled() ) return ;

                shadowStyles.push(
                        "inset " + [innerShadow.offsetX(),innerShadow.offsetY(),innerShadow.blurRadius(),innerShadow.spread()].map(function(i){
                        return i+"px"
                    }).join(' ') + " " + Util.toRGBA( innerShadow.color())
                )
            })
            shadowStyles.length && ( dom.style['box-shadow'] = shadowStyles.join(','))
        }
    }
})

Binding.register_dom_generator('Bitmap1',function(layer,outputRef){
    var dom = handler_export(layer, outputRef)


    Binding.setup_rect_for_dom( dom, layer )
    outputRef.dom = dom
})


Binding.register_dom_generator('default',function(layer,outputRef){
    var dom = handler_export(layer, outputRef)

    Binding.setup_rect_for_dom( dom, layer )
    outputRef.dom = dom
})