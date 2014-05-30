/**
 * Created by jiamiu on 14-5-22.
 */

var controllerSelector = '[binding-case-controller]',
    casesSelector = '.binding-cases',
    caseSelector = '[binding-case]'


$( controllerSelector ).hide()
$( casesSelector).children( caseSelector).hide().first().show()

$('body').keydown(function(e){
    if(e.which == 16 ){
        $( controllerSelector ).show()
        $( casesSelector).addClass( 'outline' )
    }
})

$('body').keyup(function(e){
    if(e.which == 16 ){
        $( controllerSelector ).hide()
        $( casesSelector).removeClass( 'outline' )
    }
})

$('body').on('click', controllerSelector,function(){
    var caseId = $(this).attr('data-case-id')

    $('#'+caseId).siblings(caseSelector).hide()
    $('#'+caseId).show()
})