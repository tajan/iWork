iWork.factory('dataFactory', ['$window', '$http', function ($window, $http) {

    var dataFactory = {
        baseUrl: '/api'
    };

    //General post
    dataFactory.post = function (url, data, headers, config) {
        var apiUrl = dataFactory.baseUrl + url;
        return $http.post(dataFactory.baseUrl + url, data).
            success(function (response, status, headers, config) {
                $window.history.back();
            }).
        error(function (response, status, headers, config) {
        });
    };

    dataFactory.postWithoutRedirect = function (url, data, headers, config) {
        var apiUrl = dataFactory.baseUrl + url;
        return $http.post(dataFactory.baseUrl + url, data).
            success(function (response, status, headers, config) {

            }).
        error(function (response, status, headers, config) {
        });
    };

    //General get
    dataFactory.get = function (url) {
        
        var apiUrl = dataFactory.baseUrl + url;

        return $http.get(dataFactory.baseUrl + url).
            success(function (response, status, headers, config) {
            }).
        error(function (response, status, headers, config) {
            log(response)
        });
    };

    //Project
    dataFactory.project = {
        getById: function (projectId) {
            return dataFactory.get('/project/GetById/' + projectId);
        },
        getAll: function () {
            return dataFactory.get('/project/GetAll');
        },
        postAction: function (actionName, project) {
            return dataFactory.post('/project/' + actionName, project);
        },
        getAllMinimal: function () {
            return dataFactory.get('/project/GetAllMinimal');
        }
    };


    //Sprint
    dataFactory.sprint = {
        getById: function (sprintId) {
            return dataFactory.get('/sprint/GetById/' + sprintId);
        },
        getByProject: function (projectId) {
            return dataFactory.get('/sprint/GetByProject/' + projectId);
        },
        postAction: function (actionName, sprint) {
            return dataFactory.post('/sprint/' + actionName, sprint);
        }
    };

    //User Stories
    dataFactory.userStory = {
        getById: function (userStoryId) {
            return dataFactory.get('/userstory/GetById/' + userStoryId);
        },
        getByProject: function (projectId) {
            return dataFactory.get('/userstory/GetByProject/' + projectId);
        },
        getAllMinimal: function (projectId) {
            return dataFactory.get('/userstory/GetAllMinimal/' + projectId);
        },
        postAction: function (actionName, userStory) {
            return dataFactory.post('/userstory/' + actionName, userStory);
        }
    };


    //User 
    dataFactory.user = {
        getCurrent: function () {
            return dataFactory.get('/user/GetCurrent');
        },
        getById: function (userId) {
            return dataFactory.get('/user/GetById/' + userId);
        },
        getAllMinimal: function () {
            return dataFactory.get('/user/GetAllMinimal');
        },
        getByProject: function (projectId) {
            return dataFactory.get('/user/GetByProject/' + projectId);
        },
        postAction: function (actionName, user) {
            return dataFactory.post('/user/' + actionName, user);
        },
        login: function (model) {
            var data = 'userName=' + model.username + '&password=' + model.password + '&grant_type=password';
            var headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
            return dataFactory.postWithoutRedirect('/Token', data, headers);
        },
        logout: function () {
            return dataFactory.postWithoutRedirect('/account/logout');
        },
        register: function (model) {
            return dataFactory.postWithoutRedirect('/account/register', model, { headers: { 'Content-Type': 'application/json' } });
        }
    };

    //Task
    dataFactory.task = {
        getForArchive: function () {
            return dataFactory.get('/task/GetForArchive');
        },
        getMyBoard: function () {
            return dataFactory.get('/task/GetMyBoard');
        },
        getAll: function () {
            return dataFactory.get('/task/GetAll');
        },
        getById: function (taskId) {
            return dataFactory.get('/task/GetById/' + taskId);
        },
        getByUserStory: function (userStoryId) {
            return dataFactory.get('/task/GetByUserStory/' + userStoryId);
        },
        postAction: function (actionName, task) {
            return dataFactory.post('/task/' + actionName, task);
        },
        updateStatuses: function (model) {
            return dataFactory.postWithoutRedirect('/task/UpdateStatuses', model);
        },
        archive: function (taskId, realEndDate) {
            return dataFactory.postWithoutRedirect('/task/Archive', { taskId: taskId, realEndDate: realEndDate });
        }
    };


    //Task Statuses
    dataFactory.taskStatus = {
        getAll: function () {
            var data = [
                { id: 1, title: 'Pending', viewOrder: 1 },
                { id: 2, title: 'In Progress', viewOrder: 2 },
                { id: 3, title: 'Ready For Test', viewOrder: 3 },
                { id: 4, title: 'Done', viewOrder: 4 }
            ];
            return data;
        }
    };


    //Activity
    dataFactory.activity = {
        getByTask: function (taskId) {
            return dataFactory.get('/activity/getByTask/' + taskId);
        },
        postAction: function (actionName, activity) {
            return dataFactory.post('/activity/' + actionName, activity);
        },
        addActivity: function (activity) {
            return dataFactory.postWithoutRedirect('/activity/add', activity);
        }
    };

    return dataFactory;
    
}]);
