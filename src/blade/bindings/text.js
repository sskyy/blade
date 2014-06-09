/**
 * Created by jiamiu on 14-6-5.
 */

Binding.registry('text',{
    compose: function(  layer, args, outputRef  ){
        var dom = outputRef.dom,
            layers = [layer layers]

        dom.tagName = 'input'
        dom.attr('type','text')

        Util.each( layers, function( subLayer ){
            if( Binding.get_kind( subLayer) =='Text' ){
                dom.attr('placeholder', subLayer.stringValue() )
                dom.style['font-size'] = subLayer.fontSize()
                dom.style['color'] = Util.toRGBA(subLayer.textColor())

            }else if(Binding.get_kind( subLayer) =='Rectangle'){
                //get background and border
                var border = subLayer.style().borders().array()[0],
                    fill = subLayer.style().fills().array()[0]

                dom.style['border'] = [border.thickness(),'solid', Util.toRGBA(border.color())].join(' ')
                dom.style['background'] = Util.toRGBA(fill.color())

                dom.style['line-height']= dom.style['height'] + "px"
                dom.style['outline']= 'none'
                dom.style['box-sizing']= 'border-box'
                dom.style['padding']= '0 4px'
            }
        })


        outputRef.dom = dom
    },
    //we will take the children from here
    stopAutoApplyBindingForChildren : true
})