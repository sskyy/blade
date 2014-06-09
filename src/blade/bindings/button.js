/**
 * Created by jiamiu on 14-5-19.
 */

/**
 * Created by jiamiu on 14-6-5.
 */

Binding.registry('btn',{
    compose: function(  layer, args, outputRef  ){
        var dom = outputRef.dom,
            layers = [layer layers],
            id,textPosition={},rectPosition={}

        if( dom.attr('id') ){
            id = dom.attr('id')
        }else{
            id = Binding.generate_id()
            dom.attr('id', id)
        }

        dom.tagName = 'a'
        dom.attr('type','text')

        var style = {
            comment : "dynamically generated for button",
            style : {}
        }
        style.style['#'+id] = {}
        style.style['#'+id+":hover"] = {}

        Util.each( layers, function( subLayer){

            var bindings = Binding.get_bindings(subLayer.name()),
                fakeDom

            fakeDom = Dom.create('div')

            if( Binding.get_kind( subLayer) == 'Text'){
                //use generator to help use with css
                Binding.domGenerators['Text'].css( fakeDom, subLayer )

                if( !dom.innerHTML ){
                    dom.innerHTML = subLayer.stringValue()
                    textPosition.x = subLayer.absoluteRect().rulerX()
                    textPosition.y = subLayer.absoluteRect().rulerY()
                }

            }else if( Binding.get_kind(subLayer) == 'Rectangle'){
                Binding.domGenerators['Rect'].css( fakeDom, subLayer )

                outputRef.styles.push( style )

                if( !rectPosition.x ){
                    rectPosition.x = subLayer.absoluteRect().rulerX()
                    rectPosition.y = subLayer.absoluteRect().rulerY()
                }
            }

            Util.extend(style.style['#'+id+(bindings['hover']?':hover':'')] , fakeDom.style)

        })

        // set position for text
        dom.style['padding-top'] = String(textPosition.y - rectPosition.y) + 'px'
        dom.style['padding-left'] = String(textPosition.x - rectPosition.x) + 'px'
        dom.style['box-sizing'] = 'border-box'
        dom.style['cursor'] = 'pointer'
        dom.style['display'] = 'inline-block'
        outputRef.dom = dom
    },
    //we will take the children from here
    stopAutoApplyBindingForChildren : true
})