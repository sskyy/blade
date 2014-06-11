/**
 * Created by jiamiu on 14-5-19.
 */

var Config = Config || (function(){

    var document_path = [[doc fileURL] path].replace( /\/[^\/]+\.sketch$/,'\/'),
        document_name = [doc displayName].replace(".sketch",""),
        target_folder = document_path + document_name,
        home_folder = "/Users/" + NSUserName(),
        images_folder = target_folder + "/images",
        css_folder = target_folder + "/css",
        js_folder = target_folder + "/js",
        plugin_folder = sketch.scriptPath.replace(/\/blade.sketchplugin$/,'')


    return {
        document_path : document_path,
        document_name : document_name,
        target_folder : target_folder,
        images_folder : images_folder,
        home_folder : home_folder,
        js_folder : js_folder,
        css_folder : css_folder,
        plugin_folder : plugin_folder,
        global_scripts : [{
            comment : 'global script : jquery-2.1.1.min.js',
            origin : plugin_folder + '/blade/lib/jquery-2.1.1.min.js',
            src : js_folder + '/jquery-2.1.1.min.js'
        }],
        global_styles : [{
            comment : 'global reset',
            origin : plugin_folder + '/blade/lib/reset.css',
            href : css_folder + '/reset.css'
        }],
        export_img_ext : ".png",
        show_error : false

    }
})()

