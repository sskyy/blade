/**
 * Created by jiamiu on 14-5-19.
 */

var Binding = Binding || (function(){
    var ObjectId = 0

    var bindingImp = {}

    /**
     * @param {string} name
     * @param {function|object} handler - This parameter is just like AngularJS's directive definition object.
     *        Here is an example when pass an object:
     *        {
     *          compose : function(){
     *              // some code here to perform dom transformation
     *          },
     *          link : function(){
     *              //code here to add script
     *          }
     *        }
     *        When pass a function as parameter, the function will be used as `link` function.
     */
    function registry(name, handler){
        if( bindingImp[name] ){
            Util.log( 'you are overwriting binding: ' + name)
        }

        if( typeof handler == 'function'){
            handler = { compose:noop, link : handler }
        }else if( typeof handler =='object'){
            if( !handler.compose ){
                handler.compose = noop
            }
            if( !handler.link ){
                handler.link = noop
            }

        }else{
            Util.log( 'Unacceptable handler for '+name)
            return
        }

        handler.inited = false

        bindingImp[name] = handler

    }

    /**
     * Call all bindings in this layer to do their job.
     *
     * @param {sketch layer} layer
     * @param {object} parentOutputRef - This is a reference to hold process result.
     * @param {object} [bindings] - If bindings was specified, then we will not get from layer name.
     *
     * @return {object|undefined} parentOutputRef - notice that we will always return parentOutputRef.
     */
    function apply_bindings( layer, parentOutputRef, bindings ){
//        Util.log("apply_bindings for "+ layer.name()+" : "+get_kind(layer) + " : " + layer.className() )
        if( !is_layer( layer) ){
            Util.log("please pass a layer as first argument.")
            return
        }

        if( !parentOutputRef ){
            parentOutputRef = {
                dom : Dom.create('body'),
                scripts : [],
                styles : [],
                exportFiles : []
            }

        }

        var outputRef = {
                dom : Dom.create(),
                scripts : [],
                styles : [],
                exportFiles : []
            },
            stopAutoApplyBindingForChildren = false

        // Dom generator may attach scripts for special dom,
        // so we need to pass the output reference as parameter
        generate_dom_by_kind( layer, outputRef )

        //we must append the dom here so compose function can access parent node.
        //notice you can only use dom functions to modify dom, or you will loss reference.
        parentOutputRef.dom.append( outputRef.dom )

        bindings = bindings || get_bindings(layer.name())

        // apply default binding only if no binding specified
        if( !bindings || !Util.values( bindings).length ){
            bindingImp['default']['link']( layer, null,  outputRef )
        }else{
            //compose it first and load external scripts and styles
            Util.each( bindings, function( bindingArgs, bindingName ){
                //load scripts and styles
                if( !bindingImp[bindingName] ){
                    Util.log('Unknown binding: '+ bindingName)
                    return
                }

                if( !bindingImp[bindingName].inited ){
                    if( bindingImp[bindingName]['init'] ){
                        bindingImp[bindingName]['init']()
                    }

                    if( bindingImp[bindingName]['scripts'] ){
                        Util.log("find script for "+bindingName)
                        outputRef.scripts = outputRef.scripts.concat( bindingImp[bindingName]['scripts'] )
                    }
                    //load styles
                    if( bindingImp[bindingName]['styles'] ){
                        outputRef.styles = outputRef.styles.concat( bindingImp[bindingName]['styles'] )
                    }

                    bindingImp[bindingName].inited = true

                }

                if( bindingImp[bindingName].stopAutoApplyBindingForChildren ){
                    Util.log(bindingName+' has stopAutoApplyBindingForChildren')
                    stopAutoApplyBindingForChildren = true
                }

                //compose
                bindingImp[bindingName]['compose']( layer, bindingArgs, outputRef )

                //mark it
                outputRef.dom.attr('binding-'+bindingName,String(bindingArgs))
            })



            Util.log("get bindings"+JSON.stringify( bindings))

            //link it
            Util.each( bindings, function( bindingArgs, bindingName ){
                Util.log("calling binding link function " +  bindingName)
                if( bindingImp[bindingName] ){
                    bindingImp[bindingName]['link']( layer, bindingArgs, outputRef )
                }else{
                    Util.log('Unknown binding: '+ bindingName)
                }
            })
        }

        if( is_folder(layer) && !stopAutoApplyBindingForChildren){
            var layers= [layer layers]
            Util.each( layers, function( subLayer){
                apply_bindings( subLayer, outputRef )
            })
        }

        parentOutputRef.scripts = parentOutputRef.scripts.concat( outputRef.scripts )
        parentOutputRef.styles = parentOutputRef.styles.concat( outputRef.styles )
        parentOutputRef.exportFiles = parentOutputRef.exportFiles.concat( outputRef.exportFiles )

        return parentOutputRef
    }

    function get_bindings( name ){
        var matches = name.match(/\[([\w\d%_,-:=]*)\]/g),
            bindings = {}

        if( matches ){
            for( var i in matches ){
                var tmp = matches[i].substring(1,matches[i].length-1).split("="),
                    bindingName = tmp[0],
                    bindingArgs = tmp[1] ? tmp[1].split(",") : [true]

                bindings[bindingName] = bindingArgs
            }
        }
        return bindings
    }


    var domGenerators = {}

    function register_dom_generator(name, handler){
        domGenerators[name] = (typeof handler =='object') ? handler : {dom:handler,css:noop}
    }

    function generate_dom_by_kind( layer, outputRef ){

        var kind = get_kind( layer),generatorName = domGenerators[kind]? kind : 'default'
        Util.log("generate dom for " + kind)

        domGenerators[generatorName].dom( layer, outputRef )
        domGenerators[generatorName].css( outputRef.dom, layer)

        outputRef.dom.data('sketch-kind', kind )
        outputRef.dom.data('title', layer.name())
    }

    function setup_rect_for_dom( dom, layer ){
        dom.style.position = "absolute"
        if( get_kind(layer.parentGroup()) == 'LayerGroup' ){
            dom.style.left = layer.absoluteRect().rulerX() - layer.parentGroup().absoluteRect().rulerX()
            dom.style.top = layer.absoluteRect().rulerY() - layer.parentGroup().absoluteRect().rulerY()
        }else{
            dom.style.left = layer.absoluteRect().rulerX()
            dom.style.top = layer.absoluteRect().rulerY()
        }

        dom.style.width =  layer.absoluteRect().width()
        dom.style.height =  layer.absoluteRect().height()
        if( !layer.isVisible()){
            dom.css('display','none')
        }
    }

    function sanitize_filename(name){
        return name.replace(/(\s|:|\/)/g ,"_").replace(/__/g,"_").replace("*","").replace("+","").replace("@@hidden","");
    }



    function get_kind( layer) {
        var _class = layer.className(),
            _kind = "Other",
            _path;
        if ( _class == "MSTextLayer" ) { // text layer
            _kind = "Text";
        } else if ( _class == "MSArtboardGroup") { // text layer
            _kind = "Artboard"
        } else if ( _class == "MSSliceLayer") { // text layer
            _kind = "Slice";
        } else if (_class == "MSBitmapLayer" ) { // text layer
            _kind = "Bitmap";
        } else if (_class == "MSShapeGroup" ) { // group layer or shape layer
            if( layer.children().count() == 2 ){
                var _lay = layer.children()[0],
                    _class1 = _lay.className().toString(),
                    _isSpecificShape1 = /^MS\w*Shape$/.test(_class1)


                if (_class1 == "MSShapePathLayer") { // shape path
                    _path = _lay.path(); // get the path on the layer
                    if (_path.isLine()) { // check with the path method
                        _kind = "Line";
                    }else{
                        _kind = "Vector"
                    }
                } else if (_isSpecificShape1) {
                    _kind = _class1.replace("MS", "").replace("Shape", "");
                }
            }else{
                _kind = "ShapeGroup"
            }

        }else if( _class== "MSLayerGroup" ){
            _kind  = "LayerGroup"
        }

        return _kind;
    }

    function generate_id(){
        return '_object_' + ObjectId++
    }

    function concat_child_process_result( current, child){
        if( child.dom ){
            current.dom.append(child.dom)
        }
        current.scripts = current.scripts.concat( child.scripts )
        current.styles = current.styles.concat( child.styles)
    }

    function get_styles( layer ){
        var styles = {},
            borders = layer.style.borders().array(),
            fills = layer.style.fills().array(),
            shadows =layer.style.shadows().array(),
            innerShadows =layer.style.innerShadows().array()

        //TODO
        return styles
    }



    function is_group(layer) {
        return [layer isMemberOfClass:[MSLayerGroup class]] || [layer isMemberOfClass:[MSArtboardGroup class]]
    }

    function is_folder( layer ){
        return layer.className().toString() == 'MSLayerGroup'
    }

    function is_array( layer ){
        return [layer isMemberOfClass:[MSArray class]]

    }

    function is_layer( layer ){
        if( !layer.className ) return false

        var classes = ['MSLayerGroup','MSShapeGroup','MSArtboardGroup','MSTextLayer','MSBitmapLayer','MSShapePathLayer','MSShapePath']
        return Util.in_array( classes, layer.className().toString() )
    }



    function noop(){}

    return {
        apply_bindings : apply_bindings,
        registry : registry,
        get_bindings : get_bindings,
        generate_dom_by_kind : generate_dom_by_kind,
        generate_id : generate_id,
        concat_child_process_result : concat_child_process_result,
        register_dom_generator : register_dom_generator,
        sanitize_filename : sanitize_filename,
        is_group : is_group,
        is_array : is_array,
        is_folder : is_folder,
        get_kind : get_kind,
        setup_rect_for_dom:setup_rect_for_dom,
        get_styles : get_styles,
        domGenerators : domGenerators
    }
})()


