import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var options = function(){
    const default_options = {
        pairs: 2,
        difficulty: 'normal',
        groupSize: 2
    } 

    var pairs = $('#grups');
    var difficulty = $('#dificultat');
    var groupSize = $('#mida');
    
    var savedOptions = sessionStorage.options && JSON.parse(sessionStorage.options);
    var options = Object.create(default_options);
    
    if (savedOptions && savedOptions.pairs)
        options.pairs = savedOptions.pairs;
    if (savedOptions && savedOptions.difficulty)
        options.difficulty = savedOptions.difficulty;
    if (savedOptions && savedOptions.groupSize)
        options.groupSize = savedOptions.groupSize;

    pairs.val(options.pairs);
    difficulty.val(options.difficulty);
    groupSize.val(options.groupSize);

    pairs.on('change', function (){
        options.pairs = pairs.val();
    });

    difficulty.on('change', function (){
        options.difficulty = difficulty.val();
    });
    groupSize.on('change', function (){
        options.groupSize = groupSize.val();
    });

    return {
        applyChanges: function(){
            sessionStorage.options = JSON.stringify(options);
        },
        defaultValues: function(){
            options.pairs = default_options.pairs;
            options.difficulty = default_options.difficulty;
            options.groupSize = default_options.groupSize;
            pairs.val(options.pairs);
            difficulty.val(options.difficulty);
            groupSize.val(options.groupSize);
        }
    }
}();

$('#defecte').on('click', function(){
    options.defaultValues();
})

$('#aplicar').on('click', function(){
    options.applyChanges();
    location.assign("../");
});