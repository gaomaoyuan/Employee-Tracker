const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'business_manager',
});

function promptUser() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by manager',
                'View employees by department',
                'View department budget',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update employee manager',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budget',
                'Exit',
            ],
        },
    ]).then((answers) => {
        switch (answers.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Delete an employee':
                deleteEmployee();
                break;
            case 'View department budget':
                viewDepartmentBudget();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });
}

function viewAllDepartments() {
    const query = 'SELECT * FROM departments';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

function viewAllRoles() {
    const query = 'SELECT roles.id, roles.title, roles.salary, departments.name as department FROM roles JOIN departments ON roles.department_id = departments.id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

function viewAllEmployees() {
    const query = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name as department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) as manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        promptUser();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
        },
    ]).then((answers) => {
        const query = 'INSERT INTO departments (name) VALUES (?)';
        connection.query(query, answers.name, (err, res) => {
            if (err) throw err;
            console.log(`Added department ${answers.name}`);
            promptUser();
        });
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the department id?',
        },
    ]).then((answers) => {
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
        connection.query(query, [answers.title, answers.salary, answers.department_id], (err, res) => {
            if (err) throw err;
            console.log(`Added role ${answers.title}`);
            promptUser();
        });
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'What is the role id of the employee?',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'What is the manager id of the employee?',
        },
    ]).then((answers) => {
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        connection.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, res) => {
            if (err) throw err;
            console.log(`Added employee ${answers.first_name} ${answers.last_name}`);
            promptUser();
        });
    });
}


function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'Enter the id of the employee you want to update:',
        },
        {
            type: 'input',
            name: 'new_role_id',
            message: 'Enter the new role id for this employee:',
        },
    ]).then((answers) => {
        const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
        connection.query(query, [answers.new_role_id, answers.employee_id], (err, res) => {
            if (err) throw err;
            console.log(`Updated role for employee with id ${answers.employee_id}`);
            promptUser();
        });
    });
}

function updateEmployeeManager() {
    inquirer.prompt([
    ]).then((answers) => {
        const query = 'UPDATE employees SET manager_id = ? WHERE id = ?';
        connection.query(query, [answers.new_manager_id, answers.employee_id], (err, res) => {
            if (err) throw err;
            console.log(`Updated manager for employee with id ${answers.employee_id}`);
            promptUser();
        });
    });
}

function viewEmployeesByManager() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter the manager ID:',
        },
    ]).then((answers) => {
        const query = 'SELECT * FROM employees WHERE manager_id = ?';
        connection.query(query, [answers.manager_id], (err, res) => {
            if (err) throw err;
            console.table(res);
            promptUser();
        });
    });
}

function viewEmployeesByDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department ID:',
        },
    ]).then((answers) => {
        const query = 'SELECT employees.* FROM employees JOIN roles ON employees.role_id = roles.id WHERE roles.department_id = ?';
        connection.query(query, [answers.department_id], (err, res) => {
            if (err) throw err;
            console.table(res);
            promptUser();
        });
    });
}

function deleteDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter the ID of the department you want to delete:',
        },
    ]).then((answers) => {
        const deleteRolesQuery = `DELETE FROM roles WHERE department_id IN (SELECT id FROM departments WHERE id = ${answers.id})`;
        connection.query(deleteRolesQuery, (rolesErr, rolesRes) => {
            if (rolesErr) throw rolesErr;
            const deleteDepartmentQuery = `DELETE FROM departments WHERE id = ${answers.id}`;
            connection.query(deleteDepartmentQuery, (departmentErr, departmentRes) => {
                if (departmentErr) throw departmentErr;
                console.log(`Deleted department with id ${answers.id}`);
                promptUser();
            });
        });
    });
}


function deleteRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter the ID of the role you want to delete:',
        },
    ]).then((answers) => {
        const query = `DELETE FROM roles WHERE id = ${answers.id}`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Deleted role with id ${answers.id}`);
            promptUser();
        });
    });
}

function deleteEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee you want to delete:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee you want to delete:',
        },
    ]).then((answers) => {
        const query = 'DELETE FROM employees WHERE first_name = ? AND last_name = ?';
        connection.query(query, [answers.first_name, answers.last_name], (err, res) => {
            if (err) throw err;
            console.log(`Deleted employee ${answers.first_name} ${answers.last_name}`);
            promptUser();
        });
    });
}

function viewDepartmentBudget() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the ID of the department to see its budget:',
        },
    ]).then((answers) => {
        const query = `
            SELECT departments.name AS department, SUM(roles.salary) AS total_budget
            FROM employees 
            JOIN roles ON employees.role_id = roles.id 
            JOIN departments ON roles.department_id = departments.id
            WHERE departments.id = ?
            GROUP BY departments.id;
        `;
        connection.query(query, [answers.department_id], (err, res) => {
            if (err) throw err;
            console.table(res);
            promptUser();
        });
    });
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the database with id ${connection.threadId}`);
    promptUser();
  });






  


