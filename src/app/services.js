/* Testing JS download in CDN */
var app = angular.module('app');

app.service('DataService', ['$http', function($http) {
    var dateRange = [
    {
        'name': 'Last 7 days',
        'id': 'last_7_days'
    },
    {   'name': 'Last 14 days',
        'id': 'last_14'
    },
    {
        'name': 'Last 30 days',
        'id': 'last_30_days'
    },
    {
        'name': 'Current Month',
        'id': 'this_month'
    },
    {
        'name': 'Previous Month',
        'id': 'last_month'
    }, {
        'name': 'All Time',
        'id': 'all_time'
    }]
    this.getDateRange = function() {
        return dateRange
    }
    this.validateEmail = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !re.test(email);
    }
}]);
app.service('DateRangeService', ['$http', function($http) {
    this.getLastSunday = function() {
        var date = moment().format("YYYY-MM-DD");
        var lastWeekStart = moment().day(-7).format('YYYY-MM-DD');
        return lastWeekStart
    }
    this.getLastMonday = function() {
        var date = moment().format("YYYY-MM-DD");
        var lastMonday = moment().day(-6).format('YYYY-MM-DD');
        return lastMonday
    }
    this.getLast30thDay = function() {
        var date = moment().format("YYYY-MM-DD");
        var last30thDay = moment().subtract(30, 'days').format('YYYY-MM-DD');
        return last30thDay
    }
    this.getRequiredDay = function(n) {
        var date = moment().format("YYYY-MM-DD");
        var requiredDay = moment().subtract(n, 'days').format('YYYY-MM-DD');
        return requiredDay
    }
    this.getLastFriday = function() {
        var date = moment().format("YYYY-MM-DD");
        var lastFriday = moment().day(-2).format('YYYY-MM-DD');
        return lastFriday
    }
    this.getLastSatday = function() {
        var date = moment().format("YYYY-MM-DD");
        var lastSatday = moment().day(-1).format('YYYY-MM-DD');
        return lastSatday
    }
    this.getLastSunday = function() {
        var date = moment().format("YYYY-MM-DD");
        var lastSunday = moment().day(-0).format('YYYY-MM-DD');
        return lastSunday
    }
    this.getToday = function() {
        var date = moment().format("YYYY-MM-DD");
        return date
    }

    this.getThisWeekStart = function() {
        var date = moment().format("YYYY-MM-DD");
        var weekStart = moment(date).weekday(1).format('YYYY-MM-DD');
        return weekStart
    }
    this.getMonthStart = function() {
        var date = moment().format("YYYY-MM-DD");
        var startOfLastMonth = moment().startOf('month').format('YYYY-MM-DD');
        return startOfLastMonth
    }
    this.getLastMonthStart = function() {
        var date = moment().format("YYYY-MM-DD");
        var lastMonthStart = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        return lastMonthStart
    }
    this.getLastMonthEnd = function() {
        var date = moment().format("YYYY-MM-DD");
        var endOfLastMonth = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
        return endOfLastMonth
    }

    this.getEarliestSupportedDate = function() {

        var date = moment.utc("2016-12-01", "YYYY-MM-DD");
        var s = date.format("YYYY-MM-DD");

        return s;
    }

    this.getYesterdayUtcHoursEpoc = function(hours, minutes){
       var currentDate = moment.utc();
       currentDate.add(-1,'days');
       currentDate.set('hour',hours);
       currentDate.set('minute',minutes);
       currentDate.set('second',00);
       currentDate.set('millisecond',00);
       return currentDate.unix();

    }

    this.getCurrentDateUTCHours = function(hours,minutes){
        var currentDate = moment.utc();
            currentDate.set('hour',hours);
            currentDate.set('minute',minutes);
            currentDate.set('second',00);
            currentDate.set('millisecond',00);
        return currentDate;
    }

    this.getCurrentDateUnix = function(){
        var currentDate = moment.utc();
            currentDate.set('second',00);
            currentDate.set('millisecond',00);
        return currentDate.unix();
    }

    this.isCurrentTimeGreaterThan = function(date){
        var currentDate = moment.utc();
        return currentDate.isAfter(date)
    }
}])
app.service('ImapConstants', ['$http', function($http) {
    var urls = {
        'periscope_base_url': 'https://app.periscopedata.com',
        'periscope_base_path': '/api/embedded_dashboard?data=',
        'mockable_base_url': 'https://demo7722302.mockable.io/'
    }

    var stripe = {

    }

    if(window.location.hostname == "app.intentwise.com" || window.location.hostname == "app1.intentwise.com") {
    	urls.intentwise_base_url = 'https://app.intentwise.com/api/';
        stripe.key = "pk_live_Wu3gCGbhISxtzIJngWyC0Gfm";

    } else {
        stripe.key = "pk_test_r8DaZrjWWTz5c3p6PI7erPHY";
    	urls.intentwise_base_url ='https://apptest.intentwise.com/apitest/';
    }

    var roleConstants = {
        'analyst': 'ANALYST',
        'admin': 'ADMIN',
        'superAdmin': 'SUPER_ADMIN'
    }

    var dashboardIds = {

     'OVERVIEW':'190841',
     'SPONSOREDCAMPAIGNS':'197066',
     'CAMPAIGNS':'197058',
     'NEGATIVEKEYWORDS':'197072',
     'SPONSOREDKEYWORDS':'197067',
     'HEADLINEKEYWORDS':'190842',
     'CUSTOMERSEARCHTERM': '190843',
     'PRODUCTSUMMARY': '197068',
     'HEADLINEKEYWORDBIDS': '194062',
     'SPONSOREDKEYWORDBIDS': '194060',
     'SPONSOREDKEYWORDIDEAS': '194061',
     'MULTIACCOUNTVIEW': '200419',
     'POSVIEW':'200439',
     'BRANDVIEW':'205765',
     'VENDORALERTS':'206089',
     'HIGHLEVELMETRICS':'214498',
     'CASPERREPORTDOWNLOAD':'219029',
     'ORGANICRANKING':'220956',
     'VENDORSALESOVERVIEW':'221446',
     'INTERNALPLAYGROUND':'192148',
     'BRANDVSNBVIEW' : '230078',
     'IABILLING':'211543',
     'LRPOSDATA':'140097'
    }

    this.getUrls = function() {
        return urls
    }
    this.getRoles = function() {
        return roleConstants
    }
    this.getIds = function() {
        return dashboardIds
    }

    this.getStripe = function() {
        return stripe;
    }
}]);
