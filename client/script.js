
// client/script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const processBtn = document.getElementById('process-btn');
    const processComplexBtn = document.getElementById('process-complex-btn');
    const resultOutput = document.getElementById('result-output');
    const loading = document.getElementById('loading');
    
    // Process task
    processBtn.addEventListener('click', async () => {
      const task = taskInput.value.trim();
      
      if (!task) {
        alert('Please enter a task');
        return;
      }
      
      loading.classList.remove('hidden');
      resultOutput.textContent = '';
      
      try {
        const response = await fetch('/api/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ task })
        });
        
        const data = await response.json();
        resultOutput.textContent = data.result;
      } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
      } finally {
        loading.classList.add('hidden');
      }
    });
    
    // Process complex task
    processComplexBtn.addEventListener('click', async () => {
      const task = taskInput.value.trim();
      
      if (!task) {
        alert('Please enter a task');
        return;
      }
      
      loading.classList.remove('hidden');
      resultOutput.textContent = '';
      
      try {
        const response = await fetch('/api/process-complex', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ task })
        });
        
        const data = await response.json();
        resultOutput.textContent = data.result;
      } catch (error) {
        resultOutput.textContent = `Error: ${error.message}`;
      } finally {
        loading.classList.add('hidden');
      }
    });
  });