/**
 * Created by jiamiu on 14-5-19.
 */

Binding.registry('hover',function(  layer, args, outputRef  ){
//    if( !Binding.is_group( layer) ){
//        Util.log('[hover] :' + layer.name() +' is not group.')
//        return
//    }
//
//    //1.deal with current layer
//    var bindings = Binding.get_bindings(layer.name()),
//        id = bindings['id'] ? bindings['id'][0] : Binding.generate_id()
//
//
//    if( !outputRef.dom.attr('id') ){
//        outputRef.dom.attr('id',id)
//    }
//
//    //2.deal with children who has binding of [onHover]
//    var subIds = [],layers = [layer layers]
//    Util.each( layers, function( subLayer, i ){
//
//        var subBindings = Binding.get_bindings(subLayer.name()),
//            subId = subBindings['id'] ? subBindings['id'][0] : Binding.generate_id()
//
//        if( !subBindings['onHover'] ){
//            //normal layer
//            if( !outputRef.dom.childNodes[i] ){
//                Binding.apply_bindings( subLayer, outputRef )
//            }
//
//        }else{
//            delete subBindings['onHover']
//
//            //3.generate the children with rest bindings
//            Util.log("==sublayer : " + subLayer)
//
//            if( !outputRef.dom.childNodes[i] ){
//                Binding.apply_bindings( subLayer, outputRef , subBindings )
//            }
//
//            if( !outputRef.dom.childNodes[i].attr('id') ){
//                outputRef.dom.childNodes[i].attr('id',subId)
//            }
//
//            subIds.push(subId)
//
//            //4.output hover script
//            outputRef.scripts.push({
//                comment : 'hover script for '+layer.name(),
//                script :{
//                    vars : {id:id,subIds:subIds},
//                    body : function(){
//                        $.each(subIds,function(k,subId){
//                            $('#'+subId).hide()
//                        })
//
//                        $('#'+id).hover(function(){
//                            $.each(subIds,function(k,subId){
//                                $('#'+subId).show()
//                            })
//                        },function(){
//                            $.each(subIds,function(k,subId){
//                                $('#'+subId).hide()
//                            })
//                        })
//                    }
//                }
//            })
//        }
//
//    })

})