import React, { useState, useEffect } from 'react';

const TaskManagementApp = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(storedTasks);
    }, []);

    const addTask = () => {
        if (taskInput) {
            const newTask = { id: Date.now(), name: taskInput, completed: false };
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            setTaskInput('');
        }
    };

    const deleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const toggleCompletion = (id) => {
        const updatedTasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const exportTasks = () => {
        const blob = new Blob([JSON.stringify(tasks)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const importTasks = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedTasks = JSON.parse(e.target.result);
                setTasks(importedTasks);
                localStorage.setItem('tasks', JSON.stringify(importedTasks));
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className='bg-purple-200 p-5 rounded-lg'>
            <h1 className='text-2xl font-bold text-purple-900'>Task Management</h1>
            <div className='my-3'>
                <input 
                    className='border border-purple-600 p-2 rounded' 
                    type='text' 
                    value={taskInput} 
                    onChange={(e) => setTaskInput(e.target.value)} 
                    placeholder='Add a new task' 
                />
                <button className='ml-2 bg-gold-600 text-white p-2 rounded' onClick={addTask}>Add Task</button>
            </div>
            <ul>
                {tasks.map(task => (
                    <li key={task.id} className='flex justify-between items-center my-2'>
                        <span className={task.completed ? 'line-through' : ''}>{task.name}</span>
                        <div>
                            <button className='bg-purple-500 text-white p-1 rounded ml-2' onClick={() => toggleCompletion(task.id)}>Toggle</button>
                            <button className='bg-red-500 text-white p-1 rounded ml-2' onClick={() => deleteTask(task.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <button className='mt-3 bg-blue-600 text-white p-2 rounded' onClick={exportTasks}>Export Tasks</button>
            <input className='mt-2' type='file' accept='.json' onChange={importTasks} />
        </div>
    );
};

export default TaskManagementApp;