var httpService = (function(){

    function getDummy(url){
        console.log(url);
    }

    return{
        get: getDummy
    };



})();