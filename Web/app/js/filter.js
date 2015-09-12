iWork.filter('truncate', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

iWork.filter('sumFilter', function () {
    return function (groups, key) {
        var taxTotals = 0;
        $.each(groups,function(index,item){
            taxTotals += item[key];
        });
        return taxTotals;
    };
});

iWork.filter('duration', function () {
    return function (item, key) {
        return moment.duration(item, key).format();
    };
});

iWork.filter('moment', function () {
    return function(dateString, format) {
        return moment(dateString).format(format);
    };
});