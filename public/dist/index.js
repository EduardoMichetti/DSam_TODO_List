"use strict";
(function () {
    var NotificacaoPlatform;
    (function (NotificacaoPlatform) {
        NotificacaoPlatform["SMS"] = "SMS";
        NotificacaoPlatform["EMAIL"] = "EMAIL";
        NotificacaoPlatform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    })(NotificacaoPlatform || (NotificacaoPlatform = {}));
    var ViewMode;
    (function (ViewMode) {
        ViewMode["TODO"] = "TODO";
        ViewMode["REMINDER"] = "REMINDER";
    })(ViewMode || (ViewMode = {}));
    var UUID = function () {
        return Math.random().toString(36).substr(2, 9);
        //return Math.random().toString(32).substring(2, 9); 
    };
    var DateUtil = {
        amanha: function () {
            var amanha = new Date();
            amanha.setDate(amanha.getDate() + 1);
            return amanha;
        },
        hoje: function () {
            return new Date();
        },
        formatDate: function (date) {
            return "".concat(date.getDate(), ".").concat(date.getMonth() + 1, ".").concat(date.getFullYear());
        }
    };
    var Reminder = /** @class */ (function () {
        function Reminder(description, scheduleDate, notifications) {
            this.id = UUID();
            this.dateCreated = DateUtil.hoje();
            this.dateUpdated = DateUtil.hoje();
            this.description = '';
            this.scheduleDate = DateUtil.amanha();
            this.notifications = [NotificacaoPlatform.EMAIL];
            this.description = description;
            this.scheduleDate = scheduleDate;
            this.notifications = notifications;
        }
        Reminder.prototype.render = function () {
            return "\n                ---> Reminder <---\n                description: ".concat(this.description, "\n                Data: ").concat(DateUtil.formatDate(this.scheduleDate), "\n                Notify by ").concat(this.notifications.join(" and "), " in ").concat(DateUtil.formatDate(this.scheduleDate), "\n            "); //platform: ${this.notifications.join(',')}
        };
        return Reminder;
    }());
    var Todo = /** @class */ (function () {
        function Todo(description) {
            this.id = UUID();
            this.dateCreated = DateUtil.hoje();
            this.dateUpdated = DateUtil.hoje();
            this.description = '';
            this.done = false;
            this.description = description;
        }
        Todo.prototype.render = function () {
            return "\n            ---> TODO <---\n            description: ".concat(this.description, "\n            done: ").concat(this.done, "\n            ");
        };
        return Todo;
    }());
    // const todo = new Todo('Todo criado com a classe');
    // const reminder = new Reminder('Reminder criado com a classe', new Date(), [NotificacaoPlatform.EMAIL,]);
    var taskView = {
        getTodo: function (form) {
            var todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder: function (form) {
            var reminderNotifications = [
                form.notification.value,
            ];
            var reminderDate = new Date(form.scheduleDate.value); //scheduleDate
            var reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(reminderDescription, reminderDate, reminderNotifications);
        },
        render: function (tasks, mode) {
            var taskList = document.getElementById('tasksList'); //nome aqui é o id de UL no html 
            //esvaziar list, enquanto tiver um filho vai removendo
            while (taskList === null || taskList === void 0 ? void 0 : taskList.firstChild) {
                taskList.removeChild(taskList.firstChild);
            }
            //receber lista de task
            tasks.forEach(function (task) {
                var li = document.createElement('LI');
                var textNode = document.createTextNode(task.render());
                li.appendChild(textNode); //colocar o conteudo de texto dento do li
                taskList === null || taskList === void 0 ? void 0 : taskList.appendChild(li); //colocar o elemento li dentro da lista
            });
            var todoSet = document.getElementById('todoSet');
            var reminderSet = document.getElementById('reminderSet');
            if (mode === ViewMode.TODO) {
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'display: block');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.removeAttribute('disabled');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('style', 'display: none');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('disabled', 'true');
            }
            else {
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute('style', 'display: block');
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.removeAttribute('disabled');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'display: none');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('disabled', 'true');
            }
        },
    };
    //funcao para garantir quando a view deve renderizar e armazenar na memoria do navegador nossas tasks
    var TaskController = function (view) {
        var _a, _b;
        var tasks = [];
        var mode = ViewMode.TODO;
        var handleEvent = function (event) {
            event.preventDefault();
            var form = event.target;
            switch (mode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case ViewMode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };
        var toggleMode = function () {
            switch (mode) {
                case ViewMode.TODO:
                    mode = ViewMode.REMINDER;
                    break;
                case ViewMode.REMINDER:
                    mode = ViewMode.TODO;
                    break;
            }
            view.render(tasks, mode);
        };
        (_a = document
            .getElementById('toggleMode')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', toggleMode);
        (_b = document
            .getElementById('taskForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', handleEvent);
    };
    TaskController(taskView);
})();
