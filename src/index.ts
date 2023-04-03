(() => {
    enum NotificacaoPlatform{
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
    }

    enum ViewMode{
        TODO = 'TODO',
        REMINDER = 'REMINDER',
    }

    const UUID = (): string => {
        return Math.random().toString(36).substr(2, 9);
        //return Math.random().toString(32).substring(2, 9); 
    };

    const DateUtil = { //funcao para receber uma data e formatar ela
        amanha(): Date{
            const amanha = new Date();
            amanha.setDate(amanha.getDate() + 1);
            return amanha;
        },
        hoje(): Date{
            return new Date();
        },        
        formatDate(date: Date): string {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        }
    }

    interface Task {
        id: string;
        dateCreated: Date;
        dateUpdated: Date;
        description: string;
        render(): string;
    }

    class Reminder implements Task{
        id: string = UUID();
        dateCreated: Date = DateUtil.hoje();
        dateUpdated: Date = DateUtil.hoje();
        description: string = '';

        scheduleDate: Date = DateUtil.amanha();
        notifications: Array<NotificacaoPlatform> = [NotificacaoPlatform.EMAIL];

        constructor(
            description: string,
            scheduleDate: Date,
            notifications: Array<NotificacaoPlatform>
        ){
            this.description = description;
            this.scheduleDate = scheduleDate;
            this.notifications = notifications;
        }

        render(): string {
            return `
                ---> Reminder <---
                description: ${this.description}
                Data: ${DateUtil.formatDate(this.scheduleDate)}
                Notify by ${this.notifications.join(" and ")} in ${DateUtil.formatDate(this.scheduleDate)}
            `; //platform: ${this.notifications.join(',')}
        }
    }

    class Todo implements Task{
        id: string = UUID();
        dateCreated: Date = DateUtil.hoje();
        dateUpdated: Date = DateUtil.hoje();
        description: string = '';

        done: boolean = false;

        constructor(description: string){
            this.description = description;
        }

        render(): string {
            return `
            ---> TODO <---
            description: ${this.description}
            done: ${this.done}
            `;
        }
    }

    // const todo = new Todo('Todo criado com a classe');
    // const reminder = new Reminder('Reminder criado com a classe', new Date(), [NotificacaoPlatform.EMAIL,]);

    const taskView = {
        getTodo(form: HTMLFormElement): Todo {
            const todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder(form: HTMLFormElement): Reminder {
            const reminderNotifications = [
                form.notification.value as NotificacaoPlatform, //form.notification.value as NotificacaoPlatform,
            ];
            const reminderDate = new Date(form.scheduleDate.value); //scheduleDate
            const reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(
                reminderDescription,
                reminderDate,
                reminderNotifications                
            );
        },
        render(tasks: Array<Task>, mode: ViewMode) {
            const taskList = document.getElementById('tasksList'); //nome aqui é o id de UL no html 
            //esvaziar list, enquanto tiver um filho vai removendo
            while (taskList?.firstChild){
                taskList.removeChild(taskList.firstChild);            
            }

            //receber lista de task
            tasks.forEach((task) => {
                const li = document.createElement('LI');
                const textNode = document.createTextNode(task.render());                
                li.appendChild(textNode); //colocar o conteudo de texto dento do li
                taskList?.appendChild(li); //colocar o elemento li dentro da lista
            });
            const todoSet = document.getElementById('todoSet');
            const reminderSet = document.getElementById('reminderSet');

            if (mode === ViewMode.TODO) {
                todoSet?.setAttribute('style', 'display: block');
                todoSet?.removeAttribute('disabled');
                reminderSet?.setAttribute('style', 'display: none');
                reminderSet?.setAttribute('disabled', 'true');
            } else {
                reminderSet?.setAttribute('style', 'display: block');
                reminderSet?.removeAttribute('disabled');
                todoSet?.setAttribute('style', 'display: none');
                todoSet?.setAttribute('disabled', 'true');
            }

        },      
    };

    //funcao para garantir quando a view deve renderizar e armazenar na memoria do navegador nossas tasks
    const TaskController = (view: typeof taskView) => {
        const tasks: Array<Task> = [];
        let mode: ViewMode = ViewMode.TODO;
        
        const handleEvent = (event: Event) => {            
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            switch (mode as ViewMode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));                    
                    break;
                case ViewMode.REMINDER:
                    tasks.push(view.getReminder(form))
                    break;
            }
            view.render(tasks, mode);
        };

        const toggleMode = () => {
            switch (mode as ViewMode){
                case ViewMode.TODO:
                    mode = ViewMode.REMINDER
                    break;
                case ViewMode.REMINDER:
                    mode = ViewMode.TODO
                    break
            }
            view.render(tasks, mode);
        };

        document
        .getElementById('toggleMode')
        ?.addEventListener('click', toggleMode); 
        document
            .getElementById('taskForm')
            ?.addEventListener('submit', handleEvent); 
    };

    TaskController(taskView);
})();