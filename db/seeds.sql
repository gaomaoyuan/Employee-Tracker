USE business_manager;

INSERT INTO departments (name)
VALUES ('Engineering'),
       ('Marketing'),
       ('Human Resources'),
       ('Finance'),
       ('IT support');

INSERT INTO roles (title, salary, department_id)
VALUES ('Engineer', 80000, 1),
       ('Marketing Specialist', 60000, 2),
       ('HR Manager', 70000, 3),
       ('Financial Analyst', 75000, 4),
       ('IT Support', 65000, 5),
       ('Senior Engineer', 90000, 1),
       ('Marketing Manager', 70000, 2),
       ('HR Specialist', 60000, 3),
       ('Financial Manager', 80000, 4),
       ('Senior IT Support', 75000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('James', 'Smith', 1, NULL),
       ('Sophia', 'Jones', 2, 1),
       ('Ava', 'Brown', 3, 1),
       ('Mia', 'Davis', 4, 2),
       ('Harper', 'Anderson', 5, 1),
       ('Emma', 'Johnson', 6, NULL),
       ('Noah', 'Wilson', 7, 3),
       ('Lucas', 'Taylor', 8, 4),
       ('Oliver', 'Williams', 9, NULL),
       ('Martin', 'Liu', 10, 5);
