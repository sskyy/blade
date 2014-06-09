/**
 * Created by jiamiu on 14-6-9.
 */

Binding.registry('width',{
    compose: function(  layer, args, outputRef  ){
        var dom = outputRef.dom,
            id = dom.attr('id') || Binding.generate_id(),
            width = args.pop()

        dom.style['width'] = width

    }
})