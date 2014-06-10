/**
 * Created by jiamiu on 14-5-19.
 */

var Dom = Dom || (function(){


    function E( tag ){
        this.tagName= tag || ''
        this.childNodes = []
        this.parentNode = null
        this.innerHTML = ''
        this.id = null
        this.classList = []
        this.style = {}
        this.datas = {}
        this.attrs = {}
    }

    E.prototype.append = function( e ){
        this.childNodes.push(e)
        e.parentNode = this
        return this
    }

    E.prototype.prepend = function( e ){
        this.childNodes.unshift(e)
        e.parentNode = this
        return this
    }

    E.prototype.data = function( name, data ){
        if( data ){
            this.datas[name] = data
            return this
        }else{
            return this.datas[name]
        }
    }

    E.prototype.attr = function( name, data ){
        if( data ){
            this.attrs[name] = data
            return this
        }else{
            return this.attrs[name]
        }
    }

    E.prototype.css = function( name, style ){
        if( style ){
            this.style[name] = style
            return this
        }else{
            return this.style[name]
        }

    }

    E.prototype.find = function( queryString ){
        if( this.childNodes.length == 0) return;

        var output = [],queryArr = queryString.split(" "),
            currentQuery = queryArr.shift()

        Util.each( this.childNodes,function( child){

            if( child.match( currentQuery )){

                if( queryArr.length == 0 ){
                    output.push( child )
                }else{
                    output = output.concat( child.find( queryArr.join(" ")))
                }
            }
        })
        if( output.length !== 0 ){

        }
        return output

    }

    E.prototype.match = function( queryString ){
        var regSelectors = new RegExp('[#\\.\\[][\\w\\d_-]+(\\]|(?=[#\\.\\[])|$)','g'),
            regId = new RegExp('^#'),
            regClass = new RegExp('^\\.'),
            regAttr = new RegExp('^\\['),
            selectors = queryString.match( regSelectors )
        if( selectors ){
            var selector, i, j,found

            for( i in selectors ){
                selector = selectors[i]
                if( regId.test(selector) && this.attr('id') != selector.substr(1) ) return false

                if( regClass.test( selector) ){
                    found = false
                    for( j in this.classList){
                        if( this.classList[j] == selector.substr(1) ){
                            found = true;
                            break;
                        }
                    }
                    if( !found ) return false
                }

                if( regAttr.test( selector) ){
                    found = false
                    for( j in this.attrs ){
                        if( this.attrs[j] == selector.substr(1, selector.length-2)){
                            found = true;
                            break;
                        }
                    }
                    if( !found ) return false
                }
            }
        }

        return true
    }

    E.prototype.addClass = function( className ){
        this.classList.push( className)
        return this
    }

//    E.prototype.outerHTML = function(){
//
//        var selfClose = ['input','img','textarea','link']
//
//        if( selfClose.indexOf(this.tagName ) != -1 ){
//            return '<' + generate_tag_head(this) + ' />'
//        }else{
//            if( this.childNodes.length == 0 ){
//                return '<' + generate_tag_head(this) + ' >' + this.innerHTML + '</'+this.tagName + '>'
//            }else{
//
//                var childHTMl = this.childNodes.map(function( child ){
//                    return child.outerHTML()
//                }).join('')
//
//                return  '<' + generate_tag_head(this) + ' >' + childHTMl + '</'+this.tagName + '>'
//            }
//
//        }
//    }

    Object.defineProperty(E.prototype,"outerHTML",{
        get : function(){
            var selfClose = ['input','img','textarea','link']

            if( selfClose.indexOf(this.tagName ) != -1 ){
                return '<' + generate_tag_head(this) + ' />'
            }else{
                if( this.childNodes.length == 0 ){

                    return '<' + generate_tag_head(this) + ' >' + this.innerHTML + '</'+this.tagName + '>'
//                    var output ='<' + generate_tag_head(this) + ' >' + this.innerHTML + '</'+this.tagName + '>'
//
//                    return [[NSString alloc] initWithString :output]
                }else{

                    var childHTMl = this.childNodes.map(function( child ){
                        return child.outerHTML
                    }).join('')

                    return  '<' + generate_tag_head(this) + ' >' + childHTMl + '</'+this.tagName + '>'

//                      var head = '<' + generate_tag_head(this) + ' >',
//                          output = [NSMutableString stringWithString:head];
//
//                    for( var i in this.childNodes ){
//                        var childOutput = this.childNodes[i].outerHTML
//                        [output appendString:childOutput]
//                        Util.log( childOutput, output)
//                        [childOutput release]
//                    }
//
//                    return [output appendString:@" >"]
                }

            }
        }
    })

    function generate_tag_head( el ){
        var items = [
            el.tagName
        ]

        if( Util.values(el.style).length ){
            items.push('style="' + Util.join(el.style,":",";") + '"')
        }

        if( el.id ){
            items.push( 'id="' + el.id +'"')
        }

        if( Util.values(el.datas).length ){
            items = items.concat( Util.values( Util.map( el.datas, function(v, k){ return 'data-'+k+'="'+v+'"'})))
        }

        if( Util.values(el.attrs).length ){
            items = items.concat( Util.values( Util.map( el.attrs, function(v, k){ return k+'="'+v+'"'})))
        }

        if( el.classList.length ){
            items.push('class="' + el.classList.join(' ')+'"')
        }
//        Util.log( JSON.stringify(items ) )
        return items.join(" ")
    }

    function create(tag){
        return new E(tag)
    }

    return {
        create : create
    }
})()





