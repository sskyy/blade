/**
 * Created by jiamiu on 14-6-9.
 */

Binding.registry('center',{
    /**
     *
     * @param layer
     * @param args Current support 'v' : vertical, 'h' : horizon, 'v,h' : both.
     * @param outputRef
     */
    link: function(  layer, args, outputRef  ){
        var dom = outputRef.dom,
            id = dom.attr('id') || Binding.generate_id(),
            type

        while( type = args.pop() ){
            if( type == 'h' ){

                dom.style['position'] = 'relative'
                dom.style['margin-left'] = 'auto'
                dom.style['margin-right'] = 'auto'

            }else if( type =='v' ){

                //use script

            }
        }

    }
})