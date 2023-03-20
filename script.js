const iconPlus = document.querySelector('.todo-button')
const inputElm = document.querySelector('.todo-input')
const form = document.querySelector('form')
const totalContainerTodos = document.querySelector('.todo-list')
const filterTodos = document.querySelector('.filter-todo')
let todosFragment = document.createDocumentFragment()
let todos = []
let filteredTodos
let lengthOfTodos

function setData(){
    if( inputElm.value ){
        let todoObj = { id : todos.length + 1 , text : inputElm.value , status : 'Uncompleted' }
        todos.push(todoObj)
        localStorage.setItem('todos' , JSON.stringify(todos))
        addTodoToDom(todos)
        inputElm.value = ''
        inputElm.focus()
    }
}

function addTodoToDom(todos){
    totalContainerTodos.innerHTML = ''
    todos.forEach( todo =>{
        let containerTodo = document.createElement('div')
        containerTodo.className = 'todo'
        
        let todoTitle = document.createElement('li')
        todoTitle.innerText = todo.text
        todoTitle.className = 'todo-item'
        
        let completeBtn = document.createElement('button')
        completeBtn.className = 'complete-btn'
        completeBtn.addEventListener('click' , () => completedTodo(todoTitle.innerHTML))
        if( todo.status === 'Completed') containerTodo.classList.add('completed')

        let trashBtn = document.createElement('button')
        trashBtn.className = 'trash-btn'
        trashBtn.addEventListener('click' , () => removeElm(todoTitle.innerHTML))
        
        let tikIcon = document.createElement('i')
        tikIcon.classList.add("fas" , "fa-check")
        
        let trashIcon = document.createElement('i')
        trashIcon.classList.add("fas" , "fa-trash")
        
        trashBtn.append(trashIcon)
        completeBtn.append(tikIcon)
        containerTodo.append(todoTitle , completeBtn , trashBtn )
        todosFragment.append(containerTodo)
    } )
    totalContainerTodos.append(todosFragment)
}

function completedTodo(title){
    if ( filterTodos.value === 'All' ){
        todos.forEach( todo =>{
            if( todo.text === title && todo.status === 'Uncompleted' ) todo.status = 'Completed'
            else if ( todo.text === title && todo.status === 'Completed' ) todo.status = 'Uncompleted'
        })
        addTodoToDom(todos)
        localStorage.setItem('todos' , JSON.stringify(todos))

    }else if( filterTodos.value === 'Completed' ){
        changingTheStatusOfCompletedElements(title)
    }else if( filterTodos.value === 'Uncompleted' ){
        changingTheStatusOfIncompletedElements(title)
    }

}

function changingTheStatusOfCompletedElements(title){
    filteredTodos.forEach( (todo , index) => {
        if( todo.text === title && todo.status === 'Completed' ) {
            let indexCompletedElm = todos.findIndex( todo => todo.text === title)
            todos[indexCompletedElm].status = 'Uncompleted'
            localStorage.setItem('todos' , JSON.stringify(todos))
            filteredTodos.splice(index , 1 )
        }
    } )
    localStorage.setItem('filterTodos' , JSON.stringify(filteredTodos))
    addTodoToDom(filteredTodos)
}

function changingTheStatusOfIncompletedElements(title){
    filteredTodos.forEach( (todo , index) => {
        if( todo.text === title && todo.status === 'Uncompleted' ) {
            let indexIncompletedElm = todos.findIndex( todo => todo.text === title)
            todos[indexIncompletedElm].status = 'Completed'
            localStorage.setItem('todos' , JSON.stringify(todos))
            filteredTodos.splice(index , 1 )
        }
    } )
    localStorage.setItem('filterTodos' , JSON.stringify(filteredTodos))
    addTodoToDom(filteredTodos)
}

function removeElm(title){
    if ( filterTodos.value === 'All' ){
        todos = todos.filter( todo =>{
            if( todo.text !== title ) return todo
        })
        addTodoToDom(todos)
        localStorage.setItem('todos' , JSON.stringify(todos))
    }else{
        removeElmFromCompletedOrIncompleted(title)
    }
}

function removeElmFromCompletedOrIncompleted(title){
    filteredTodos.forEach( (todo , index) => {
        if( todo.text === title) {
            let indexRemoveElmExceptAll = todos.findIndex( todo => todo.text === title)
            todos.splice(indexRemoveElmExceptAll, 1)
            localStorage.setItem('todos' , JSON.stringify(todos))
            filteredTodos.splice(index , 1 )
        }
    } )
    localStorage.setItem('filterTodos' , JSON.stringify(filteredTodos))
    addTodoToDom(filteredTodos)
}

filterTodos.addEventListener( 'change' , () =>{
    filteredTodos = todos.filter( todo =>{ 
        if( todo.status === filterTodos.value ) return todo 
        else if (filterTodos.value === "All") return todo
    })
    addTodoToDom(filteredTodos)
    localStorage.setItem('todosStatus' , filterTodos.value)
    localStorage.setItem('filterTodos' , JSON.stringify(filteredTodos))
} )


document.addEventListener('DOMContentLoaded' , () =>{
    let oldTodos = JSON.parse(localStorage.getItem('todos'))
    let titleOfFilter = localStorage.getItem('todosStatus')
    let oldFilteredTodos = JSON.parse(localStorage.getItem('filterTodos'))

    inputElm.focus()
    filterTodos.value = titleOfFilter ;
    ( oldTodos ) ? todos = oldTodos : todos = [] ;
    ( oldFilteredTodos ) ? filteredTodos = oldFilteredTodos : filteredTodos = []

    if ( titleOfFilter === 'All' ) addTodoToDom(todos)
    else addTodoToDom(filteredTodos)
})

inputElm.addEventListener('focus' , () => inputElm.style.border = '1px solid gray')
inputElm.addEventListener('blur' , () => inputElm.style.border = 'none')

iconPlus.addEventListener('click' , () =>{
    filterTodos.value = 'All'
    setData()
})
inputElm.addEventListener('keyup' , e => {
    if (e.key === 'Enter'){
        filterTodos.value = 'All'
        setData()
    }
})
form.addEventListener('submit' , e => e.preventDefault())