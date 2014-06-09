/**
 * Created by jiamiu on 14-5-19.
 */

Binding.registry('case',{
    scripts : [{
        'origin' : Config.plugin_folder + '/blade/bindings/case/binding-case.js',
        'src' : Config.js_folder +'/binding-case.js'
    }],
    styles:[{
        'origin' : Config.plugin_folder + '/blade/bindings/case/binding-case.css',
        'href' : Config.css_folder + '/binding-case.css'
    }],
    init: function(){
        /* this method will only be called when this binding first be used.*/
    },
    compose: function(  layer, args, outputRef  ){
        var controllerClass = 'binding-case-controller',
            caseClass = 'binding-case',
            casesClass = 'binding-cases',
            controllersClass= controllerClass + 's',
            controllersSelector = '['+controllersClass+']',
            bindings = Binding.get_bindings(layer.name()),
            id = bindings['id'] ? bindings['id'][0] : Binding.generate_id()


        //1. generator a controller for current case
        if( outputRef.dom.parentNode.find(controllersSelector).length ==0 ){
            outputRef.dom.parentNode.append(
                Dom.create('div').attr(controllersClass,controllersClass).addClass(controllersClass) )

            //give parent a class by the way
            outputRef.dom.parentNode.addClass(casesClass)
        }

        var controller = Dom.create('div')
            .attr('data-case-id',id)
            .attr(controllerClass,controllerClass)
            .addClass(controllerClass)
        controller.innerHTML = args[0]

        outputRef.dom.parentNode.find(controllersSelector)[0].append( controller )

        //2. dealing with current case
        if( !outputRef.dom.attr('id') ){
            outputRef.dom.attr('id',id)
        }
        outputRef.dom.addClass( caseClass)
    }
})